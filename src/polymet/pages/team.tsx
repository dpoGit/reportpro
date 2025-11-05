import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Team() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Team Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Information about team members will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}