const RedisHandler = require('../../lib/redisHandler');

/**
 * get a list of the trees
 */
module.exports = async function(req, res, redis) {
  // build the key
  const redisKey = RedisHandler.createKeyFromId('tree', '*');

  // grab the ray keys
  const rawKeys = await redis.listKeys(redisKey);
  
  // convert to an app-friendly list
  const keys = rawKeys.map((key) => key.replace('tree:',''));

  // send the response
  res.type('application/json');
  res.send(keys);
};