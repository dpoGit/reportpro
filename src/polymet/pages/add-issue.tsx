import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { useTheme } from 'next-themes';
import CameraCapture from '../components/AutoAudit/components/CameraCapture';
import AnalysisReport from '../components/AutoAudit/components/AnalysisReport';
import IssueForm from '../components/AutoAudit/components/IssueForm';
import SupportingImages from '../components/AutoAudit/components/SupportingImages';
import { analyzeSnagImage } from '../components/AutoAudit/services/geminiService';
import { IssueFormData, IssuePriority, IssueStatus, SnagItem, BOX_COLORS } from '../components/AutoAudit/types';
import { CheckCircle2, ScanSearch, Loader2 } from 'lucide-react';
import { addIssueToProject, Issue, Project } from '../data/site-audit-data';

interface AddIssuePageProps {
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

export default function AddIssuePage({ projects, setProjects }: AddIssuePageProps) {
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
        if (!projectId) return;

        const newIssue: Issue = {
            id: `issue-${Date.now()}`,
            title: formData.location || 'New Issue',
            description: formData.notes || analysisText || 'No description provided.',
            status: formData.status === IssueStatus.CLOSED ? 'resolved' :
                formData.status === IssueStatus.IN_PROGRESS ? 'in-progress' : 'open',
            category: 'General',
            assignee: { name: formData.assignee || 'Unassigned' },
            createdAt: new Date().toISOString(),
            images: [],
            priority: (formData.priority === IssuePriority.CRITICAL ? 'high' : formData.priority.toLowerCase()) as "low" | "medium" | "high",
        };

        // Add main image with bounding boxes
        if (selectedImage) {
            newIssue.images.push({
                url: selectedImage,
                caption: 'Main Image',
                boundingBoxes: snagItems.map(item => ({
                    box_2d: item.box_2d,
                    label: item.label,
                    description: item.description,
                    color: item.color
                }))
            });
        }

        // Add supporting images
        supportingImages.forEach((img, index) => {
            if (img) {
                newIssue.images.push({
                    url: img,
                    caption: `Supporting Image ${index + 1}`
                });
            }
        });

        // Update global state
        setProjects(prevProjects => prevProjects.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    issues: [newIssue, ...p.issues],
                    issueCount: (p.issueCount || 0) + 1
                };
            }
            return p;
        }));

        addIssueToProject(projectId, newIssue);

        setShowSuccessToast(true);
        setTimeout(() => {
            setShowSuccessToast(false);
            navigate(`/project/${projectId}`);
        }, 2000);
    };

    return (
        // Main Container
        // Adjusted height to fit within layout (assuming layout has header)
        <div className="h-[calc(100vh-8rem)] w-full flex flex-col md:flex-row md:overflow-hidden bg-white dark:bg-background text-slate-900 dark:text-gray-100 transition-colors duration-300 rounded-xl border border-neutral-200 dark:border-slate-800 shadow-sm">

            {/* LEFT PANEL: Camera / Image Display */}
            <div className="relative shrink-0 w-full h-[40vh] min-h-[400px] md:h-full md:flex-1 bg-black flex flex-col overflow-hidden border-b border-white/10 md:border-b-0 md:border-r">

                {/* Camera Capture - Fills available space */}
                <div className="flex-1 min-h-0 relative">
                    <CameraCapture
                        onImageSelected={handleImageSelected}
                        selectedImage={selectedImage}
                        snagItems={snagItems}
                    />

                    {/* Scan Button Overlay */}
                    {selectedImage && (
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
                            <button
                                onClick={handleScan}
                                disabled={isAnalyzing}
                                className={`
                                    group relative overflow-hidden flex items-center gap-3 px-8 py-3.5 rounded-full font-bold text-white shadow-xl transition-all duration-300 border-2
                                    ${isAnalyzing
                                        ? 'bg-amber-400 cursor-wait border-primary'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-105 hover:shadow-amber-500/30 active:scale-95 border-transparent active:border-primary'
                                    }
                                `}
                            >
                                {isAnalyzing ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <ScanSearch size={20} />
                                )}
                                <span className="relative z-10">{isAnalyzing ? 'Analyzing...' : 'Scan for Issues'}</span>

                                {/* Shine Effect */}
                                {!isAnalyzing && (
                                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 group-hover:animate-shine" />
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Supporting Images - Fixed at bottom of left panel */}
                <div className="shrink-0 bg-slate-50 dark:bg-background border-t border-slate-200 dark:border-slate-800 z-20">
                    <SupportingImages
                        images={supportingImages}
                        onUpdate={handleSupportingImageUpdate}
                    />
                </div>
            </div>

            {/* RIGHT PANEL: Sidebar (Report & Form) */}
            <div className="flex-1 w-full md:w-[420px] lg:w-[480px] md:h-full bg-white dark:bg-background shadow-2xl z-20 flex flex-col relative">
                {/* Project Name Header */}
                <div className="p-4 border-b border-neutral-200 dark:border-slate-800 bg-slate-50 dark:bg-background/50">
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Project: <span className="text-foreground font-semibold">{projects.find(p => p.id === projectId)?.title || 'Unknown Project'}</span>
                    </h2>
                </div>
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
