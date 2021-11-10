<template>
    <div class="fm-navbar">
        <div class="fm-navbar_title border-bottom p-3 lh-1">
            <i class="fas fa-folder tx-20" />
            <span v-if="breadcrumb" class="tx-medium tx-16 pl-2">{{ breadcrumb.slice(-1)[0] }}</span>
            <span v-else class="tx-medium tx-16 pl-2">{{ selectedDisk }}</span>
        </div>
        <div class="fm-navbar_tools_1 border-bottom p-3">
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-primary btn-tool" v-bind:disabled="backDisabled" v-bind:title="lang.btn.back" v-on:click="historyBack()">
                    <i class="fas fa-arrow-left" />
                    <p>Back</p>
                </button>
                <button type="button" class="btn btn-outline-primary btn-tool" v-bind:disabled="forwardDisabled" v-bind:title="lang.btn.forward" v-on:click="historyForward()">
                    <i class="fas fa-arrow-right" />
                    <p>Next</p>
                </button>
                <button type="button" class="btn btn-outline-primary btn-tool" v-on:click="levelUp" v-bind:disabled="isRootPath">
                    <i class="fas fa-level-up-alt" />
                    <p>Up One Level</p>
                </button>
            </div>
            <div class="btn-group" role="group">
                <button v-if="settings.permissions.can_edit" type="button" class="btn btn-outline-primary btn-tool" v-on:click="showModal('NewFolder')" v-bind:title="lang.btn.folder">
                    <i class="fas fa-folder-plus" />
                    <p>New Folder</p>
                </button>
                <template v-if="settings.permissions.can_edit">
                    <button type="button" class="btn btn-outline-primary btn-tool" disabled v-if="uploading" v-bind:title="lang.btn.upload">
                        <i class="fas fa-file-upload" />
                        <p>Upload</p>
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-tool" v-else v-on:click="showModal('Upload')" v-bind:title="lang.btn.upload">
                        <i class="fas fa-file-upload" />
                        <p>Upload</p>
                    </button>
                </template>
                <button type="button" class="btn btn-outline-primary btn-tool" v-bind:disabled="!isAnyItemSelected || selectedCount > 1 || selectedItem.type == 'dir'" v-on:click="downloadAction()">
                    <i class="fas fa-file-download" />
                    <p>Download</p>
                </button>
                <button v-if="settings.permissions.can_edit" type="button" class="btn btn-outline-primary btn-tool" v-bind:disabled="!isAnyItemSelected || selectedCount > 1" v-on:click="showModal('Rename')" v-bind:title="lang.btn.rename">
                    <i class="fas fa-i-cursor" />
                    <p>Rename</p>
                </button>
                <button type="button" class="btn btn-outline-primary btn-tool" v-bind:disabled="!isAnyItemSelected || selectedCount > 1" v-on:click="showModal('Properties')" v-bind:title="lang.btn.properties">
                    <i class="fas fa-eye" />
                    <p>Preview</p>
                </button>
            </div>
            <div class="btn-group" role="group">
                <!-- btn copy link -->
                <button type="button" class="btn btn-outline-primary btn-tool" v-bind:disabled="!isAnyItemSelected || selectedCount > 1 || selectedItem.type == 'dir'" v-on:click="showModal('GetLink')" v-bind:title="lang.btn.getLink">
                    <i class="fas fa-link" />
                    <p>Copy Link</p>
                </button>
            </div>
            <div class="btn-group" role="group" v-if="settings.permissions.can_delete">
                <button type="button" class="btn btn-outline-danger btn-tool" v-bind:disabled="!isAnyItemSelected" v-on:click="showModal('Delete')" v-bind:title="lang.btn.delete">
                    <i class="fas fa-trash-alt" />
                    <p>Delete</p>
                </button>
            </div>
        </div>
        <div class="fm-navbar_tools_2 d-flex align-items-center justify-content-between border-bottom p-3">
            <div class="row w-100 m-0">
                <div class="col-xl-2 p-0 order-last order-xl-first mt-3 mt-xl-0">
                    <label for="checkAll" class="btn checkbox wd-auto bd-gray-200 pd-x-10-f tx-uppercase tx-13 tx-xl-14 m-0">
                        <input type="checkbox" name="checkAll" id="checkAll" class="mg-r-7" @change="setCheckAll" :checked="getCheckAll" />
                        Select All
                    </label>
                    <!-- {{ this.getCheckAll }} -->
                </div>
                <div class="col-xl-10 d-flex p-0 pl-xl-2 flex-column flex-md-row">
                    <div class="d-flex align-items-center ht-40 w-100 wd-md-30p-f">
                        <label class="form-label m-0 mr-2 tx-medium">Sorting</label>
                        <v-select ref="mySelect" :options="option_sortBy" :searchable="false" :clearable="false" v-model="selected_sortBy" @input="onSelected()" class="vue-select wd-100p h-100 no-search no-clear"></v-select>
                    </div>
                    <div class="d-flex align-items-center w-100 wd-md-25p-f mx-3 my-3 my-md-0">
                        <label class="form-label m-0 mr-2 tx-medium">View</label>
                        <button type="button" class="btn btn-outline-primary btn-view" v-bind:class="[viewType === 'table' ? 'active' : '']" v-on:click="selectView('table')" v-bind:title="lang.btn.table">
                            <i class="fas fa-th-list tx-bold"></i>
                        </button>
                        <button type="button" class="btn btn-outline-primary btn-view" v-bind:class="[viewType === 'grid' ? 'active' : '']" v-on:click="selectView('grid')" v-bind:title="lang.btn.grid">
                            <i class="fas fa-th tx-bold"></i>
                        </button>
                    </div>
                    <div class="d-flex align-items-center w-100 wd-md-45p-f">
                        <label class="form-label m-0 mr-2 tx-medium">Search</label>
                        <input type="text" placeholder="Keywords" value="" name="Search" class="form-control d-inline-block bd-gray-200" v-model="search" />
                        <button type="button" class="btn btn-outline-primary ml-2 tx-uppercase" v-on:click="setSearch()">
                            <i class="far fa-search tx-bold lh-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="row justify-content-between">
            <div class="col-auto">
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-primary btn-tool" v-on:click="refreshAll()" v-bind:title="lang.btn.refresh">
                        <i class="fas fa-sync-alt" />
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-tool" v-on:click="showModal('NewFile')" v-bind:title="lang.btn.file">
                        <i class="far fa-file" />
                    </button>
                </div>
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-primary btn-tool" v-bind:disabled="!isAnyItemSelected" v-bind:title="lang.btn.copy" v-on:click="toClipboard('copy')">
                        <i class="fas fa-copy" />
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-tool" v-bind:disabled="!isAnyItemSelected" v-bind:title="lang.btn.cut" v-on:click="toClipboard('cut')">
                        <i class="fas fa-cut" />
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-tool" v-bind:disabled="!clipboardType" v-bind:title="lang.btn.paste" v-on:click="paste">
                        <i class="fas fa-paste" />
                    </button>
                </div>
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-primary btn-tool" v-bind:title="lang.btn.hidden" v-on:click="toggleHidden">
                        <i class="fas" v-bind:class="[hiddenFiles ? 'fa-eye' : 'fa-eye-slash']" />
                    </button>
                </div>
            </div>
            <div class="col-auto text-right">
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-primary btn-tool" v-bind:class="[viewType === 'table' ? 'active' : '']" v-on:click="selectView('table')" v-bind:title="lang.btn.table">
                        <i class="fas fa-th-list" />
                    </button>
                    <button role="button" class="btn btn-outline-primary btn-tool" v-bind:class="[viewType === 'grid' ? 'active' : '']" v-on:click="selectView('grid')" v-bind:title="lang.btn.grid">
                        <i class="fas fa-th" />
                    </button>
                </div>
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-primary btn-tool" v-bind:title="lang.btn.fullScreen" v-bind:class="{ active: fullScreen }" v-on:click="screenToggle">
                        <i class="fas fa-expand-arrows-alt" />
                    </button>
                </div>
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-primary btn-tool" v-bind:title="lang.btn.about" v-on:click="showModal('About')">
                        <i class="fas fa-question" />
                    </button>
                </div>
            </div>
        </div> -->
    </div>
