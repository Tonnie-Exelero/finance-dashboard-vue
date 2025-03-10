<template>
  <div class="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
    <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Transactions</h3>
      <button 
        @click="showAddTransactionModal = true"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Add Transaction
      </button>
    </div>
    
    <!-- Loading state -->
    <div v-if="transactionsStore.loading" class="p-6 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Loading transactions...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="transactionsStore.error" class="p-6 text-center text-red-600 dark:text-red-400">
      <p>Error loading transactions. Please try again.</p>
    </div>
    
    <!-- Transactions table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="transaction in transactionsStore.paginatedTransactions" :key="transaction.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(transaction.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ transaction.description }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ transaction.category }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ formatCurrency(transaction.amount) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                :class="getStatusClass(transaction.status)">
                {{ transaction.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              <button 
                @click="editTransaction(transaction)"
                class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
              >
                Edit
              </button>
              <button 
                @click="confirmDelete(transaction.id)"
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center">
        <div>
          <span class="text-sm text-gray-700 dark:text-gray-300">
            Showing 
            <span class="font-medium">{{ (transactionsStore.currentPage - 1) * transactionsStore.itemsPerPage + 1 }}</span>
            to
            <span class="font-medium">
              {{ Math.min(transactionsStore.currentPage * transactionsStore.itemsPerPage, transactionsStore.totalItems) }}
            </span>
            of
            <span class="font-medium">{{ transactionsStore.totalItems }}</span>
            results
          </span>
        </div>
        <div class="flex space-x-2">
          <button 
            @click="transactionsStore.setPage(transactionsStore.currentPage - 1)"
            :disabled="transactionsStore.currentPage === 1"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            @click="transactionsStore.setPage(transactionsStore.currentPage + 1)"
            :disabled="transactionsStore.currentPage === transactionsStore.pageCount"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Transaction Modal -->
    <div v-if="showAddTransactionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ editingTransaction ? 'Edit Transaction' : 'Add Transaction' }}
        </h3>
        
        <form @submit.prevent="saveTransaction">
          <div class="space-y-4">
            <!-- Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input 
                type="date" 
                v-model="transactionForm.date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <input 
                type="text" 
                v-model="transactionForm.description"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select 
                v-model="transactionForm.category"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
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
            
            <!-- Amount -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
              <input 
                type="number" 
                v-model="transactionForm.amount"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Use positive values for income, negative for expenses
              </p>
            </div>
            
            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select 
                v-model="transactionForm.status"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              type="button"
              @click="showAddTransactionModal = false"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {{ editingTransaction ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
        <p class="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to delete this transaction? This action cannot be undone.
        </p>
        
        <div class="flex justify-end space-x-3">
          <button 
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button 
            @click="deleteTransaction"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
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
import { formatCurrency, getStatusClass } from '@/utils/formatters';
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