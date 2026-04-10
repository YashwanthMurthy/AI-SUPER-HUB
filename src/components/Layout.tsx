import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AGENTS, NAV_ITEMS } from "../constants";
import { cn } from "../lib/utils";
import { 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ChevronRight,
  User,
  Zap
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-border">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Zap className="text-primary-foreground w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">AI SUPER HUB</h1>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Navigation</p>
          {NAV_ITEMS.map((item) => (
            <Link key={item.id} to={item.path}>
              <Button
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 px-4",
                  location.pathname === item.path && "bg-secondary font-medium"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-1 py-2">
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Agents</p>
          {AGENTS.map((agent) => (
            <Link key={agent.id} to={`/chat/${agent.id}`}>
              <Button
                variant={location.pathname === `/chat/${agent.id}` ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 px-4 text-sm",
                  location.pathname === `/chat/${agent.id}` && "bg-secondary font-medium"
                )}
              >
                <agent.icon className="w-4 h-4 opacity-70" />
                <span className="truncate">{agent.name}</span>
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
          <Avatar className="w-9 h-9">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Yashwanth Murthy</p>
            <p className="text-xs text-muted-foreground truncate">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("flex h-screen w-full bg-background text-foreground", isDarkMode && "dark")}>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:block transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="relative w-64 md:w-96 hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search agents, history..."
                className="pl-9 bg-muted/50 border-none h-9 focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Theme</TooltipContent>
            </Tooltip>
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
              <Zap className="w-4 h-4 text-primary fill-primary" />
              Upgrade
            </Button>
            <Avatar className="w-8 h-8 sm:hidden">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen && window.innerWidth < 768} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </div>
  );
}
