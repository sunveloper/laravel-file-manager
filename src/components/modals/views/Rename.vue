<template>
    <div class="modal-content fm-modal-rename">
        <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title main-content-label">{{ lang.modal.rename.title }}</h5>
            <!-- <button type="button" class="close" aria-label="Close" v-on:click="hideModal">
                <span aria-hidden="true">&times;</span>
            </button> -->
        </div>
        <div class="modal-body">
            <div class="form-group mb-0">
                <label for="fm-input-rename" class="form-label tx-gray-600 mb-2 tx-medium">{{ lang.modal.rename.fieldName }}</label>
                <input type="text" class="form-control" id="fm-input-rename"
                       v-focus
                       v-bind:class="{'is-invalid': checkName}"
                       v-model="name"
                       v-on:keyup="validateName">
                <div class="invalid-feedback" v-show="checkName">
                    {{ lang.modal.rename.fieldFeedback }}
                    {{ directoryExist ? ` - ${lang.modal.rename.directoryExist}` : ''}}
                    {{ fileExist ? ` - ${lang.modal.rename.fileExist}` : ''}}
                </div>
            </div>
        </div>
        <div class="modal-footer justify-content-between">
            <button class="btn btn-outline-light flex-1 mr-1" v-on:click="hideModal">{{ lang.btn.cancel }}</button>
            <button class="btn btn-primary flex-1 ml-1"
                    v-bind:disabled="submitDisable"
                    v-on:click="rename">{{ lang.modal.rename.submit }}
            </button>
        </div>
    </div>
</template>

<script>
import modal from '../mixins/modal';
import translate from '../../../mixins/translate';

export default {
  name: 'Rename',
  mixins: [modal, translate],
  data() {
    return {
      name: '',
      directoryExist: false,
      fileExist: false,
    };
  },
  computed: {
    /**
     * Selected item
     * @returns {*}
     */
    selectedItem() {
      return this.$store.getters[`fm/${this.activeManager}/selectedList`][0];
    },

    /**
     * Check new name
     * @returns {boolean}
     */
    checkName() {
      return this.directoryExist || this.fileExist || !this.name;
    },

    /**
     * Submit button disable
     * @returns {*|boolean}
     */
    submitDisable() {
      return this.checkName || this.name === this.selectedItem.basename;
    },
  },
  mounted() {
    // initiate item name
    this.name = this.selectedItem.basename;
  },
  methods: {
    /**
     * Validate item name
     */
    validateName() {
      if (this.name !== this.selectedItem.basename) {
        // if item - folder
        if (this.selectedItem.type === 'dir') {
          // check folder name matches
          this.directoryExist = this.$store.getters[`fm/${this.activeManager}/directoryExist`](this.name);
        } else {
          // check file name matches
          this.fileExist = this.$store.getters[`fm/${this.activeManager}/fileExist`](this.name);
        }
      }
    },

    /**
     * Rename item
     */
    rename() {
      // create new name with path
      const newName = this.selectedItem.dirname
        ? `${this.selectedItem.dirname}/${this.name}`
        : this.name;

      this.$store.dispatch('fm/rename', {
        type: this.selectedItem.type,
        newName,
        oldName: this.selectedItem.path,
      }).then(() => {
        // close modal window
        this.hideModal();
      });
    },
  },
};
</script>
