/**
 * Reusable app header/logo component
 */

interface AppHeaderProps {
    subtitle?: string;
    className?: string;
}

const AppHeader = ({ subtitle, className = "" }: AppHeaderProps) => {
    return (
        <div className={`text-center ${className}`}>
            <h1 className="mb-2" style={{ fontSize: '50px', lineHeight: 1 }}>
                <span className="font-black" style={{ color: 'rgba(190, 190, 190, 1)' }}>Pause</span>
                <span className="font-normal" style={{ color: '#30B3A4' }}>Shop</span>
            </h1>
            {subtitle && (
                <p className="text-gray-400 max-w-lg mx-auto">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default AppHeader;