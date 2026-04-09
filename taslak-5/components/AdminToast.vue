<script setup>
const { toasts, removeToast } = useToast()

const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' }
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast show"
        :class="t.type"
        @click="removeToast(t.id)"
      >
        <i class="fa-solid" :class="icons[t.type] || icons.info"></i>
        <span class="toast-text">{{ t.msg }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s; }
.toast-enter-from, .toast-leave-to { transform: translateX(120%); opacity: 0; }
</style>
