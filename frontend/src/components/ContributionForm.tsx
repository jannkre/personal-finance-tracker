import React, { useState } from 'react';
import { format } from 'date-fns';
import { SavingsGoal, GoalContributionInput } from '../types';
import { useContributeToGoal } from '../hooks/useApi';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';

interface ContributionFormProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal;
  onSuccess?: () => void;
}

const ContributionForm: React.FC<ContributionFormProps> = ({
  isOpen,
  onClose,
  goal,
  onSuccess
}) => {
  const [formData, setFormData] = useState<GoalContributionInput>({
    goal_id: goal.id,
    amount: 0,
    contribution_date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const contributeMutation = useContributeToGoal();

  const handleChange = (field: keyof GoalContributionInput, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    }

    if (!formData.contribution_date) {
      newErrors.contribution_date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    contributeMutation.mutate(formData, {
      onSuccess: () => {
        onSuccess?.();
        onClose();
        setFormData({
          goal_id: goal.id,
          amount: 0,
          contribution_date: format(new Date(), 'yyyy-MM-dd'),
          description: '',
        });
        setErrors({});
      },
      onError: (error: any) => {
        setErrors({
          submit: error.message || 'Failed to add contribution. Please try again.',
        });
      },
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const remainingAmount = Math.max(goal.target_amount - goal.current_amount, 0);
  const progressAfterContribution = goal.current_amount + (Number(formData.amount) || 0);
  const newProgress = Math.min((progressAfterContribution / goal.target_amount) * 100, 100);

  const quickAmounts = [25, 50, 100, 250, 500];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Contribution to ${goal.name}`}
      size="md"
    >
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <div
            className="w-4 h-4 rounded-full mr-3"
            style={{ backgroundColor: goal.color }}
          />
          <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Current Progress</span>
            <span>{formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${(goal.current_amount / goal.target_amount) * 100}%`,
                backgroundColor: goal.color,
              }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {formatCurrency(remainingAmount)} remaining to reach your goal
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Amount Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Amounts
          </label>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((amount) => (
              <Button
                key={amount}
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleChange('amount', amount)}
                className="text-center"
              >
                ${amount}
              </Button>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleChange('amount', remainingAmount)}
              className="text-center"
              disabled={remainingAmount <= 0}
            >
              Complete Goal
            </Button>
          </div>
        </div>

        {/* Amount */}
        <Input
          label="Contribution Amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount || ''}
          onChange={(e) => handleChange('amount', Number(e.target.value))}
          placeholder="0.00"
          leftIcon="$"
          error={errors.amount}
          required
        />

        {/* Progress Preview */}
        {formData.amount > 0 && (
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>After this contribution</span>
              <span>{formatCurrency(progressAfterContribution)} / {formatCurrency(goal.target_amount)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${newProgress}%`,
                  backgroundColor: goal.color,
                }}
              />
            </div>
            <p className="text-sm text-primary-700 font-medium">
              {newProgress >= 100 ? '🎉 Goal will be achieved!' : `${newProgress.toFixed(1)}% complete`}
            </p>
          </div>
        )}

        {/* Date */}
        <Input
          label="Contribution Date"
          type="date"
          value={formData.contribution_date}
          onChange={(e) => handleChange('contribution_date', e.target.value)}
          error={errors.contribution_date}
          required
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Notes about this contribution..."
            rows={2}
            className="input"
          />
        </div>

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
            isLoading={contributeMutation.isPending}
          >
            Add Contribution
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ContributionForm;