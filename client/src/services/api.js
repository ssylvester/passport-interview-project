const axios = require('axios');

/**
 * Class to handle Api communication
 */
class Api {
  constructor(host = 'http://localhost', port = '3000') {
    this.host = host;
    this.port = port;
    this.treeUrl = `${this.host}:${this.port}/tree`;
  }

  /**
   * get the tree. As of now,
   * the application centers around one tree,
   * but can easily be extended to manipulate multiple trees.
   */
  get() {
    return new Promise((resolve, reject) => {
      // first get the list of trees
      axios
        .get(this.treeUrl)
        .then((listData) => {
          const treeList = listData.data;

          // not an array? uh oh
          if (!Array.isArray(treeList)) {
            reject(new Error('Invalid Api response'));
          } else if (treeList.length === 0) { // no trees? return false
            resolve(false);
          } else {
            // grab the first tree, as the only functionality we support
            // now is management of a single tree
            const treeKey = treeList[0];

            // get the data
            axios.get(`${this.treeUrl}/${treeKey}`)
              .then((treeData) => {
                resolve(treeData.data);
              });
          }
        })
        .catch((error) => {
          // reject with the error
          reject(error);
        });
    });
  }

  /**
   * send the tree back to be stored
   * @param {object} tree the tree
   */
  put(tree) {
    return new Promise((resolve, reject) => {
      // first get the list of trees
      axios
        .put(`${this.treeUrl}/${tree.id}`, tree)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default Api;
