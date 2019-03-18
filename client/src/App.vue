<template>
  <div id="app" class="container">
    <div class="row">
      <Root></Root>
    </div>
  </div>
</template>

<script>
import Root from '@/components/Root.vue'
import { mapActions, mapState } from 'vuex';

export default {
  name: 'App',
  mounted: function() {
    this.initializePolling();
  },
  computed: {
    ...mapState({
      pauseNetworking: state => state.pauseNetworking
    })
  },
  methods: {
    ...mapActions([
      'createTree',
      'setTree',
      'refreshTree',
      'initializePolling'
    ]),
  },
  components:{
    Root
  },
};
</script>

<style lang="scss">
  @import '../node_modules/mini.css/dist/mini-default.css'
</style>
