<template>
    <div class="modal-content fm-modal-properties flex-md-row">
        <div class="modal-close">
            <button type="button" class="btn btn-light btn-close" aria-label="Close" v-on:click="hideModal">
                <i class="far fa-times" aria-hidden="true" />
            </button>
        </div>
        <!-- <div class="modal-header p-0">
            <h5 class="modal-title">{{ lang.modal.properties.title }}</h5>
            <div class="preview">
                <img src="https://via.placeholder.com/640x480" alt="preview" class="preview-wrap">
            </div>
        </div> -->
        <div class="modal-body p-0">
            <div class="data-preview">
                <div class="preview" v-if="selectedItem.type === 'file'">
                    <div v-if="selectedItem.extension == 'jpg' || 'png'">
                        <i v-if="!url" class="fas fa-image preview-wrap" />
                        <img :src="url" alt="preview" class="preview-wrap" v-else />
                    </div>
                    <i class="fas fa-file-alt preview-wrap" v-else />
                </div>
                <div class="preview" v-else>
                    <i class="fas fa-folder preview-wrap"></i>
                </div>
            </div>
            <div class="data-info">
                <div class="data-info-body p-3">
                    <div class="name mb-3">
                        <label class="form-label tx-gray-600 mb-0 tx-medium">{{ lang.modal.properties.name }}</label>
                        <p class="m-0 tx-medium">{{ selectedItem.basename }}</p>
                    </div>
                    <div class="type mb-3">
                        <label class="form-label tx-gray-600 mb-0 tx-medium">{{ lang.modal.properties.type }}</label>
                        <p class="m-0 tx-medium" v-if="selectedItem.type == 'dir'">
                            {{ selectedItem.folder }}
                        </p>
                        <p class="m-0 tx-medium tx-uppercase" v-else>
                            {{ selectedItem.extension }}
                        </p>
                    </div>
                    <div class="size mb-3">
                        <label class="form-label tx-gray-600 mb-0 tx-medium">{{ lang.modal.properties.size }}</label>
                        <p class="m-0 tx-medium" v-if="selectedItem.type == 'dir'">{{ selectedItem.count }} items</p>
                        <p class="m-0 tx-medium" v-else>
                            {{ bytesToHuman(selectedItem.size) }}
                        </p>
                    </div>
                    <div class="size mb-3">
                        <label class="form-label tx-gray-600 mb-0 tx-medium">{{ lang.modal.properties.created }}</label>
                        <p class="m-0 tx-medium" v-if="selectedItem.type == 'dir'">
                            {{ moment(selectedItem.created_at).format('D MMM YYYY, HH:mm') }}
                        </p>
                        <p class="m-0 tx-medium" v-else>
                            {{ moment(selectedItem.created_at).format('D MMM YYYY, HH:mm') }}
                        </p>
                    </div>
                    <div class="size mb-3">
                        <label class="form-label tx-gray-600 mb-0 tx-medium">{{ lang.modal.properties.modified }}</label>
                        <p class="m-0 tx-medium" v-if="selectedItem.type == 'dir'">
                            {{ moment(selectedItem.updated_at).format('D MMM YYYY, HH:mm') }}
                        </p>
                        <p class="m-0 tx-medium" v-else>
                            {{ moment(selectedItem.updated_at).format('D MMM YYYY, HH:mm') }}
                        </p>
                    </div>
                    <a v-if="permissions.can_delete" href="javascript:void(0)" class="tx-danger tx-14 btn-link-delete" v-on:click="activeModalDelete">Delete File</a>
                </div>
                <div class="data-info-footer p-3 border-top d-flex justify-content-between">
                    <button type="button" class="btn btn-outline-primary btn-tool wd-100 py-2 px-0" v-on:click="downloadAction()" v-bind:disabled="selectedItem.type == 'dir'">
                        <i class="fas fa-file-download tx-24" />
                        <p class="m-0 mt-2">Download</p>
                    </button>
                    <button v-if="permissions.can_edit" type="button" class="btn btn-outline-primary btn-tool wd-100 py-2 px-0 mx-2" v-on:click="activeModalRename">
                        <i class="fas fa-i-cursor tx-24" />
                        <p class="m-0 mt-2">Rename</p>
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-tool wd-100 py-2 px-0" v-on:click="copyToClipboard(url)" v-bind:disabled="!url || selectedItem.type == 'dir'">
                        <i class="fas fa-link tx-24" />
                        <p class="m-0 mt-2">Copy Link</p>
                    </button>
                </div>
            </div>
            <!-- <div class="row">
                <div class="col-2">{{ lang.modal.properties.disk }}:</div>
                <div class="col-9">{{ selectedDisk }}</div>
                <div class="col-1 text-right">
                    <i v-on:click="copyToClipboard(selectedDisk)"
                       v-bind:title="lang.clipboard.copy"
                       class="far fa-copy"/>
                </div>
            </div>
            <div class="row">
                <div class="col-2">{{ lang.modal.properties.name }}:</div>
                <div class="col-9">{{ selectedItem.basename }}</div>
                <div class="col-1 text-right">
                    <i v-on:click="copyToClipboard(selectedItem.basename)"
                       v-bind:title="lang.clipboard.copy"
                       class="far fa-copy"/>
                </div>
            </div>
            <div class="row">
                <div class="col-2">{{ lang.modal.properties.path }}:</div>
                <div class="col-9">{{ selectedItem.path }}</div>
                <div class="col-1 text-right">
                    <i v-on:click="copyToClipboard(selectedItem.path)"
                       v-bind:title="lang.clipboard.copy"
                       class="far fa-copy"/>
                </div>
            </div>
            <template v-if="selectedItem.type === 'file'">
                <div class="row">
                    <div class="col-2">{{ lang.modal.properties.size }}:</div>
                    <div class="col-9">{{ bytesToHuman(selectedItem.size) }}</div>
                    <div class="col-1 text-right">
                        <i v-on:click="copyToClipboard(bytesToHuman(selectedItem.size))"
                           v-bind:title="lang.clipboard.copy"
                           class="far fa-copy"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">{{ lang.modal.properties.url }}:</div>
                    <div class="col-9">
                        <span v-if="url">{{ url }}</span>
                        <span v-else>
                            <button v-on:click="getUrl" type="button"
                                    class="btn btn-sm btn-light">
                                <i class="fas fa-sm fa-link"/> Get URL
                            </button>
                        </span>
                    </div>
                    <div v-if="url" class="col-1 text-right">
                        <i v-on:click="copyToClipboard(url)"
                           v-bind:title="lang.clipboard.copy"
                           class="far fa-copy"/>
                    </div>
                </div>
            </template>
            <template v-if="selectedItem.hasOwnProperty('timestamp')">
                <div class="row">
                    <div class="col-2">{{ lang.modal.properties.modified }}:</div>
                    <div class="col-9">{{ timestampToDate(selectedItem.timestamp) }}</div>
                    <div class="col-1 text-right">
                        <i v-on:click="copyToClipboard(timestampToDate(selectedItem.timestamp))"
                           v-bind:title="lang.clipboard.copy"
                           class="far fa-copy"/>
                    </div>
                </div>
            </template> -->
            <!-- <template v-if="selectedItem.hasOwnProperty('acl')">
                <div class="row">
                    <div class="col-2">{{ lang.modal.properties.access }}:</div>
                    <div class="col-9">{{ lang.modal.properties['access_' + selectedItem.acl] }}</div>
                </div>
            </template> -->
        </div>
        <!-- modal confirm delete -->
        <div class="fm-modal fm-modal-level_2" ref="fmModal" v-on:click="inActiveModalDelete" v-if="modalDelete">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content fm-modal-delete">
                    <div class="modal-body text-center flex-column">
                        <i class="fas fa-trash-alt tx-60 text-danger my-3" />
                        <p class="form-label tx-16 tx-dark tx-semiBold message my-2">You Are About to Delete This Item</p>
                        <p class="form-label tx-13 tx-gray-600 tx-medium message m-0">This will delete your item. Are you sure?</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline-light flex-1 mr-1" v-on:click="inActiveModalDelete">
                            {{ lang.btn.cancel }}
                        </button>
                        <button class="btn btn-outline-danger flex-1 ml-1" v-on:click="deleteItems">
                            {{ lang.modal.delete.title }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- modal rename -->
        <div class="fm-modal fm-modal-level_2" ref="fmModal" v-if="modalRename">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content fm-modal-rename">
                    <div class="modal-header border-bottom-0 pb-0">
                        <h5 class="modal-title main-content-label">
                            {{ lang.modal.rename.title }}
                        </h5>
                    </div>
                    <div class="modal-body">
                        <div class="form-group mb-0 w-100">
                            <label for="fm-input-rename" class="form-label tx-gray-600 mb-2 tx-medium">{{ lang.modal.rename.fieldName }}</label>
                            <div>
                                <div v-if="!allDirectories || !allFiles">
                                    <span class="spinner-border spinner-border-sm tx-gray-600" role="status" aria-hidden="true"></span>
                                </div>
                                <input type="text" class="form-control" id="fm-input-rename" v-focus v-bind:class="{ 'is-invalid': checkName }" v-model="name" v-on:keyup="validateName" v-else />
                                <div class="invalid-feedback" v-show="checkName">
                                    {{ lang.modal.rename.fieldFeedback }}
                                    {{ directoryExist ? ` - ${lang.modal.rename.directoryExist}` : '' }}
                                    {{ fileExist ? ` - ${lang.modal.rename.fileExist}` : '' }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer justify-content-between">
                        <button class="btn btn-outline-light flex-1 mr-1" v-on:click="inActiveModalRename">
                            {{ lang.btn.cancel }}
                        </button>
                        <button class="btn btn-primary flex-1 ml-1" v-bind:disabled="submitDisable" v-on:click="rename">
                            {{ lang.modal.rename.submit }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import modal from '../mixins/modal';
import translate from '../../../mixins/translate';
import helper from '../../../mixins/helper';
import EventBus from '../../../eventBus';
import contextMenu from '../../blocks/mixins/contextMenu.js';
import contextMenuRules from '../../blocks/mixins/contextMenuRules';
import contextMenuActions from '../../blocks/mixins/contextMenuActions';
import { format } from 'date-fns';
import moment from 'moment';
export default {
    name: 'Properties',
    mixins: [modal, translate, helper, contextMenu, contextMenuRules, contextMenuActions],
    mounted() {
        this.getUrl();
        // initiate item name
        this.name = this.selectedItem.basename;
        axios.get(`${this.coreEndpoint}/admin/storage/all`).then((response) => {
            this.allDirectories = response.data.data.directories;
            this.allFiles = response.data.data.files;
        });
    },
    data() {
        return {
            url: null,
            url_test: null,
            modalDelete: false,
            modalRename: false,
            name: '',
            directoryExist: false,
            fileExist: false,
            format,
            moment,
            // all name in directory
            allDirectories: null,
            allFiles: null,
        };
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
        checkName() {
            return this.directoryExist || this.fileExist || !this.name;
        },
        submitDisable() {
            return this.checkName || this.name === this.selectedItem.basename;
        },
        permissions() {
            return this.$store.state.fm.settings.permissions;
        },
        coreEndpoint() {
            return this.$store.state.fm.settings.core_endpoint;
        },
    },
    methods: {
        /**
         * Get URL
         */
        getUrl() {
            this.$store
                .dispatch('fm/url', {
                    disk: this.selectedDisk,
                    path: this.selectedItem.path,
                })
                .then((response) => {
                    if (response.data.result.status === 'success') {
                        this.url = response.data.url;
                    }
                });
        },
        /**
         * Copy text to clipboard
         * @param text
         */
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
        activeModalDelete() {
            this.modalDelete = true;
        },
        activeModalRename() {
            this.modalRename = true;
        },
        inActiveModalDelete() {
            this.modalDelete = false;
        },
        inActiveModalRename() {
            this.modalRename = false;
        },
        deleteItems() {
            // create items list for delete
            const items = [
                {
                    path: this.selectedItem.path,
                    type: this.selectedItem.type,
                },
            ];
            this.$store.dispatch('fm/delete', items).then(() => {
                // close modal window
                this.hideModal();
            });
        },
        validateName() {
            if (this.name !== this.selectedItem.basename) {
                // if item - folder
                // if (this.selectedItem.type === 'dir') {
                // 	// check folder name matches
                // 	this.directoryExist = this.$store.getters[
                // 		`fm/${this.activeManager}/directoryExist`
                // 	](this.name);
                // } else {
                // 	// check file name matches
                // 	this.fileExist = this.$store.getters[
                // 		`fm/${this.activeManager}/fileExist`
                // 	](this.name);
                // }
                if (this.selectedItem.type === 'dir') {
                    // check folder name matches
                    // this.directoryExist = this.$store.getters[`fm/${this.activeManager}/directoryExist`](this.name);
                    this.directoryExist = this.allDirectories.some((basename) => basename === this.name);
                } else {
                    // check file name matches
                    // this.fileExist = this.$store.getters[`fm/${this.activeManager}/fileExist`](this.name);
                    this.fileExist = this.allFiles.some((basename) => basename === this.name);
                }
            }
        },
        rename() {
            // create new name with path
            const newName = this.selectedItem.dirname ? `${this.selectedItem.dirname}/${this.name}` : this.name;
            this.$store
                .dispatch('fm/rename', {
                    type: this.selectedItem.type,
                    newName,
                    oldName: this.selectedItem.path,
                })
                .then(() => {
                    // close modal window
                    this.hideModal();
                });
            // console.log('rename');
        },
    },
};
</script>
