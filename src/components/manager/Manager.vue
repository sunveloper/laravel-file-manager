<template>
    <div class="fm-content">
        <!-- <disk-list v-bind:manager="manager"/> -->
        <!-- <breadcrumb v-bind:manager="manager" /> -->
        <div class="fm-content-body">
            <table-view v-if="viewType === 'table'" v-bind:manager="manager" v-bind:search="search" v-bind:checkAll="checkAll" />
            <grid-view v-else v-bind:manager="manager" v-bind:search="search" v-bind:checkAll="checkAll" />
        </div>
    </div>
</template>

<script>
// Components
import DiskList from './DiskList.vue';
import Breadcrumb from './Breadcrumb.vue';
import TableView from './TableView.vue';
import GridView from './GridView.vue';

export default {
  name: 'Manager',
  components: {
    DiskList,
    Breadcrumb,
    TableView,
    GridView,
  },
  props: {
    manager: { type: String, required: true },
    search: { type: String },
    checkAll: { type: Boolean},
  },
  computed: {
    /**
     * view type - grid or table
     * @returns {default.computed.viewType|(function())|string}
     */
    viewType() {
      return this.$store.state.fm[this.manager].viewType;
    },
    viewType() {
      return this.$store.state.fm[this.manager].viewType;
    },
  },
};
</script>
