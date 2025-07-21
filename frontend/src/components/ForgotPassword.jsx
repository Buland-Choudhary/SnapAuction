import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import FloatingLabelInput from './FloatingLabelInput';

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-gray-600 mb-4">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or try again.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              setIsSuccess(false);
              setEmail('');
            }}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
          >
            Send Another Email
          </button>
          
          <button
            onClick={onBack}
            className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FloatingLabelInput
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          icon={Mail}
          validation={validateEmail}
          placeholder="Enter your email address"
          required
        />

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
              Sending Reset Link...
            </>
          ) : (
            <>
              Send Reset Link
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
