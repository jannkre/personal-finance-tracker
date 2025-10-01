import React, { useState, useMemo } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useTransactions, useDeleteTransaction } from '../hooks/useApi';
import { TransactionWithDetails } from '../types';
import Button from '../components/ui/button';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import TransactionFilters from '../components/TransactionFilters';
import LoadingSpinner from '../components/LoadingSpinner';

interface FilterState {
  startDate: string;
  endDate: string;
  accountId: string;
  categoryId: string;
  type: string;
}

const Transactions: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionWithDetails | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    startDate: '',
    endDate: '',
    accountId: '',
    categoryId: '',
    type: ''
  });

  // Build query parameters from filters
  const queryParams = useMemo(() => {
    const params: any = {};

    if (filters.startDate) params.start_date = filters.startDate;
    if (filters.endDate) params.end_date = filters.endDate;
    if (filters.accountId) params.account_id = Number(filters.accountId);
    if (filters.categoryId) params.category_id = Number(filters.categoryId);
    if (filters.type) params.type = filters.type;

    return params;
  }, [filters]);

  const { data: transactions, isLoading, refetch } = useTransactions(queryParams);
  const deleteMutation = useDeleteTransaction();

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEditTransaction = (transaction: TransactionWithDetails) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          refetch();
        }
      });
    }
  };

  const handleFormSuccess = () => {
    refetch();
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      accountId: '',
      categoryId: '',
      type: ''
    });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  // Calculate summary stats
  const summary = useMemo(() => {
    if (!transactions) return { totalIncome: 0, totalExpenses: 0, netAmount: 0, count: 0 };

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netAmount: totalIncome - totalExpenses,
      count: transactions.length
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading">Transactions</h1>
          <p className="text-body mt-1">
            Track and manage all your income and expenses
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleAddTransaction}
          leftIcon={<PlusIcon className="h-5 w-5" />}
        >
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                  <span className="text-success-600 text-sm font-medium">↗</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Income</p>
                <p className="text-2xl font-semibold text-success-600">
                  {formatCurrency(summary.totalIncome)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center">
                  <span className="text-danger-600 text-sm font-medium">↙</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-2xl font-semibold text-danger-600">
                  {formatCurrency(summary.totalExpenses)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  summary.netAmount >= 0 ? 'bg-primary-100' : 'bg-warning-100'
                }`}>
                  <span className={`text-sm font-medium ${
                    summary.netAmount >= 0 ? 'text-primary-600' : 'text-warning-600'
                  }`}>
                    {summary.netAmount >= 0 ? '💰' : '⚠️'}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Net Amount</p>
                <p className={`text-2xl font-semibold ${
                  summary.netAmount >= 0 ? 'text-primary-600' : 'text-warning-600'
                }`}>
                  {formatCurrency(summary.netAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-medium">#</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Transactions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {summary.count}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Transactions Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-subheading">
            {isLoading ? 'Loading transactions...' : `Transactions (${summary.count})`}
          </h3>
        </div>
        <div className="card-body p-0">
          <TransactionTable
            transactions={transactions || []}
            isLoading={isLoading}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            onDeleteLoading={deleteMutation.isPending}
          />
        </div>
      </div>

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={showForm}
        onClose={handleCloseForm}
        transaction={editingTransaction}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default Transactions;