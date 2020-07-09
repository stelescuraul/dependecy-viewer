const dependencyFiles = {
  Prod: './graphData/prodDepsGraph.json',
  Dev: './graphData/devDepsGraph.json',
  All: './graphData/allDepsGraph.json',
};

const renderGraph = (data) => {
  this.document.getElementById('mountNode').innerHTML = '';
  const width = this.document.getElementById('mountNode').scrollWidth || 1000;
  const height = this.document.getElementById('mountNode').scrollHeight || 1000;

  const minimap = new G6.Minimap({
    size: [150, 100],
  });

  const graph = new G6.Graph({
    container: 'mountNode',
    width,
    height,
    fitView: true,
    fitViewPadding: [20, 40, 50, 20],
    controlPoints: false,
    modes: {
      default: [
        'drag-canvas',
        'drag-node',
        'zoom-canvas',
        'activate-relations',
      ],
    },
    defaultNode: {
      size: [50, 50],
      style: {
        lineWidth: 1,
        fill: '#DEE9FF',
        stroke: '#5B8FF9',
      },
      labelCfg: {
        style: {
          fontSize: 20,
        },
      },
    },
    defaultEdge: {
      size: 2,
      style: {
        stroke: '#e2e2e2',
        lineAppendWidth: 2,
      },
      labelCfg: {
        autoRotate: true,
        style: {
          opacity: 0,
          stroke: 'white',
          lineWidth: 10,
          fontSize: 20,
        },
      },
    },
    layout: {
      type: 'dagre',
    },
    nodeStateStyles: {
      active: {
        opacity: 1,
      },
      inactive: {
        opacity: 0.2,
      },
    },
    edgeStateStyles: {
      active: {
        stroke: '#999',
      },
    },
    plugins: [minimap],
  });

  graph.node((node) => ({
    id: node.key,
    label: node.key,
    labelCfg: {
      positions: 'top',
    },
  }));

  graph.edge((edge) => ({
    ...edge,
    style: {
      endArrow: true,
    },
    label: edge.attributes.version || '',
  }));

  graph.on('node:click', (evt) => {
    const node = evt.item;
    node.blocked = !node.blocked;
  });

  graph.on('node:mouseenter', (evt) => {
    const node = evt.item;

    const edges = node.getEdges().map((edge) => edge._cfg.id);
    // There is a problem updating this.
    edges.forEach((edge) => {
      graph.updateItem(edge, {
        labelCfg: {
          style: {
            opacity: 1,
          },
        },
      });
    });
  });

  graph.on('node:mouseleave', (evt) => {
    const node = evt.item;
    if (node.blocked) {
      return;
    }

    const edges = node.getEdges().map((edge) => edge._cfg.id);

    edges.forEach((edge) => {
      graph.updateItem(edge, {
        labelCfg: {
          style: {
            opacity: 0,
          },
        },
      });
    });
  });

  graph.data(data);
  graph.render();
  graph.fitView();
};

const changeGraph = () => {
  const selectorValue = $('#dependencyTypeSelector').val();
  fetch(dependencyFiles[selectorValue])
    .then((res) => res.json())
    .then((data) => renderGraph(data));
};

changeGraph();

let timer;
const delay = 500;
$('#packageSelector').bind('keydown blur change', (e) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const selectorValue = $('#dependencyTypeSelector').val();
    const packageName = $('#packageSelector').val();
    fetch(dependencyFiles[selectorValue])
      .then((res) => res.json())
      .then((data) => {
        const nodesSet = new Set();
        data.edges = data.edges.filter((edge) => {
          const includes =
            edge.source.includes(packageName) ||
            edge.target.includes(packageName);
          if (includes) {
            nodesSet.add(edge.source);
            nodesSet.add(edge.target);
          }

          return includes;
        });
        data.nodes = data.nodes.filter((node) => nodesSet.has(node.key));

        renderGraph(data);
      });
  }, delay);
});
