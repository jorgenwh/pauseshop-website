/**
 * Component for displaying keyboard shortcuts
 */

interface KeyboardKeyProps {
    keys: string;
    className?: string;
}

const KeyboardKey = ({ keys, className = '' }: KeyboardKeyProps) => {
    return (
        <span className={`bg-gray-600 px-1.5 py-0.5 rounded text-xs mr-1 font-mono ${className}`}>
            {keys}
        </span>
    );
};

export default KeyboardKey;