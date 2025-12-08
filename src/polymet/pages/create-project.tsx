import { useNavigate } from 'react-router-dom';
import ProjectForm, { ProjectFormData } from '../components/project-form';
import { Project } from '../data/site-audit-data';

interface CreateProjectPageProps {
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

export default function CreateProjectPage({ projects, setProjects }: CreateProjectPageProps) {
    const navigate = useNavigate();

    const handleSubmit = (formData: ProjectFormData) => {
        // Create new project
        const newProject: Project = {
            id: `proj-${Date.now()}`,
            title: formData.title,
            client: formData.client,
            date: formData.date.toISOString(),
            status: "Pending",
            progress: 0,
            thumbnail: formData.thumbnail || undefined,
            issues: [],
            reference: formData.reference,
            location: formData.location,
            issueCount: 0,
            notes: formData.notes,
        };

        setProjects([newProject, ...projects]);
        navigate('/projects');
    };

    const handleCancel = () => {
        navigate(-1); // Go back to previous page
    };

    return (
        <div className="container max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Create New Project</h1>
                <p className="text-muted-foreground mt-2">Add details for your new project</p>
            </div>

            <ProjectForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </div>
    );
}
