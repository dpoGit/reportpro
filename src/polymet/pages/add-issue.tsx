import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { useTheme } from 'next-themes';
import CameraCapture from '../components/AutoAudit/components/CameraCapture';
import AnalysisReport from '../components/AutoAudit/components/AnalysisReport';
import IssueForm from '../components/AutoAudit/components/IssueForm';
import SupportingImages from '../components/AutoAudit/components/SupportingImages';
import { analyzeSnagImage } from '../components/AutoAudit/services/geminiService';
import { IssueFormData, IssuePriority, IssueStatus, SnagItem, BOX_COLORS } from '../components/AutoAudit/types';
import { CheckCircle2 } from 'lucide-react';

export default function AddIssuePage() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    // const { theme } = useTheme();

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [supportingImages, setSupportingImages] = useState<(string | null)[]>([null, null, null, null]);
    const [analysisText, setAnalysisText] = useState<string>('');
    const [snagItems, setSnagItems] = useState<SnagItem[]>([]);
    // History state for undo/redo
    const [pastSnagItems, setPastSnagItems] = useState<SnagItem[][]>([]);
    const [futureSnagItems, setFutureSnagItems] = useState<SnagItem[][]>([]);

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const [formData, setFormData] = useState<IssueFormData>({
        location: '',
        assignee: '',
        priority: IssuePriority.MEDIUM,
        status: IssueStatus.OPEN,
        notes: '',
    });

    const handleImageSelected = (base64: string) => {
        setSelectedImage(base64);
        setSupportingImages([null, null, null, null]); // Reset supporting images on new main image
        setAnalysisText('');
        setSnagItems([]);
        setPastSnagItems([]);
        setFutureSnagItems([]);
    };

    const handleSupportingImageUpdate = (index: number, base64: string | null) => {
        setSupportingImages(prev => {
            const newImages = [...prev];
            newImages[index] = base64;
            return newImages;
        });
    };

    const handleScan = async () => {
        if (!selectedImage) return;

        setIsAnalyzing(true);
        setAnalysisText('Analyzing image with Gemini Vision...');
        setSnagItems([]);
        setPastSnagItems([]);
        setFutureSnagItems([]);

        try {
            const result = await analyzeSnagImage(selectedImage);

            const coloredItems = result.identified_issues.map((item, index) => ({
                ...item,
                color: BOX_COLORS[index % BOX_COLORS.length]
            }));

            setAnalysisText(result.analysis_report);
            setSnagItems(coloredItems);

            if (!formData.notes) {
                setFormData(prev => ({ ...prev, notes: result.analysis_report }));
            }

        } catch (error) {
            setAnalysisText('Error analyzing image. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleUpdateSnagItem = (index: number, updates: Partial<SnagItem>) => {
        // Push current state to past before updating
        setPastSnagItems(prev => [...prev, snagItems]);
        // Clear future because we branched off
        setFutureSnagItems([]);

        setSnagItems(prevItems => {
            const newItems = [...prevItems];
            newItems[index] = { ...newItems[index], ...updates };
            return newItems;
        });
    };

    const handleDeleteSnagItem = (index: number) => {
        // Push current state to past before deleting
        setPastSnagItems(prev => [...prev, snagItems]);
        // Clear future because we branched off
        setFutureSnagItems([]);

        setSnagItems(prevItems => prevItems.filter((_, i) => i !== index));
    };

    const handleUndo = () => {
        if (pastSnagItems.length === 0) return;

        const previous = pastSnagItems[pastSnagItems.length - 1];
        const newPast = pastSnagItems.slice(0, -1);

        setFutureSnagItems(prev => [snagItems, ...prev]);
        setPastSnagItems(newPast);
        setSnagItems(previous);
    };

    const handleRedo = () => {
        if (futureSnagItems.length === 0) return;

        const next = futureSnagItems[0];
        const newFuture = futureSnagItems.slice(1);

        setPastSnagItems(prev => [...prev, snagItems]);
        setFutureSnagItems(newFuture);
        setSnagItems(next);
    };

    const handleFormChange = (field: keyof IssueFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCancel = () => {
        navigate(`/project/${projectId}`);
    };

    const handleCreateIssue = () => {
        console.log('Issue Created:', {
            ...formData,
            image: selectedImage ? 'Image attached' : 'No image',
            supportingImages: supportingImages.filter(img => img !== null).length,
            report: analysisText,
            detectedItems: snagItems
        });

        setShowSuccessToast(true);
        setTimeout(() => {
            setShowSuccessToast(false);
            handleCancel();
        }, 2000);
    };

    return (
        // Main Container
        // Adjusted height to fit within layout (assuming layout has header)
        <div className="h-[calc(100vh-8rem)] w-full flex flex-col md:flex-row md:overflow-hidden bg-white dark:bg-[#0B1120] text-slate-900 dark:text-gray-100 transition-colors duration-300 rounded-xl border border-neutral-200 dark:border-slate-800 shadow-sm">

            {/* LEFT PANEL: Camera / Image Display */}
            <div className="relative shrink-0 w-full h-[40vh] min-h-[400px] md:h-full md:flex-1 bg-black flex flex-col overflow-hidden border-b border-white/10 md:border-b-0 md:border-r">

                {/* Camera Capture - Fills available space */}
                <div className="flex-1 min-h-0 relative">
                    <CameraCapture
                        onImageSelected={handleImageSelected}
                        selectedImage={selectedImage}
                        snagItems={snagItems}
                    />
                </div>

                {/* Supporting Images - Fixed at bottom of left panel */}
                <div className="shrink-0 bg-slate-50 dark:bg-[#0B1120] border-t border-slate-200 dark:border-slate-800 z-20">
                    <SupportingImages
                        images={supportingImages}
                        onUpdate={handleSupportingImageUpdate}
                    />
                </div>
            </div>

            {/* RIGHT PANEL: Sidebar (Report & Form) */}
            <div className="flex-1 w-full md:w-[420px] lg:w-[480px] md:h-full bg-white dark:bg-[#0B1120] shadow-2xl z-20 flex flex-col relative">
                <div className="flex-1 md:overflow-y-auto custom-scrollbar">
                    <AnalysisReport
                        reportText={analysisText}
                        snagItems={snagItems}
                        isAnalyzing={isAnalyzing}
                        onScan={handleScan}
                        canScan={!!selectedImage}
                        onUpdateSnagItem={handleUpdateSnagItem}
                        onDeleteSnagItem={handleDeleteSnagItem}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        canUndo={pastSnagItems.length > 0}
                        canRedo={futureSnagItems.length > 0}
                    />

                    <IssueForm
                        formData={formData}
                        onChange={handleFormChange}
                        onSubmit={handleCreateIssue}
                        onCancel={handleCancel}
                    />
                </div>
            </div>

            {/* Success Toast */}
            {showSuccessToast && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-max pointer-events-none">
                    <div className="bg-white dark:bg-neutral-800 border border-amber-500 text-slate-800 dark:text-white px-8 py-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex flex-col items-center gap-4 animate-bounce-in">
                        <CheckCircle2 className="text-green-500 w-14 h-14" />
                        <span className="font-bold text-xl tracking-tight">Issue Logged Successfully</span>
                    </div>
                </div>
            )}
        </div>
    );
}
