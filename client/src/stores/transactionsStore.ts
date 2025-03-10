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
import type { Transaction, TransactionInput } from '@/types';

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
    transactionCount
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
  const paginatedTransactions = computed(() => transactions.value);
  
  // Variables for GraphQL query
  const variables = computed(() => ({
    limit: itemsPerPage.value,
    offset: (currentPage.value - 1) * itemsPerPage.value
  }));

  // Fetch transactions using useQuery
  const { result, loading: queryLoading, error: queryError, refetch } = useQuery(
    GET_TRANSACTIONS,
    variables,
    { fetchPolicy: 'cache-and-network' }
  );

  // Watch for changes in the Apollo query result
  watch(result, (newResult) => {
    if (newResult?.transactions) {
      transactions.value = newResult.transactions;
      totalItems.value = newResult.transactionCount || 0;
    }
  });

  watch(queryLoading, (newLoading) => {
    loading.value = newLoading;
  });

  watch(queryError, (newError) => {
    error.value = newError || null;
  });
  
  // Mutations
  const { mutate: addTransactionMutation } = useMutation(ADD_TRANSACTION);
  const { mutate: updateTransactionMutation } = useMutation(UPDATE_TRANSACTION);
  const { mutate: deleteTransactionMutation } = useMutation(DELETE_TRANSACTION);

  // Actions
  async function fetchTransactions() {
    loading.value = true;
    error.value = null;
    
    try {
      await refetch();
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error');
    } finally {
      loading.value = false;
    }
  }
  
  async function addTransaction(transaction: Omit<Transaction, 'id'>) {
    loading.value = true;
    error.value = null;
    
    try {
      const result = await addTransactionMutation({
        input: transaction
      });
      
      if (result?.data?.addTransaction) {
        // Refetch to update the list and count
        await fetchTransactions();
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to add transaction');
      throw error.value;
    } finally {
      loading.value = false;
    }
  }
  
  async function updateTransaction(id: string, transaction: Omit<Transaction, 'id'>) {
    loading.value = true;
    error.value = null;
    
    try {
      const result = await updateTransactionMutation({
        id,
        input: transaction
      });
      
      if (result?.data?.updateTransaction) {
        // Update the transaction in the local state
        const index = transactions.value.findIndex(t => t.id === id);
        if (index !== -1) {
          transactions.value[index] = result.data.updateTransaction;
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to update transaction');
      throw error.value;
    } finally {
      loading.value = false;
    }
  }
  
  async function deleteTransaction(id: string) {
    loading.value = true;
    error.value = null;
    
    try {
      const result = await deleteTransactionMutation({ id });
      
      if (result?.data?.deleteTransaction) {
        // Refetch to update the list and count
        await fetchTransactions();
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to delete transaction');
      throw error.value;
    } finally {
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