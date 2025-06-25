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
            <h1 className="text-4xl font-bold mb-2">
                <span className="text-white">Pause</span>
                <span className="text-[#30B3A4]">Shop</span>
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