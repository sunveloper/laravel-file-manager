<template>
    <div class="modal-content fm-modal-folder">
        <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title main-content-label">{{ lang.modal.newFolder.title }}</h5>
            <!-- <button type="button" class="close" aria-label="Close" v-on:click="hideModal">
                <span aria-hidden="true">&times;</span>
            </button> -->
        </div>
        <div class="modal-body">
            <div class="form-group mb-0">
                <label for="fm-folder-name" class="form-label tx-gray-600 mb-2 tx-medium">{{ lang.modal.newFolder.fieldName }}</label>
                <input type="text" class="form-control" id="fm-folder-name"
                       v-focus
                       v-bind:class="{'is-invalid': directoryExist}"
                       v-model="directoryName"
                       v-on:keyup="validateDirName">
                <div class="invalid-feedback" v-show="directoryExist">
                    {{ lang.modal.newFolder.fieldFeedback }}
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline-light flex-1 mr-1" v-on:click="hideModal">{{ lang.btn.cancel }}</button>
            <button class="btn btn-primary flex-1 ml-1"
                    v-bind:disabled="!submitActive"
                    v-on:click="addFolder">{{ lang.modal.newFolder.submit }}
            </button>
        </div>
    </div>
</template>

<script>
import modal from '../mixins/modal';
import translate from '../../../mixins/translate';

export default {
  name: 'NewFolder',
  mixins: [modal, translate],
  data() {
    return {
      // name for new directory
      directoryName: '',

      // directory exist
      directoryExist: false,
    };
  },
  computed: {
    /**
     * Submit button - active or no
     * @returns {string|boolean}
     */
    submitActive() {
      return this.directoryName && !this.directoryExist;
    },
  },
  methods: {
    /**
     * Check the folder name if it exists or not.
     */
    validateDirName() {
      if (this.directoryName) {
        this.directoryExist = this.$store.getters[`fm/${this.activeManager}/directoryExist`](this.directoryName);
      } else {
        this.directoryExist = false;
      }
    },

    /**
     * Create new directory
     */
    addFolder() {
      this.$store.dispatch('fm/createDirectory', this.directoryName).then((response) => {
        // if new directory created successfully
        if (response.data.result.status === 'success') {
          // close modal window
          this.hideModal();
        }
      });
    },
  },
};
</script>
