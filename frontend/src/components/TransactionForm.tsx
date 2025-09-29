import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { TransactionForm as TransactionFormType, TransactionWithDetails } from '../types';
import { useAccounts, useCategories, useCreateTransaction, useUpdateTransaction } from '../hooks/useApi';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Modal from './ui/Modal';
import LoadingSpinner from './LoadingSpinner';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: TransactionWithDetails | null;
  onSuccess?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  transaction,
  onSuccess
}) => {
  const [formData, setFormData] = useState<TransactionFormType>({
    account_id: 0,
    category_id: 0,
    amount: '',
    type: 'expense',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  const isEditing = !!transaction;
  const isLoading = accountsLoading || categoriesLoading;

  // Initialize form when transaction changes
  useEffect(() => {
    if (transaction) {
      setFormData({
        account_id: transaction.account_id,
        category_id: transaction.category_id,
        amount: transaction.amount.toString(),
        type: transaction.type,
        description: transaction.description || '',
        date: transaction.date,
      });
    } else {
      setFormData({
        account_id: accounts?.[0]?.id || 0,
        category_id: 0,
        amount: '',
        type: 'expense',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      });
    }
  }, [transaction, accounts]);

  const handleChange = (field: keyof TransactionFormType, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.account_id) {
      newErrors.account_id = 'Please select an account';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Please select a category';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      account_id: Number(formData.account_id),
      category_id: Number(formData.category_id),
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: transaction!.id, data: submitData },
        {
          onSuccess: () => {
            onSuccess?.();
            onClose();
            setFormData({
              account_id: accounts?.[0]?.id || 0,
              category_id: 0,
              amount: '',
              type: 'expense',
              description: '',
              date: format(new Date(), 'yyyy-MM-dd'),
            });
            setErrors({});
          },
          onError: (error: any) => {
            setErrors({
              submit: error.message || 'Failed to save transaction. Please try again.',
            });
          },
        }
      );
    } else {
      createMutation.mutate(submitData, {
        onSuccess: () => {
          onSuccess?.();
          onClose();
          setFormData({
            account_id: accounts?.[0]?.id || 0,
            category_id: 0,
            amount: '',
            type: 'expense',
            description: '',
            date: format(new Date(), 'yyyy-MM-dd'),
          });
          setErrors({});
        },
        onError: (error: any) => {
          setErrors({
            submit: error.message || 'Failed to save transaction. Please try again.',
          });
        },
      });
    }
  };

  const filteredCategories = categories?.filter(cat => cat.type === formData.type) || [];

  const accountOptions = accounts?.map(account => ({
    value: account.id,
    label: `${account.name} ($${account.balance.toFixed(2)})`,
  })) || [];

  const categoryOptions = filteredCategories.map(category => ({
    value: category.id,
    label: category.name,
    icon: category.icon,
    color: category.color,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Transaction' : 'Add Transaction'}
      size="md"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={formData.type === 'income' ? 'success' : 'secondary'}
                onClick={() => {
                  handleChange('type', 'income');
                  handleChange('category_id', 0); // Reset category when type changes
                }}
                className="justify-center"
              >
                💰 Income
              </Button>
              <Button
                type="button"
                variant={formData.type === 'expense' ? 'danger' : 'secondary'}
                onClick={() => {
                  handleChange('type', 'expense');
                  handleChange('category_id', 0); // Reset category when type changes
                }}
                className="justify-center"
              >
                💸 Expense
              </Button>
            </div>
          </div>

          {/* Amount */}
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder="0.00"
            leftIcon="$"
            error={errors.amount}
            required
          />

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account
            </label>
            <Select
              options={accountOptions}
              value={formData.account_id}
              onChange={(value) => handleChange('account_id', value)}
              placeholder="Select an account"
              error={errors.account_id}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select
              options={categoryOptions}
              value={formData.category_id}
              onChange={(value) => handleChange('category_id', value)}
              placeholder={`Select ${formData.type} category`}
              error={errors.category_id}
            />
          </div>

          {/* Description */}
          <Input
            label="Description (Optional)"
            type="text"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="What was this transaction for?"
            error={errors.description}
          />

          {/* Date */}
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            error={errors.date}
            required
          />

          {errors.submit && (
            <div className="rounded-md bg-danger-50 p-4">
              <p className="text-sm text-danger-700">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {isEditing ? 'Update Transaction' : 'Add Transaction'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default TransactionForm;