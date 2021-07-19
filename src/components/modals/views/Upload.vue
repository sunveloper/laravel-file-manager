<template>
    <div class="modal-content fm-modal-upload">
        <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title main-content-label">{{ lang.modal.upload.title }}</h5>
            <!-- <button type="button" class="close" aria-label="Close" v-on:click="hideModal">
                <span aria-hidden="true">&times;</span>
            </button> -->
        </div>
        <div class="modal-body">
            <div class="fm-btn-wrapper mb-3" v-show="!progressBar">
                <button type="button" class="btn btn-secondary btn-block tx-uppercase">
                    {{ lang.btn.uploadSelect }}
                </button>
                <input type="file" multiple name="myfile" v-on:change="selectFiles($event)">
            </div>
            <div class="fm-upload-list" v-if="countFiles">
              <!-- file upload list -->
              <div class="d-flex justify-content-between align-items-center my-1"
                    v-for="(item, index) in newFiles"
                    v-bind:key="index">
                  <div class="w-75 text-truncate">
                      <i class="fas" v-bind:class="mimeToIcon(item.type)"/>
                      {{ item.name }}
                      <span v-if="item.check" class="tx-danger">({{ lang.modal.upload.fileExist }})</span>
                  </div>
                  <div class="text-right">
                      {{ bytesToHuman(item.size) }}
                  </div>
              </div>
              <!-- summary file -->
              <div class="d-flex justify-content-between align-items-center my-3">
                  <div>
                      <span class="tx-medium pr-1">{{ lang.modal.upload.selected }}</span>
                      {{ newFiles.length }}
                  </div>
                  <div class="text-right">
                      <span class="tx-medium pr-1">{{ lang.modal.upload.size }}</span>
                      {{ allFilesSize }}
                  </div>
              </div>
              <!-- event check file -->
              <!-- <div class="d-flex justify-content-between align-items-center my-3">
                  <div>
                      <span class="tx-medium pr-1">{{ lang.modal.upload.ifExist }}</span>
                  </div>
                  <label class="form-check rdiobox">
                      <input class="form-check-input"
                              id="uploadRadio1"
                              type="radio"
                              name="uploadOptions"
                              value="0"
                              checked
                              v-model="overwrite">
                      <span class="form-check-label rdiobox-mark pl-1" for="uploadRadio1">
                          {{ lang.modal.upload.skip }}
                      </span>
                  </label>
                  <label class="form-check rdiobox">
                      <input class="form-check-input"
                              id="uploadRadio2"
                              type="radio"
                              name="uploadOptions"
                              value="1"
                              checked
                              v-model="overwrite">
                      <span class="form-check-label rdiobox-mark pl-1" for="uploadRadio2">
                          {{ lang.modal.upload.overwrite }}
                      </span>
                  </label>
              </div> -->
               
            </div>
            <div v-else><p class="form-label m-0">{{ lang.modal.upload.noSelected }}</p></div>
            <div class="fm-upload-info">
                <!-- Progress Bar -->
                <div class="progress" v-show="countFiles">
                    <div class="progress-bar progress-bar-striped bg-primary" role="progressbar"
                         v-bind:aria-valuenow="progressBar"
                         aria-valuemin="0"
                         aria-valuemax="100"
                         v-bind:style="{width: progressBar + '%' }">
                        {{ progressBar }}%
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline-light flex-1 mr-1" v-on:click="hideModal()">{{ lang.btn.cancel }}</button>
            <button class="btn btn-primary flex-1 ml-1"
                    v-bind:disabled="!countFiles || disabledFileExist"
                    v-on:click="uploadFiles">{{ lang.modal.upload.submit }}
            </button>
        </div>
    </div>
</template>

<script>
import modal from '../mixins/modal';
import translate from '../../../mixins/translate';
import helper from '../../../mixins/helper';

export default {
  name: 'Upload',
  mixins: [modal, translate, helper],
  data() {
    return {
      // selected files
      newFiles: [],

      // overwrite if exists
      overwrite: 0,
      fileExist: false,
      // x: null,
    };
  },
  mounted() {
  },
  computed: {

    /**
     * Progress bar value - %
     * @returns {number}
     */
    progressBar() {
      return this.$store.state.fm.messages.actionProgress;
    },

    /**
     * Count of files selected for upload
     * @returns {number}
     */
    countFiles() {
      return this.newFiles.length;
    },

    disabledFileExist() {
      for (let i = 0; i < this.newFiles.length; i += 1) {
        if(this.fileExist = this.$store.getters[`fm/${this.activeManager}/fileExist`](this.newFiles[i].name) == true) {
          return true;
        }
      }
    },

    /**
     * Calculate the size of all files
     * @returns {*|string}
     */
    allFilesSize() {
      let size = 0;

      for (let i = 0; i < this.newFiles.length; i += 1) {
        size += this.newFiles[i].size;
      }

      return this.bytesToHuman(size);
    }
  },
  methods: {
    /**
     * Select file or files
     * @param event
     */
    selectFiles(event) {
      // files selected?
      if (event.target.files.length === 0) {
        // no file selected
        this.newFiles = [];
      } else {
        // we have file or files
        this.newFiles = event.target.files;
      }

      this.checkFileExist()
      // console.log(this.newFiles)
    },

    checkFileExist() {
      for (let i = 0; i < this.newFiles.length; i += 1) {
        this.fileExist = this.$store.getters[`fm/${this.activeManager}/fileExist`](this.newFiles[i].name) ? this.newFiles[i].check = true : this.newFiles[i].check = false
      }
    },

    /**
     * Upload new files
     */
    uploadFiles() {
      // if files exists
      if (this.countFiles) {
        // upload files
        this.$store.dispatch('fm/upload', {
          files: this.newFiles,
          overwrite: this.overwrite,
        }).then((response) => {
          // if upload is successful
          if (response.data.result.status === 'success') {
            // close modal window
            this.hideModal();
          }
        });
      }
    },
  },
};
</script>
