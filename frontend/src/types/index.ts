// API Types matching backend
export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Account {
  id: number;
  user_id: number;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  user_id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
  is_default: boolean;
  created_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  account_id: number;
  category_id: number;
  amount: number;
  type: 'income' | 'expense';
  description?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionWithDetails extends Transaction {
  account_name: string;
  category_name: string;
  category_color: string;
  category_icon?: string;
}

export interface SavingsGoal {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  color: string;
  is_achieved: boolean;
  created_at: string;
  updated_at: string;
}

export interface GoalContribution {
  id: number;
  goal_id: number;
  transaction_id?: number;
  amount: number;
  contribution_date: string;
  description?: string;
  created_at: string;
}

export interface GoalContributionInput {
  goal_id: number;
  amount: number;
  contribution_date: string;
  description?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface TransactionForm {
  account_id: number;
  category_id: number;
  amount: string;
  type: 'income' | 'expense';
  description?: string;
  date: string;
}

export interface AccountForm {
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance?: string;
  currency?: string;
}

export interface CategoryForm {
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
}

export interface SavingsGoalForm {
  name: string;
  description?: string;
  target_amount: string;
  target_date?: string;
  color?: string;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface CategoryBreakdown {
  category_id: number;
  category_name: string;
  category_color: string;
  category_icon?: string;
  total_amount: number;
  transaction_count: number;
  percentage: number;
}

// Dashboard types
export interface DashboardSummary {
  total_income: number;
  total_expenses: number;
  net_income: number;
  savings_rate: number;
  total_savings_goals: number;
  achieved_goals: number;
}

// UI component types
export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  current?: boolean;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface SelectOption {
  value: string | number;
  label: string;
  color?: string;
  icon?: string;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FilterOptions {
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  accountId?: number;
  type?: 'income' | 'expense';
}