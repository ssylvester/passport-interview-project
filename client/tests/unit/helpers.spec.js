import { expect } from 'chai';
import { create as createTree, validate as validateTree } from '../../src/helpers/tree';
import { create as createFactory, generateChildren } from '../../src/helpers/factory';

// start helper tests
describe('tree/factory helper tests', () => {
  it('should generate valid trees with unique ids', () => {
    const tree = createTree();

    // should have a value
    expect(tree.id).not.to.be.empty;

    // create a new one
    const newTree = createTree();

    // expect the ids to be different
    expect(newTree.id).not.to.eq(tree.id);

    // add a factory
    const newFactory = createFactory();

    // make sure default values are there
    expect(newFactory.name).to.be.a('string');
    expect(newFactory.name.length).to.be.at.least(5);
    expect(newFactory.children).to.be.an('array');
    expect(newFactory.children).to.be.empty;

    // the new new factory to the tree
    tree.factories[newFactory.id] = newFactory;

    // validate
    const validated = validateTree(tree);

    // grab the factory
    const factory = validated.factories[newFactory.id];

    // the factory should have validation issues
    expect(factory.validationIssues.numChildren).to.eq('missing required child range');
    expect(factory.validationIssues.childMin).to.eq('missing required child minimum value');
    expect(factory.validationIssues.childMax).to.eq('missing required child maximum value');

    // set real values
    const numChildren = 5;
    const childMin = 3;
    const childMax = 400;
    const name = 'factory';

    // update factory with real vals
    validated.factories[newFactory.id].numChildren = numChildren;
    validated.factories[newFactory.id].childMin = childMin;
    validated.factories[newFactory.id].childMax = childMax;
    validated.factories[newFactory.id].name = name;

    // validate again
    const validTree = validateTree(validated);

    // there should be no validation issues
    Object.values(validTree.factories).forEach((validFactory) => {
      expect(Object.keys(validFactory.validationIssues).length).to.eq(0);
    });

    // generate children
    const builtFactory = generateChildren(validTree.factories[newFactory.id]);

    // should be ${numChildren} integers
    expect(builtFactory.children.length).to.eq(numChildren);

    // each child should be in range
    builtFactory.children.forEach((child) => {
      expect(child).to.be.at.least(childMin);
      expect(child).to.be.at.most(childMax);
      expect(Number.isInteger(child)).to.be.true;
    });
  });

  it('should throw an invalid tree error', () => {
    const invalidInstance = {
      id: 1121332,
    };

    // create an instantiation func
    const badFunc = () => {
      validateTree(invalidInstance);
    };

    // instance should have the same id
    expect(badFunc).to.throw('passed instance is an invalid tree');
  });

  it('should have validation issues', () => {
    const tree = {
      id: '1121332-asakldjf3',
      factories: [
        {
          id: '1121332-asakldjf3',
        },
      ],
    };

    const validated = validateTree(tree);

    // the first factory instance should have issues
    expect(validated.factories[0].validationIssues.numChildren).to.eq('missing required child range');
    expect(validated.factories[0].validationIssues.childMin).to.eq('missing required child minimum value');
    expect(validated.factories[0].validationIssues.childMax).to.eq('missing required child maximum value');
    expect(validated.factories[0].validationIssues.name).to.eq('invalid name');
  });

  it('should store the provided tree instance', () => {
    const tree = {
      id: '1121332-asakldjf3',
      factories: {
        '1121332-asaddddkldjf3': {
          name: 'factory',
          numChildren: 5,
          childMin: 5,
          childMax: 100,
          children: [],
        },
      },
    };

    const validated = validateTree(tree);

    // no validation issues
    Object.values(validated.factories).forEach((factory) => {
      expect(factory.validationIssues).to.be.empty;
    });
  });
});
