<template>
	<div class="fm-grid p-3">
		<!-- {{ this.getCheckAll }} -->
		<div class="row m-0">
			<!-- folder -->
			<!-- v-on:contextmenu.prevent="contextMenu(directory, $event)" -->
			<div class="col-6 col-md-3 col-lg-2 fm-grid-item unselectable p-1" v-for="(directory, index) in filteredFolder" v-bind:key="`d-${index}`" v-bind:title="directory.basename" v-bind:class="{ active: checkSelect('directories', directory.path)}" v-on:dblclick.stop="selectDirectory(directory.path)">
				<div class="fm-grid-item-card text-center h-100">
					<label for="select" class="fm-grid-item-checkbox">
						<input type="checkbox" id="select" v-on:click="selectItem('directories', directory.path, $event)" :checked="getCheckAll && checkSelect('directories', directory.path)" v-bind:disabled="getCheckAll" ref="itemCheckbox" />
					</label>
					<div class="fm-grid-item-preview">
						<i class="fm-grid-item-preview_wrap" v-bind:class="acl && directory.acl === 0 ? 'fas fa-unlock-alt' : 'fas fa-folder'" />
					</div>
					<div class="fm-grid-item-caption p-2">
						<p class="title tx-medium text-break m-0">{{ directory.basename }}</p>
						<p class="subtitle tx-gray-500 m-0">{{ directory.count }} items</p>
					</div>
				</div>
			</div>
			
			<!-- file -->
			<!-- v-on:contextmenu.prevent="contextMenu(file, $event)" -->
			<!-- v-on:dblclick="selectAction(file.path, file.extension)" -->
			<div class="col-6 col-md-3 col-lg-2 fm-grid-item unselectable p-1" v-for="(file, index) in filteredFile" v-bind:key="`f-${index}`" v-bind:title="file.basename" v-bind:class="{ active: checkSelect('files', file.path) }">
				<div class="fm-grid-item-card text-center h-100">
					<label for="select" class="fm-grid-item-checkbox">
						<input type="checkbox" id="select" v-on:click="selectItem('files', file.path, $event)" :checked="getCheckAll && checkSelect('files', file.path)" v-bind:disabled="getCheckAll" ref="itemCheckbox" />
					</label>
					<div class="fm-grid-item-preview">
						<i v-if="acl && file.acl === 0" class="fas fa-unlock-alt fm-grid-item-preview_wrap" />
						<thumbnail v-else-if="thisImage(file.extension)" v-bind:disk="disk" v-bind:file="file"> </thumbnail>
						<i v-else class="fm-grid-item-preview_wrap fas" v-bind:class="extensionToIcon(file.extension)" />
					</div>
					<div class="fm-grid-item-caption p-2">
						<p class="title tx-medium text-break m-0">{{ `${file.filename}.${file.extension}` }}</p>
						<p class="subtitle tx-gray-500 m-0">{{ bytesToHuman(file.size) }}</p>
					</div>
				</div>
			</div>
		</div>
		{{ afterCheckAll }}
	</div>
</template>

<script>
	import translate from '../../mixins/translate';
	import helper from '../../mixins/helper';
	import managerHelper from './mixins/manager';
	import Thumbnail from './Thumbnail.vue';

	export default {
		name: 'grid-view',
		components: { Thumbnail },
		mixins: [translate, helper, managerHelper],
		data() {
			return {
				disk: '',
			};
		},
		props: {
			manager: { type: String, required: true },
		},
		mounted() {
			this.disk = this.selectedDisk;
		},
		beforeUpdate() {
			// if disk changed
			if (this.disk !== this.selectedDisk) {
				this.disk = this.selectedDisk;
			}
		},
		computed: {
			/**
			 * Image extensions list
			 * @returns {*}
			 */
			imageExtensions() {
				return this.$store.state.fm.settings.imageExtensions;
			},
			filteredFolder() {
				return this.directories.filter((item) => {
					item.folder = 'Folder';

					return item.basename.toLowerCase().indexOf(this.setSearch.toLowerCase()) > -1 || item.folder.toLowerCase().indexOf(this.setSearch.toLowerCase()) > -1;
				});
			},
			filteredFile() {
				return this.files.filter((item) => {
					return item.basename.toLowerCase().indexOf(this.setSearch.toLowerCase()) > -1 || item.extension.toLowerCase().indexOf(this.setSearch.toLowerCase()) > -1;
				});
			},

			activeManager() {
				// console.log(this.$store.state.fm.activeManager);
				return this.$store.state.fm.activeManager;
			},

			selectedItem() {
				return this.$store.getters['fm/selectedItems'];
			},

			getCheckAll() {
				return this.$store.state.fm[this.activeManager].checkAll;
			},

			afterCheckAll: function() {
				this.$store.state.fm[this.activeManager].selected.directories = []
				this.$store.state.fm[this.activeManager].selected.files = []
				return this.allSelected(this.getCheckAll);
			},
		},
		methods: {
			/**
			 * Check file extension (image or no)
			 * @param extension
			 * @returns {boolean}
			 */
			thisImage(extension) {
				// extension not found
				if (!extension) return false;

				return this.imageExtensions.includes(extension.toLowerCase());
			},
			allSelected(){
				if(this.getCheckAll) {
					_.each(this.$refs.itemCheckbox,(v,k)=>this.$refs.itemCheckbox[k].click());
				} else {
					this.$store.state.fm[this.activeManager].selected.directories = []
					this.$store.state.fm[this.activeManager].selected.files = []
				}
			},
		},
	};
</script>
