<template>
  <div class="root-node container">
    <header>
      Root Node 
      <button @click="addFactory">add factory</button>
      <button @click="reset">reset</button>
    </header>
    <small>
      Click on a Factory to edit it's values. 
      Invalid factories will be highlighted in <span class='error'>red</span>.
      Selected factories will be <span class="selected">bolded</span>.
    </small>
    <div class="factory-list">
      <Factory v-for="(factory, factoryId) in tree.factories" :key="factoryId" :factory-id="factoryId">
      </Factory>
    </div>
    <footer class="sticky">
      <FactoryEditor :factory-id="selectedFactory"> </FactoryEditor>
    </footer>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Factory from './Factory.vue';
import FactoryEditor from './FactoryEditor.vue';

export default {
  name: 'Root',
  components: {
    Factory,
    FactoryEditor,
  },
  methods: {
    ...mapActions([
      'addFactory',
      'reset'
    ]),
  },
  computed: mapState([
    'tree',
    'errors',
    'loading',
    'selectedFactory',
  ]),
};
</script>

<style scoped lang="scss">

.root-node {
  width: 100%;

  header {
    font-weight: bold;
  }

  .factory-list {
    margin: 10px 0;
  }

  footer {
    position:fixed;
    width: 100%;
  }

  .error {
    color: #c71f1f;
  }

  .selected {
    font-weight: bold;
  }
}
</style>
