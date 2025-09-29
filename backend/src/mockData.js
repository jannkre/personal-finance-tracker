// Mock data store
let nextId = 1;
const generateId = () => nextId++;

// User data
export const users = [
  {
    id: 1,
    email: 'demo@example.com',
    password_hash: 'mock_hash', // In a real app, this would be hashed
    first_name: 'Demo',
    last_name: 'User',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

// Accounts data
export const accounts = [
  {
    id: 1,
    user_id: 1,
    name: 'Main Checking',
    type: 'checking',
    balance: 2500.00,
    currency: 'USD',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    user_id: 1,
    name: 'Savings Account',
    type: 'savings',
    balance: 10000.00,
    currency: 'USD',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 3,
    user_id: 1,
    name: 'Credit Card',
    type: 'credit',
    balance: -1200.00,
    currency: 'USD',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

// Categories data
export const categories = [
  {
    id: 1,
    user_id: 1,
    name: 'Salary',
    type: 'income',
    color: '#10B981',
    icon: '💰',
    is_default: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    user_id: 1,
    name: 'Groceries',
    type: 'expense',
    color: '#EF4444',
    icon: '🛒',
    is_default: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 3,
    user_id: 1,
    name: 'Transportation',
    type: 'expense',
    color: '#F59E0B',
    icon: '🚗',
    is_default: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 4,
    user_id: 1,
    name: 'Entertainment',
    type: 'expense',
    color: '#8B5CF6',
    icon: '🎬',
    is_default: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 5,
    user_id: 1,
    name: 'Utilities',
    type: 'expense',
    color: '#06B6D4',
    icon: '⚡',
    is_default: true,
    created_at: '2025-01-01T00:00:00Z'
  }
];

// Transactions data
export const transactions = [
  {
    id: 1,
    user_id: 1,
    account_id: 1,
    category_id: 1,
    amount: 3000.00,
    type: 'income',
    description: 'Monthly salary',
    date: '2025-01-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    user_id: 1,
    account_id: 1,
    category_id: 2,
    amount: 150.00,
    type: 'expense',
    description: 'Weekly grocery shopping',
    date: '2025-01-02',
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z'
  },
  {
    id: 3,
    user_id: 1,
    account_id: 3,
    category_id: 3,
    amount: 45.00,
    type: 'expense',
    description: 'Gas station',
    date: '2025-01-03',
    created_at: '2025-01-03T00:00:00Z',
    updated_at: '2025-01-03T00:00:00Z'
  },
  {
    id: 4,
    user_id: 1,
    account_id: 1,
    category_id: 4,
    amount: 25.00,
    type: 'expense',
    description: 'Movie tickets',
    date: '2025-01-04',
    created_at: '2025-01-04T00:00:00Z',
    updated_at: '2025-01-04T00:00:00Z'
  },
  {
    id: 5,
    user_id: 1,
    account_id: 1,
    category_id: 5,
    amount: 120.00,
    type: 'expense',
    description: 'Electricity bill',
    date: '2025-01-05',
    created_at: '2025-01-05T00:00:00Z',
    updated_at: '2025-01-05T00:00:00Z'
  }
];

// Savings goals data
export const savingsGoals = [
  {
    id: 1,
    user_id: 1,
    name: 'Emergency Fund',
    description: 'Build a 6-month emergency fund',
    target_amount: 15000.00,
    current_amount: 5000.00,
    target_date: '2025-12-31',
    color: '#10B981',
    is_achieved: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    user_id: 1,
    name: 'Vacation',
    description: 'Save for European vacation',
    target_amount: 3000.00,
    current_amount: 1200.00,
    target_date: '2025-06-01',
    color: '#F59E0B',
    is_achieved: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

// Goal contributions data
export const goalContributions = [
  {
    id: 1,
    goal_id: 1,
    transaction_id: null,
    amount: 500.00,
    contribution_date: '2025-01-01',
    description: 'Initial contribution',
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    goal_id: 2,
    transaction_id: null,
    amount: 300.00,
    contribution_date: '2025-01-01',
    description: 'Starting vacation fund',
    created_at: '2025-01-01T00:00:00Z'
  }
];

// Helper functions to manipulate data
export const getNextId = () => nextId++;

export const createEntity = (collection, data) => {
  const entity = {
    id: getNextId(),
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  collection.push(entity);
  return entity;
};

export const updateEntity = (collection, id, data) => {
  const index = collection.findIndex(item => item.id === parseInt(id));
  if (index === -1) return null;
  
  collection[index] = {
    ...collection[index],
    ...data,
    updated_at: new Date().toISOString()
  };
  return collection[index];
};

export const deleteEntity = (collection, id) => {
  const index = collection.findIndex(item => item.id === parseInt(id));
  if (index === -1) return false;
  
  collection.splice(index, 1);
  return true;
};

export const findEntityById = (collection, id) => {
  return collection.find(item => item.id === parseInt(id));
};

export const findEntitiesByUserId = (collection, userId) => {
  return collection.filter(item => item.user_id === parseInt(userId));
};
