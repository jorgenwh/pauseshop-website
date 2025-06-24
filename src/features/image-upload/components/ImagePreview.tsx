/**
 * Component to display a preview of the uploaded image
 */
import { Icon } from '../../../components/ui';

interface ImagePreviewProps {
    imageUrl: string;
    onRemove: () => void;
}

const ImagePreview = ({ imageUrl, onRemove }: ImagePreviewProps) => {
    return (
        <div className="relative">
            <div className="max-h-[400px] overflow-hidden flex items-center justify-center rounded-lg shadow-md bg-gray-700">
                <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-w-full max-h-[400px] object-contain"
                />
            </div>
            <button
                onClick={onRemove}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                aria-label="Remove image"
            >
                <Icon name="close" />
            </button>
        </div>
    );
};

export default ImagePreview;
