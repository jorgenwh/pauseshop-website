/**
 * Component for action buttons (cancel and analyze)
 */
import { TEXT } from '../../lib/constants';
import Button from './Button';
import Icon from './Icon';

interface ActionButtonsProps {
    onCancel: () => void;
    onAnalyze: () => void;
    isLoading: boolean;
}

const ActionButtons = ({ onCancel, onAnalyze, isLoading }: ActionButtonsProps) => {
    return (
        <div className="flex justify-end space-x-3">
            <Button
                onClick={onCancel}
                variant="secondary"
                disabled={isLoading}
            >
                <Icon name="close" className="mr-1" />
                {TEXT.cancelButton}
            </Button>
            <Button
                onClick={onAnalyze}
                variant="primary"
                loading={isLoading}
                disabled={isLoading}
            >
                {!isLoading && <Icon name="plus" className="mr-1" />}
                {isLoading ? TEXT.processingText : TEXT.analyzeButton}
            </Button>
        </div>
    );
};

export default ActionButtons;
