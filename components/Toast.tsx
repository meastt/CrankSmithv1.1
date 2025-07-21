import React, { useState, useEffect } from 'react';
import { Toast, ToastType, ToastAPI, ToastAction } from '../types';

let toastId = 0;
const toastStack: Toast[] = [];
let toastListener: ((toasts: Toast[]) => void) | null = null;

export const toast: ToastAPI = {
  success: (message: string, duration = 4000) => {
    showToast({ type: 'success', message, duration });
  },
  error: (message: string, duration = 6000) => {
    showToast({ type: 'error', message, duration });
  },
  warning: (message: string, duration = 5000) => {
    showToast({ type: 'warning', message, duration });
  },
  info: (message: string, duration = 4000) => {
    showToast({ type: 'info', message, duration });
  }
};

function showToast({ type, message, duration, actions }: { 
  type: ToastType; 
  message: string; 
  duration: number; 
  actions?: ToastAction[] 
}): void {
  const id = ++toastId;
  const newToast: Toast = { id, type, message, duration, actions };
  
  toastStack.push(newToast);
  
  if (toastListener) {
    toastListener([...toastStack]);
  }
  
  // Auto remove after duration (but not if there are actions)
  if (!actions || actions.length === 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  } else {
    // For toasts with actions, auto-remove after a longer duration
    setTimeout(() => {
      removeToast(id);
    }, duration * 2);
  }
}

function removeToast(id: number): void {
  const index = toastStack.findIndex(toast => toast.id === id);
  if (index > -1) {
    toastStack.splice(index, 1);
    if (toastListener) {
      toastListener([...toastStack]);
    }
  }
}

export function ToastContainer(): JSX.Element | null {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    toastListener = setToasts;
    setToasts([...toastStack]);

    // Listen for custom mobile suggestion events
    const handleMobileSuggestion = (event: CustomEvent) => {
      const { message, type, duration, actions } = event.detail;
      showToast({ type, message, duration, actions });
    };

    window.addEventListener('show-mobile-suggestion', handleMobileSuggestion as EventListener);
    
    return () => {
      toastListener = null;
      window.removeEventListener('show-mobile-suggestion', handleMobileSuggestion as EventListener);
    };
  }, []);

  // Don't render until mounted to prevent hydration issues
  if (!mounted) return null;
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = (): void => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  const typeStyles = {
    success: {
      bg: 'bg-green-500/10 border-green-500/30',
      icon: '✓',
      iconColor: 'text-green-500'
    },
    error: {
      bg: 'bg-red-500/10 border-red-500/30',
      icon: '✕',
      iconColor: 'text-red-500'
    },
    warning: {
      bg: 'bg-yellow-500/10 border-yellow-500/30',
      icon: '⚠',
      iconColor: 'text-yellow-500'
    },
    info: {
      bg: 'bg-blue-500/10 border-blue-500/30',
      icon: 'ℹ',
      iconColor: 'text-blue-500'
    }
  };

  const style = typeStyles[toast.type] || typeStyles.info;

  // Don't render until mounted to prevent hydration issues
  if (!mounted) return null;

  return (
    <div
      className={`
        ${style.bg} border backdrop-blur-sm rounded-lg p-4 shadow-lg
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`${style.iconColor} font-bold text-lg leading-none mt-0.5`}>
          {style.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[var(--text-primary)] break-words">
            {toast.message}
          </p>
          {toast.actions && toast.actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {toast.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    handleClose();
                  }}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-md transition-colors
                    ${action.variant === 'primary' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-neutral-200 dark:bg-neutral-700 text-[var(--text-primary)] hover:bg-neutral-300 dark:hover:bg-neutral-600'
                    }
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleClose}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}