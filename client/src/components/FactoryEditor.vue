<template>
  <div v-if="factoryId" class="factory">
    <div v-if="issueList.length">
      <div v-for="(issue, issueKey) in issueList" :key="issueKey" class="error">{{issue}}</div>
    </div>
    <div>
      Name:
      <input type="text" v-model="name" :class="getInputClass('name')">
      children:
      <input v-model.number="numChildren" :class="getInputClass('numChildren')" size="5">
      range:
      <input size="5" v-model.number="childMin" :class="getInputClass('childMin')"> -
      <input size="5" v-model.number="childMax" :class="getInputClass('childMax')">
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "FactoryEditor",
  props: ["factoryId"],
  methods: {
    /**
     * Get the classes that can apply to the given input field
     */
    getInputClass(field) {
      return {
        "input-error": typeof this.factory.validationIssues[field] === "string"
      };
    },
    /**
     * update the given field
     */
    updateField(fieldName, value) {
      // grab a copy of the factory
      const factory = Object.assign({},this.$store.state.tree.factories[this.factoryId]);

      // set the value
      factory[fieldName] = value;

      // commit the action
      this.$store.dispatch("updateFactory", {
        id: factory.id,
        factoryData: factory
      });
    }
  },
  computed: {
    /**
     * Array of the issues for this factory
     */
    issueList() {
      return Object.values(this.factory.validationIssues);
    },
    /**
     * Provide access to the factory for READ only, since we're using vuex for changes
     */
    factory() {
      return this.$store.state.tree.factories[this.factoryId];
    },
    name: {
      get() {
        return this.$store.state.tree.factories[this.factoryId].name;
      },
      set(value) {
        // update the factory with the new value
        this.updateField("name", value);
      }
    },
    numChildren: {
      get() {
        return this.$store.state.tree.factories[this.factoryId].numChildren;
      },
      set(value) {
        // update the factory with the new value
        this.updateField("numChildren", value);
      }
    },
    childMax: {
      get() {
        return this.$store.state.tree.factories[this.factoryId].childMax;
      },
      set(value) {
        // update the factory with the new value
        this.updateField("childMax", value);
      }
    },
    childMin: {
      get() {
        return this.$store.state.tree.factories[this.factoryId].childMin;
      },
      set(value) {
        // update the factory with the new value
        this.updateField("childMin", value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>

  .error {
    font-size: 50%;
    color: red;
  }

  .input-error {
    border-color: red;
  }

</style>
