/**
 * Component for displaying error messages
 */
import { TEXT } from '../lib/constants';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) {
    return null;
  }
  
  return (
    <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded mb-6">
      <p className="font-bold">{TEXT.errorTitle}</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;