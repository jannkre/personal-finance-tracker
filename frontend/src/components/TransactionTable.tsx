import React from 'react';
import { format, parseISO } from 'date-fns';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { TransactionWithDetails } from '../types';
import Button from './ui/Button';
import LoadingSpinner from './LoadingSpinner';

interface TransactionTableProps {
  transactions: TransactionWithDetails[];
  isLoading?: boolean;
  onEdit: (transaction: TransactionWithDetails) => void;
  onDelete: (id: number) => void;
  onDeleteLoading?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isLoading,
  onEdit,
  onDelete,
  onDeleteLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <span className="text-gray-400 text-xl">📊</span>
        </div>
        <p className="text-gray-500">No transactions found</p>
        <p className="text-sm text-gray-400 mt-1">
          Add your first transaction to get started.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-cell font-semibold text-gray-900">Date</th>
              <th className="table-cell font-semibold text-gray-900">Description</th>
              <th className="table-cell font-semibold text-gray-900">Category</th>
              <th className="table-cell font-semibold text-gray-900">Account</th>
              <th className="table-cell font-semibold text-gray-900 text-right">Amount</th>
              <th className="table-cell font-semibold text-gray-900 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="table-cell text-gray-900">
                  {formatDate(transaction.date)}
                </td>
                <td className="table-cell">
                  <div className="max-w-xs">
                    <p className="text-gray-900 font-medium truncate">
                      {transaction.description || 'No description'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.type === 'income' ? 'Income' : 'Expense'}
                    </p>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center">
                    {transaction.category_icon && (
                      <span className="mr-2 text-sm">{transaction.category_icon}</span>
                    )}
                    <div>
                      <span className="text-gray-900">{transaction.category_name}</span>
                      <div
                        className="w-3 h-3 rounded-full ml-2 inline-block"
                        style={{ backgroundColor: transaction.category_color }}
                      />
                    </div>
                  </div>
                </td>
                <td className="table-cell text-gray-700">
                  {transaction.account_name}
                </td>
                <td className="table-cell text-right">
                  <span
                    className={`font-semibold ${
                      transaction.type === 'income'
                        ? 'text-success-600'
                        : 'text-danger-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className="table-cell">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(transaction)}
                      className="p-1"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(transaction.id)}
                      className="p-1 text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                      isLoading={onDeleteLoading}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;