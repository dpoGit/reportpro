import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BellIcon,
  HomeIcon,
  ClipboardListIcon,
  MenuIcon,
  FileTextIcon,
  SettingsIcon,
  UsersIcon,
  LogOutIcon,
  UserIcon,
  ImageIcon,
  LifeBuoyIcon,
  CheckSquareIcon, // Added CheckSquareIcon
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/polymet/components/theme-toggle";

interface SiteAuditLayoutProps {
  children: React.ReactNode;
}

export default function SiteAuditLayout({ children }: SiteAuditLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
      isActive: location.pathname === "/dashboard",
    },
    {
      name: "Projects",
      href: "/projects",
      icon: CheckSquareIcon, // Changed from FolderIcon for consistency if desired, or keep specific icons
      isActive: location.pathname.startsWith("/projects") || location.pathname.startsWith("/project/"),
    },
    {
      name: "Issues",
      href: "/issues",
      icon: ClipboardListIcon,
      isActive: location.pathname.startsWith("/issues") || location.pathname.startsWith("/issue/"),
    },
    {
      name: "Reports",
      href: "/reports",
      icon: FileTextIcon,
      isActive: location.pathname === "/reports",
    },
    {
      name: "Media",
      href: "/media",
      icon: ImageIcon,
      isActive: location.pathname === "/media",
    },
  ];

  const bottomNavItems = [
    {
      name: "Settings",
      href: "/settings",
      icon: SettingsIcon,
      isActive: location.pathname === "/settings",
    },
    {
      name: "Users",
      href: "/users",
      icon: UsersIcon,
      isActive: location.pathname === "/users",
    },
    {
      name: "Help & Support",
      href: "/help-and-support",
      icon: LifeBuoyIcon,
      isActive: location.pathname === "/help-and-support",
    },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden md:block bg-sidebar text-sidebar-foreground border-r border-sidebar-border rounded-r-xl overflow-hidden shadow-lg sticky top-0 h-screen">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold text-white">
              <CheckSquareIcon className="h-6 w-6 text-primary" /> {/* Changed Icon */}
              <span>Report<span className="text-orange-500">Pro</span></span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-sidebar-foreground hover:text-primary">
              <BellIcon className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 py-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-r-lg px-3 py-2 transition-all ${item.isActive
                    ? "bg-sidebar-active text-primary border-l-4 border-primary"
                    : "text-sidebar-foreground hover:text-primary"
                    }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {bottomNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-r-lg px-3 py-2 transition-all ${item.isActive
                    ? "bg-sidebar-active text-primary border-l-4 border-primary"
                    : "text-sidebar-foreground hover:text-primary"
                    }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      {/* Main Content Area */}
      <div className="flex flex-col">
        <header className="flex h-auto py-2 items-center gap-4 border-b border-border bg-card px-4 lg:px-6 shadow-sm relative">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-sidebar text-sidebar-foreground">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Mobile navigation menu for accessing different sections of the application.
              </SheetDescription>
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  to="#"
                  className="flex items-center gap-2 text-lg font-semibold text-white mb-4" // Added mb-4 for spacing
                >
                  <CheckSquareIcon className="h-6 w-6 text-primary" /> {/* Changed Icon */}
                  <span>Report<span className="text-orange-500">Pro</span></span> {/* Ensured text is visible, removed sr-only */}
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${item.isActive
                      ? "bg-sidebar-active text-primary border-l-4 border-primary"
                      : "text-sidebar-foreground hover:text-primary"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
                <div className="border-t border-sidebar-border pt-2 mt-2">
                  {bottomNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${item.isActive
                        ? "bg-sidebar-active text-primary border-l-4 border-primary"
                        : "text-sidebar-foreground hover:text-primary"
                        }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1 flex justify-center">
            {(() => {
              const getPageInfo = (path: string) => {
                if (path === "/dashboard") return { title: "ReportPro", description: "Manage your projects and issues efficiently" };
                if (path.startsWith("/projects")) return { title: "Projects", description: "View and manage all your projects" };
                if (path.startsWith("/project/") && path.endsWith("/add-issue")) return { title: "Add Issue", description: "Create a new issue for this project" };
                if (path.startsWith("/project/")) return { title: "Project Details", description: "View project information and issues" };
                if (path.startsWith("/issue/")) return { title: "Issue Details", description: "View and edit issue details" };
                if (path === "/reports") return { title: "Reports", description: "Generate and view reports" };
                if (path.startsWith("/report/")) return { title: "Report Details", description: "View report details" };
                if (path === "/issues") return { title: "Issues", description: "View all issues across projects" };
                if (path === "/media") return { title: "Media", description: "Manage project media" };
                if (path === "/settings") return { title: "Settings", description: "Manage application settings" };
                if (path === "/profile") return { title: "Profile", description: "Manage your profile" };
                if (path === "/users") return { title: "Users", description: "Manage users" };
                if (path === "/help-and-support") return { title: "Help & Support", description: "Get help and support" };
                return { title: "", description: "" };
              };

              const { title, description } = getPageInfo(location.pathname);

              return (
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                    {title === "ReportPro" && <CheckSquareIcon className="h-5 w-5 text-primary" />}
                    {title === "ReportPro" ? (
                      <span>Report<span className="text-orange-500">Pro</span></span>
                    ) : (
                      title
                    )}
                  </h1>
                  {description && (
                    <>
                      <span className="text-muted-foreground/50">|</span>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </>
                  )}
                </div>
              );
            })()}
          </div>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://github.com/yusufhilmi.png"
                    alt="User Avatar"
                  />
                  <AvatarFallback>YH</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/logout">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
