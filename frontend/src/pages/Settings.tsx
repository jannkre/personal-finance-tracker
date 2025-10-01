import React from 'react';
import ChangePasswordForm from '../components/ChangePasswordForm';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-heading">Settings</h1>
      </div>

      <ChangePasswordForm />
    </div>
  );
};

export default Settings;