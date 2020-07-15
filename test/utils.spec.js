const { expect } = require('chai');
const Graph = require('graphology');
const utils = require('../lib/utils');

describe('utils', () => {
  describe('filterDependency', () => {
    const deps = {
      'production-dep': '1.0.0',
      'fake-dep': '1.5.2',
      'my-awesome-dep': '1.2.3',
      'foorg/dep': '1.2.3',
      'foorg/another-dep': '4.3.2',
      'foorg/third-dep': '3.2.1',
      'barorg/dep': '1.2.3',
      'barorg/another-dep': '4.3.2',
    };

    it('returns all dependencies if no prefix and no indlude', () => {
      expect(utils.filterDependency(deps)).to.eql(deps);
    });

    it('returns dependencies that start with prefix', () => {
      expect(utils.filterDependency(deps, 'foorg')).to.eql({
        dep: '1.2.3',
        'another-dep': '4.3.2',
        'third-dep': '3.2.1',
      });
    });

    it('returns dependencies that contain the include string', () => {
      expect(utils.filterDependency(deps, '', 'another')).to.eql({
        'foorg/another-dep': '4.3.2',
        'barorg/another-dep': '4.3.2',
      });
    });

    it('returns dependencies that contain both prefix and include', () => {
      expect(utils.filterDependency(deps, 'foorg', 'another')).to.eql({
        dep: '1.2.3',
        'another-dep': '4.3.2',
        'third-dep': '3.2.1',
        'barorg/another-dep': '4.3.2',
      });
    });
  });

  describe('addNodesAndEdgesForDependency', () => {
    const deps = {
      dep: '1.2.3',
      'another-dep': '4.3.2',
      'third-dep': '3.2.1',
    };
    let graph;
    beforeEach(() => {
      graph = new Graph({ multi: true });
    });

    it('returns the same graph if dependencyt is empty', () => {
      expect(utils.addNodesAndEdgesForDependency(graph, {}, 'package')).to.eql(
        graph,
      );
    });

    it('returns the graph with the new dependencies added', () => {
      const parentPackageAttributes = {
        version: '1',
        description: 'foo',
        homepage: 'bar',
      };
      graph.mergeNode('parent-package', parentPackageAttributes);
      const targetGraph = {
        attributes: {},
        nodes: [
          {
            key: 'parent-package',
            attributes: parentPackageAttributes,
          },
          ...Object.keys(deps).map((k) => ({ key: k })),
        ],
        edges: [
          {
            source: 'parent-package',
            target: 'dep',
            attributes: { version: '1.2.3' },
          },
          {
            source: 'parent-package',
            target: 'another-dep',
            attributes: { version: '4.3.2' },
          },
          {
            source: 'parent-package',
            target: 'third-dep',
            attributes: { version: '3.2.1' },
          },
        ],
      };

      expect(
        utils.addNodesAndEdgesForDependency(graph, deps, 'parent-package').export(),
      ).to.eql(targetGraph);
    });
  });
});
