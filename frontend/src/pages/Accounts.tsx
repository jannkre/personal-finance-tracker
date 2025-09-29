import React from 'react';

const Accounts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-heading">Accounts</h1>
        <button className="btn-primary">Add Account</button>
      </div>

      <div className="card">
        <div className="card-body text-center py-12">
          <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-gray-400 text-xl">🏦</span>
          </div>
          <p className="text-gray-500">Accounts page coming soon!</p>
          <p className="text-sm text-gray-400 mt-1">
            Manage your bank accounts, credit cards, and other financial accounts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Accounts;