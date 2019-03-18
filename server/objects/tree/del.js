const RedisHandler = require('../../lib/redisHandler');

/**
 * delete a tree by it's id
 */
module.exports = async function (req, res, redis) {
  // grab the id 
  const id = req.params.id;

  // invalid? return a 500
  if (typeof id !== 'string' && id.length > 5) {
    res.status(500);
    return res.send('Invalid id');
  }

  // build the key
  const redisKey = RedisHandler.createKeyFromId('tree', id);

  // check for the id first
  const tree = await redis.get(redisKey);

  // delete if we found it
  if (tree) {
    // get em
    await redis.delete(redisKey);

    // send 200
    res.status(200);
    res.send('Deleted');
  } else {
    res.status(404);
    res.send('Not Found');
  }
}
