/**
 * Reusable button component with different variants
 */
import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;
}

const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className = '',
    type = 'button',
    fullWidth = false
}: ButtonProps) => {
    const baseClasses = 'font-medium rounded-md transition-colors flex items-center justify-center';
    
    const variantClasses = {
        primary: disabled || loading 
            ? 'bg-[#30B3A4]/70 text-white cursor-not-allowed' 
            : 'bg-[#30B3A4] hover:bg-[#30B3A4]/80 text-white',
        secondary: disabled || loading 
            ? 'bg-gray-700/70 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-700 hover:bg-gray-600 text-gray-200',
        danger: disabled || loading 
            ? 'bg-red-500/70 text-white cursor-not-allowed' 
            : 'bg-red-500 hover:bg-red-600 text-white',
        ghost: disabled || loading 
            ? 'text-gray-500 cursor-not-allowed' 
            : 'text-[#30B3A4] hover:text-[#30B3A4]/80 hover:bg-[#30B3A4]/10'
    };
    
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg'
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;
    
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={classes}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;