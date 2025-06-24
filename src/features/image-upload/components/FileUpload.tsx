import { ChangeEvent, DragEvent, useCallback, useState } from 'react';
import { isImageFile } from '../../../lib/utils';
import { Icon } from '../../../components/ui';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    disabled?: boolean;
}

const FileUpload = ({ onFileSelect, disabled = false }: FileUploadProps) => {
    const [isDragging, setIsDragging] = useState(false);

    // Handle drag over event
    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    }, [disabled]);

    // Handle drag leave event
    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Handle drop event
    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (!isImageFile(file)) {
                alert('Please upload a PNG or JPG/JPEG file only.');
                return;
            }
            
            onFileSelect(file);
        }
    }, [onFileSelect, disabled]);

    // Handle file input change
    const handleFileInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (!isImageFile(file)) {
                alert('Please upload a PNG or JPG/JPEG file only.');
                return;
            }
            
            onFileSelect(file);
        }
    }, [onFileSelect, disabled]);

    return (
        <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-[#30B3A4] bg-[#30B3A4]/5' : 'border-gray-600 hover:border-gray-500'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !disabled && document.getElementById('fileInput')?.click()}
        >
            <input
                id="fileInput"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleFileInputChange}
                disabled={disabled}
            />
            <div className="flex flex-col items-center justify-center">
                <Icon name="upload" className="text-gray-300 mb-4" size={48} />
                <p className="text-lg font-medium text-gray-200">
                    {isDragging ? 'Drop the image here' : 'Drag and drop an image, or click to browse'}
                </p>
                <p className="text-sm text-gray-400 mt-2">PNG and JPG/JPEG files only (auto-compressed if needed)</p>
            </div>
        </div>
    );
};

export default FileUpload;
