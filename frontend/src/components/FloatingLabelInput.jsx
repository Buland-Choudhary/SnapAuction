import { useState, forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const FloatingLabelInput = forwardRef(({
  label,
  type = 'text',
  value = '',
  onChange,
  onBlur,
  placeholder = '',
  error = '',
  success = '',
  required = false,
  disabled = false,
  className = '',
  icon: Icon,
  validation,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const hasValue = value && value.toString().length > 0;
  const isFloating = isFocused || hasValue;
  const actualType = type === 'password' && showPassword ? 'text' : type;

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    setIsDirty(true);
    if (onBlur) onBlur(e);
  };

  const handleChange = (e) => {
    setIsDirty(true);
    if (onChange) onChange(e);
  };

  // Validation state
  const getValidationState = () => {
    if (!isDirty && !error && !success) return 'default';
    if (error) return 'error';
    if (success) return 'success';
    if (validation && hasValue) {
      const isValid = validation(value);
      return isValid ? 'success' : 'error';
    }
    return 'default';
  };

  const validationState = getValidationState();

  const inputClasses = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50',
    success: 'border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50',
  };

  const labelClasses = {
    default: 'text-gray-500',
    error: 'text-red-500',
    success: 'text-green-600',
    focused: 'text-blue-600',
  };

  const getLabelColor = () => {
    if (isFocused) return labelClasses.focused;
    return labelClasses[validationState] || labelClasses.default;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <Icon 
              size={20} 
              className={`${getLabelColor()} transition-colors duration-200`}
            />
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={actualType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={isFocused ? placeholder : ''}
          className={`
            peer w-full px-4 py-4 text-gray-900 bg-transparent border-2 rounded-xl
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-20
            ${Icon ? 'pl-12' : 'pl-4'}
            ${type === 'password' ? 'pr-12' : 'pr-4'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
            ${inputClasses[validationState]}
          `}
          {...props}
        />

        {/* Floating Label */}
        <label
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none select-none font-medium
            ${Icon ? 'left-12' : 'left-4'}
            ${isFloating 
              ? 'top-2 text-xs transform -translate-y-0' 
              : 'top-1/2 text-base transform -translate-y-1/2'
            }
            ${getLabelColor()}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}

        {/* Validation Icon */}
        {(validationState === 'error' || validationState === 'success') && type !== 'password' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {validationState === 'error' ? (
              <AlertCircle size={20} className="text-red-500" />
            ) : (
              <CheckCircle size={20} className="text-green-500" />
            )}
          </div>
        )}
      </div>

      {/* Error/Success Message */}
      {(error || success) && (
        <div className={`mt-2 flex items-center gap-2 text-sm animate-slide-down`}>
          {error ? (
            <>
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <span className="text-red-600">{error}</span>
            </>
          ) : (
            <>
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              <span className="text-green-600">{success}</span>
            </>
          )}
        </div>
      )}

      {/* Helper Text */}
      {!error && !success && placeholder && isFocused && (
        <div className="mt-2 text-sm text-gray-500 animate-slide-down">
          {placeholder}
        </div>
      )}
    </div>
  );
});

FloatingLabelInput.displayName = 'FloatingLabelInput';

export default FloatingLabelInput;
