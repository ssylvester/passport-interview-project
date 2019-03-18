// mutations.spec.js
import { expect } from 'chai';
import { mutations } from '@/store';

// set up the sample data
const id = 'askdks';
const factory = {
  id,
  validationIssues: [],
  children: [
    2,
    1,
  ],
  numChildren: 2,
  childMax: 5,
  childMin: 1,
};

describe('store tests', () => {
  it('should update factory', () => {
    const state = {
      tree: {
        factories: {},
      },
    };

    const payload = {
      id,
      factoryData: {},
    };

    state.tree.factories[id] = Object.assign({}, factory);
    payload.factoryData = Object.assign({}, factory);

    // run it
    mutations.updateFactory(state, payload);

    // object should deep equal
    expect(state.tree.factories[id]).to.eql(payload.factoryData);

    // make sure there's still only one factory
    expect(Object.keys(state.tree.factories).length).to.eq(1);

    // create a new factory
    const newPayload = {
      id,
      factoryData: Object.assign({}, factory),
    };

    // make the values different
    const newChildrenVal = 5;
    newPayload.factoryData.numChildren = newChildrenVal;

    // update
    mutations.updateFactory(state, newPayload);

    // child count should match
    expect(state.tree.factories[id].numChildren).to.eq(newChildrenVal);

    // children should be empty
    expect(state.tree.factories[id].children.length).to.eq(0);
  });

  it('should add the factory', () => {
    const state = {
      tree: {
        factories: {},
      },
    };

    mutations.addFactory(state);

    // there should be a new factory
    expect(Object.values(state.tree.factories).length).to.eq(1);
  });

  it('should set the tree', () => {
    const tree = { id: 2 };
    const state = {};

    mutations.setTree(state, tree);

    expect(state.tree).to.eql(tree);
  });

  it('should generate children', () => {
    const state = {
      tree: {
        factories: {},
      },
    };

    // add the sample factory
    state.tree.factories[id] = Object.assign({}, factory);

    // remove the children
    state.tree.factories[id].children = [];

    // run it
    mutations.generateChildren(state);

    // there should be 2 children
    expect(state.tree.factories[id].children.length).to.eq(2);
  });
});
