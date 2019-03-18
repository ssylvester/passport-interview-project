const RedisHandler = require('../../lib/redisHandler');

/**
 * put a tree into the db
 */
module.exports = async function (req, res, redis) {
  // grab the id 
  const id = req.params.id;

  // invalid? return a 500
  if (typeof id !== 'string' && id.length > 5) {
    res.status(500);
    return res.send('Invalid id');
  }

  // grab the body
  const tree = req.body;

  // make sure that the tree is valid
  if(
    typeof tree !== 'object'
    || typeof tree.id !== 'string'
    || typeof tree.factories !== 'object'
  ) {
    res.status(500);
    return res.send('Invalid tree');
  }

  // stringify the body response
  const treeString = JSON.stringify(tree);

  // build the key
  const redisKey = RedisHandler.createKeyFromId('tree', id);

  // put into the db
  await redis.put(redisKey, treeString);

  // send the response back
  res.send(tree);
}
