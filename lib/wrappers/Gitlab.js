const rp = require('request-promise');
const Wrapper = require('./Wrapper');
const { filterDependency } = require('../utils');

/**
 * @class GitlabWrapper
 * implements all the communication with Gitlab api
 */
class GitlabWrapper extends Wrapper {
  /**
   * Create new GitlabWrapper
   * @param {String} [organization=''] name of organization
   * @param {Object} options options object
   * @param {String} [options.protocol=https] protocol to be used
   * @param {String} [options.domain=gitlab.com] domain to be used
   * @param {String} options.token token from Gitlab
   */
  constructor(organization, options = {}) {
    super();
    this.organization = organization || '';
    this.protocol = options.protocol || 'https';
    this.domain = options.domain || 'gitlab.com';
    this.token = options.token;

    if (!this.token) {
      throw new Error('No token provided');
    }

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
        && !excludeProjects.includes(project.path)
        && (this.organization === ''
          || project.namespace.name.toLowerCase()
            === this.organization.toLowerCase()
          || project.namespace.path.toLowerCase()
            === this.organization.toLowerCase()),
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

  /**
   * Get all package.json from gitlab projects
   * @param {Object} options options object
   * @param {String[]} [options.excludeProjects=[]] array of strings representing projects
   * to exclude
   * @param {String} [options.packagePrefix=''] inlcude packages that have this prefix
   * in their name.
   * Useful for organization packages
   * @param {String} [options.packageInclude=''] include packages that contain this this
   * in their name
   *
   * @returns {Object} All dependencies objects
   */
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
