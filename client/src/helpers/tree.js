import uuid from 'uuid/v1';
import { validate as validateFactory } from './factory'; 

/**
 * Create a new tree
 */
export function create() {
  return { id: uuid(), factories: {} };
}

/**
 * validate the factories in the given tree
 * @param {object} tree the tree
 */
export function validate(tree) {
  if (typeof tree === 'undefined') {
    throw new Error('invalid tree');
  }

  // make sure the tree has valid values
  if (
    typeof tree.id !== 'string'
    || typeof tree.factories !== 'object'
  ) {
    // the instance is invalid and unusable, so lets dump it
    throw new Error('passed instance is an invalid tree');
  }

  // create a new tree
  const newTree = tree;

  // walk each of the factories to validate
  Object.keys(newTree.factories).forEach((factoryId) => {
    // validate
    const factory = validateFactory(newTree.factories[factoryId]);

    // reassign
    newTree.factories[factoryId] = factory;
  });

  return newTree;
}
