<template>
  <div class="table-container">
    <div class="table-header">
      <h3 class="table-title">Recent Transactions</h3>
      <button 
        @click="showAddTransactionModal = true"
        class="btn-primary"
      >
        Add Transaction
      </button>
    </div>
    
    <!-- Loading state -->
    <div v-if="transactionsStore.loading" class="p-6 text-center">
      <div class="spinner"></div>
      <p class="loading-text mt-2">Loading transactions...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="transactionsStore.error" class="p-6 text-center">
      <p class="error-text">Error loading transactions. Please try again.</p>
    </div>
    
    <!-- Transactions table -->
    <div v-else class="table">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactionsStore.paginatedTransactions" :key="transaction.id">
            <td>{{ formatDate(transaction.date) }}</td>
            <td>{{ transaction.description }}</td>
            <td>{{ transaction.category }}</td>
            <td :class="transaction.amount > 0 ? 'text-success' : 'text-danger'">
              {{ formatCurrency(transaction.amount) }}
            </td>
            <td>
              <span :class="getStatusClass(transaction.status)">
                {{ transaction.status }}
              </span>
            </td>
            <td>
              <button 
                @click="editTransaction(transaction)"
                class="btn-ghost mr-3"
              >
                Edit
              </button>
              <button 
                @click="confirmDelete(transaction.id)"
                class="btn-ghost text-danger"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div class="table-footer">
      <div class="pagination-info">
        Showing 
        <span class="font-medium">{{ (transactionsStore.currentPage - 1) * transactionsStore.itemsPerPage + 1 }}</span>
        to
        <span class="font-medium">
          {{ Math.min(transactionsStore.currentPage * transactionsStore.itemsPerPage, transactionsStore.totalItems) }}
        </span>
        of
        <span class="font-medium">{{ transactionsStore.totalItems }}</span>
        results
      </div>
      <div class="table-pagination">
        <button 
          @click="transactionsStore.setPage(transactionsStore.currentPage - 1)"
          :disabled="transactionsStore.currentPage === 1"
          class="pagination-button"
        >
          Previous
        </button>
        <button 
          @click="transactionsStore.setPage(transactionsStore.currentPage + 1)"
          :disabled="transactionsStore.currentPage === transactionsStore.pageCount"
          class="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
    
    <!-- Add/Edit Transaction Modal -->
    <div v-if="showAddTransactionModal" class="modal">
      <div class="modal-overlay" @click="showAddTransactionModal = false"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">
            {{ editingTransaction ? 'Edit Transaction' : 'Add Transaction' }}
          </h3>
        </div>
        
        <form @submit.prevent="saveTransaction" class="modal-content">
          <div class="form-group">
            <label class="form-label">Date</label>
            <input 
              type="date" 
              v-model="transactionForm.date"
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <input 
              type="text" 
              v-model="transactionForm.description"
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Category</label>
            <select 
              v-model="transactionForm.category"
              class="form-select"
              required
            >
              <option value="Income">Income</option>
              <option value="Housing">Housing</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Amount</label>
            <input 
              type="number" 
              v-model="transactionForm.amount"
              step="0.01"
              class="form-input"
              required
            />
            <p class="form-helper">
              Use positive values for income, negative for expenses
            </p>
          </div>
          
          <div class="form-group">
            <label class="form-label">Status</label>
            <select 
              v-model="transactionForm.status"
              class="form-select"
              required
            >
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button 
              type="button"
              @click="showAddTransactionModal = false"
              class="btn-outline"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="btn-primary"
            >
              {{ editingTransaction ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-overlay" @click="showDeleteModal = false"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">Confirm Delete</h3>
        </div>
        <div class="modal-content">
          <p class="mb-6">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>
          
          <div class="form-actions">
            <button 
              @click="showDeleteModal = false"
              class="btn-outline"
            >
              Cancel
            </button>
            <button 
              @click="deleteTransaction"
              class="btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Transactions Table Component
 * 
 * Displays a table of financial transactions with pagination and CRUD operations.
 * 
 * @component
 */
import { ref, reactive } from 'vue';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatCurrency } from '@/utils/formatters';
import type { Transaction } from '@/types';

// Initialize stores
const transactionsStore = useTransactionsStore();
const settingsStore = useSettingsStore();

// Modal state
const showAddTransactionModal = ref(false);
const showDeleteModal = ref(false);
const editingTransaction = ref<Transaction | null>(null);
const transactionToDeleteId = ref<string | null>(null);

// Transaction form
const transactionForm = reactive({
  date: new Date().toISOString().split('T')[0],
  description: '',
  category: 'Other',
  amount: 0,
  status: 'Completed'
});

// Format date based on user settings
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString(undefined, options);
};

// Get status class based on status
const getStatusClass = (status: string): string => {
  switch (status) {
    case 'Completed':
      return 'status-completed';
    case 'Pending':
      return 'status-pending';
    case 'Failed':
      return 'status-failed';
    default:
      return '';
  }
};

// Edit transaction
const editTransaction = (transaction: Transaction) => {
  editingTransaction.value = transaction;
  transactionForm.date = transaction.date;
  transactionForm.description = transaction.description;
  transactionForm.category = transaction.category;
  transactionForm.amount = transaction.amount;
  transactionForm.status = transaction.status;
  showAddTransactionModal.value = true;
};

// Save transaction (add or update)
const saveTransaction = async () => {
  if (editingTransaction.value) {
    // Update existing transaction
    await transactionsStore.updateTransaction(
      editingTransaction.value.id,
      {
        date: transactionForm.date,
        description: transactionForm.description,
        category: transactionForm.category,
        amount: transactionForm.amount,
        status: transactionForm.status
      }
    );
  } else {
    // Add new transaction
    await transactionsStore.addTransaction({
      date: transactionForm.date,
      description: transactionForm.description,
      category: transactionForm.category,
      amount: transactionForm.amount,
      status: transactionForm.status
    });
  }
  
  // Reset form and close modal
  resetForm();
  showAddTransactionModal.value = false;
};

// Confirm delete
const confirmDelete = (id: string) => {
  transactionToDeleteId.value = id;
  showDeleteModal.value = true;
};

// Delete transaction
const deleteTransaction = async () => {
  if (transactionToDeleteId.value) {
    await transactionsStore.deleteTransaction(transactionToDeleteId.value);
    transactionToDeleteId.value = null;
    showDeleteModal.value = false;
  }
};

// Reset form
const resetForm = () => {
  editingTransaction.value = null;
  transactionForm.date = new Date().toISOString().split('T')[0];
  transactionForm.description = '';
  transactionForm.category = 'Other';
  transactionForm.amount = 0;
  transactionForm.status = 'Completed';
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: map-get($z-index, 'modal');
  @include flex-center;
  padding: map-get($spacing-scale, 4);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.modal-container {
  @include theme-color('background-color', 'card');
  @include border-radius('lg');
  @include shadow-xl;
  max-width: 28rem;
  width: 100%;
}

.modal-header {
  @include padding(6);
  @include theme-color('border-bottom-color', 'border');
  border-bottom-width: 1px;
  border-bottom-style: solid;
}

.modal-title {
  @include font-size('lg');
  @include font-weight('medium');
  @include theme-color('color', 'card-foreground');
}

.modal-content {
  @include padding(6);
}

.loading-text {
  @include font-size('sm');
  @include theme-color('color', 'muted-foreground');
}

.error-text {
  @include font-size('sm');
  @include theme-color('color', 'danger');
}

.spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 0.25rem solid rgba(99, 102, 241, 0.2);
  border-top-color: rgb(99, 102, 241);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>