import Vue from 'vue';
import Vuex from 'vuex';
import { isEqual } from 'lodash';

// helpers
import { create as createTree, validate as validateTree } from '@/helpers/tree';
import { create as createFactory, generateChildren } from '@/helpers/factory';

// services
import Api from '@/services/api';

// set vuex middleware
Vue.use(Vuex);

// create api
// hardcoded
const apiHandler = new Api(process.env.VUE_APP_APIURL, process.env.VUE_APP_APIPORT);

export const mutations = {
  /**
   * replace the given factory with the updated values
   */
  updateFactory: (state, payload) => {
    // reassign to keep things clean
    const factory = payload.factoryData;

    // get the original factory
    const originalFactory = state.tree.factories[factory.id];

    // if the factory data has been changed
    if (
      factory.numChildren !== originalFactory.numChildren
      || factory.childMax !== originalFactory.childMax
      || factory.childMin !== originalFactory.childMin
    ) {
      // clear the children. it will be regenerated later
      factory.children = [];
    }

    // set
    Vue.set(state.tree.factories, payload.id, factory);
  },
  /**
   * Add a new factory to the root node
   */
  addFactory: (state) => {
    // lets grab a new factory
    const factory = createFactory();

    // let's add the factory to the tree
    Vue.set(state.tree.factories, factory.id, factory);

    // also set the selected factory
    Vue.set(state, 'selectedFactory', factory.id);

    // return the factory
    return factory;
  },
  /**
   * Set the given tree onto the state
   */
  setTree: (state, tree) => {
    Vue.set(state, 'tree', tree);
  },
  /**
   * Create a new tree
   */
  createTree: (state) => {
    Vue.set(state, 'tree', createTree());
  },
  /**
   * Validate all of the tree's inputs
   */
  validateTree: (state) => {
    // validate
    const tree = validateTree(state.tree);

    // set the new tree
    Vue.set(state, 'tree', tree);
  },
  /**
   * Generate children for all of the valid factories
   */
  generateChildren: (state) => {
    // loop factories
    Object.values(state.tree.factories).forEach((factory) => {
      // no issues and needs children?
      if (Object.keys(factory.validationIssues).length === 0
        && factory.children.length !== factory.numChildren) {
        // generate
        const generatedFactory = generateChildren(factory);

        // set
        Vue.set(state.tree.factories, factory.id, generatedFactory);
      }
    });
  },
  /**
   * Reset the children array
   */
  resetChildren: (state, id) => {
    // create an empty child set
    Vue.set(state.tree.factories[id], 'children', []);
  },
  /**
   * Remove the given factory
   */
  deleteFactory: (state, id) => {
    // if the factory exists...
    if (state.tree.factories[id]) {
      // delete it
      Vue.delete(state.tree.factories, id);
    }
  },
  setLoading: (state, flag) => {
    Vue.set(state, 'loading', flag);
  },
  setUpdating: (state, flag) => {
    Vue.set(state, 'updating', flag);
  },
  setSelectedFactory: (state, id) => {
    Vue.set(state, 'selectedFactory', id);
  },
};

export const actions = {
  setSelectedFactory: ({ commit }, id) => {
    commit('setSelectedFactory', id);
  },
  updateFactory: ({ commit, dispatch }, payload) => {
    commit('updateFactory', payload);
    commit('validateTree');
    commit('generateChildren');

    // send up the new tree
    dispatch('uploadTree');
  },
  addFactory: ({ commit, dispatch }) => {
    commit('addFactory');
    commit('validateTree');
    commit('generateChildren');

    // send up the new tree
    dispatch('uploadTree');
  },
  setTree: ({ commit, dispatch }, tree) => {
    commit('setTree', tree);
    commit('validateTree');
    commit('generateChildren');

    // send up the new tree
    dispatch('uploadTree');
  },
  createTree: ({ commit, dispatch }) => {
    commit('createTree');
    commit('validateTree');
    commit('generateChildren');

    // send up the new tree
    dispatch('uploadTree');
  },
  deleteFactory: ({ commit, dispatch }, id) => {
    commit('deleteFactory', id);
    commit('validateTree');
    commit('generateChildren');

    // send up the new tree
    dispatch('uploadTree');
  },
  refreshTree: ({ commit, dispatch, state }) => {
    // return a promise since we're going to be making an api call
    return new Promise((resolve, reject) => {
      // set loading
      commit('setLoading', true);

      // first, get a tree from the api
      apiHandler.get()
        .then((tree) => {
          // is this tree different?
          if (!isEqual(state.tree, tree)) {
            // make sure that we're not updating
            if (!state.updating) {
              // if we got a tree back...
              if (tree) {
                // set the tree in the store
                dispatch('setTree', tree);
                resolve();
              } else {
                // no tree found, so we need to create one
                dispatch('createTree');
                resolve();
              }
            }
          }
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => {
          commit('setLoading', false);
        });
    });
  },
  initializePolling: ({ dispatch, state }) => {
    // set the interval to poll every second
    setInterval(() => {
      // if we're loading, wait till the next poll
      if (!state.loading && !state.updating) {
        dispatch('refreshTree');
      }
    }, 1000);
  },
  uploadTree: ({ commit, state }) => {
    // set loading to true
    commit('setUpdating', true);

    // send the tree back to the api
    apiHandler.put(state.tree)
      .finally(() => {
        commit('setUpdating', false);
      });
  },
  reset: ({ dispatch, state }) => {
    // get the given tree
    const treeId = state.tree.id;

    // create a new one
    const newTree = createTree();

    // use the old id
    newTree.id = treeId;

    // update
    dispatch('setTree', newTree);
  },
};

export default new Vuex.Store({
  state: {
    selectedFactory: null,
    tree: {},
    loading: false,
    updating: false,
  },
  mutations,
  actions,
});
