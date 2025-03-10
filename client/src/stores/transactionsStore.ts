/**
 * Transactions Store
 * 
 * Manages the state for transactions, including fetching, adding, updating, and deleting transactions.
 * 
 * @module stores/transactionsStore
 */
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';
import type { Transaction } from '@/types';

// GraphQL queries and mutations
const GET_TRANSACTIONS = gql`
  query GetTransactions($limit: Int, $offset: Int) {
    transactions(limit: $limit, offset: $offset) {
      id
      date
      description
      category
      amount
      status
    }
  }
`;

const ADD_TRANSACTION = gql`
  mutation AddTransaction($input: TransactionInput!) {
    addTransaction(input: $input) {
      id
      date
      description
      category
      amount
      status
    }
  }
`;

const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $input: TransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      id
      date
      description
      category
      amount
      status
    }
  }
`;

const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;

export const useTransactionsStore = defineStore('transactions', () => {
  // State
  const transactions = ref<Transaction[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const totalItems = ref(0);
  
  // Computed properties
  const pageCount = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
  const paginatedTransactions = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return transactions.value.slice(start, end);
  });

  // Fetch transactions using useQuery
  const {
    result: transactionsResult,
    loading: queryLoading,
    error: queryError,
    onResult,
    onError,
    refetch
  } = useQuery(GET_TRANSACTIONS, {
    limit: itemsPerPage,
    offset: computed(() => (currentPage.value - 1) * itemsPerPage.value),
  }, {
    clientId: 'default',
  });

  // Watch for changes in the Apollo query result
  watch(transactionsResult, (newResult) => {
    if (newResult?.transactions) {
      transactions.value = newResult.transactions;
    }
  }, { deep: true });

  watch(queryLoading, (newLoading) => {
    loading.value = newLoading;
  });

  watch(queryError, (newError) => {
    error.value = newError || null;
  });
  
  // Actions
  async function fetchTransactions() {
    await refetch({
      limit: itemsPerPage.value,
      offset: (currentPage.value - 1) * itemsPerPage.value
    });
  }
  
  async function addTransaction(transaction: Omit<Transaction, 'id'>) {
    loading.value = true;
    error.value = null;
    
    try {
      const { mutate, onDone, onError } = useMutation(ADD_TRANSACTION);
      
      await mutate({
        input: transaction
      });
      
      onDone((result) => {
        if (result.data) {
          transactions.value.unshift(result.data.addTransaction);
          totalItems.value++;
        }
        loading.value = false;
      });
      
      onError((err) => {
        error.value = err;
        loading.value = false;
      });
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error');
      loading.value = false;
    }
  }
  
  async function updateTransaction(id: string, transaction: Omit<Transaction, 'id'>) {
    loading.value = true;
    error.value = null;
    
    try {
      const { mutate, onDone, onError } = useMutation(UPDATE_TRANSACTION);
      
      await mutate({
        id,
        input: transaction
      });
      
      onDone((result) => {
        if (result.data) {
          const index = transactions.value.findIndex(t => t.id === id);
          if (index !== -1) {
            transactions.value[index] = result.data.updateTransaction;
          }
        }
        loading.value = false;
      });
      
      onError((err) => {
        error.value = err;
        loading.value = false;
      });
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error');
      loading.value = false;
    }
  }
  
  async function deleteTransaction(id: string) {
    loading.value = true;
    error.value = null;
    
    try {
      const { mutate, onDone, onError } = useMutation(DELETE_TRANSACTION);
      
      await mutate({ id });
      
      onDone((result) => {
        if (result.data && result.data.deleteTransaction) {
          transactions.value = transactions.value.filter(t => t.id !== id);
          totalItems.value--;
        }
        loading.value = false;
      });
      
      onError((err) => {
        error.value = err;
        loading.value = false;
      });
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error');
      loading.value = false;
    }
  }
  
  function setPage(page: number) {
    currentPage.value = page;
    fetchTransactions();
  }
  
  function setItemsPerPage(items: number) {
    itemsPerPage.value = items;
    currentPage.value = 1; // Reset to first page
    fetchTransactions();
  }
  
  return {
    // State
    transactions,
    loading,
    error,
    currentPage,
    itemsPerPage,
    totalItems,
    
    // Getters
    pageCount,
    paginatedTransactions,
    
    // Actions
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setPage,
    setItemsPerPage
  };
});