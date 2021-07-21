<template>
	<div class="fm-tree p-0 border-right overflow-auto cursor-pointer" :class="{ 'is-expanded': isExpanded }" @click="Sidebar()" v-click-outside="SidebarHide" v-on:click="selectMainDirectory">
		<div class="fm-tree-disk sticky-top px-3 pt-3 pb-2 bg-white l-0">
			<i class="fas fa-hdd tx-18" />
			<span class="tx-medium ml-2">{{ selectedDisk }}</span>
		</div>
		<branch v-bind:parent-id="0" />
	</div>
</template>

<script>
	import Branch from './Branch.vue';

	export default {
		name: 'FolderTree',
		data() {
			return {
				isExpanded: false,
			};
		},
		components: {
			branch: Branch,
		},
		computed: {
			/**
			 * Selected Disk
			 * @returns {*}
			 */
			selectedDisk() {
				return this.$store.getters['fm/selectedDisk'];
			},

			selectedDirectory() {
				// return this.$store.state.fm[this.manager].selectedDirectory;
				return this.$store.getters['fm/selectedDirectory'];
			},
		},
		methods: {
			Sidebar() {
				this.isExpanded = !this.isExpanded;
			},
			SidebarHide() {
				this.isExpanded = false;
			},

			/**
			 * Select main directory
			 */
			selectMainDirectory() {
				if (this.selectedDirectory) {
					this.$store.dispatch(`fm/left/selectDirectory`, { path: null, history: true });
				}
			},
		},
	};
</script>
