<template>
  <div class="modal-backdrop" @click.self="$emit('cancel')">
    <div class="modal modal--sm">
      <div class="modal__header">
        <h3>{{ title }}</h3>
        <button class="close-button" @click="$emit('cancel')" aria-label="Close">
          <XIcon />
        </button>
      </div>

      <div class="modal__body">
        <p>{{ message }}</p>
      </div>

      <div class="modal__footer">
        <button type="button" @click="$emit('cancel')" class="btn btn--outline">
          {{ cancelText }}
        </button>
        <button
          type="button"
          @click="$emit('confirm')"
          class="btn"
          :class="`btn--${confirmVariant}`"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Confirmation Modal Component
 *
 * Reusable modal for confirming actions.
 *
 * @component
 * @emits confirm - Emitted when the confirm button is clicked
 * @emits cancel - Emitted when the cancel button is clicked
 */
import { XIcon } from 'lucide-vue-next'

defineProps({
  /**
   * Modal title
   */
  title: {
    type: String,
    default: 'Confirm Action',
  },
  /**
   * Modal message
   */
  message: {
    type: String,
    required: true,
  },
  /**
   * Confirm button text
   */
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  /**
   * Cancel button text
   */
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  /**
   * Confirm button variant
   */
  confirmVariant: {
    type: String,
    default: 'primary',
    // eslint-disable-next-line
    validator: (value: string) => ['primary', 'secondary', 'danger'].includes(value),
  },
})

defineEmits<{
  /**
   * Emitted when the confirm button is clicked
   */
  (e: 'confirm'): void
  /**
   * Emitted when the cancel button is clicked
   */
  (e: 'cancel'): void
}>()
</script>
