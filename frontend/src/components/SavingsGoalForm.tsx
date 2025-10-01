import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { SavingsGoalForm as SavingsGoalFormType, SavingsGoal } from '../types';
import { useCreateSavingsGoal, useUpdateSavingsGoal } from '../hooks/useApi';
import Button from './ui/button';
import Input from './ui/input';
import Modal from './ui/Modal';

interface SavingsGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: SavingsGoal | null;
  onSuccess?: () => void;
}

const SavingsGoalForm: React.FC<SavingsGoalFormProps> = ({
  isOpen,
  onClose,
  goal,
  onSuccess
}) => {
  const [formData, setFormData] = useState<SavingsGoalFormType>({
    name: '',
    description: '',
    target_amount: '',
    target_date: '',
    color: '#10B981',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateSavingsGoal();
  const updateMutation = useUpdateSavingsGoal();

  const isEditing = !!goal;

  // Initialize form when goal changes
  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        description: goal.description || '',
        target_amount: goal.target_amount.toString(),
        target_date: goal.target_date || '',
        color: goal.color,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        target_amount: '',
        target_date: '',
        color: '#10B981',
      });
    }
  }, [goal]);

  const handleChange = (field: keyof SavingsGoalFormType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    if (!formData.target_amount.trim()) {
      newErrors.target_amount = 'Target amount is required';
    } else if (isNaN(Number(formData.target_amount)) || Number(formData.target_amount) <= 0) {
      newErrors.target_amount = 'Please enter a valid positive amount';
    }

    if (formData.target_date) {
      const targetDate = new Date(formData.target_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (targetDate <= today) {
        newErrors.target_date = 'Target date must be in the future';
      }
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
      target_amount: formData.target_amount,
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: goal!.id, data: submitData },
        {
          onSuccess: () => {
            onSuccess?.();
            onClose();
            setFormData({
              name: '',
              description: '',
              target_amount: '',
              target_date: '',
              color: '#10B981',
            });
            setErrors({});
          },
          onError: (error: any) => {
            setErrors({
              submit: error.message || 'Failed to update savings goal. Please try again.',
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
            name: '',
            description: '',
            target_amount: '',
            target_date: '',
            color: '#10B981',
          });
          setErrors({});
        },
        onError: (error: any) => {
          setErrors({
            submit: error.message || 'Failed to create savings goal. Please try again.',
          });
        },
      });
    }
  };

  const predefinedColors = [
    '#10B981', // Green
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#EC4899', // Pink
    '#84CC16', // Lime
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Savings Goal' : 'Create Savings Goal'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Goal Name */}
        <Input
          label="Goal Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Emergency Fund, New Car, Vacation"
          error={errors.name}
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
            placeholder="Add more details about your savings goal..."
            rows={3}
            className="input"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-danger-600">{errors.description}</p>
          )}
        </div>

        {/* Target Amount */}
        <Input
          label="Target Amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.target_amount}
          onChange={(e) => handleChange('target_amount', e.target.value)}
          placeholder="0.00"
          leftIcon="$"
          error={errors.target_amount}
          required
        />

        {/* Target Date */}
        <Input
          label="Target Date (Optional)"
          type="date"
          value={formData.target_date}
          onChange={(e) => handleChange('target_date', e.target.value)}
          min={format(new Date(), 'yyyy-MM-dd')}
          error={errors.target_date}
        />

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {predefinedColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleChange('color', color)}
                className={`w-8 h-8 rounded-full border-2 transition-colors ${
                  formData.color === color
                    ? 'border-gray-800 scale-110'
                    : 'border-gray-300 hover:border-gray-500'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
            <div className="flex items-center ml-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-8 h-8 rounded-full border-2 border-gray-300"
              />
            </div>
          </div>
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
            isLoading={createMutation.isPending || updateMutation.isPending}
          >
            {isEditing ? 'Update Goal' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SavingsGoalForm;