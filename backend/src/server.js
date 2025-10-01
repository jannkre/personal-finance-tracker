import express from 'express';
import { 
  users, 
  accounts, 
  categories, 
  transactions, 
  savingsGoals, 
  goalContributions,
  createEntity,
  updateEntity,
  deleteEntity,
  findEntityById,
  findEntitiesByUserId
} from './mockData.js';
import { authenticateToken, validateId, cors } from './middleware.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'Finance Tracker Mock API is running',
    timestamp: new Date().toISOString()
  });
});

// AUTH ROUTES
app.post('/api/auth/register', (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  
  // Check if user exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User already exists'
    });
  }
  
  // Create new user
  const newUser = createEntity(users, {
    email,
    password_hash: 'mock_hash', // In real app, hash the password
    first_name,
    last_name
  });
  
  res.status(201).json({
    success: true,
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name
      },
      token: 'mock_jwt_token'
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
  
  // In real app, verify password hash
  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      },
      token: 'mock_jwt_token'
    }
  });
});

app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    }
  });
});

app.post('/api/auth/change-password', authenticateToken, (req, res) => {
  const { current_password, new_password } = req.body;
  
  if (!current_password || !new_password) {
    return res.status(400).json({
      success: false,
      error: 'Current password and new password are required'
    });
  }

  if (new_password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'New password must be at least 6 characters long'
    });
  }
  
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  // In real app, verify current password hash
  // For mock, just accept any current password
  
  // Update password hash (in mock, we just update a timestamp)
  user.password_hash = 'new_mock_hash';
  user.updated_at = new Date().toISOString();
  
  res.json({
    success: true,
    data: {
      message: 'Password changed successfully'
    }
  });
});

// ACCOUNT ROUTES
app.get('/api/accounts', authenticateToken, (req, res) => {
  const userAccounts = findEntitiesByUserId(accounts, req.user.userId);
  res.json({
    success: true,
    data: userAccounts
  });
});

app.get('/api/accounts/:id', authenticateToken, validateId, (req, res) => {
  const account = findEntityById(accounts, req.params.id);
  if (!account || account.user_id !== req.user.userId) {
    return res.status(404).json({
      success: false,
      error: 'Account not found'
    });
  }
  
  res.json({
    success: true,
    data: account
  });
});

app.post('/api/accounts', authenticateToken, (req, res) => {
  const { name, type, balance = 0, currency = 'USD' } = req.body;
  
  const newAccount = createEntity(accounts, {
    user_id: req.user.userId,
    name,
    type,
    balance: parseFloat(balance),
    currency,
    is_active: true
  });
  
  res.status(201).json({
    success: true,
    data: newAccount
  });
});

app.put('/api/accounts/:id', authenticateToken, validateId, (req, res) => {
  const account = findEntityById(accounts, req.params.id);
  if (!account || account.user_id !== req.user.userId) {
    return res.status(404).json({
      success: false,
      error: 'Account not found'
    });
  }
  
  const { name, type, balance, currency } = req.body;
  const updatedAccount = updateEntity(accounts, req.params.id, {
    name,
    type,
    balance: balance !== undefined ? parseFloat(balance) : account.balance,
    currency
  });
  
  res.json({
    success: true,
    data: updatedAccount
  });
});

app.delete('/api/accounts/:id', authenticateToken, validateId, (req, res) => {
  const account = findEntityById(accounts, req.params.id);
  if (!account || account.user_id !== req.user.userId) {
    return res.status(404).json({
      success: false,
      error: 'Account not found'
    });
  }
  
  const deleted = deleteEntity(accounts, req.params.id);
  if (deleted) {
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Failed to delete account'
    });
  }
});

// CATEGORY ROUTES
app.get('/api/categories', authenticateToken, (req, res) => {
  const userCategories = findEntitiesByUserId(categories, req.user.userId);
  res.json({
    success: true,
    data: userCategories
  });
});

app.get('/api/categories/:id', authenticateToken, validateId, (req, res) => {
  const category = findEntityById(categories, req.params.id);
  if (!category || category.user_id !== req.user.userId) {
    return res.status(404).json({
      success: false,
      error: 'Category not found'
    });
  }
  
  res.json({
    success: true,
    data: category
  });
});

app.post('/api/categories', authenticateToken, (req, res) => {
  const { name, type, color = '#6B7280', icon } = req.body;
  
  const newCategory = createEntity(categories, {
    user_id: req.user.userId,
    name,
    type,
    color,
    icon,
    is_default: false
  });
  
  res.status(201).json({
    success: true,
    data: newCategory
  });
});

app.put('/api/categories/:id', authenticateToken, validateId, (req, res) => {
  const category = findEntityById(categories, req.params.id);
  if (!category || category.user_id !== req.user.userId) {
    return res.status(404).json({
      success: false,
      error: 'Category not found'
    });
  }
  
  const { name, type, color, icon } = req.body;
  const updatedCategory = updateEntity(categories, req.params.id, {
    name,
    type,
    color,
    icon
  });
  
  res.json({
    success: true,
    data: updatedCategory
  });
});

