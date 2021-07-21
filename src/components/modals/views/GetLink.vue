<template>
    <div class="modal-content fm-modal-getLink">
        <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title main-content-label">{{ lang.modal.getLink.title }}</h5>
        </div>
        <div class="modal-body">
            <label for="fm-folder-name" class="form-label tx-gray-600 mb-2 tx-medium">{{ lang.modal.getLink.label }}</label>
            <div v-if="!url">
                <span class="spinner-border spinner-border-sm tx-gray-600" role="status" aria-hidden="true"></span>
                <span class="tx-gray-500 pl-1">Get Link...</span>
            </div>
           <div v-else>
                <p class="form-label tx-dark tx-medium m-0">{{ url }}</p>
           </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline-light flex-1 mr-1" v-on:click="hideModal()">{{ lang.btn.cancel }}</button>
            <button class="btn btn-primary flex-1 ml-1" v-on:click="copyToClipboard(url)" v-bind:disabled="!url">{{ lang.modal.getLink.submit }}</button>
        </div>
    </div>
</template>

<script>
import SelectedFileList from '../additions/SelectedFileList.vue';
import modal from '../mixins/modal';
import translate from '../../../mixins/translate';
import EventBus from '../../../eventBus';

export default {
  name: 'GetLink',
  mixins: [modal, translate],
  components: { SelectedFileList },
  mounted() {
    this.getUrl();
  },
  data() {
      return {
        url: null,
      }
  },
  computed: {
   	/**
     * Selected disk
     * @returns {*}
     */
    selectedDisk() {
        return this.$store.getters['fm/selectedDisk'];
    },

    /**
     * Selected file
     * @returns {*}
     */
    selectedItem() {
        return this.$store.getters['fm/selectedItems'][0];
    },
  },
  methods: {
    // /**
    //  * Delete selected directories and files
    //  */
    // deleteItems() {
    //   // create items list for delete
    //   const items = this.selectedItems.map((item) => ({
    //     path: item.path,
    //     type: item.type,
    //   }));

    //   this.$store.dispatch('fm/delete', items).then(() => {
    //     // close modal window
    //     this.hideModal();
    //   });
    // },
    getUrl() {
        this.$store
            .dispatch('fm/url', {
                disk: this.selectedDisk,
                path: this.selectedItem.path,
            })
            .then((response) => {
                if (response.data.result.status === 'success') {
                    this.url = response.data.url;
                    // console.log(this.url)					
                }
            });			
    },
    	copyToClipboard(text) {
				// create input
				const copyInputHelper = document.createElement('input');
				copyInputHelper.className = 'copyInputHelper';
				document.body.appendChild(copyInputHelper);
				// add text
				copyInputHelper.value = text;
				copyInputHelper.select();
				// copy text to clipboard
				document.execCommand('copy');
				// clear
				document.body.removeChild(copyInputHelper);

				// Notification
				EventBus.$emit('addNotification', {
					status: 'success',
					message: this.lang.notifications.copyToClipboard,
				});
			},
  },
};
</script>
