import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import {
  AuthResponse,
  LoginForm,
  RegisterForm,
  User,
  Account,
  Category,
  TransactionWithDetails,
  TransactionForm,
  AccountForm,
  CategoryForm,
  SavingsGoal,
  SavingsGoalForm,
  GoalContribution,
  GoalContributionInput
} from '../types';

// Query keys
export const queryKeys = {
  auth: ['auth'] as const,
  profile: ['auth', 'profile'] as const,
  accounts: ['accounts'] as const,
  account: (id: number) => ['accounts', id] as const,
  categories: (type?: 'income' | 'expense') => ['categories', type] as const,
  category: (id: number) => ['categories', id] as const,
  transactions: (params?: any) => ['transactions', params] as const,
  transaction: (id: number) => ['transactions', id] as const,
  savingsGoals: ['savings-goals'] as const,
  savingsGoal: (id: number) => ['savings-goals', id] as const,
  goalContributions: (goalId: number) => ['savings-goals', goalId, 'contributions'] as const,
};

// Authentication hooks
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginForm) => apiClient.login(credentials),
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(queryKeys.profile, data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterForm) => apiClient.register(userData),
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(queryKeys.profile, data.user);
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => apiClient.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Promise.resolve(apiClient.logout()),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

// Account hooks
export const useAccounts = () => {
  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: () => apiClient.getAccounts(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAccount = (id: number) => {
  return useQuery({
    queryKey: queryKeys.account(id),
    queryFn: () => apiClient.getAccount(id),
    enabled: !!id,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountData: AccountForm) => apiClient.createAccount(accountData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AccountForm> }) =>
      apiClient.updateAccount(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.account(id) });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
};

// Category hooks
export const useCategories = (type?: 'income' | 'expense') => {
  return useQuery({
    queryKey: queryKeys.categories(type),
    queryFn: () => apiClient.getCategories(type),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: queryKeys.category(id),
    queryFn: () => apiClient.getCategory(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: CategoryForm) => apiClient.createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoryForm> }) =>
      apiClient.updateCategory(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.category(id) });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Transaction hooks
export const useTransactions = (params?: {
  start_date?: string;
  end_date?: string;
  category_id?: number;
  account_id?: number;
  type?: 'income' | 'expense';
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: queryKeys.transactions(params),
    queryFn: () => apiClient.getTransactions(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useTransaction = (id: number) => {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: () => apiClient.getTransaction(id),
    enabled: !!id,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionData: TransactionForm) => apiClient.createTransaction(transactionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TransactionForm }) =>
      apiClient.updateTransaction(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.transaction(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
};

// Savings Goals hooks
export const useSavingsGoals = () => {
  return useQuery({
    queryKey: queryKeys.savingsGoals,
    queryFn: () => apiClient.getSavingsGoals(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSavingsGoal = (id: number) => {
  return useQuery({
    queryKey: queryKeys.savingsGoal(id),
    queryFn: () => apiClient.getSavingsGoal(id),
    enabled: !!id,
  });
};

export const useCreateSavingsGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalData: SavingsGoalForm) => apiClient.createSavingsGoal(goalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savingsGoals });
    },
  });
};

export const useUpdateSavingsGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SavingsGoalForm> }) =>
      apiClient.updateSavingsGoal(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savingsGoals });
      queryClient.invalidateQueries({ queryKey: queryKeys.savingsGoal(id) });
    },
  });
};

export const useDeleteSavingsGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.deleteSavingsGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savingsGoals });
    },
  });
};

export const useContributeToGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contributionData: GoalContributionInput) => apiClient.contributeToGoal(contributionData),
    onSuccess: (_, { goal_id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savingsGoals });
      queryClient.invalidateQueries({ queryKey: queryKeys.savingsGoal(goal_id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.goalContributions(goal_id) });
    },
  });
};

export const useGoalContributions = (goalId: number) => {
  return useQuery({
    queryKey: queryKeys.goalContributions(goalId),
    queryFn: () => apiClient.getGoalContributions(goalId),
    enabled: !!goalId,
  });
};

// Health check hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.healthCheck(),
    refetchInterval: 30000, // 30 seconds
    staleTime: 10000, // 10 seconds
  });
};