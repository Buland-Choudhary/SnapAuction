import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Sparkles, Gavel, Shield } from 'lucide-react';
import FloatingLabelInput from '../components/FloatingLabelInput';
import SocialLogin from '../components/SocialLogin';
import ForgotPassword from '../components/ForgotPassword';

const Login = () => {
  const { login, authError } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: 'alice@example.com',
    password: 'secret123'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);
      setShowSuccess(true);
      
      // Show success message briefly before redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || authError || 'Login failed';
      setErrors({ general: errorMessage });
      console.error('[Login] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    console.log(`Attempting ${provider} login`);
    // Implementation would depend on your social auth setup
    // For now, we'll just show a placeholder
    setErrors({ general: `${provider} login not yet implemented` });
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-4">Login successful. Redirecting to dashboard...</p>
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Sparkle Effects */}
        {[...Array(8)].map((_, i) => (
          <Sparkles 
            key={i}
            className={`absolute text-white/20 animate-pulse`}
            size={Math.random() * 12 + 8}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Gavel className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">SnapAuction</h1>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-blue-200">Sign in to continue bidding on amazing auctions</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            {showForgotPassword ? (
              <ForgotPassword onBack={() => setShowForgotPassword(false)} />
            ) : (
              <>
                {/* Social Login */}
                <div className="mb-6">
                  <SocialLogin onSocialLogin={handleSocialLogin} />
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
                  </div>
                </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-slide-down">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-red-700 text-sm">{errors.general}</span>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <FloatingLabelInput
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                icon={Mail}
                validation={validateEmail}
                placeholder="Enter your email address"
                required
              />

              {/* Password Field */}
              <FloatingLabelInput
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                icon={Lock}
                validation={validatePassword}
                placeholder="Enter your password"
                required
              />

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-lg
                  transition-all duration-300 transform
                  ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
                >
                  Create one now
                </Link>
              </p>
            </div>
            </>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-blue-200 text-sm">
              Secure login protected by industry-standard encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
