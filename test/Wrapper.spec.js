const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Wrapper = require('../lib/wrappers/Wrapper');

chai.use(chaiAsPromised);
const { expect } = chai;

describe('Wrapper', () => {
  describe('getAllPackages', () => {
    it('throws if it is not implemented', async () => {
      class FooWrapper extends Wrapper {}
      const fooWrapper = new FooWrapper();

      return expect(fooWrapper.getAllPackages()).to.eventually.be.rejectedWith('Not implemented yet');
    });

    it('calls the implementation', async () => {
      class FooWrapper extends Wrapper {
        constructor() {
          super();
          this.value = 'bar';
        }

        async getAllPackages() {
          return this.value;
        }
      }

      const fooWrapper = new FooWrapper();

      return expect(fooWrapper.getAllPackages()).to.eventually.equal('bar');
    });
  });
});
