import uuid from 'uuid/v1';

/**
 * validate the given factory
 * @param {object} factory the factory
 */
export function validate(factory) {
  if (typeof factory === 'undefined') {
    throw new Error('invalid factory');
  }

  // create a new factory
  const validatedFactory = factory;

  // set validationIssues
  validatedFactory.validationIssues = {};

  // missing numChidren
  if (
    typeof validatedFactory.numChildren === 'undefined'
    || !Number.isInteger(validatedFactory.numChildren)) {
    validatedFactory.validationIssues.numChildren = 'missing required child range';
  } else if (validatedFactory.numChildren > 15) {
    // the limit for children is 15
    validatedFactory.validationIssues.numChildren = 'exceeded max of 15 children';
  }

  // lower limit
  if (typeof validatedFactory.childMin === 'undefined'
    || !Number.isInteger(validatedFactory.childMin)) {
    validatedFactory.validationIssues.childMin = 'missing required child minimum value';
  }

  // upper limit
  if (typeof validatedFactory.childMax === 'undefined'
    || !Number.isInteger(validatedFactory.childMax)) {
    validatedFactory.validationIssues.childMax = 'missing required child maximum value';
  } else if (validatedFactory.childMin > validatedFactory.childMax) {
    validatedFactory.validationIssues.childMax = 'max child value is smaller than the min';
  }

  // name
  if (typeof validatedFactory.name !== 'string' || validatedFactory.name.length === 0) {
    validatedFactory.validationIssues.name = 'invalid name';
  }

  return validatedFactory;
}

/**
 * Create a new factory
 */
export function create() {
  // create a uuid to use as the name and id
  const id = uuid();
  return {
    id,
    name: id,
    numChildren: null,
    childMax: null,
    childMin: null,
    children: [],
    dateTimeAdded: Date.now(),
  };
}

/**
 * generate the children
 * @param {object} factory factory
 */
export function generateChildren(factory) {
  // create a new factory based on the old
  const newFactory = factory;

  // clear the children
  newFactory.children = [];

  // let's start creating
  for (let i = 0; i < newFactory.numChildren; i += 1) {
    // generate a random number
    const child = Math.floor(Math.random() * (newFactory.childMax - newFactory.childMin) + newFactory.childMin);

    // add to the factory
    newFactory.children.push(child);
  }

  // return the new factory with generated children
  return newFactory;
}
