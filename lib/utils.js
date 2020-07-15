/**
 * Filters the dependency object to only include the packages that
 * start with the prefix of include the keyword (include param)
 * @param {Object} dependencies A dependency object (eg: devDependencies from package.json)
 * @param {String} prefix A string representing the prefix of a package (eg: organization)
 * @param {String} include A string which if found in the name of a package,
 * will include that package
 */
const filterDependency = (dependencies, prefix = '', include = '') => {
  const filteredDependencies = {};

  Object.entries(dependencies).forEach(([key, value]) => {
    let shouldReturnDependency = false;

    if (!prefix && !include) {
      shouldReturnDependency = true;
    } else if (
      (prefix && key.startsWith(prefix))
        || (include && key.includes(include))
    ) {
      shouldReturnDependency = true;
    }

    if (shouldReturnDependency) {
      /**
         * Transform the name of the dependency from prefix/package_name
         * to just package_name
         * Works with delimiter / and -
         */
      let finalKey = `${key}`;
      const match = key.match(`^${prefix}(?:/?-?)(.+)`);
      if (match && match.length === 2) {
        [, finalKey] = match;
      }
      filteredDependencies[finalKey] = value;
    }
  });

  return filteredDependencies;
};

/**
 * Adds unique nodes to a graph. Creates directed edges from parent to current node
 * given the version of the relation. E.g. package A includes package B using version 2.0.0,
 * then the graph will have a directed edge from package A -> B with edge version attribute = 2.0.0
 * A node can have multiple edges between A -> B with different versions
 * (eg: dependencies vs peerDependencies)
 * @param {Graph} originalGraph A Graph instance
 * @param {Object} dependencyObject A dependency object (eg: devDependencies from package.json)
 * @param {String} parent A parent node name (eg: package name from package.json)
 */
const addNodesAndEdgesForDependency = (
  originalGraph,
  dependencyObject,
  parent,
) => {
  const graph = originalGraph.copy();
  Object.entries(dependencyObject).forEach(([key, value]) => {
    graph.mergeNode(key);

    graph.addDirectedEdge(parent, key, {
      version: value,
    });
  });

  return graph;
};

module.exports = { filterDependency, addNodesAndEdgesForDependency };
