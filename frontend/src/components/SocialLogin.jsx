import { useState } from 'react';
import { Mail, Chrome, Github, Facebook, Apple, Loader2 } from 'lucide-react';

const SocialLoginButton = ({ 
  provider, 
  onClick, 
  disabled = false, 
  loading = false 
}) => {
  const providers = {
    google: {
      icon: Chrome,
      label: 'Continue with Google',
      bgColor: 'bg-white hover:bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300',
    },
    facebook: {
      icon: Facebook,
      label: 'Continue with Facebook',
      bgColor: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white',
      borderColor: 'border-blue-600',
    },
    github: {
      icon: Github,
      label: 'Continue with GitHub',
      bgColor: 'bg-gray-900 hover:bg-gray-800',
      textColor: 'text-white',
      borderColor: 'border-gray-900',
    },
    apple: {
      icon: Apple,
      label: 'Continue with Apple',
      bgColor: 'bg-black hover:bg-gray-900',
      textColor: 'text-white',
      borderColor: 'border-black',
    },
    email: {
      icon: Mail,
      label: 'Continue with Email',
      bgColor: 'bg-gray-100 hover:bg-gray-200',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300',
    },
  };

  const config = providers[provider];
  const Icon = config.icon;

  return (
    <button
      onClick={() => !disabled && !loading && onClick(provider)}
      disabled={disabled || loading}
      className={`
        w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl 
        border-2 font-medium transition-all duration-200 
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${disabled || loading 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-[1.02] hover:shadow-md active:scale-[0.98]'
        }
      `}
    >
      {loading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <Icon size={20} />
      )}
      <span>{config.label}</span>
    </button>
  );
};

const SocialLogin = ({ onSocialLogin, className = '' }) => {
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleSocialLogin = async (provider) => {
    setLoadingProvider(provider);
    try {
      await onSocialLogin(provider);
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <SocialLoginButton
        provider="google"
        onClick={handleSocialLogin}
        loading={loadingProvider === 'google'}
      />
      <SocialLoginButton
        provider="facebook"
        onClick={handleSocialLogin}
        loading={loadingProvider === 'facebook'}
      />
      <SocialLoginButton
        provider="github"
        onClick={handleSocialLogin}
        loading={loadingProvider === 'github'}
      />
      <SocialLoginButton
        provider="apple"
        onClick={handleSocialLogin}
        loading={loadingProvider === 'apple'}
      />
    </div>
  );
};

export { SocialLoginButton, SocialLogin };
export default SocialLogin;
