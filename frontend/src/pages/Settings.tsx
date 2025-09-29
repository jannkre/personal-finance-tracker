import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-heading">Settings</h1>
      </div>

      <div className="card">
        <div className="card-body text-center py-12">
          <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-gray-400 text-xl">⚙️</span>
          </div>
          <p className="text-gray-500">Settings page coming soon!</p>
          <p className="text-sm text-gray-400 mt-1">
            Configure your preferences and account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;