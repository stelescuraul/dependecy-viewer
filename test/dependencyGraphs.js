const dependencies = {
  'production-dep': '1.0.0',
  'fake-dep': '1.5.2',
  'my-awesome-dep': '1.2.3',
  'foorg/dep': '1.2.3',
  'foorg/another-dep': '4.3.2',
  'foorg/third-dep': '3.2.1',
  'barorg/dep': '1.2.3',
  'barorg/another-dep': '4.3.2',
  bar: '1.0.0',
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

const packages = [
  {
    name: 'foo',
    version: '1.0.0',
    description: 'Lorem ipsum',
    homepage: 'http://homepage.foo',
    devDependencies,
    peerDependencies,
    dependencies,
  },
  {
    name: 'bar',
    version: '1.0.0',
    description: 'Lorem ipsum',
    homepage: 'http://homepage.bar',
    devDependencies: {
      'some-package': '1.0.0',
    },
    peerDependencies: {},
    dependencies: {
      'another-package': '1.0.0',
    },
  },
];

const prodDependencyGraph = {
  attributes: {},
  nodes: [
    {
      key: 'foo',
      attributes: {
        version: '1.0.0',
        description: 'Lorem ipsum',
        homepage: 'http://homepage.foo',
      },
    },
    { key: 'production-dep' },
    { key: 'fake-dep' },
    { key: 'my-awesome-dep' },
    { key: 'foorg/dep' },
    { key: 'foorg/another-dep' },
    { key: 'foorg/third-dep' },
    { key: 'barorg/dep' },
    { key: 'barorg/another-dep' },
    {
      key: 'bar',
      attributes: {
        version: '1.0.0',
        description: 'Lorem ipsum',
        homepage: 'http://homepage.bar',
      },
    },
    { key: 'another-package' },
  ],
  edges: [
    {
      source: 'foo',
      target: 'production-dep',
      attributes: { version: '1.0.0' },
    },
    { source: 'foo', target: 'fake-dep', attributes: { version: '1.5.2' } },
    {
      source: 'foo',
      target: 'my-awesome-dep',
      attributes: { version: '1.2.3' },
    },
    { source: 'foo', target: 'foorg/dep', attributes: { version: '1.2.3' } },
    {
      source: 'foo',
      target: 'foorg/another-dep',
      attributes: { version: '4.3.2' },
    },
    {
      source: 'foo',
      target: 'foorg/third-dep',
      attributes: { version: '3.2.1' },
    },
    { source: 'foo', target: 'barorg/dep', attributes: { version: '1.2.3' } },
    {
      source: 'foo',
      target: 'barorg/another-dep',
      attributes: { version: '4.3.2' },
    },
    { source: 'foo', target: 'bar', attributes: { version: '1.0.0' } },
    {
      source: 'bar',
      target: 'another-package',
      attributes: { version: '1.0.0' },
    },
  ],
};

const devDependencyGraph = {
  attributes: {},
  nodes: [
    {
      key: 'foo',
      attributes: {
        version: '1.0.0',
        description: 'Lorem ipsum',
        homepage: 'http://homepage.foo',
      },
    },
    { key: 'general-dep' },
    { key: 'foorg/dev-dep' },
    { key: 'foorg/another-dev-dep' },
    { key: 'barorg/dev-dep' },
    { key: 'barorg/another-dev-dep' },
    {
      key: 'bar',
      attributes: {
        version: '1.0.0',
        description: 'Lorem ipsum',
        homepage: 'http://homepage.bar',
      },
    },
    { key: 'some-package' },
  ],
  edges: [
    { source: 'foo', target: 'general-dep', attributes: { version: '1.0.0' } },
    {
      source: 'foo',
      target: 'foorg/dev-dep',
      attributes: { version: '1.2.3' },
    },
    {
      source: 'foo',
      target: 'foorg/another-dev-dep',
      attributes: { version: '1.2.3' },
    },
    {
      source: 'foo',
      target: 'barorg/dev-dep',
      attributes: { version: '3.2.1' },
    },
    {
      source: 'foo',
      target: 'barorg/another-dev-dep',
      attributes: { version: '3.2.1' },
    },
    { source: 'bar', target: 'some-package', attributes: { version: '1.0.0' } },
  ],
};

const allDependencyGraph = {
  attributes: {},
  nodes: [
    {
      key: 'foo',
      attributes: {
        version: '1.0.0',
        description: 'Lorem ipsum',
        homepage: 'http://homepage.foo',
      },
    },
    { key: 'lorem-ipsum' },
    { key: 'foorg/dep' },
    { key: 'foorg/another-dep' },
    { key: 'barorg/another-dep' },
    { key: 'general-dep' },
    { key: 'foorg/dev-dep' },
    { key: 'foorg/another-dev-dep' },
    { key: 'barorg/dev-dep' },
    { key: 'barorg/another-dev-dep' },
    { key: 'production-dep' },
    { key: 'fake-dep' },
    { key: 'my-awesome-dep' },
    { key: 'foorg/third-dep' },
    { key: 'barorg/dep' },
    {
      key: 'bar',
      attributes: {
        version: '1.0.0',
        description: 'Lorem ipsum',
        homepage: 'http://homepage.bar',
      },
    },
    { key: 'some-package' },
    { key: 'another-package' },
  ],
  edges: [
    { source: 'foo', target: 'lorem-ipsum', attributes: { version: '1.2.3' } },
    { source: 'foo', target: 'foorg/dep', attributes: { version: '^1' } },
    {
      source: 'foo',
      target: 'foorg/another-dep',
      attributes: { version: '4.3.2' },
    },
    {
      source: 'foo',
      target: 'barorg/another-dep',
      attributes: { version: '^2' },
    },
    { source: 'foo', target: 'general-dep', attributes: { version: '1.0.0' } },
    {
      source: 'foo',
      target: 'foorg/dev-dep',
      attributes: { version: '1.2.3' },
    },
    {
      source: 'foo',
      target: 'foorg/another-dev-dep',
      attributes: { version: '1.2.3' },
    },
    {
      source: 'foo',
      target: 'barorg/dev-dep',
      attributes: { version: '3.2.1' },
    },
    {
      source: 'foo',
      target: 'barorg/another-dev-dep',
      attributes: { version: '3.2.1' },
    },
    {
      source: 'foo',
      target: 'production-dep',
      attributes: { version: '1.0.0' },
    },
    { source: 'foo', target: 'fake-dep', attributes: { version: '1.5.2' } },
    {
      source: 'foo',
      target: 'my-awesome-dep',
      attributes: { version: '1.2.3' },
    },
    { source: 'foo', target: 'foorg/dep', attributes: { version: '1.2.3' } },
    {
      source: 'foo',
      target: 'foorg/another-dep',
      attributes: { version: '4.3.2' },
    },
    {
      source: 'foo',
      target: 'foorg/third-dep',
      attributes: { version: '3.2.1' },
    },
    { source: 'foo', target: 'barorg/dep', attributes: { version: '1.2.3' } },
    {
      source: 'foo',
      target: 'barorg/another-dep',
      attributes: { version: '4.3.2' },
    },
    { source: 'foo', target: 'bar', attributes: { version: '1.0.0' } },
    { source: 'bar', target: 'some-package', attributes: { version: '1.0.0' } },
    {
      source: 'bar',
      target: 'another-package',
      attributes: { version: '1.0.0' },
    },
  ],
};

module.exports = {
  packages,
  prodDependencyGraph,
  devDependencyGraph,
  allDependencyGraph,
};