app.delete('/api/categories/:id', authenticateToken, validateId, (req, res) => {
  const category = findEntityById(categories, req.params.id);
  if (!category || category.user_id !== req.user.userId) {
    return res.status(404).json({
      success: false,
      error: 'Category not found'
    });
  }
  
  const deleted = deleteEntity(categories, req.params.id);
  if (deleted) {
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Failed to delete category'
    });
  }
});

// TRANSACTION ROUTES
app.get('/api/transactions', authenticateToken, (req, res) => {
  let userTransactions = findEntitiesByUserId(transactions, req.user.userId);
  
  // Apply filters if provided
  const { start_date, end_date, account_id, category_id, type } = req.query;
  
  if (start_date) {
    userTransactions = userTransactions.filter(t => t.date >= start_date);
  }
  if (end_date) {
    userTransactions = userTransactions.filter(t => t.date <= end_date);
  }
  if (account_id) {
    userTransactions = userTransactions.filter(t => t.account_id === parseInt(account_id));
  }
  if (category_id) {
    userTransactions = userTransactions.filter(t => t.category_id === parseInt(category_id));
  }
  if (type) {
    userTransactions = userTransactions.filter(t => t.type === type);
  }
  
  // Add related data
  const transactionsWithDetails = userTransactions.map(transaction => {
    const account = findEntityById(accounts, transaction.account_id);
    const category = findEntityById(categories, transaction.category_id);
    
    return {
      ...transaction,
      account_name: account?.name || 'Unknown Account',
      category_name: category?.name || 'Unknown Category',
      category_color: category?.color || '#6B7280',
      category_icon: category?.icon
    };
  });
  
  res.json({
    success: true,
    data: transactionsWithDetails
  });
});

app.get('/api/transactions/:id', authenticateToken, validateId, (req, res) => {
  const transaction = findEntityById(transactions, req.params.id);
  if (!transaction || transaction.user_id !== req.user.userId) {
    return res.status(404).json({
      success: false,
      error: 'Transaction not found'
    });
  }
  
  const account = findEntityById(accounts, transaction.account_id);
  const category = findEntityById(categories, transaction.category_id);
  
  const transactionWithDetails = {
    ...transaction,
    account_name: account?.name || 'Unknown Account',
    category_name: category?.name || 'Unknown Category',
    category_color: category?.color || '#6B7280',
    category_icon: category?.icon
  };
  
  res.json({
    success: true,
    data: transactionWithDetails
  });
});

app.post('/api/transactions', authenticateToken, (req, res) => {
  const { account_id, category_id, amount, type, description, date } = req.body;
  
  // Verify account and category belong to user
  const account = findEntityById(accounts, account_id);
  const category = findEntityById(categories, category_id);
  
  if (!account || account.user_id !== req.user.userId) {
    return res.status(400).json({
      success: false,
      error: 'Invalid account'
    });
  }
  
  if (!category || category.user_id !== req.user.userId) {
    return res.status(400).json({
      success: false,
      error: 'Invalid category'
    });
  }
  
  const newTransaction = createEntity(transactions, {
    user_id: req.user.userId,
    account_id: parseInt(account_id),
    category_id: parseInt(category_id),
    amount: parseFloat(amount),
    type,
    description,
    date
  });
  
  // Update account balance
  if (type === 'income') {
    account.balance += parseFloat(amount);
  } else {
    account.balance -= parseFloat(amount);
  }
  
  res.status(201).json({
    success: true,
    data: {
      ...newTransaction,
      account_name: account.name,
      category_name: category.name,
      category_color: category.color,
      category_icon: category.icon
    }
  });
});

app.put('/api/transactions/:id', authenticateToken, validateId, (req, res) => {
  const transaction = findEntityById(transactions, req.params.id);
  if (!transaction || transaction.user_id !== req.user.userId) {
    return res.status(404).json({
      success: false,
      error: 'Transaction not found'
    });
  }
  
  const { account_id, category_id, amount, type, description, date } = req.body;
  
  // Revert old transaction from account balance
  const oldAccount = findEntityById(accounts, transaction.account_id);
  if (oldAccount) {
    if (transaction.type === 'income') {
      oldAccount.balance -= transaction.amount;
    } else {
      oldAccount.balance += transaction.amount;
    }
  }
  
  const updatedTransaction = updateEntity(transactions, req.params.id, {
    account_id: account_id ? parseInt(account_id) : transaction.account_id,
    category_id: category_id ? parseInt(category_id) : transaction.category_id,
    amount: amount ? parseFloat(amount) : transaction.amount,
    type: type || transaction.type,
    description,
    date
  });
  
  // Apply new transaction to account balance
  const newAccount = findEntityById(accounts, updatedTransaction.account_id);
  if (newAccount) {
    if (updatedTransaction.type === 'income') {
      newAccount.balance += updatedTransaction.amount;
    } else {
      newAccount.balance -= updatedTransaction.amount;
    }
  }
  
  const account = findEntityById(accounts, updatedTransaction.account_id);
  const category = findEntityById(categories, updatedTransaction.category_id);
  
  res.json({
    success: true,
    data: {
      ...updatedTransaction,
      account_name: account?.name || 'Unknown Account',
      category_name: category?.name || 'Unknown Category',
      category_color: category?.color || '#6B7280',
      category_icon: category?.icon
    }
  });
});

