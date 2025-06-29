/**
 * Component to display a preview of the uploaded image
 */

interface ImagePreviewProps {
    imageUrl: string;
}

const ImagePreview = ({ imageUrl }: ImagePreviewProps) => {
    return (
        <div className="relative">
            <div className="max-h-[400px] overflow-hidden flex items-center justify-center rounded-lg shadow-md bg-gray-700">
                <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-w-full max-h-[400px] object-contain"
                />
            </div>
        </div>
    );
};

export default ImagePreview;
