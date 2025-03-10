<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal__header">
        <h3>{{ isEditing ? 'Edit Transaction' : 'Add Transaction' }}</h3>
        <button class="close-button" @click="$emit('close')" aria-label="Close">
          <XIcon />
        </button>
      </div>
      
      <div class="modal__body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="date" class="form-label">Date</label>
            <input 
              type="date" 
              id="date"
              v-model="form.date"
              class="form-control"
              :class="{ 'form-control--error': errors.date }"
              required
            />
            <span v-if="errors.date" class="form-error">{{ errors.date }}</span>
          </div>
          
          <div class="form-group">
            <label for="description" class="form-label">Description</label>
            <input 
              type="text" 
              id="description"
              v-model="form.description"
              class="form-control"
              :class="{ 'form-control--error': errors.description }"
              required
            />
            <span v-if="errors.description" class="form-error">{{ errors.description }}</span>
          </div>
          
          <div class="form-group">
            <label for="category" class="form-label">Category</label>
            <select 
              id="category"
              v-model="form.category"
              class="form-control"
              :class="{ 'form-control--error': errors.category }"
              required
            >
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <span v-if="errors.category" class="form-error">{{ errors.category }}</span>
          </div>
          
          <div class="form-group">
            <label for="amount" class="form-label">Amount</label>
            <input 
              type="number" 
              id="amount"
              v-model="form.amount"
              step="0.01"
              class="form-control"
              :class="{ 'form-control--error': errors.amount }"
              required
            />
            <span class="form-text">Use positive values for income, negative for expenses</span>
            <span v-if="errors.amount" class="form-error">{{ errors.amount }}</span>
          </div>
          
          <div class="form-group">
            <label for="status" class="form-label">Status</label>
            <select 
              id="status"
              v-model="form.status"
              class="form-control"
              :class="{ 'form-control--error': errors.status }"
              required
            >
              <option v-for="status in statuses" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
            <span v-if="errors.status" class="form-error">{{ errors.status }}</span>
          </div>
        </form>
      </div>
      
      <div class="modal__footer">
        <button 
          type="button"
          @click="$emit('close')"
          class="btn btn--outline"
        >
          Cancel
        </button>
        <button 
          type="button"
          @click="handleSubmit"
          class="btn btn--primary"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="loading-spinner"></span>
          <span>{{ isEditing ? 'Update' : 'Add' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Transaction Modal Component
 * 
 * Modal for adding or editing transactions.
 * 
 * @component
 * @emits close - Emitted when the modal is closed
 * @emits save - Emitted when a transaction is saved
 */
import { ref, reactive, computed, onMounted } from 'vue';
import { XIcon } from 'lucide-vue-next';
import type { Transaction, TransactionStatus, TransactionCategory } from '@/types';

const props = defineProps<{
  /**
   * Transaction to edit (null for new transaction)
   */
  transaction: Transaction | null;
}>();

const emit = defineEmits<{
  /**
   * Emitted when the modal is closed
   */
  (e: 'close'): void;
  /**
   * Emitted when a transaction is saved
   */
  (e: 'save', transaction: Transaction | Omit<Transaction, 'id'>): void;
}>();

// Form state
const form = reactive({
  date: new Date().toISOString().split('T')[0],
  description: '',
  category: 'Other' as TransactionCategory,
  amount: 0,
  status: 'Completed' as TransactionStatus
});

// Form validation errors
const errors = reactive({
  date: '',
  description: '',
  category: '',
  amount: '',
  status: ''
});

// Form submission state
const isSubmitting = ref(false);

// Available options
const categories: TransactionCategory[] = [
  'Income',
  'Housing',
  'Food',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Other'
];

const statuses: TransactionStatus[] = [
  'Completed',
  'Pending',
  'Failed'
];

// Computed properties
const isEditing = computed(() => !!props.transaction);

// Initialize form with transaction data if editing
onMounted(() => {
  if (props.transaction) {
    form.date = props.transaction.date;
    form.description = props.transaction.description;
    form.category = props.transaction.category as TransactionCategory;
    form.amount = props.transaction.amount;
    form.status = props.transaction.status;
  }
});

// Validate form
const validateForm = (): boolean => {
  let isValid = true;
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = '';
  });
  
  // Validate date
  if (!form.date) {
    errors.date = 'Date is required';
    isValid = false;
  }
  
  // Validate description
  if (!form.description) {
    errors.description = 'Description is required';
    isValid = false;
  } else if (form.description.length < 3) {
    errors.description = 'Description must be at least 3 characters';
    isValid = false;
  }
  
  // Validate amount
  if (form.amount === 0) {
    errors.amount = 'Amount cannot be zero';
    isValid = false;
  }
  
  return isValid;
};

// Handle form submission
const handleSubmit = () => {
  if (!validateForm()) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    if (props.transaction) {
      // Editing existing transaction
      emit('save', {
        id: props.transaction.id,
        ...form
      });
    } else {
      // Adding new transaction
      emit('save', { ...form });
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
// Component-specific styles can be added here if needed
// Most styles are in the global SCSS file: src/styles/components/_modals.scss
</style>