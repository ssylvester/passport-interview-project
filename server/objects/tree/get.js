const RedisHandler = require('../../lib/redisHandler');

/**
 * get a tree by it's id
 */
module.exports = async function(req, res, redis) {
    // grab the id 
    const id = req.params.id;

    // invalid? return a 500
    if(typeof id !== 'string' && id.length > 5 && !/^[a-z0-9-]+$/.test(id)) {
        res.status(500);
        return res.send('Invalid id');
    }

    // build the key
    const redisKey = RedisHandler.createKeyFromId('tree', id);

    // get em
    const tree = await redis.get(redisKey);

    if(tree) {
        // decode 
        const decodedTree = JSON.parse(tree);

        // set content type
        res.type('application/json');
        return res.json(decodedTree);
    }
 
     // nothig? return 404
     res.status(404);
     res.send('Not Found');
}
