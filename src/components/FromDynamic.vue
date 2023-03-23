<template>
	<n-form-item v-for="item in $props.config" :key="item.key" :label="item.title">
		<template v-if="item.type === 'select'">
			<n-select v-bind="item.attr" />
		</template>
		<template v-else-if="item.type === 'input'">
			<n-input v-bind="item.attr"></n-input>
		</template>
		<template v-else-if="item.type === 'slider'">
			<n-slider v-bind="item.attr"> </n-slider>
		</template>
		<template v-else-if="item.type === 'switch'">
			<n-switch v-bind="item.attr">
				<template v-if="item?.attr?.label" #checked> {{ item?.attr?.label }} </template>
				<template v-if="item?.attr?.unlabel" #unchecked> {{ item?.attr?.unlabel }} </template>
			</n-switch>
		</template>
	</n-form-item>
</template>
<script lang="ts" setup>
defineProps<{
	config: FromConfig[];
}>();
</script>
