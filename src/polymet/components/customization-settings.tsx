import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon } from "lucide-react";

interface CustomizationSettingsProps {
  onSave?: (settings: CustomizationSettings) => void;
  onBack?: () => void;
  initialSettings?: CustomizationSettings;
}

export interface CustomizationSettings {
  companyLogo?: string;
  auditorCompany: string;
  auditorName: string;
  customWordings: {
    issue: string;
    issues: string;
    identified: string;
    preparedFor: string;
    assignedTo: string;
    page: string;
    pageSeparator: string;
  };
}

const defaultSettings: CustomizationSettings = {
  companyLogo: "",
  auditorCompany: "",
  auditorName: "",
  customWordings: {
    issue: "Issue",
    issues: "Issues",
    identified: "Identified",
    preparedFor: "Prepared For",
    assignedTo: "Assigned To",
    page: "Page",
    pageSeparator: "of",
  },
};

export default function CustomizationSettings({
  onSave,
  onBack,
  initialSettings = defaultSettings,
}: CustomizationSettingsProps) {
  const [settings, setSettings] =
    useState<CustomizationSettings>(initialSettings);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof CustomizationSettings
  ) => {
    setSettings({
      ...settings,
      [field]: e.target.value,
    });
  };

  const handleWordingChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof settings.customWordings
  ) => {
    setSettings({
      ...settings,
      customWordings: {
        ...settings.customWordings,
        [field]: e.target.value,
      },
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSettings({
          ...settings,
          companyLogo: event.target.result as string,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(settings);
    }
  };

  const handleRestoreDefaults = () => {
    setSettings({
      ...settings,
      customWordings: defaultSettings.customWordings,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center bg-gray-900 p-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Settings
        </Button>
        <div className="text-center text-sm font-medium flex-1">
          Customisation
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            COMPANY SETTINGS
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-logo">Company Logo</Label>
              <div className="flex items-center space-x-2">
                {settings.companyLogo && (
                  <div className="h-10 w-10 rounded-md overflow-hidden border">
                    <img
                      src={settings.companyLogo}
                      alt="Company logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <Input
                  id="company-logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="auditor-company">Auditor Company</Label>
              <Input
                id="auditor-company"
                value={settings.auditorCompany}
                onChange={(e) => handleInputChange(e, "auditorCompany")}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auditor-name">Auditor Name</Label>
              <Input
                id="auditor-name"
                value={settings.auditorName}
                onChange={(e) => handleInputChange(e, "auditorName")}
                placeholder="Enter your name"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            CUSTOM WORDINGS
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wording-issue">Issue</Label>
                <Input
                  id="wording-issue"
                  value={settings.customWordings.issue}
                  onChange={(e) => handleWordingChange(e, "issue")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wording-issues">Issues</Label>
                <Input
                  id="wording-issues"
                  value={settings.customWordings.issues}
                  onChange={(e) => handleWordingChange(e, "issues")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wording-identified">Identified</Label>
              <Input
                id="wording-identified"
                value={settings.customWordings.identified}
                onChange={(e) => handleWordingChange(e, "identified")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wording-prepared-for">Prepared For</Label>
              <Input
                id="wording-prepared-for"
                value={settings.customWordings.preparedFor}
                onChange={(e) => handleWordingChange(e, "preparedFor")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wording-assigned-to">Assigned To</Label>
              <Input
                id="wording-assigned-to"
                value={settings.customWordings.assignedTo}
                onChange={(e) => handleWordingChange(e, "assignedTo")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wording-page">Page</Label>
                <Input
                  id="wording-page"
                  value={settings.customWordings.page}
                  onChange={(e) => handleWordingChange(e, "page")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wording-page-separator">Page # Separator</Label>
                <Input
                  id="wording-page-separator"
                  value={settings.customWordings.pageSeparator}
                  onChange={(e) => handleWordingChange(e, "pageSeparator")}
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            These terms apply throughout the app and on reports you create. Use
            them to customize the app to suit your needs. For example, reports
            could read '100 Problems Found' instead of '100 Issues Identified'.
          </p>
          <Button
            variant="outline"
            className="mt-4 text-blue-500"
            onClick={handleRestoreDefaults}
          >
            Restore Default Custom Wordings
          </Button>
        </div>
      </div>

      <div className="border-t p-4">
        <Button className="w-full" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
