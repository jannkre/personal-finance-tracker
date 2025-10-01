import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useTransactions, useSavingsGoals } from '../hooks/useApi';
import Button from '../components/ui/button';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: recentTransactions, isLoading: transactionsLoading } = useTransactions({
    limit: 5
  });
  const { data: savingsGoals } = useSavingsGoals();

  // Calculate summary stats
  const summary = useMemo(() => {
    if (!recentTransactions) return { totalIncome: 0, totalExpenses: 0, netIncome: 0, recentCount: 0 };

    const totalIncome = recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      recentCount: recentTransactions.length
    };
  }, [recentTransactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading">
            Welcome back{user?.first_name ? `, ${user.first_name}` : ''}!
          </h1>
          <p className="text-body mt-1">
            Here's an overview of your finances.
          </p>
        </div>
        <Link to="/transactions">
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="h-5 w-5" />}
          >
            Add Transaction
          </Button>
        </Link>
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
                <p className="text-sm text-gray-500">Recent Income</p>
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
                <p className="text-sm text-gray-500">Recent Expenses</p>
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
                  summary.netIncome >= 0 ? 'bg-primary-100' : 'bg-warning-100'
                }`}>
                  <span className={`text-sm font-medium ${
                    summary.netIncome >= 0 ? 'text-primary-600' : 'text-warning-600'
                  }`}>
                    {summary.netIncome >= 0 ? '💰' : '⚠️'}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Net Amount</p>
                <p className={`text-2xl font-semibold ${
                  summary.netIncome >= 0 ? 'text-primary-600' : 'text-warning-600'
                }`}>
                  {formatCurrency(summary.netIncome)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                  <span className="text-warning-600 text-sm font-medium">🎯</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Savings Goals</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {savingsGoals?.length || 0}
                </p>
                {savingsGoals && savingsGoals.length > 0 && (
                  <p className="text-xs text-gray-400">
                    {savingsGoals.filter(g => g.is_achieved).length} achieved
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-subheading">Recent Transactions</h3>
            <Link to="/transactions">
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRightIcon className="h-4 w-4" />}
              >
                View All
              </Button>
            </Link>
          </div>
        </div>
        <div className="card-body">
          {transactionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : !recentTransactions || recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-xl">📊</span>
              </div>
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start by adding your first transaction to see your financial overview.
              </p>
              <Link to="/transactions" className="mt-4 inline-block">
                <Button variant="primary" size="sm">
                  Add Your First Transaction
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {transaction.category_icon && (
                        <span className="text-lg mr-3">{transaction.category_icon}</span>
                      )}
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: transaction.category_color }}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.description || 'No description'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.category_name} • {transaction.account_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/transactions" className="card hover:shadow-md transition-shadow">
          <div className="card-body text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-primary-600 text-xl">💳</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Track Transactions</h3>
            <p className="text-sm text-gray-500">Add and manage your income and expenses</p>
          </div>
        </Link>

        <Link to="/accounts" className="card hover:shadow-md transition-shadow">
          <div className="card-body text-center">
            <div className="w-12 h-12 bg-success-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-success-600 text-xl">🏦</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Accounts</h3>
            <p className="text-sm text-gray-500">Set up your bank accounts and cards</p>
          </div>
        </Link>

        <Link to="/savings-goals" className="card hover:shadow-md transition-shadow">
          <div className="card-body text-center">
            <div className="w-12 h-12 bg-warning-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-warning-600 text-xl">🎯</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Savings Goals</h3>
            <p className="text-sm text-gray-500">Set and track your financial goals</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;