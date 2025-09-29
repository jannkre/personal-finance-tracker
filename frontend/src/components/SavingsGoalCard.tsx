import React from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { SavingsGoal } from '../types';
import Button from './ui/Button';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: number) => void;
  onContribute: (goal: SavingsGoal) => void;
  isDeleting?: boolean;
}

const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  onContribute,
  isDeleting
}) => {
  const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
  const remainingAmount = Math.max(goal.target_amount - goal.current_amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getDaysRemaining = () => {
    if (!goal.target_date) return null;
    try {
      const days = differenceInDays(parseISO(goal.target_date), new Date());
      return days > 0 ? days : 0;
    } catch {
      return null;
    }
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="card-body">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: goal.color }}
              />
              <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
              {goal.is_achieved && (
                <span className="ml-2 badge badge-success">✓ Achieved</span>
              )}
            </div>
            {goal.description && (
              <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(goal)}
              className="p-1"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(goal.id)}
              className="p-1 text-danger-600 hover:text-danger-700 hover:bg-danger-50"
              isLoading={isDeleting}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: goal.color,
              }}
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div>
            {remainingAmount > 0 ? (
              <span>{formatCurrency(remainingAmount)} remaining</span>
            ) : (
              <span className="text-success-600 font-medium">Goal achieved! 🎉</span>
            )}
          </div>
          {goal.target_date && (
            <div>
              {daysRemaining !== null && (
                <span>
                  {daysRemaining > 0
                    ? `${daysRemaining} days left`
                    : 'Deadline passed'
                  }
                </span>
              )}
            </div>
          )}
        </div>

        {goal.target_date && (
          <div className="text-xs text-gray-500 mb-4">
            Target date: {formatDate(goal.target_date)}
          </div>
        )}

        {/* Actions */}
        {!goal.is_achieved && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onContribute(goal)}
            leftIcon={<PlusIcon className="h-4 w-4" />}
            className="w-full"
          >
            Add Contribution
          </Button>
        )}
      </div>
    </div>
  );
};

export default SavingsGoalCard;