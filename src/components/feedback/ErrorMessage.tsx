/**
 * Component for displaying error messages
 */
import { TEXT } from '../../lib/constants';

interface ErrorMessageProps {
    message: string | null;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
    if (!message) {
        return null;
    }

    // Split message by colons to separate error type from details
    const parts = message.split(': ');
    const errorType = parts.length > 1 ? parts[0] : TEXT.errorTitle;
    const errorDetails = parts.length > 1 ? parts.slice(1).join(': ') : message;

    return (
        <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded mb-6">
            <p className="font-bold">{errorType}</p>
            <p className="whitespace-pre-wrap">{errorDetails}</p>
        </div>
    );
};

export default ErrorMessage;
