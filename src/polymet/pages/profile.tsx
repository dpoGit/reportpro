import { useState, useRef, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

export default function Profile() {
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>("https://github.com/yusufhilmi.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-foreground">User Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={avatarSrc} alt="User Avatar" />
              <AvatarFallback className="text-4xl">JD</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">John Doe</CardTitle>
            <CardDescription className="text-muted-foreground">john@example.com</CardDescription>
            <Button variant="outline" className="mt-4" onClick={handleAvatarChangeClick}>
              Change Avatar
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelected}
              accept="image/*"
              className="hidden"
              aria-label="Upload new avatar"
            />
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Member since: January 1, 2023
            </p>
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Manage your personal information and account settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john@example.com" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" defaultValue="Site Audit Pro Inc." />
            </div>
            <Button className="w-full md:w-auto">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Password Security Card */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Password Security</CardTitle>
            <CardDescription>Update your password to keep your account secure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
            </div>
            <Button variant="destructive" className="w-full md:w-auto">Update Password</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
