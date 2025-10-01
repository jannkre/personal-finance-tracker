import React from 'react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAccounts, useCategories } from '../hooks/useApi';
import Button from './ui/button';
import Input from './ui/input';
import Select from './ui/Select';

interface FilterState {
  startDate: string;
  endDate: string;
  accountId: string;
  categoryId: string;
  type: string;
}

interface TransactionFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const setDateRange = (days: number) => {
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    onFiltersChange({
      ...filters,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    });
  };

  const setCurrentMonth = () => {
    const now = new Date();
    onFiltersChange({
      ...filters,
      startDate: format(startOfMonth(now), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(now), 'yyyy-MM-dd')
    });
  };

  const accountOptions = [
    { value: '', label: 'All Accounts' },
    ...(accounts?.map(account => ({
      value: account.id.toString(),
      label: account.name
    })) || [])
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...(categories?.map(category => ({
      value: category.id.toString(),
      label: category.name,
      icon: category.icon
    })) || [])
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'income', label: '💰 Income' },
    { value: 'expense', label: '💸 Expenses' }
  ];

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              leftIcon={<XMarkIcon className="h-4 w-4" />}
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Input
              label="Start Date"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>

          {/* Account Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account
            </label>
            <Select
              options={accountOptions}
              value={filters.accountId}
              onChange={(value) => handleFilterChange('accountId', value.toString())}
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select
              options={categoryOptions}
              value={filters.categoryId}
              onChange={(value) => handleFilterChange('categoryId', value.toString())}
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <Select
              options={typeOptions}
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value.toString())}
            />
          </div>
        </div>

        {/* Quick Date Filters */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Quick Filters:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDateRange(7)}
            >
              Last 7 days
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDateRange(30)}
            >
              Last 30 days
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={setCurrentMonth}
            >
              This month
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDateRange(90)}
            >
              Last 3 months
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;