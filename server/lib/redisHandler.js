const redis = require('redis');

class RedisHandler {
  /**
   * constructor
   * @param {string} url the redis url to use
   * @param {object} redisInstance redis handler for testing
   */
  constructor(url, redisInstance) {
    this.url = url;
    this.redisInstance = redisInstance || redis;
  }

  /**
   * Get client
   */
  getClient() {
    // create the client
    const client = this.redisInstance.createClient(this.url);

    // throw exception on error
    client.on("error", (err) => {
      throw new Error(err);
    });

    return client;
  }

  /**
   * List all the keys that match the given wildcard
   * @param {string} key 
   */
  listKeys(key) {
    return new Promise((resolve, reject) => {
      // grab the client first
      const client = this.getClient();

      // get em
      client.keys(key, (err, reply) => {
        if(err) {
          reject(err);
        } else {
          resolve(reply);
        }

        // clean up after yourself
        client.quit();
      });
    });
  }

  /**
   * get a value
   * @param {string} key the key to reference
   */
  get(key) {
    return new Promise((resolve, reject) => {
      // grab the client first
      const client = this.getClient();

      // get em
      client.get(key, (err, reply) => {
        if(err) {
          reject(err);
        } else {
          resolve(reply);
        }

        // clean up after yourself
        client.quit();
      });
    });
  }

  /**
   * set a value
   * 
   * @param {string} key the key to reference
   * @param {*} value the value to set
   */
  put(key, value) {
    return new Promise((resolve, reject) => {
      // grab the client first
      const client = this.getClient();

      // get em
      client.set(key, value, (err, reply) => {
        if(err) {
          reject(err);
        } else {
          resolve(reply);
        }

        // clean up
        client.quit();
      });
    });
  }

  /**
   * create a redis key
   * @param {string} type the type of object
   * @param {string} id the id for the given object
   */
  static createKeyFromId(type, id) {
    return `${type}:${id}`;
  }
}

module.exports = exports = RedisHandler;
