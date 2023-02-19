<script lang="ts" setup>
defineProps(['html'])
</script>
<template>
    <div class="trm-publication" v-html="html"></div>
</template>
<style lang="less">
@import url(./pre/index.less);
@import url(./pre/md.less);
@import url(./pre/highlight.less);
</style>