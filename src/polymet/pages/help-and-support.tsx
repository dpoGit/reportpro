import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpAndSupport() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions (FAQ)</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I create a new project?</AccordionTrigger>
              <AccordionContent>
                Navigate to the "Projects" section from the sidebar. Click on the
                "Create New Project" button, fill in the required details such as
                project name, URL, and description, then save.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Can I invite other users to my project?
              </AccordionTrigger>
              <AccordionContent>
                Yes, you can invite other users. Go to "Project Details" for a
                specific project, then find the "Team" or "Collaborators" section
                to add users by their email addresses.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                How do I generate a site audit report?
              </AccordionTrigger>
              <AccordionContent>
                From the "Project Details" page, you'll see an option to "Run
                Audit" or "Generate Report." Click this, and the system will
                process the audit. Once complete, the report will be available in
                the "Reports" section.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                What kind of issues does the audit detect?
              </AccordionTrigger>
              <AccordionContent>
                Our site audit tool detects a wide range of issues including broken
                links, missing alt tags, SEO optimization opportunities,
                accessibility concerns, performance bottlenecks, and more. Each
                issue comes with a detailed explanation and suggested fixes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>
                Is there a limit to the number of projects I can manage?
              </AccordionTrigger>
              <AccordionContent>
                The number of projects you can manage depends on your subscription
                plan. Please refer to your account's plan details or contact
                support for more information on limits.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Use Report<span className="text-[#FF8C00]">Pro</span></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Welcome to Report<span className="text-[#FF8C00]">Pro</span>! This guide will walk you through the basic
            steps to get started and make the most of our powerful site auditing
            tool.
          </p>
          <h3 className="text-lg font-semibold text-foreground">1. Dashboard Overview</h3>
          <p>
            Upon logging in, you'll land on the Dashboard. Here, you can see a
            summary of your active projects, recent audit results, and quick
            links to frequently accessed features. It's your central hub for
            monitoring your website's health.
          </p>
          <h3 className="text-lg font-semibold text-foreground">2. Managing Projects</h3>
          <p>
            The "Projects" section is where you manage all your websites. You can
            add new projects, view existing ones, and access detailed information
            for each. Each project represents a website you want to audit.
          </p>
          <h3 className="text-lg font-semibold text-foreground">3. Running Audits</h3>
          <p>
            To run an audit, select a project from the "Projects" list and navigate
            to its "Project Details" page. Look for the "Run Audit" button. Once
            clicked, our system will crawl your site and identify potential issues.
            You can monitor the progress from this page.
          </p>
          <h3 className="text-lg font-semibold text-foreground">4. Reviewing Issues</h3>
          <p>
            After an audit completes, all detected issues are listed under the
            "Issues" section. You can filter issues by project, type, severity,
            and status. Clicking on an issue provides detailed information,
            including its location, a description of the problem, and recommended
            solutions.
          </p>
          <h3 className="text-lg font-semibold text-foreground">5. Generating Reports</h3>
          <p>
            Comprehensive reports can be generated from the "Reports" section.
            These reports provide a high-level overview of your site's performance,
            SEO, accessibility, and more. You can customize reports and export
            them for sharing with your team or clients.
          </p>
          <h3 className="text-lg font-semibold text-foreground">6. Media Management</h3>
          <p>
            The "Media" section allows you to manage and review all media assets
            found during audits, such as images and videos. This helps in
            identifying large files, missing alt tags, or other media-related
            issues.
          </p>
          <h3 className="text-lg font-semibold text-foreground">7. Settings and Profile</h3>
          <p>
            Customize your experience in "Settings," where you can adjust
            preferences, notifications, and integrations. Your "Profile" section
            allows you to update personal information and manage your account
            details.
          </p>
          <p>
            If you have any further questions, please refer to the FAQ section
            above or contact our support team. Happy auditing!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
