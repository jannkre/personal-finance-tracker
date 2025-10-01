import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import LoadingSpinner from '../components/LoadingSpinner';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const loginMutation = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasUserInteracted(true);
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent automatic submission from browser autofill
    if (!hasUserInteracted) {
      console.log('Form submission prevented - no user interaction detected');
      return;
    }

    if (!validateForm()) {
      return;
    }

    loginMutation.mutate(formData, {
      onSuccess: (data) => {
        setUser(data.user);
        navigate('/dashboard');
      },
      onError: (error: any) => {
        setErrors({
          submit: error.message || 'Login failed. Please try again.',
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
            <span className="text-2xl">💰</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyDown={() => setHasUserInteracted(true)}
                  onFocus={() => setHasUserInteracted(true)}
                  className={errors.email ? 'border-danger-300 focus-visible:ring-danger-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-danger-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyDown={() => setHasUserInteracted(true)}
                  onFocus={() => setHasUserInteracted(true)}
                  className={errors.password ? 'border-danger-300 focus-visible:ring-danger-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-danger-600">{errors.password}</p>
                )}
              </div>

              {errors.submit && (
                <div className="rounded-md bg-danger-50 p-4">
                  <p className="text-sm text-danger-700">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full"
                onClick={() => setHasUserInteracted(true)}
              >
                {loginMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Demo credentials: demo@example.com / password123
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;