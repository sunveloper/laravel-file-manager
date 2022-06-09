<template>
  <div
    class="
      fm-footer fm-info-block
      d-flex
      align-items-center
      justify-content-between
      bg-gray-200
      px-3
      pd-y-10
    "
  >
    <div class="tx-medium tx-file-manager-total">
      <span v-show="selectedCount">
        {{ `${selectedCount}` }} of
        {{ `${directoriesCount + filesCount}` }} selected
        <!-- {{ `${lang.info.selected} ${selectedCount}` }} -->
        <!-- {{ `${lang.info.selectedSize} ${selectedFilesSize}` }} -->
      </span>
      <span v-if="!selectedCount">
        Total {{ `${directoriesCount + filesCount}` }} items
        <!-- {{ `${lang.info.directories} ${directoriesCount}` }} -->
        <!-- {{ `${lang.info.files} ${filesCount}` }} -->
        <!-- {{ `${lang.info.size} ${filesSize}`}} -->
      </span>
    </div>
    <span v-show="loadingSpinner">
      <i class="fas fa-spinner fa-pulse" />
    </span>
    <!-- <span  v-on:click="showModal('Status')"
                v-bind:class="[hasErrors ? 'text-danger' : 'text-success']"
                v-bind:title="lang.modal.status.title">
            <i class="fas fa-info-circle"/>
        </span> -->
    <!-- <div class="col-4"> -->
    <!-- Progress Bar -->
    <!-- <div class="progress" v-show="progressBar">
                <div class="progress-bar progress-bar-striped bg-info" role="progressbar"
                     v-bind:aria-valuenow="progressBar"
                     aria-valuemin="0"
                     aria-valuemax="100"
                     v-bind:style="{width: progressBar + '%' }">
                    {{ progressBar }}%
                </div>
            </div>
        </div> -->
    <!-- <div class="col-auto text-right">
            <span v-show="loadingSpinner">
                <i class="fas fa-spinner fa-pulse"/>
            </span>
            <span v-show="clipboardType"
                  v-on:click="showModal('Clipboard')"
                  v-bind:title="[ lang.clipboard.title + ' - ' + lang.clipboard[clipboardType] ]">
                <i class="far fa-clipboard"/>
            </span>
            <span v-on:click="showModal('Status')"
                  v-bind:class="[hasErrors ? 'text-danger' : 'text-success']"
                  v-bind:title="lang.modal.status.title">
                <i class="fas fa-info-circle"/>
            </span>
        </div> -->
    <button
      class="btn btn-outline-light IfModal"
      data-dismiss="modal"
      aria-label="Close"
    >
      CANCEL
    </button>
    <button
      type="button"
      class="btn btn-primary IfModal"
      data-dismiss="modal"
      aria-label="Close"
      v-on:click="selectPic()"
      v-bind:disabled="!isAnyItemSelected"
    >
      CHOOSE
    </button>
    <input id="language" type="hidden" value="" />
  </div>
</template>
<script>
import translate from "../../mixins/translate";
import helper from "../../mixins/helper";
export default {
  name: "InfoBlock",
  mixins: [translate, helper],
  computed: {
    /**
     * Active manager
     * @returns {default.computed.activeManager|(function())|string|activeManager}
     */
    activeManager() {
      return this.$store.state.fm.activeManager;
    },
    /**
     * Progress bar value - %
     * @returns {number}
     */
    progressBar() {
      return this.$store.state.fm.messages.actionProgress;
    },
    /**
     * App has errors
     * @returns {boolean}
     */
    hasErrors() {
      return !!this.$store.state.fm.messages.errors.length;
    },
    /**
     * Files count in selected directory
     * @returns {*}
     */
    filesCount() {
      return this.$store.getters[`fm/${this.activeManager}/filesCount`];
    },
    /**
     * Directories count in selected directory
     * @returns {*}
     */
    directoriesCount() {
      return this.$store.getters[`fm/${this.activeManager}/directoriesCount`];
    },
    /**
     * Files size in selected directory
     * @returns {*|string}
     */
    filesSize() {
      return this.bytesToHuman(
        this.$store.getters[`fm/${this.activeManager}/filesSize`]
      );
    },
    /**
     * Count files and folders
     * @returns {*}
     */
    selectedCount() {
      return this.$store.getters[`fm/${this.activeManager}/selectedCount`];
    },
    /**
     * Calculate selected files size
     * @returns {*|string}
     */
    selectedFilesSize() {
      return this.bytesToHuman(
        this.$store.getters[`fm/${this.activeManager}/selectedFilesSize`]
      );
    },
    /**
     * Clipboard - action type
     * @returns {null}
     */
    clipboardType() {
      return this.$store.state.fm.clipboard.type;
    },
    /**
     * Spinner
     * @returns {number}
     */
    loadingSpinner() {
      return this.$store.state.fm.messages.loading;
    },
    isAnyItemSelected() {
      return (
        this.$store.state.fm[this.activeManager].selected.files.length > 0 &&
        this.$store.state.fm[this.activeManager].selected.files.length < 2 &&
        this.$store.state.fm[this.activeManager].selected.directories.length !=
          1
      );
    },
  },
  methods: {
    /**
     * Show modal window
     * @param modalName
     */
    showModal(modalName) {
      this.$store.commit("fm/modal/setModalState", {
        modalName,
        show: true,
      });
    },
    rtrim(str1, str2) {
      if (str2 == undefined) str2 = "\\s";
      return str1.replace(new RegExp("[" + str2 + "]*$"), "");
    },
    ltrim(str1, str2) {
      if (str2 == undefined) str2 = "\\s";
      return str1.replace(new RegExp("^[" + str2 + "]*"), "");
    },
    getEndpoint(url, path) {
      return this.rtrim(url, "/") + (path ? "/" + this.ltrim(path, "/") : "");
    },
    selectPic() {
      let path = this.getEndpoint(
        this.$store.state.fm.settings.aws_url,
        this.$store.getters[`fm/selectedItems`][0].path
      );
      let lang = $("#language").val();
      let el = $(".FileManagerPreview-" + lang);
      el.find("input").val(path);
      // console.log(lang + '---' + $('#language').val());
      el.append(
        `<div class="dropify-wrapper has-preview">
              <button type="button" class="dropify-clear filemanager-clear">✖</button>
              <div class="dropify-preview" style="display: block;">
                  <span class="dropify-render">
                      <img src="` +
          path +
          `">
                  </span>
              </div>
          </div>`
      );
      let reName = path.split("/");
      el.closest(".image_upload")
        .find(".description_file_upload")
        .text(reName[reName.length - 1]);
      el.closest(".image_upload")
        .find(".upload-byFileManager, .upload-byDropify")
        .fadeOut();
      $("body").on("click", ".filemanager-clear", function () {
        el.find(".dropify-wrapper").remove();
        el.find("input").val("");
        el.closest(".image_upload")
          .find(".description_file_upload")
          .text(
            "Minimum dimension of image is 1200x202px. Size limit is 2MB. Accepted file types is JPG and PNG."
          );
        el.closest(".image_upload")
          .find(".upload-byFileManager, .upload-byDropify")
          .fadeIn();
      });
    },
  },
};
</script>
// <style lang="scss">
//     .fm-info-block {
//         display: flex;
//         margin-right: -15px;
//         margin-left: -15px;
//         padding-top: 0.2rem;
//         padding-bottom: 0.4rem;
//         border-bottom: 1px solid #6d757d;
//         .progress {
//             margin-top: 0.3rem;
//         }
//         .text-right > span {
//             padding-left: 0.5rem;
//             cursor: pointer;
//         }
//     }
//
</style>