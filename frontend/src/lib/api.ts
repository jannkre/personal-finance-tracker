import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ApiResponse,
  AuthResponse,
  LoginForm,
  RegisterForm,
  User,
  Account,
  Category,
  Transaction,
  TransactionWithDetails,
  SavingsGoal,
  TransactionForm,
  AccountForm,
  CategoryForm,
  SavingsGoalForm,
  GoalContribution,
  GoalContributionInput
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Helper method to handle API responses
  private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
    if (!response.data.success) {
      throw new Error(response.data.error || 'API request failed');
    }
    return response.data.data as T;
  }

  // Authentication
  async login(credentials: LoginForm): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    const authData = this.handleResponse(response);
    localStorage.setItem('auth_token', authData.token);
    return authData;
  }

  async register(userData: RegisterForm): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    const authData = this.handleResponse(response);
    localStorage.setItem('auth_token', authData.token);
    return authData;
  }

  async getProfile(): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>('/auth/profile');
    return this.handleResponse(response);
  }

  async changePassword(passwordData: { current_password: string; new_password: string }): Promise<{ message: string }> {
    const response = await this.client.post<ApiResponse<{ message: string }>>('/auth/change-password', passwordData);
    return this.handleResponse(response);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  }

  // Accounts
  async getAccounts(): Promise<Account[]> {
    const response = await this.client.get<ApiResponse<Account[]>>('/accounts');
    return this.handleResponse(response);
  }

  async getAccount(id: number): Promise<Account> {
    const response = await this.client.get<ApiResponse<Account>>(`/accounts/${id}`);
    return this.handleResponse(response);
  }

  async createAccount(accountData: AccountForm): Promise<Account> {
    const response = await this.client.post<ApiResponse<Account>>('/accounts', accountData);
    return this.handleResponse(response);
  }

  async updateAccount(id: number, accountData: Partial<AccountForm>): Promise<Account> {
    const response = await this.client.put<ApiResponse<Account>>(`/accounts/${id}`, accountData);
    return this.handleResponse(response);
  }

  async deleteAccount(id: number): Promise<void> {
    const response = await this.client.delete<ApiResponse<void>>(`/accounts/${id}`);
    this.handleResponse(response);
  }

  // Categories
  async getCategories(type?: 'income' | 'expense'): Promise<Category[]> {
    const params = type ? { type } : {};
    const response = await this.client.get<ApiResponse<Category[]>>('/categories', { params });
    return this.handleResponse(response);
  }

  async getCategory(id: number): Promise<Category> {
    const response = await this.client.get<ApiResponse<Category>>(`/categories/${id}`);
    return this.handleResponse(response);
  }

  async createCategory(categoryData: CategoryForm): Promise<Category> {
    const response = await this.client.post<ApiResponse<Category>>('/categories', categoryData);
    return this.handleResponse(response);
  }

  async updateCategory(id: number, categoryData: Partial<CategoryForm>): Promise<Category> {
    const response = await this.client.put<ApiResponse<Category>>(`/categories/${id}`, categoryData);
    return this.handleResponse(response);
  }

  async deleteCategory(id: number): Promise<void> {
    const response = await this.client.delete<ApiResponse<void>>(`/categories/${id}`);
    this.handleResponse(response);
  }

  // Transactions
  async getTransactions(params?: {
    start_date?: string;
    end_date?: string;
    category_id?: number;
    account_id?: number;
    type?: 'income' | 'expense';
    limit?: number;
    offset?: number;
  }): Promise<TransactionWithDetails[]> {
    const response = await this.client.get<ApiResponse<TransactionWithDetails[]>>('/transactions', { params });
    return this.handleResponse(response);
  }

  async getTransaction(id: number): Promise<TransactionWithDetails> {
    const response = await this.client.get<ApiResponse<TransactionWithDetails>>(`/transactions/${id}`);
    return this.handleResponse(response);
  }

  async createTransaction(transactionData: TransactionForm): Promise<TransactionWithDetails> {
    const response = await this.client.post<ApiResponse<TransactionWithDetails>>('/transactions', transactionData);
    return this.handleResponse(response);
  }

  async updateTransaction(id: number, transactionData: TransactionForm): Promise<TransactionWithDetails> {
    const response = await this.client.put<ApiResponse<TransactionWithDetails>>(`/transactions/${id}`, transactionData);
    return this.handleResponse(response);
  }

  async deleteTransaction(id: number): Promise<void> {
    const response = await this.client.delete<ApiResponse<void>>(`/transactions/${id}`);
    this.handleResponse(response);
  }

  // Savings Goals
  async getSavingsGoals(): Promise<SavingsGoal[]> {
    const response = await this.client.get<ApiResponse<SavingsGoal[]>>('/savings-goals');
    return this.handleResponse(response);
  }

  async getSavingsGoal(id: number): Promise<SavingsGoal> {
    const response = await this.client.get<ApiResponse<SavingsGoal>>(`/savings-goals/${id}`);
    return this.handleResponse(response);
  }

  async createSavingsGoal(goalData: SavingsGoalForm): Promise<SavingsGoal> {
    const payload = {
      ...goalData,
      target_amount: Number(goalData.target_amount)
    };
    const response = await this.client.post<ApiResponse<SavingsGoal>>('/savings-goals', payload);
    return this.handleResponse(response);
  }

  async updateSavingsGoal(id: number, goalData: Partial<SavingsGoalForm>): Promise<SavingsGoal> {
    const payload = {
      ...goalData,
      target_amount: goalData.target_amount ? Number(goalData.target_amount) : undefined
    };
    const response = await this.client.put<ApiResponse<SavingsGoal>>(`/savings-goals/${id}`, payload);
    return this.handleResponse(response);
  }

  async deleteSavingsGoal(id: number): Promise<void> {
    const response = await this.client.delete<ApiResponse<void>>(`/savings-goals/${id}`);
    this.handleResponse(response);
  }

  async contributeToGoal(contributionData: GoalContributionInput): Promise<SavingsGoal> {
    const response = await this.client.post<ApiResponse<SavingsGoal>>('/savings-goals/contribute', contributionData);
    return this.handleResponse(response);
  }

  async getGoalContributions(goalId: number): Promise<GoalContribution[]> {
    const response = await this.client.get<ApiResponse<GoalContribution[]>>(`/savings-goals/${goalId}/contributions`);
    return this.handleResponse(response);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string; timestamp: string }> {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export const apiClient = new ApiClient();