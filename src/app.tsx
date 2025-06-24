import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import { useImageProcessing } from './features/image-upload';

const App = () => {
    const {
        isLoading,
        error,
        products,
        previewUrl,
        analysisCompleted,
        handleFileSelect,
        processImage,
        reset
    } = useImageProcessing();

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <Router>
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <UploadPage 
                                isLoading={isLoading}
                                error={error}
                                previewUrl={previewUrl}
                                analysisCompleted={analysisCompleted}
                                handleFileSelect={handleFileSelect}
                                processImage={processImage}
                                reset={reset}
                            />
                        } 
                    />
                    <Route 
                        path="/results" 
                        element={
                            <ResultsPage 
                                imageUrl={previewUrl}
                                products={products}
                                onReset={reset}
                            />
                        } 
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
