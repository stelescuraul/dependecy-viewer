const { expect } = require('chai');
const sinon = require('sinon');

const GraphBuilder = require('../lib/GraphBuilder');
const {
  packages, prodDependencyGraph, devDependencyGraph, allDependencyGraph,
} = require('./dependencyGraphs');

describe('GraphBuilder', () => {
  const wrapper = {
    getAllPackages: sinon.stub(),
  };
  let graphBuilder;

  before(() => {
    graphBuilder = new GraphBuilder(wrapper);
  });

  beforeEach(() => {
    wrapper.getAllPackages.reset();
  });

  it('creates the dependencies', async () => {
    wrapper.getAllPackages.returns(packages);
    return expect(graphBuilder.buildDependencyGraph()).to.eventually.be.fulfilled;
  });

  it('returns the correct production dependency graph', async () => {
    wrapper.getAllPackages.returns(packages);
    const graphs = await graphBuilder.buildDependencyGraph();
    expect(graphs).to.have.property('prodDepsGraph');
    expect(graphs.prodDepsGraph.export()).to.be.eql(prodDependencyGraph);
  });

  it('returns the correct dev dependency graph', async () => {
    wrapper.getAllPackages.returns(packages);
    const graphs = await graphBuilder.buildDependencyGraph();
    expect(graphs).to.have.property('devDepsGraph');
    expect(graphs.devDepsGraph.export()).to.be.eql(devDependencyGraph);
  });

  it('returns the correct all dependency graph', async () => {
    wrapper.getAllPackages.returns(packages);
    const graphs = await graphBuilder.buildDependencyGraph();
    expect(graphs).to.have.property('allDepsGraph');
    expect(graphs.allDepsGraph.export()).to.be.eql(allDependencyGraph);
  });
});
