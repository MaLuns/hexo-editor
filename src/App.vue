<script lang="ts" setup>
import { zhCN, dateZhCN } from 'naive-ui'
import { themmStore } from '@/store';
</script>
<template>
  <n-config-provider :theme="themmStore.mode" :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <RouterView />
    </n-message-provider>
  </n-config-provider>
</template>