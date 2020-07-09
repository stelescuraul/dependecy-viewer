const rp = require('request-promise');
const { filterDependency } = require('../utils');

class GitlabWrapper {
  // TODO: add defaults for options
  constructor(organization, options) {
    this.organization = organization;
    this.protocol = options.protocol;
    this.domain = options.domain;
    this.token = options.token;

    this.baseUrl = `${this.protocol}://${this.domain}/api/v4`;
  }

  async getProjects(excludeProjects = []) {
    const requestOptions = `simple=true&search=${this.organization}&search_namespaces=true`;
    let projects = await rp.get(`${this.baseUrl}/projects?${requestOptions}`, {
      json: true,
      headers: {
        'Private-Token': this.token,
      },
    });

    projects = projects.filter(
      (project) => !excludeProjects.includes(project.name)
        && project.namespace.name.toLowerCase() === this.organization,
    );

    return projects;
  }

  async getPackageJson(projectId) {
    const fileResponse = await rp.get(
      `${this.baseUrl}/projects/${projectId}/repository/files/package.json?ref=master`,
      {
        json: true,
        headers: {
          'Private-Token': this.token,
        },
      },
    );

    return JSON.parse(
      Buffer.from(fileResponse.content, 'base64').toString('utf8'),
    );
  }

  // TODO: define packagePrefix and packageInclude
  async getAllPackages(
    options = {
      excludeProjects: [],
      packagePrefix: '',
      packageInclude: '',
    },
  ) {
    const projects = await this.getProjects(options.excludeProjects);

    const packageJsonPromises = [];
    projects.forEach((project) => {
      packageJsonPromises.push(this.getPackageJson(project.id));
    });

    let packageJsons = await Promise.all(packageJsonPromises);

    packageJsons = packageJsons.map((packageJson) => {
      let {
        devDependencies = {},
        peerDependencies = {},
        dependencies = {},
      } = packageJson;

      devDependencies = filterDependency(
        devDependencies,
        options.packagePrefix,
        options.packageInclude,
      );

      peerDependencies = filterDependency(
        peerDependencies,
        options.packagePrefix,
        options.packageInclude,
      );

      dependencies = filterDependency(
        dependencies,
        options.packagePrefix,
        options.packageInclude,
      );

      return {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        homepage: packageJson.homepage,
        devDependencies,
        peerDependencies,
        dependencies,
      };
    });

    return packageJsons;
  }
}

module.exports = GitlabWrapper;
