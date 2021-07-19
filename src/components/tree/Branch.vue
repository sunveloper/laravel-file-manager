<template>
    <ul class="list-unstyled fm-tree-branch">
        <li v-for="(directory, index) in subDirectories" v-bind:key="index" v-bind:class="[arrowState(index) ? 'is-expand' : '']">
            <p class="unselectable"
               v-bind:class="{'selected': isDirectorySelected(directory.path)}"
               v-on:click="selectDirectory(directory.path)">
                <i class="far"
                   v-if="directory.props.hasSubdirectories"
                   v-on:click.stop="showSubdirectories(
                        directory.path,
                        directory.props.showSubdirectories
                      )"
                   v-bind:class="[arrowState(index)
                    ? 'fa-minus-square'
                    : 'fa-plus-square'
                   ]" />
                <i class="fas fa-minus op-0" v-else />
                <i class="tx-16 px-1 fas" v-bind:class="[arrowState(index)
                    ? 'fa-folder-open'
                    : 'fa-folder'
                   , {'tx-primary': isDirectorySelected(directory.path)}]"></i>
                <span class="tx-medium" v-bind:class="{'tx-primary': isDirectorySelected(directory.path)}">{{ directory.basename }}</span> 
            </p>

            <transition name="fade-tree">
                <branch v-show="arrowState(index)"
                        v-if="directory.props.hasSubdirectories"
                        v-bind:parent-id="directory.id">
                </branch>
            </transition>
        </li>
    </ul>
</template>

<script>
export default {
  name: 'Branch',
  props: {
    parentId: { type: Number, required: true },
  },
  computed: {
    /**
     * Subdirectories for selected parent
     * @returns {*}
     */
    subDirectories() {
      return this.$store.getters['fm/tree/directories'].filter((item) => item.parentId === this.parentId);
    },
  },
  methods: {
    /**
     * Check, is this directory selected?
     * @param path
     * @returns {boolean}
     */
    isDirectorySelected(path) {
      return this.$store.state.fm.left.selectedDirectory === path;
    },

    /**
     * Show subdirectories - arrow
     * @returns {boolean}
     * @param index
     */
    arrowState(index) {
      return this.subDirectories[index].props.showSubdirectories;
    },

    /**
     * Show/Hide subdirectories
     * @param path
     * @param showState
     */
    showSubdirectories(path, showState) {
      if (showState) {
        // hide
        this.$store.dispatch('fm/tree/hideSubdirectories', path);
      } else {
        // show
        this.$store.dispatch('fm/tree/showSubdirectories', path);
      }
    },

    /**
     * Load selected directory and show files
     * @param path
     */
    selectDirectory(path) {
      // only if this path not selected
      if (!this.isDirectorySelected(path)) {
        this.$store.dispatch('fm/left/selectDirectory', { path, history: true });
      }

      this.$store.state.fm.left.selected.directories = []
			this.$store.state.fm.left.selected.files = []
      this.$store.state.fm.left.checkAll = false
    },
  },
};
</script>
