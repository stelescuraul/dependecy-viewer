/**
 * @class Wrapper
 * extend it when implementing a Wrapper
 */
class Wrapper {
  /**
   * @param {Object} options options object
   * @param {String[]} options.excludeProjects array of strings representing projects to exclude
   * @param {String} options.packagePrefix inlcude packages that have this prefix in their name.
   * Useful for organization packages
   * @param {String} options.packageInclude include packages that contain this this in their name
   */
  // eslint-disable-next-line
  async getAllPackages(
  // eslint-disable-next-line
    options = {
      excludeProjects: [],
      packagePrefix: '',
      packageInclude: '',
    },
  ) {
    throw new Error('Not implemented yet');
  }
}

module.exports = Wrapper;
