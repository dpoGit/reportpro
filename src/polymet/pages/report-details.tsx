import { useParams, Navigate } from "react-router-dom";
import ReportPreview from "@/polymet/components/report-preview";
import { Project } from "@/polymet/data/site-audit-data";
import React from "react";

interface ReportDetailsProps {
  projects: Project[];
}

export default function ReportDetails({ projects }: ReportDetailsProps) {
  const { projectId } = useParams<{ projectId: string }>();

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return <Navigate to="/reports" replace />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <ReportPreview project={project} />
    </div>
  );
}