app.delete('/api/transactions/:id', authenticateToken, validateId, (req, res) => {
  const transaction = findEntityById(transactions, req.params.id);
  if (!transaction || transaction.user_id !== req.user.userId) {
    return res.status(404).json({
      success: false,
      error: 'Transaction not found'
    });
  }
  
  // Revert transaction from account balance
  const account = findEntityById(accounts, transaction.account_id);
  if (account) {
    if (transaction.type === 'income') {
      account.balance -= transaction.amount;
    } else {
      account.balance += transaction.amount;
    }
  }
  
  const deleted = deleteEntity(transactions, req.params.id);
  if (deleted) {
    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Failed to delete transaction'
    });
  }
});

// SAVINGS GOALS ROUTES
app.get('/api/savings-goals', authenticateToken, (req, res) => {
  const userGoals = findEntitiesByUserId(savingsGoals, req.user.userId);
  res.json({
    success: true,
    data: userGoals
  });
});

app.get('/api/savings-goals/:id', authenticateToken, validateId, (req, res) => {
  const goal = findEntityById(savingsGoals, req.params.id);
  if (!goal || goal.user_id !== req.user.userId) {
    return res.status(404).json({
      success: false,
      error: 'Savings goal not found'
    });
  }
  
  res.json({
    success: true,
    data: goal
  });
});

app.post('/api/savings-goals', authenticateToken, (req, res) => {
  const { name, description, target_amount, target_date, color = '#10B981' } = req.body;
  
  const newGoal = createEntity(savingsGoals, {
    user_id: req.user.userId,
    name,
    description,
    target_amount: parseFloat(target_amount),
    current_amount: 0,
    target_date,
    color,
    is_achieved: false
  });
  
  res.status(201).json({
    success: true,
    data: newGoal
  });
});

app.put('/api/savings-goals/:id', authenticateToken, validateId, (req, res) => {
  const goal = findEntityById(savingsGoals, req.params.id);
  if (!goal || goal.user_id !== req.user.userId) {
    return res.status(404).json({
      success: false,
      error: 'Savings goal not found'
    });
  }
  
  const { name, description, target_amount, target_date, color } = req.body;
  const updatedGoal = updateEntity(savingsGoals, req.params.id, {
    name,
    description,
    target_amount: target_amount ? parseFloat(target_amount) : goal.target_amount,
    target_date,
    color
  });
  
  // Check if goal is achieved
  updatedGoal.is_achieved = updatedGoal.current_amount >= updatedGoal.target_amount;
  
  res.json({
    success: true,
    data: updatedGoal
  });
});

app.delete('/api/savings-goals/:id', authenticateToken, validateId, (req, res) => {
  const goal = findEntityById(savingsGoals, req.params.id);
  if (!goal || goal.user_id !== req.user.userId) {
    return res.status(404).json({
      success: false,
      error: 'Savings goal not found'
    });
  }
  
  const deleted = deleteEntity(savingsGoals, req.params.id);
  if (deleted) {
    res.json({
      success: true,
      message: 'Savings goal deleted successfully'
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Failed to delete savings goal'
    });
  }
});

app.post('/api/savings-goals/contribute', authenticateToken, (req, res) => {
  const { goal_id, amount, contribution_date, description } = req.body;
  
  const goal = findEntityById(savingsGoals, goal_id);
  if (!goal || goal.user_id !== req.user.userId) {
    return res.status(400).json({
      success: false,
      error: 'Invalid savings goal'
    });
  }
  
  const contribution = createEntity(goalContributions, {
    goal_id: parseInt(goal_id),
    transaction_id: null,
    amount: parseFloat(amount),
    contribution_date,
    description
  });
  
  // Update goal current amount
  goal.current_amount += parseFloat(amount);
  goal.is_achieved = goal.current_amount >= goal.target_amount;
  goal.updated_at = new Date().toISOString();
  
  res.status(201).json({
    success: true,
    data: contribution
  });
});

app.get('/api/savings-goals/:id/contributions', authenticateToken, validateId, (req, res) => {
  const goal = findEntityById(savingsGoals, req.params.id);
  if (!goal || goal.user_id !== req.user.userId) {
    return res.status(404).json({
      success: false,
      error: 'Savings goal not found'
    });
  }
  
  const contributions = goalContributions.filter(c => c.goal_id === parseInt(req.params.id));
  res.json({
    success: true,
    data: contributions
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock Finance Tracker API running on port ${PORT}`);
  console.log(`📊 Ready to serve mock data`);
});

export default app;
