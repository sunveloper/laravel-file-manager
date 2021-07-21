<template>
	<div class="fm-table overflow-x">
		<!-- {{ this.getCheckAll }} -->
		<table class="table table-sm">
			<thead>
				<tr>
					<th class="wd-5p"></th>
					<th class="wd-30p">
						{{ lang.manager.table.name }}
						<!--  v-on:click="sortBy('name')" -->
						<!-- <template v-if="sortSettings.field === 'name'">
                            <i class="fas fa-sort-amount-down"
                               v-show="sortSettings.direction === 'down'"/>
                            <i class="fas fa-sort-amount-up"
                               v-show="sortSettings.direction === 'up'"/>
                        </template> -->
					</th>
					<th class="wd">
						{{ lang.manager.table.type }}
						<!-- v-on:click="sortBy('type')" -->
						<!-- <template v-if="sortSettings.field === 'type'">
                            <i class="fas fa-sort-amount-down"
                               v-show="sortSettings.direction === 'down'"/>
                            <i class="fas fa-sort-amount-up"
                               v-show="sortSettings.direction === 'up'"/>
                        </template> -->
					</th>
					<th class="wd">
						{{ lang.manager.table.info }}
						<!-- v-on:click="sortBy('size')" -->
						<!-- <template v-if="sortSettings.field === 'size'">
                            <i class="fas fa-sort-amount-down"
                               v-show="sortSettings.direction === 'down'"/>
                            <i class="fas fa-sort-amount-up"
                               v-show="sortSettings.direction === 'up'"/>
                        </template> -->
					</th>
					<th class="wd-20p">
						{{ lang.manager.table.created }}
					</th>
					<th class="wd-20p">
						{{ lang.manager.table.modified }}
					</th>
					<th class="wd-5p"></th>
					<!-- <th class="w-auto" v-on:click="sortBy('date')">
                        {{ lang.manager.table.date }}
                        <template v-if="sortSettings.field === 'date'">
                            <i class="fas fa-sort-amount-down"
                               v-show="sortSettings.direction === 'down'"/>
                            <i class="fas fa-sort-amount-up"
                               v-show="sortSettings.direction === 'up'"/>
                        </template>
                    </th> -->
				</tr>
			</thead>
			<tbody :key="elKey">
				<!-- <tr v-if="!isRootPath">
                    <td colspan="7" class="fm-content-item" v-on:click="levelUp">
                        <i class="fas fa-level-up-alt"/>
                    </td>
                </tr> -->

				<!-- folder -->
				<!-- v-on:contextmenu.prevent="contextMenu(directory, $event)" -->
				<tr
					v-for="(directory, index) in folders"
					v-bind:key="`d-${index}`"
					v-bind:class="{
						'table-info': checkSelect('directories', directory.path)
					}">
					<td class="text-center">
						<input type="checkbox" v-on:click=" selectItem('directories', directory.path, $event)" :checked="getCheckAll && checkSelect('directories', directory.path)" v-bind:disabled="getCheckAll" ref="itemCheckbox" />
					</td>
					<td class="fm-content-item unselectable" v-bind:class="acl && directory.acl === 0 ? 'text-hidden' : ''" v-on:dblclick.stop="selectDirectory(directory.path)">
						<i class="fas fa-folder" />
						<span class="pl-1">{{ directory.basename }}</span>
					</td>
					<td>{{ directory.folder }}</td>
					<td>{{ directory.count }} items</td>
					<td>
						<span v-if="directory.created_at">{{ moment(directory.created_at).format('D MMM YYYY, HH:mm') }}</span>
						<span v-else>-</span>
					</td>
					<td>
						<span v-if="directory.updated_at">{{ moment(directory.updated_at).format('D MMM YYYY, HH:mm') }}</span>
						<span v-else>-</span>
					</td>
					<td class="text-center">
						<i class="fas fa-chevron-right cursor-pointer" v-on:click="selectDirectory(directory.path)"></i>
					</td>
				</tr>

				<!-- file -->
				<!-- v-on:dblclick="selectAction(file.path, file.extension)" -->
				<!-- v-on:contextmenu.prevent="contextMenu(file, $event)" -->
				<tr
					v-for="(file, index) in filesAll"
					v-bind:key="`f-${index}`"
					v-bind:class="{
						'table-info': checkSelect('files', file.path),
					}"
				>
					<td class="text-center">
						<input type="checkbox" v-on:click="selectItem('files', file.path, $event)" :checked="getCheckAll && checkSelect('files', file.path)" v-bind:disabled="getCheckAll" ref="itemCheckbox" />
					</td>
					<td class="fm-content-item unselectable" v-bind:class="acl && file.acl === 0 ? 'text-hidden' : ''">
						<i class="fas" v-bind:class="extensionToIcon(file.extension)" />
						<!-- <span class="pl-1">{{ file.filename ? file.filename : file.basename }}</span> -->
						<span class="pl-1">{{ setName[index] }}</span>
					</td>
					<td class="tx-uppercase">
						{{ file.extension }}
					</td>
					<td>{{ bytesToHuman(file.size) }}</td>
					<td>
						<span v-if="file.created_at">{{ moment(file.created_at).format('D MMM YYYY, HH:mm') }}</span>
						<span v-else>-</span>
					</td>
					<td>
						<span v-if="file.updated_at">{{ moment(file.updated_at).format('D MMM YYYY, HH:mm') }}</span>
						<span v-else>-</span>
					</td>
					<td></td>
				</tr>
				<!-- Don't delete it -->
				{{ filteredFolder }}
				{{ filteredFile }}
				{{ afterCheckAll }}
			</tbody>
		</table>
		<!-- <input type="checkbox" v-model="selectedAll" @click="allSelected"> : {{ selectedAll }} <br> -->
		<!-- {{ selectedItem }} -->
	</div>
