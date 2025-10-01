import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useSavingsGoals, useDeleteSavingsGoal } from '../hooks/useApi';
import { SavingsGoal } from '../types';
import Button from '../components/ui/button';
import SavingsGoalCard from '../components/SavingsGoalCard';
import SavingsGoalForm from '../components/SavingsGoalForm';
import ContributionForm from '../components/ContributionForm';
import LoadingSpinner from '../components/LoadingSpinner';

const SavingsGoals: React.FC = () => {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showContributionForm, setShowContributionForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [contributingToGoal, setContributingToGoal] = useState<SavingsGoal | null>(null);

  const { data: goals, isLoading, refetch } = useSavingsGoals();
  const deleteMutation = useDeleteSavingsGoal();

  const handleAddGoal = () => {
    setEditingGoal(null);
    setShowGoalForm(true);
  };

  const handleEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setShowGoalForm(true);
  };

  const handleDeleteGoal = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          refetch();
        }
      });
    }
  };

  const handleContributeToGoal = (goal: SavingsGoal) => {
    setContributingToGoal(goal);
    setShowContributionForm(true);
  };

  const handleFormSuccess = () => {
    refetch();
  };

  const handleCloseGoalForm = () => {
    setShowGoalForm(false);
    setEditingGoal(null);
  };

  const handleCloseContributionForm = () => {
    setShowContributionForm(false);
    setContributingToGoal(null);
  };

  // Calculate summary stats
  const summary = React.useMemo(() => {
    if (!goals) return {
      totalGoals: 0,
      achievedGoals: 0,
      totalTarget: 0,
      totalSaved: 0,
      completionRate: 0
    };

    const totalGoals = goals.length;
    const achievedGoals = goals.filter(g => g.is_achieved).length;
    const totalTarget = goals.reduce((sum, g) => sum + g.target_amount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.current_amount, 0);
    const completionRate = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    return {
      totalGoals,
      achievedGoals,
      totalTarget,
      totalSaved,
      completionRate
    };
  }, [goals]);

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
          <h1 className="text-heading">Savings Goals</h1>
          <p className="text-body mt-1">
            Track your progress towards your financial goals
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleAddGoal}
          leftIcon={<PlusIcon className="h-5 w-5" />}
        >
          Create Goal
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600 text-sm font-medium">🎯</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Goals</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {summary.totalGoals}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                  <span className="text-success-600 text-sm font-medium">✓</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Achieved</p>
                <p className="text-2xl font-semibold text-success-600">
                  {summary.achievedGoals}
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
                  <span className="text-warning-600 text-sm font-medium">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Saved</p>
                <p className="text-2xl font-semibold text-warning-600">
                  {formatCurrency(summary.totalSaved)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-sm font-medium">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Overall Progress</p>
                <p className="text-2xl font-semibold text-purple-600">
                  {summary.completionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-subheading">
            {isLoading ? 'Loading goals...' : `Your Goals (${summary.totalGoals})`}
          </h3>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : !goals || goals.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-xl">🎯</span>
              </div>
              <p className="text-gray-500">No savings goals yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Create your first savings goal to start tracking your financial progress.
              </p>
              <Button variant="primary" onClick={handleAddGoal} className="mt-4">
                Create Your First Goal
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <SavingsGoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                  onContribute={handleContributeToGoal}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Savings Goal Form Modal */}
      <SavingsGoalForm
        isOpen={showGoalForm}
        onClose={handleCloseGoalForm}
        goal={editingGoal}
        onSuccess={handleFormSuccess}
      />

      {/* Contribution Form Modal */}
      {contributingToGoal && (
        <ContributionForm
          isOpen={showContributionForm}
          onClose={handleCloseContributionForm}
          goal={contributingToGoal}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default SavingsGoals;