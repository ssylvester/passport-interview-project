<template>
  <div v-if="factoryId" class="factory child" >
    <div class="head" @click="selectFactory" :class="computedClasses">
        <span>Name: <i>{{factory.name}}</i> </span> | 
        <span>children: <i>{{factory.numChildren}}</i> </span> | 
        <span>range: <i>{{factory.childMin}} - {{factory.childMax}}</i> </span> | 
        <button class="small" @click="remove">remove</button>
    </div>
    <div class="child" v-for="(child, idx) in factory.children" :key="idx">
      {{child}}
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default { 
    name: 'Factory',
    data() {
      return {
        showMenu: false
      }
    },
    props: [
      'factoryId'
    ],
    methods: {
      /**
       * remove this factory
       */
      remove() {
        this.$store.dispatch('deleteFactory', this.factoryId);
      },
      /**
       * set this factory as selected
       */
      selectFactory() {
        this.$store.dispatch('setSelectedFactory', this.factoryId);
      }
    },
    computed: {
      /**
       * Provide access to the factory for READ only, since we're using vuex for changes
       */
      factory(){
        return this.$store.state.tree.factories[this.factoryId];
      },
       /**
       * Get the classes that are dynamic based on factory properties
       */
      computedClasses() {
        return {
          'error': Object.keys(this.factory.validationIssues).length > 0,
          'selected': this.$store.state.selectedFactory === this.factoryId
        };
      },
    }, 
  };
</script>

<style lang="scss" scoped>
  .factory {
    margin-left: 10px;
    padding: 0;

    .head {
      cursor: pointer;
    }
  }

  .child {
    margin: 0 25px;
    border-left:1px solid rgb(100,100,100);

    .head {
      display: inline-block;
    }
    
    .head.error {
      color: #c71f1f;
    }

    .head.selected {
      font-weight: bold;
    }
  }

  .child:last-child {
    border-left:none;
  }

  .child:before {
    position:relative;
    top:-0.3em;
    height:1em;
    width:15px;
    color:white;
    border-bottom:1px solid rgb(100,100,100);
    content:"";
    display:inline-block;
    // left:-15px;
  }
  
  .child:last-child:before {
    border-left:1px solid rgb(100,100,100);   
  }

  button.small {
    margin: 0 !important;
    padding: 5px;
  }
</style>