</template>

<script>
	import translate from '../../mixins/translate';
	import helper from '../../mixins/helper';
	import managerHelper from './mixins/manager';
	import { format } from 'date-fns';
	import moment from 'moment';

	export default {
		name: 'table-view',
		mixins: [translate, helper, managerHelper],
		props: {
			manager: { type: String, required: true },
		},
		data() {
			return {
				response: null,
				format,
				moment,
				folders:[],
				filesAll: [],
				newSelectedItem: [],
				elKey:Math.random(),
			};
		},
		mounted() {
			// console.log('mounted')
			// console.log('this.folders -->', this.folders);
		},
		updated() {
			// console.log(this.$store.state.fm[this.activeManager].selected.files)
			// console.log('get select-->', this.$store.getters['fm/selectedItems'])
			// this.allSelected();
		},
		computed: {
			/**
			 * Sort settings
			 * @returns {*}
			 */
			sortSettings() {
				return this.$store.state.fm[this.manager].sort;
			},
			filteredFolder() {
				// console.log('filteredFolder');
				this.folders= this.directories.filter((item) => {
					item.folder = 'Folder'
					return  item.basename.toLowerCase().indexOf(this.setSearch.toLowerCase()) > -1 || 
							item.folder.toLowerCase().indexOf(this.setSearch.toLowerCase()) > -1;
				});
				return this.getFolderDetail(this.folders);
			},
			filteredFile() {

				this.filesAll= this.files.filter((item) => {
					return  item.basename.toLowerCase().indexOf(this.setSearch.toLowerCase()) > -1 || 
							item.extension.toLowerCase().indexOf(this.setSearch.toLowerCase()) > -1;
				});
				return this.getFileDetail(this.filesAll);

				// return this.files.filter((item) => {
				// 	return  item.basename.toLowerCase().indexOf(this.setSearch.toLowerCase()) > -1 || 
				// 			item.extension.toLowerCase().indexOf(this.setSearch.toLowerCase()) > -1;
				// });
			},
			directoriesCount() {
				return this.$store.getters[`fm/${this.activeManager}/directoriesCount`];
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

			setName() {
				return this.filesAll.map(function(item) {
					return item.basename.split(".")[0]
				});
			},
		},
		methods: {
			/**
			 * Sort by field
			 * @param field
			 */
			sortBy(field) {
				this.$store.dispatch(`fm/${this.manager}/sortBy`, { field, direction: null });
			},
			getFolderDetail(){
				const self = this;
				_.map(self.folders, (item,index)=>{
					if(!item.created_at || !item.updated_at)
						axios.post('https://b2b-core-develop.ecslab.dev/api/admin/storage/detail', {
							path: item.path
						})
						.then(function (resp) {
							self.folders[index].count = resp.data.data.count;
							self.folders[index].created_at = resp.data.data.created_at;
							self.folders[index].updated_at = resp.data.data.updated_at;
							self.elKey=Math.random();

							// console.log(resp)
						})
						.catch(function (error) {
							// console.log(error);
						});
				});
			},
			getFileDetail(){
				const self = this;
				_.map(self.filesAll, (item,index)=>{
					if(!item.created_at && !item.updated_at)
						axios.post('https://b2b-core-develop.ecslab.dev/api/admin/storage/detail', {
							path: item.path
						})
						.then(function (resp) {
							self.filesAll[index].created_at = resp.data.data.created_at;
							self.filesAll[index].updated_at = resp.data.data.updated_at;
							self.elKey=Math.random();

							// console.log(resp)
						})
						.catch(function (error) {
							// console.log(error);
						});
				});
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
