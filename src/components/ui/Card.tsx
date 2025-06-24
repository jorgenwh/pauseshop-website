/**
 * Reusable card container component
 */
import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

const Card = ({ 
    children, 
    className = '', 
    padding = 'md',
    hover = false 
}: CardProps) => {
    const baseClasses = 'bg-gray-800 rounded-lg shadow-md border border-gray-700';
    
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };
    
    const hoverClass = hover ? 'hover:shadow-lg transition-shadow' : '';
    
    const classes = `${baseClasses} ${paddingClasses[padding]} ${hoverClass} ${className}`;
    
    return (
        <div className={classes}>
            {children}
        </div>
    );
};

export default Card;