const Graph = require('graphology');
const { addNodesAndEdgesForDependency } = require('./utils');

/**
 * @class GraphBuilder
 * builds the dependency graph given a wrapper
 */
class GraphBuilder {
  /**
   * Create new GraphBuilder
   * @param {Wrapper} wrapper
   */
  constructor(wrapper) {
    this.wrapper = wrapper;
  }

  /**
   * build the dependency graph
   * @param {Object} wrapperOptions
   * @returns {Object} all dependencies {allDepsGraph, proDepsGraph, devDepsGraph }
   */
  async buildDependencyGraph({ wrapperOptions = {} } = {}) {
    const packages = await this.wrapper.getAllPackages(wrapperOptions);
    let allDepsGraph = new Graph({ multi: true });
    let prodDepsGraph = new Graph({ multi: true });
    let devDepsGraph = new Graph({ multi: true });

    packages.forEach((_package) => {
      allDepsGraph.mergeNode(_package.name, {
        version: _package.version,
        description: _package.description,
        homepage: _package.homepage,
      });
      prodDepsGraph.mergeNode(_package.name, {
        version: _package.version,
        description: _package.description,
        homepage: _package.homepage,
      });
      devDepsGraph.mergeNode(_package.name, {
        version: _package.version,
        description: _package.description,
        homepage: _package.homepage,
      });

      allDepsGraph = addNodesAndEdgesForDependency(
        allDepsGraph,
        _package.peerDependencies,
        _package.name,
      );
      allDepsGraph = addNodesAndEdgesForDependency(
        allDepsGraph,
        _package.devDependencies,
        _package.name,
      );
      allDepsGraph = addNodesAndEdgesForDependency(
        allDepsGraph,
        _package.dependencies,
        _package.name,
      );

      prodDepsGraph = addNodesAndEdgesForDependency(
        prodDepsGraph,
        _package.dependencies,
        _package.name,
      );

      devDepsGraph = addNodesAndEdgesForDependency(
        devDepsGraph,
        _package.devDependencies,
        _package.name,
      );
    });

    return { allDepsGraph, prodDepsGraph, devDepsGraph };
  }
}

module.exports = GraphBuilder;
