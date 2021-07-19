// Event bus
import EventBus from '../../../eventBus';

export default {
  computed: {
    /**
     * Selected disk for this manager
     * @returns {default.computed.selectedDisk|(function())|default.selectedDisk|null}
     */
    selectedDisk() {
      return this.$store.state.fm[this.manager].selectedDisk;
    },

    /**
     * Selected directory for this manager
     * @returns {default.computed.selectedDirectory|(function())|default.selectedDirectory|null}
     */
    selectedDirectory() {
      return this.$store.state.fm[this.manager].selectedDirectory;
    },

    /**
     * Files list for selected directory
     * @returns {*}
     */
    files() {
      return this.$store.getters[`fm/${this.manager}/files`];
    },

    /**
     * Directories list for selected directory
     * @returns {*}
     */
    directories() {
      return this.$store.getters[`fm/${this.manager}/directories`];
    },

    /**
     * Selected files and folders
     * @returns {default.computed.selected|(function())|selected|{directories, files}|string|*|boolean}
     */
    selected() {
      return this.$store.state.fm[this.manager].selected;
    },

    /**
     * ACL On/Off
     */
    acl() {
      return this.$store.state.fm.settings.acl;
    },

    /**
     * Check if current path is at root level
     * @return {boolean}
     */
    isRootPath() {
      return this.$store.state.fm[this.manager].selectedDirectory === null;
    },

    setSearch() {
      return this.$store.state.fm[this.manager].search;
    },
  },
  methods: {
    /**
     * Load selected directory and show files
     * @param path
     */
    selectDirectory(path) {
      this.$store.dispatch(`fm/${this.manager}/selectDirectory`, { path, history: true });
      
      this.$store.state.fm[this.activeManager].selected.directories = []
			this.$store.state.fm[this.activeManager].selected.files = []
      this.$store.state.fm.left.checkAll = false
    },

    /**
     * Level up directory
     */
    levelUp() {
      // if this a not root directory
      if (this.selectedDirectory) {
        // calculate up directory path
        const pathUp = this.selectedDirectory.split('/').slice(0, -1).join('/');

        // load directory
        this.$store.dispatch(`fm/${this.manager}/selectDirectory`, { path: pathUp || null, history: true });
      }
    },

    /**
     * Check item - selected
     * @param type
     * @param path
     */
    checkSelect(type, path) {
      return this.selected[type].includes(path);
    },

    /**
     * Select items in list (files + folders)
     * @param type
     * @param path
     * @param event
     */
    selectItem(type, path, event) {
      // console.log('event selectItem -->', type, path, event)
      
      // search in selected array
      const alreadySelected = this.selected[type].includes(path);
      // const getSelectedCount = this.$store.getters[`fm/${this.activeManager}/selectedCount`] + 1;
      // const getDirectoriesCount = this.$store.getters[`fm/${this.activeManager}/directoriesCount`];
      // const getFilesCount = this.$store.getters[`fm/${this.activeManager}/filesCount`];
      // const sumSelectedCount = getDirectoriesCount + getFilesCount
      // const getSelectAllStatus = this.$store.state.fm[this.activeManager].checkAll;

      // console.log('get => ',getSelectedCount)
      // console.log('sum => ',sumSelectedCount)

      // if pressed *** -> multi select
      if (event.which) {
        if (!alreadySelected) {
          // add new selected item
          this.$store.commit(`fm/${this.manager}/setSelected`, { type, path });
          // console.log('no already')
        } 
        // else if (alreadySelected) {
        //   // this.$store.state.fm[this.activeManager].selected.directories.splice(this.$store.state.fm[this.activeManager].selected.directories.indexOf(type), 1);
        //   // this.$store.commit(`fm/${this.manager}/removeSelected`, { type, path });

        //   console.log(type, path)
        //   console.log('already')
        // }
         else {
          // remove selected item
          this.$store.commit(`fm/${this.manager}/removeSelected`, { type, path });
          // console.log('remove')
        }
      }

      // if(getSelectedCount == sumSelectedCount) {
      //   this.$store.commit(`fm/${this.activeManager}/setCheckAll`, true);
      // } else {
      //   this.$store.commit(`fm/${this.activeManager}/setCheckAll`, false);
      // }

      // console.log('working')

      // single select
      // if (!event.which && !alreadySelected) {
      //   this.$store.commit(`fm/${this.manager}/changeSelected`, { type, path });
      // }
      
    },

    /**
     * Show context menu
     * @param item
     * @param event
     */
    contextMenu(item, event) {
      // el type
      const type = item.type === 'dir' ? 'directories' : 'files';
      // search in selected array
      const alreadySelected = this.selected[type].includes(item.path);

      // select this element
      if (!alreadySelected) {
        // select item
        this.$store.commit(`fm/${this.manager}/changeSelected`, {
          type,
          path: item.path,
        });
      }

      // create event
      EventBus.$emit('contextMenu', event);
    },

    /**
     * Select and Action
     * @param path
     * @param extension
     */
    selectAction(path, extension) {
      // if is set fileCallback
      if (this.$store.state.fm.fileCallback) {
        this.$store.dispatch('fm/url', {
          disk: this.selectedDisk,
          path,
        }).then((response) => {
          if (response.data.result.status === 'success') {
            this.$store.state.fm.fileCallback(response.data.url);
          }
        });

        return;
      }

      // if extension not defined
      if (!extension) {
        return;
      }

      // show, play..
      if (this.$store.state.fm.settings.imageExtensions
        .includes(extension.toLowerCase())) {
        // show image
        this.$store.commit('fm/modal/setModalState', {
          modalName: 'Preview',
          show: true,
        });
      } else if (Object.keys(this.$store.state.fm.settings.textExtensions)
        .includes(extension.toLowerCase())) {
        // show text file
        this.$store.commit('fm/modal/setModalState', {
          modalName: 'TextEdit',
          show: true,
        });
      } else if (this.$store.state.fm.settings.audioExtensions
        .includes(extension.toLowerCase())) {
        // show player modal
        this.$store.commit('fm/modal/setModalState', {
          modalName: 'AudioPlayer',
          show: true,
        });
      } else if (this.$store.state.fm.settings.videoExtensions
        .includes(extension.toLowerCase())) {
        // show player modal
        this.$store.commit('fm/modal/setModalState', {
          modalName: 'VideoPlayer',
          show: true,
        });
      } else if (extension.toLowerCase() === 'pdf') {
        // show pdf document
        this.$store.dispatch('fm/openPDF', {
          disk: this.selectedDisk,
          path,
        });
      }
    },
  },
};