</template>
<script>
import translate from '../../mixins/translate';
import EventBus from '../../eventBus';
import contextMenu from './mixins/contextMenu';
import contextMenuRules from './mixins/contextMenuRules';
import contextMenuActions from './mixins/contextMenuActions';
export default {
    mixins: [translate, contextMenu, contextMenuRules, contextMenuActions],
    /* props: {
        manager: { type: String, required: true },
        settings,
    }, */
    props: ['manager', 'settings'],
    data() {
        return {
            selected_sortBy: 'By Name', // default sortBy
            option_sortBy: ['By Name', 'By Type', 'By Size'],
            url: null,
            search: '',
            checkAll: false,
        };
    },
    computed: {
        selectedDirectory() {
            return this.$store.state.fm[this.manager].selectedDirectory;
        },
        isRootPath() {
            return this.$store.state.fm[this.manager].selectedDirectory === null;
        },
        /**
         * Active manager name
         * @returns {default.computed.activeManager|(function())|string|activeManager}
         */
        activeManager() {
            return this.$store.state.fm.activeManager;
        },
        /**
         * Back button state
         * @returns {boolean}
         */
        backDisabled() {
            return !this.$store.state.fm[this.activeManager].historyPointer;
        },
        /**
         * Forward button state
         * @returns {boolean}
         */
        forwardDisabled() {
            return this.$store.state.fm[this.activeManager].historyPointer === this.$store.state.fm[this.activeManager].history.length - 1;
        },
        /**
         * Is any files or directories selected?
         * @returns {boolean}
         */
        isAnyItemSelected() {
            return this.$store.state.fm[this.activeManager].selected.files.length > 0 || this.$store.state.fm[this.activeManager].selected.directories.length > 0;
        },
        /**
         * Manager view type - grid or table
         * @returns {default.computed.viewType|(function())|string}
         */
        viewType() {
            return this.$store.state.fm[this.activeManager].viewType;
        },
        getSearch() {
            return this.$store.state.fm[this.activeManager].search;
        },
        getCheckAll() {
            return this.$store.state.fm[this.activeManager].checkAll;
        },
        /**
         * Upload files
         * @returns {boolean}
         */
        uploading() {
            return this.$store.state.fm.messages.actionProgress > 0;
        },
        /**
         * Clipboard - action type
         * @returns {null}
         */
        clipboardType() {
            return this.$store.state.fm.clipboard.type;
        },
        /**
         * Full screen status
         * @returns {default.computed.fullScreen|(function())|boolean|fullScreen|*|string}
         */
        fullScreen() {
            return this.$store.state.fm.fullScreen;
        },
        /**
         * Show or Hide hidden files
         * @returns {boolean}
         */
        hiddenFiles() {
            return this.$store.state.fm.settings.hiddenFiles;
        },
        selectedItem() {
            return this.$store.getters['fm/selectedItems'][0];
        },
        selectedDisk() {
            return this.$store.getters['fm/selectedDisk'];
        },
        sortSettings() {
            return this.$store.state.fm[this.manager].sort;
        },
        breadcrumb() {
            return this.$store.getters[`fm/${this.manager}/breadcrumb`];
        },
        selectedCount() {
            return this.$store.getters[`fm/${this.activeManager}/selectedCount`];
        },
        isSelectedAll() {
            if (this.$store.state.fm[this.activeManager].selected.directories != '' || this.$store.state.fm[this.activeManager].selected.files != '') {
                return true;
            } else {
                return false;
            }
        },
    },
    mounted() {
        // this.$refs["mySelect"].open = true;
        this.sortBy('name');
    },
    methods: {
        levelUp() {
            // if this a not root directory
            if (this.selectedDirectory) {
                // calculate up directory path
                const pathUp = this.selectedDirectory.split('/').slice(0, -1).join('/');
                // load directory
                this.$store.dispatch(`fm/${this.manager}/selectDirectory`, {
                    path: pathUp || null,
                    history: true,
                });
            }
        },
        /**
         * Refresh file manager
         */
        refreshAll() {
            this.$store.dispatch('fm/refreshAll');
        },
        /**
         * History back
         */
        historyBack() {
            this.$store.dispatch(`fm/${this.activeManager}/historyBack`);
        },
        /**
         * History forward
         */
        historyForward() {
            this.$store.dispatch(`fm/${this.activeManager}/historyForward`);
        },
        /**
         * Copy
         * @param type
         */
        toClipboard(type) {
            this.$store.dispatch('fm/toClipboard', type);
            // show notification
            if (type === 'cut') {
                EventBus.$emit('addNotification', {
                    status: 'success',
                    message: this.lang.notifications.cutToClipboard,
                });
            } else if (type === 'copy') {
                EventBus.$emit('addNotification', {
                    status: 'success',
                    message: this.lang.notifications.copyToClipboard,
                });
            }
        },
        /**
         * Paste
         */
        paste() {
            this.$store.dispatch('fm/paste');
        },
        /**
         * Set Hide or Show hidden files
         */
        toggleHidden() {
            this.$store.commit('fm/settings/toggleHiddenFiles');
        },
        /**
         * Show modal window
         * @param modalName
         */
        showModal(modalName) {
            // show selected modal
            this.$store.commit('fm/modal/setModalState', {
                modalName,
                show: true,
            });
        },
        /**
         * Select view type
         * @param type
         */
        selectView(type) {
            if (this.viewType !== type) this.$store.commit(`fm/${this.activeManager}/setView`, type);
            if (this.$store.state.fm[this.activeManager].selected.directories != '' || this.$store.state.fm[this.activeManager].selected.files != '') {
                // this.checkAll = false
                this.$store.commit(`fm/${this.activeManager}/setCheckAll`, false);
            }
        },
        setSearch(text = this.search) {
            this.$store.commit(`fm/${this.activeManager}/setSearch`, text);
        },
        setCheckAll(checkAll_status = this.checkAll) {
            this.$store.commit(`fm/${this.activeManager}/setCheckAll`, !this.getCheckAll);
        },
        /**
         * Full screen toggle
         */
        screenToggle() {
            const fm = document.getElementsByClassName('fm')[0];
            if (!this.fullScreen) {
                if (fm.requestFullscreen) {
                    fm.requestFullscreen();
                } else if (fm.mozRequestFullScreen) {
                    fm.mozRequestFullScreen();
                } else if (fm.webkitRequestFullscreen) {
                    fm.webkitRequestFullscreen();
                } else if (fm.msRequestFullscreen) {
                    fm.msRequestFullscreen();
                }
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            this.$store.commit('fm/screenToggle');
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
        sortBy(field) {
            this.$store.dispatch(`fm/${this.manager}/sortBy`, {
                field,
                direction: 'up',
            });
        },
        onSelected(event) {
            if (this.selected_sortBy == 'By Type') {
                this.sortBy('type');
            } else if (this.selected_sortBy == 'By Size') {
                this.sortBy('size');
            } else if (this.selected_sortBy == 'By Date') {
                this.sortBy('date');
            } else {
                this.sortBy('name');
            }
        },
    },
};
</script>