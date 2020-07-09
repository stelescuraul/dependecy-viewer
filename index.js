const { createWriteStream } = require('fs');
const Gitlab = require('./lib/wrappers/Gitlab');
const GraphBuilder = require('./lib/GraphBuilder');

const gitlab = new Gitlab('', { protocol: '', domain: '', token: '' });
const graphBuilder = new GraphBuilder(gitlab);

graphBuilder.buildDependencyGraph({
  wrapperOptions: {
    excludeProjects: [],
    packageInclude: '',
    packagePrefix: '',
  },
}).then(async (dependencyGraphs) => {
  Object.keys(dependencyGraphs).forEach((graphName) => {
    const graphDataStream = createWriteStream(`./graphData/${graphName}.json`);

    const exportedGraph = dependencyGraphs[graphName].export();
    graphDataStream.write(Buffer.from(JSON.stringify(exportedGraph)));
    graphDataStream.close();
  });
});
