import { useEffect, useRef } from 'react';
import { X, AlertTriangle, CheckCircle, Info, Zap } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = ''
}) => {
  const modalRef = useRef(null);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      // Focus the modal for accessibility
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className={`
          relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl 
          transform transition-all duration-300 animate-slide-up
          ${className}
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default", // default, danger, success, warning
  loading = false,
  icon: CustomIcon
}) => {
  const typeConfig = {
    default: {
      icon: Info,
      confirmBg: 'bg-blue-600 hover:bg-blue-700',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    danger: {
      icon: AlertTriangle,
      confirmBg: 'bg-red-600 hover:bg-red-700',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
    },
    success: {
      icon: CheckCircle,
      confirmBg: 'bg-green-600 hover:bg-green-700',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
    },
    warning: {
      icon: AlertTriangle,
      confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
    },
  };

  const config = typeConfig[type];
  const Icon = CustomIcon || config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        {/* Icon */}
        <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-gray-600 mb-8">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-3 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 flex items-center gap-2 ${config.confirmBg}`}
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const BidConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  bidAmount,
  currentPrice,
  auctionTitle,
  loading = false
}) => {
  const increase = bidAmount - currentPrice;
  const increasePercent = ((increase / currentPrice) * 100).toFixed(1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Confirm Your Bid">
      <div className="space-y-6">
        {/* Auction Info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 mb-2">{auctionTitle}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Current High Bid:</span>
              <div className="font-semibold text-gray-900">${currentPrice.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-gray-600">Your Bid:</span>
              <div className="font-semibold text-blue-600 text-lg">${bidAmount.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Bid Analysis */}
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Bid Analysis</span>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-blue-700">Increase Amount:</span>
              <span className="font-semibold text-blue-900">+${increase.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Increase Percentage:</span>
              <span className="font-semibold text-blue-900">+{increasePercent}%</span>
            </div>
          </div>
        </div>

        {/* Warning */}
        {increase > currentPrice * 0.5 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Large Bid Increase</span>
            </div>
            <p className="text-sm text-yellow-700">
              Your bid is significantly higher than the current price. Please confirm this is intentional.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Place Bid
          </button>
        </div>
      </div>
    </Modal>
  );
};

export { Modal, ConfirmationModal, BidConfirmationModal };
export default Modal;
