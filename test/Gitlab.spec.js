const proxyquire = require('proxyquire');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const rp = require('request-promise');

chai.use(chaiAsPromised);
const { expect } = chai;
const requestPromiseStub = sinon.stub(rp);

const Gitlab = proxyquire('../lib/wrappers/Gitlab', {
  'request-promise': requestPromiseStub,
});

describe('Gitlab', () => {
  const defaultOrganization = 'foorg';
  const defaultOptions = {
    protocol: 'http',
    domain: 'localhost',
    token: 'someToken',
  };

  afterEach(() => {
    sinon.resetBehavior();
    sinon.resetHistory();
  });

  describe('constructor', () => {
    it('creates an instance with passed values', () => {
      const gitlabInstance = new Gitlab(defaultOrganization, defaultOptions);

      expect(gitlabInstance).to.eql({
        ...defaultOptions,
        organization: defaultOrganization,
        baseUrl: `${defaultOptions.protocol}://${defaultOptions.domain}/api/v4`,
      });
    });

    it('throws if no token is passed', () => {
      expect(
        () => new Gitlab(defaultOrganization, {
          ...defaultOptions,
          token: undefined,
        }),
      ).to.throw('No token provided');
    });

    it('fills default protocol and domain if not passed', () => {
      expect(
        new Gitlab(defaultOrganization, {
          ...defaultOptions,
          protocol: undefined,
          domain: undefined,
        }),
      ).to.eql({
        ...defaultOptions,
        organization: defaultOrganization,
        protocol: 'https',
        domain: 'gitlab.com',
        baseUrl: 'https://gitlab.com/api/v4',
      });
    });

    it('throws if no options are passed', () => {
      expect(() => new Gitlab(defaultOrganization)).to.throw(
        'No token provided',
      );
    });
  });

  describe('getProjects', () => {
    let gitlabWrapper;
    const defaultProjects = [
      {
        name: 'foo',
        namespace: {
          name: 'foorg',
          path: 'foorg',
        },
      },
      {
        name: 'bar',
        namespace: {
          name: 'barorg',
          path: 'barorg',
        },
      },
    ];

    before(() => {
      gitlabWrapper = new Gitlab('', defaultOptions);
    });

    beforeEach(() => {
      requestPromiseStub.get.returns(defaultProjects);
    });

    it('returns all projects if exludeProjects is emtpy', async () => expect(gitlabWrapper.getProjects()).to.eventually.eql(defaultProjects));

    it('returns only projects not present in excludeProjects', async () => expect(gitlabWrapper.getProjects(['foo'])).to.eventually.eql([
      { ...defaultProjects[1] },
    ]));

    it('returns only the projects of the organization', async () => {
      const organizationGitlabWrapper = new Gitlab(
        defaultOrganization,
        defaultOptions,
      );

      return expect(organizationGitlabWrapper.getProjects()).to.eventually.eql([
        { ...defaultProjects[0] },
      ]);
    });
  });

  describe('getPackageJson', () => {
    const fakePackageJson = { name: 'foo' };
    const requestResponse = Buffer.from(
      JSON.stringify(fakePackageJson),
    ).toString('base64');
    let gitlabWrapper;

    before(() => {
      gitlabWrapper = new Gitlab(defaultOrganization, defaultOptions);
    });

    beforeEach(() => {
      requestPromiseStub.get.returns({ content: requestResponse });
    });

    it('returns parsed fakePackageJson', () => expect(gitlabWrapper.getPackageJson('someId')).to.eventually.eql(
      fakePackageJson,
    ));
  });

  describe('getAllPackages', () => {
    let gitlabWrapper;
    const projectsData = [
      {
        name: 'foo',
        namespace: {
          name: 'foorg',
          path: 'foorg',
        },
        id: 0,
      },
      {
        name: 'bar',
        namespace: {
          name: 'barorg',
          path: 'barorg',
        },
        id: 1,
      },
    ];

    const dependencies = {
      'production-dep': '1.0.0',
      'fake-dep': '1.5.2',
      'my-awesome-dep': '1.2.3',
      'foorg/dep': '1.2.3',
      'foorg/another-dep': '4.3.2',
      'foorg/third-dep': '3.2.1',
      'barorg/dep': '1.2.3',
      'barorg/another-dep': '4.3.2',
    };
    const devDependencies = {
      'general-dep': '1.0.0',
      'foorg/dev-dep': '1.2.3',
      'foorg/another-dev-dep': '1.2.3',
      'barorg/dev-dep': '3.2.1',
      'barorg/another-dev-dep': '3.2.1',
    };
    const peerDependencies = {
      'lorem-ipsum': '1.2.3',
      'foorg/dep': '^1',
      'foorg/another-dep': '4.3.2',
      'barorg/another-dep': '^2',
    };

    const packageJsonData = (id) => {
      const project = projectsData[id];

      return {
        name: project.name,
        version: '1.0.0',
        description: 'Lorem ipsum',
        homepage: 'http://homepage',
        devDependencies,
        peerDependencies,
        dependencies,
      };
    };

    beforeEach(() => {
      gitlabWrapper = new Gitlab(defaultOrganization, defaultOptions);
      requestPromiseStub.get.returns(projectsData);
      sinon.stub(gitlabWrapper, 'getPackageJson').callsFake(packageJsonData);
    });

    it('returns all dependencies if no options', async () => expect(gitlabWrapper.getAllPackages()).to.eventually.eql([
      packageJsonData(0),
    ]));

    it('returns empty dependencies if packageJson does not have them', async () => {
      gitlabWrapper.getPackageJson.restore();

      sinon.stub(gitlabWrapper, 'getPackageJson').callsFake((id) => {
        const project = projectsData[id];

        return {
          name: project.name,
          version: '1.0.0',
          description: 'Lorem ipsum',
          homepage: 'http://homepage',
        };
      });

      return expect(gitlabWrapper.getAllPackages()).to.eventually.eql([
        {
          ...packageJsonData(0),
          devDependencies: {},
          dependencies: {},
          peerDependencies: {},
        },
      ]);
    });

    it('returns only packages with prefix', async () => expect(
      gitlabWrapper.getAllPackages({ packagePrefix: 'foorg' }),
    ).to.eventually.eql([
      {
        name: 'foo',
        version: '1.0.0',
        description: 'Lorem ipsum',
        homepage: 'http://homepage',
        devDependencies: {
          'dev-dep': '1.2.3',
          'another-dev-dep': '1.2.3',
        },
        peerDependencies: {
          dep: '^1',
          'another-dep': '4.3.2',
        },
        dependencies: {
          dep: '1.2.3',
          'another-dep': '4.3.2',
          'third-dep': '3.2.1',
        },
      },
    ]));

    it('returns only packages with include', async () => expect(
      gitlabWrapper.getAllPackages({ packageInclude: 'another' }),
    ).to.eventually.eql([
      {
        name: 'foo',
        version: '1.0.0',
        description: 'Lorem ipsum',
        homepage: 'http://homepage',
        devDependencies: {
          'foorg/another-dev-dep': '1.2.3',
          'barorg/another-dev-dep': '3.2.1',
        },
        peerDependencies: {
          'foorg/another-dep': '4.3.2',
          'barorg/another-dep': '^2',
        },
        dependencies: {
          'foorg/another-dep': '4.3.2',
          'barorg/another-dep': '4.3.2',
        },
      },
    ]));

    it('returns only packages with prefix and include', async () => expect(
      gitlabWrapper.getAllPackages({
        packagePrefix: 'foorg',
        packageInclude: 'another',
      }),
    ).to.eventually.eql([
      {
        name: 'foo',
        version: '1.0.0',
        description: 'Lorem ipsum',
        homepage: 'http://homepage',
        devDependencies: {
          'dev-dep': '1.2.3',
          'another-dev-dep': '1.2.3',
          'barorg/another-dev-dep': '3.2.1',
        },
        peerDependencies: {
          dep: '^1',
          'another-dep': '4.3.2',
          'barorg/another-dep': '^2',
        },
        dependencies: {
          dep: '1.2.3',
          'another-dep': '4.3.2',
          'third-dep': '3.2.1',
          'barorg/another-dep': '4.3.2',
        },
      },
    ]));
  });
});
