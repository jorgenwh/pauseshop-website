/**
 * Reusable empty state component
 */
import { ReactNode } from 'react';
import Button from './Button';

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: {
        label: string;
        onClick: () => void;
        variant?: 'primary' | 'secondary';
    };
    className?: string;
}

const EmptyState = ({ 
    title, 
    description, 
    icon, 
    action, 
    className = '' 
}: EmptyStateProps) => {
    return (
        <div className={`text-center py-8 ${className}`}>
            {icon && (
                <div className="flex justify-center mb-4 text-gray-400">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-medium text-gray-300 mb-2">{title}</h3>
            {description && (
                <p className="text-gray-400 mb-4">{description}</p>
            )}
            {action && (
                <Button 
                    variant={action.variant || 'primary'} 
                    onClick={action.onClick}
                >
                    {action.label}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;