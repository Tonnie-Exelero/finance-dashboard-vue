<template>
	<div>
  <div class="card">
    <div class="card__header">
      <h3>Recent Transactions</h3>
      <button 
        @click="showAddTransactionModal = true"
        class="btn btn--primary"
      >
        Add Transaction
      </button>
    </div>
    
    <div class="card__body">
      <!-- Loading state -->
      <div v-if="transactionsStore.loading" class="text-center py-8">
        <div class="loading-spinner"></div>
        <p class="mt-4 text-muted">Loading transactions...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="transactionsStore.error" class="text-center py-8 text-danger">
        <AlertCircleIcon size="32" />
        <p class="mt-4">Error loading transactions. Please try again.</p>
      </div>
      
      <!-- Empty state -->
      <div v-else-if="transactionsStore.transactions.length === 0" class="text-center py-8">
        <InboxIcon size="32" class="text-muted" />
        <p class="mt-4 text-muted">No transactions found.</p>
        <button 
          @click="showAddTransactionModal = true"
          class="btn btn--primary mt-4"
        >
          Add Your First Transaction
        </button>
      </div>
      
      <!-- Transactions table -->
      <div v-else class="table-container">
        <table class="table table--striped">
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
                <span 
                  class="status-badge"
                  :class="`status-badge--${transaction.status.toLowerCase()}`"
                >
                  {{ transaction.status }}
                </span>
              </td>
              <td>
                <div class="table__actions">
                  <button 
                    @click="editTransaction(transaction)"
                    class="btn btn--sm btn--outline"
                  >
                    Edit
                  </button>
                  <button 
                    @click="confirmDelete(transaction.id)"
                    class="btn btn--sm btn--danger"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="pagination">
        <div class="pagination__info">
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
        <div class="pagination__controls">
          <button 
            @click="transactionsStore.setPage(transactionsStore.currentPage - 1)"
            :disabled="transactionsStore.currentPage === 1"
            class="pagination__button"
          >
            Previous
          </button>
          <button 
            @click="transactionsStore.setPage(transactionsStore.currentPage + 1)"
            :disabled="transactionsStore.currentPage === transactionsStore.pageCount"
            class="pagination__button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Add/Edit Transaction Modal -->
  <TransactionModal
    v-if="showAddTransactionModal"
    :transaction="editingTransaction"
    @close="closeTransactionModal"
    @save="saveTransaction"
  />
  
  <!-- Delete Confirmation Modal -->
  <ConfirmationModal
    v-if="showDeleteModal"
    title="Confirm Delete"
    message="Are you sure you want to delete this transaction? This action cannot be undone."
    confirm-text="Delete"
    confirm-variant="danger"
    @confirm="deleteTransaction"
    @cancel="showDeleteModal = false"
  />
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
import { ref } from 'vue';
import { AlertCircleIcon, InboxIcon } from 'lucide-vue-next';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatCurrency } from '@/utils/formatters';
import TransactionModal from '@/components/transactions/TransactionModal.vue';
import ConfirmationModal from '@/components/shared/ConfirmationModal.vue';
import type { Transaction } from '@/types';

// Initialize stores
const transactionsStore = useTransactionsStore();
const settingsStore = useSettingsStore();

// Modal state
const showAddTransactionModal = ref(false);
const showDeleteModal = ref(false);
const editingTransaction = ref<Transaction | null>(null);
const transactionToDeleteId = ref<string | null>(null);

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

// Edit transaction
const editTransaction = (transaction: Transaction) => {
  editingTransaction.value = { ...transaction };
  showAddTransactionModal.value = true;
};

// Close transaction modal
const closeTransactionModal = () => {
  showAddTransactionModal.value = false;
  editingTransaction.value = null;
};

// Save transaction (add or update)
const saveTransaction = async (transaction: Transaction | Omit<Transaction, 'id'>) => {
  if ('id' in transaction) {
    // Update existing transaction
    await transactionsStore.updateTransaction(
      transaction.id,
      {
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        status: transaction.status
      }
    );
  } else {
    // Add new transaction
    await transactionsStore.addTransaction(transaction);
  }
  
  // Close modal
  closeTransactionModal();
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
</script>

<style lang="scss" scoped>
// Component-specific styles can be added here if needed
// Most styles are in the global SCSS files
</style>