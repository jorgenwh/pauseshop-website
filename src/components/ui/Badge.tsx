/**
 * Reusable badge/tag component
 */
import { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    className?: string;
    rounded?: boolean;
}

const Badge = ({ 
    children, 
    variant = 'default', 
    size = 'md',
    className = '',
    rounded = false 
}: BadgeProps) => {
    const baseClasses = 'inline-flex items-center font-medium';
    
    const variantClasses = {
        default: 'bg-gray-600 text-gray-200',
        primary: 'bg-[#30B3A4]/10 text-[#30B3A4] border border-[#30B3A4]/30',
        success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
        danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
        info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    };
    
    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-2'
    };
    
    const roundedClass = rounded ? 'rounded-full' : 'rounded';
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClass} ${className}`;
    
    return (
        <span className={classes}>
            {children}
        </span>
    );
};

export default Badge;