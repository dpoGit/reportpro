import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SiteAuditLayout from "@/polymet/layouts/site-audit-layout";
import Dashboard from "@/polymet/pages/dashboard";
import Projects from "@/polymet/pages/projects";
import ProjectDetails from "@/polymet/pages/project-details";
import IssueDetails from "@/polymet/pages/issue-details";
import Reports from "@/polymet/pages/reports";
import ReportDetails from "@/polymet/pages/report-details";
import Issues from "@/polymet/pages/issues";
import Media from "@/polymet/pages/media";
import Settings from "@/polymet/pages/settings";
import Profile from "@/polymet/pages/profile";
import Users from "@/polymet/pages/users";
import HelpAndSupport from "@/polymet/pages/help-and-support"; // Import the HelpAndSupport component
import React, { useState } from "react";
import { PROJECTS, Project } from "@/polymet/data/site-audit-data";

export default function SiteAuditPrototype() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <SiteAuditLayout>
              <Dashboard projects={projects} setProjects={setProjects} />
            </SiteAuditLayout>
          }
        />

        <Route
          path="/projects"
          element={
            <SiteAuditLayout>
              <Projects projects={projects} setProjects={setProjects} />
            </SiteAuditLayout>
          }
        />

        <Route
          path="/project/:projectId"
          element={
            <SiteAuditLayout>
              <ProjectDetails projects={projects} setProjects={setProjects} />
            </SiteAuditLayout>
          }
        />

        <Route
          path="/issue/:projectId/:issueId"
          element={
            <SiteAuditLayout>
              <IssueDetails projects={projects} setProjects={setProjects} />
            </SiteAuditLayout>
          }
        />

        <Route
          path="/reports"
          element={
            <SiteAuditLayout>
              <Reports />
            </SiteAuditLayout>
          }
        />

        <Route
          path="/report/:projectId"
          element={
            <SiteAuditLayout>
              <ReportDetails projects={projects} />
            </SiteAuditLayout>
          }
        />

        <Route
          path="/issues"
          element={
            <SiteAuditLayout>
              <Issues />
            </SiteAuditLayout>
          }
        />

        <Route
          path="/media"
          element={
            <SiteAuditLayout>
              <Media />
            </SiteAuditLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <SiteAuditLayout>
              <Settings />
            </SiteAuditLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <SiteAuditLayout>
              <Profile />
            </SiteAuditLayout>
          }
        />

        <Route
          path="/users"
          element={
            <SiteAuditLayout>
              <Users />
            </SiteAuditLayout>
          }
        />

        {/* Add the route for the Help & Support page */}
        <Route
          path="/help-and-support"
          element={
            <SiteAuditLayout>
              <HelpAndSupport />
            </SiteAuditLayout>
          }
        />

        <Route path="/logout" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
