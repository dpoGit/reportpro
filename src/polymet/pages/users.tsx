import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Dummy data for users
const USERS = [
  {
    id: "user-1",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    role: "Admin",
    status: "Active",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "user-2",
    name: "Bob Williams",
    email: "bob.w@example.com",
    role: "Editor",
    status: "Active",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "user-3",
    name: "Charlie Brown",
    email: "charlie.b@example.com",
    role: "Viewer",
    status: "Inactive",
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "user-4",
    name: "Diana Prince",
    email: "diana.p@example.com",
    role: "Admin",
    status: "Active",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "user-5",
    name: "Eve Adams",
    email: "eve.a@example.com",
    role: "Editor",
    status: "Active",
    avatar: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

export default function Users() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredUsers = USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    alert("Add User functionality coming soon!");
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage your team members and their roles
          </p>
        </div>
        <Button onClick={handleAddUser}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>All Users</CardTitle>
            <div className="relative w-full md:w-64">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <SearchIcon className="h-4 w-4" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="flex items-center p-4 gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{user.role}</Badge>
                      <Badge
                        // Use the new 'success' variant for active status
                        variant={user.status === "Active" ? "success" : "outline"}
                        className={
                          // Only apply red styling for Inactive status, Active status is handled by 'success' variant
                          user.status === "Inactive"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : "" // No additional class for Active, as 'success' variant handles it
                        }
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
