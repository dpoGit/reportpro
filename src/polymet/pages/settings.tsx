import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircleIcon,
  BellIcon,
  CheckIcon,
  CloudIcon,
  KeyIcon,
  LockIcon,
  SaveIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DEFAULT_APP_SETTINGS,
  DEFAULT_REPORT_SETTINGS,
} from "@/polymet/data/site-audit-data";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileSettings, setProfileSettings] = useState({
    name: "John Doe",
    email: "john@example.com",
    company: "Granville Auditing Co",
    phone: "+1 (555) 123-4567",
    avatar: "https://github.com/yusufhilmi.png",
  });

  const [appSettings, setAppSettings] = useState({
    ...DEFAULT_APP_SETTINGS,
  });

  const [reportSettings, setReportSettings] = useState({
    ...DEFAULT_REPORT_SETTINGS,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    projectUpdates: true,
    issueAssignments: true,
    reportGeneration: true,
    systemUpdates: false,
    marketingEmails: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordLastChanged: "2023-10-15",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update logic
    console.log("Profile updated:", profileSettings);
    alert("Profile changes saved!");
  };

  const handleAppSettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle app settings update logic
    console.log("App settings updated:", appSettings);
    alert("App settings saved!");
  };

  const handleReportSettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle report settings update logic
    console.log("Report settings updated:", reportSettings);
    alert("Report settings saved!");
  };

  const handleNotificationSettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Notification settings updated:", notificationSettings);
    alert("Notification settings saved!");
  };

  const handleSecuritySettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Security settings updated:", securitySettings);
    alert("Security settings saved!");
  };

  const handleChangeProfilePicture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileSettings({ ...profileSettings, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfileSettings({ ...profileSettings, avatar: "" });
    alert("Profile picture removed!");
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-64 flex-shrink-0">
          <CardContent className="p-4">
            <nav className="flex flex-col space-y-1">
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("profile")}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant={activeTab === "app" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("app")}
              >
                <SettingsIcon className="mr-2 h-4 w-4" />
                App Settings
              </Button>
              <Button
                variant={activeTab === "reports" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("reports")}
              >
                <CloudIcon className="mr-2 h-4 w-4" />
                Report Settings
              </Button>
              <Button
                variant={activeTab === "notifications" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("notifications")}
              >
                <BellIcon className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button
                variant={activeTab === "security" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("security")}
              >
                <LockIcon className="mr-2 h-4 w-4" />
                Security
              </Button>
            </nav>
          </CardContent>
        </Card>

        <div className="flex-1">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate}>
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={profileSettings.avatar} />
                        <AvatarFallback>
                          {profileSettings.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "JD"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Profile Picture</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleChangeProfilePicture}
                            type="button"
                          >
                            Change
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveProfilePicture}
                            type="button"
                          >
                            Remove
                          </Button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileSettings.name}
                          onChange={(e) =>
                            setProfileSettings({
                              ...profileSettings,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileSettings.email}
                          onChange={(e) =>
                            setProfileSettings({
                              ...profileSettings,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={profileSettings.company}
                          onChange={(e) =>
                            setProfileSettings({
                              ...profileSettings,
                              company: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileSettings.phone}
                          onChange={(e) =>
                            setProfileSettings({
                              ...profileSettings,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => alert("Cancel clicked")}>Cancel</Button>
                <Button onClick={handleProfileUpdate}>
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "app" && (
            <Card>
              <CardHeader>
                <CardTitle>App Settings</CardTitle>
                <CardDescription>
                  Customize the application to suit your workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAppSettingsUpdate}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="company-logo">Company Logo</Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 rounded-md">
                          <AvatarImage src={appSettings.companyLogo} />

                          <AvatarFallback>CL</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm" type="button" onClick={() => alert("Change Logo clicked")}>
                          Change Logo
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="auditor-company">Auditor Company</Label>
                        <Input
                          id="auditor-company"
                          value={appSettings.auditorCompany}
                          onChange={(e) =>
                            setAppSettings({
                              ...appSettings,
                              auditorCompany: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="auditor-name">Auditor Name</Label>
                        <Input
                          id="auditor-name"
                          value={appSettings.auditorName}
                          onChange={(e) =>
                            setAppSettings({
                              ...appSettings,
                              auditorName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Custom Terminology
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="term-issue">Issue (Singular)</Label>
                          <Input
                            id="term-issue"
                            value={appSettings.customWordings.issue}
                            onChange={(e) =>
                              setAppSettings({
                                ...appSettings,
                                customWordings: {
                                  ...appSettings.customWordings,
                                  issue: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="term-issues">Issue (Plural)</Label>
                          <Input
                            id="term-issues"
                            value={appSettings.customWordings.issues}
                            onChange={(e) =>
                              setAppSettings({
                                ...appSettings,
                                customWordings: {
                                  ...appSettings.customWordings,
                                  issues: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="term-identified">Identified</Label>
                          <Input
                            id="term-identified"
                            value={appSettings.customWordings.identified}
                            onChange={(e) =>
                              setAppSettings({
                                ...appSettings,
                                customWordings: {
                                  ...appSettings.customWordings,
                                  identified: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="term-prepared-for">
                            Prepared For
                          </Label>
                          <Input
                            id="term-prepared-for"
                            value={appSettings.customWordings.preparedFor}
                            onChange={(e) =>
                              setAppSettings({
                                ...appSettings,
                                customWordings: {
                                  ...appSettings.customWordings,
                                  preparedFor: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => {
                  setAppSettings(DEFAULT_APP_SETTINGS);
                  alert("App settings restored to defaults!");
                }}>Restore Defaults</Button>
                <Button onClick={handleAppSettingsUpdate}>
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "reports" && (
            <Card>
              <CardHeader>
                <CardTitle>Report Settings</CardTitle>
                <CardDescription>
                  Configure default settings for generated reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReportSettingsUpdate}>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Content Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="include-photos"
                            className="cursor-pointer"
                          >
                            Include Photos
                          </Label>
                          <Switch
                            id="include-photos"
                            checked={reportSettings.includePhotos}
                            onCheckedChange={(checked) =>
                              setReportSettings({
                                ...reportSettings,
                                includePhotos: checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="include-front-cover"
                            className="cursor-pointer"
                          >
                            Include Front Cover
                          </Label>
                          <Switch
                            id="include-front-cover"
                            checked={reportSettings.includeFrontCover}
                            onCheckedChange={(checked) =>
                              setReportSettings({
                                ...reportSettings,
                                includeFrontCover: checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="include-timestamps"
                            className="cursor-pointer"
                          >
                            Include Timestamps
                          </Label>
                          <Switch
                            id="include-timestamps"
                            checked={reportSettings.includeTimestamps}
                            onCheckedChange={(checked) =>
                              setReportSettings({
                                ...reportSettings,
                                includeTimestamps: checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="include-page-numbers"
                            className="cursor-pointer"
                          >
                            Include Page Numbers
                          </Label>
                          <Switch
                            id="include-page-numbers"
                            checked={reportSettings.includePageNumbers}
                            onCheckedChange={(checked) =>
                              setReportSettings({
                                ...reportSettings,
                                includePageNumbers: checked,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Appearance Settings
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="theme">Theme</Label>
                          <Select
                            value={reportSettings.theme}
                            onValueChange={(value) =>
                              setReportSettings({
                                ...reportSettings,
                                theme: value,
                              })
                            }
                          >
                            <SelectTrigger id="theme">
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bright">Bright</SelectItem>
                              <SelectItem value="classic">Classic</SelectItem>
                              <SelectItem value="modern">Modern</SelectItem>
                              <SelectItem value="minimal">Minimal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="photo-size">Photo Size</Label>
                          <Select
                            value={reportSettings.photoSize}
                            onValueChange={(value) =>
                              setReportSettings({
                                ...reportSettings,
                                photoSize: value,
                              })
                            }
                          >
                            <SelectTrigger id="photo-size">
                              <SelectValue placeholder="Select photo size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="regular">Regular</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="text-size">Text Size</Label>
                          <Select
                            value={reportSettings.textSize}
                            onValueChange={(value) =>
                              setReportSettings({
                                ...reportSettings,
                                textSize: value,
                              })
                            }
                          >
                            <SelectTrigger id="text-size">
                              <SelectValue placeholder="Select text size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="regular">Regular</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="photo-quality">
                            Photo Quality: {reportSettings.photoQuality}%
                          </Label>
                          <Input
                            id="photo-quality"
                            type="range"
                            min="10"
                            max="100"
                            step="10"
                            value={reportSettings.photoQuality}
                            onChange={(e) =>
                              setReportSettings({
                                ...reportSettings,
                                photoQuality: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        CSV Export Settings
                      </h3>
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="include-images-csv"
                          className="cursor-pointer"
                        >
                          Include Images in CSV
                        </Label>
                        <Switch
                          id="include-images-csv"
                          checked={reportSettings.includeImagesInCSV}
                          onCheckedChange={(checked) =>
                            setReportSettings({
                              ...reportSettings,
                              includeImagesInCSV: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => {
                  setReportSettings(DEFAULT_REPORT_SETTINGS);
                  alert("Report settings restored to defaults!");
                }}>Restore Defaults</Button>
                <Button onClick={handleReportSettingsUpdate}>
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Types</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Project Updates</h4>
                          <p className="text-sm text-muted-foreground">
                            Notify when projects are updated
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.projectUpdates}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              projectUpdates: checked,
                            })
                          }
                          disabled={!notificationSettings.emailNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Issue Assignments</h4>
                          <p className="text-sm text-muted-foreground">
                            Notify when issues are assigned to you
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.issueAssignments}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              issueAssignments: checked,
                            })
                          }
                          disabled={!notificationSettings.emailNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Report Generation</h4>
                          <p className="text-sm text-muted-foreground">
                            Notify when reports are generated
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.reportGeneration}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              reportGeneration: checked,
                            })
                          }
                          disabled={!notificationSettings.emailNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">System Updates</h4>
                          <p className="text-sm text-muted-foreground">
                            Notify about system updates and maintenance
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.systemUpdates}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              systemUpdates: checked,
                            })
                          }
                          disabled={!notificationSettings.emailNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Marketing Emails</h4>
                          <p className="text-sm text-muted-foreground">
                            Receive marketing and promotional emails
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.marketingEmails}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              marketingEmails: checked,
                            })
                          }
                          disabled={!notificationSettings.emailNotifications}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => alert("Cancel clicked")}>Cancel</Button>
                <Button onClick={handleNotificationSettingsUpdate}>
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and authentication options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({
                          ...securitySettings,
                          twoFactorAuth: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Last changed</p>
                        <p className="text-sm font-medium">
                          {new Date(
                            securitySettings.passwordLastChanged
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" className="w-full" type="button" onClick={() => alert("Change Password clicked")}>
                        <KeyIcon className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Session Settings</h3>
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">
                        Session Timeout (minutes)
                      </Label>
                      <Select
                        value={securitySettings.sessionTimeout}
                        onValueChange={(value) =>
                          setSecuritySettings({
                            ...securitySettings,
                            sessionTimeout: value,
                          })
                        }
                      >
                        <SelectTrigger id="session-timeout">
                          <SelectValue placeholder="Select timeout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" type="button" onClick={() => alert("Log Out All Other Sessions clicked")}>
                      <AlertCircleIcon className="mr-2 h-4 w-4" />
                      Log Out All Other Sessions
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => alert("Cancel clicked")}>Cancel</Button>
                <Button onClick={handleSecuritySettingsUpdate}>
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
