"use client";

import { logout } from "@/app/login/actions";
import { ModeToggle } from "@/components/mode-toggle";
import { RightSidebar } from "@/components/right-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Permissions, type user } from "@/db";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  FolderOpen,
  GraduationCap,
  HandMetal,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Consuntivazione",
    href: "/consuntivazione",
    icon: Clock,
  },
  {
    title: "Ferie e Permessi",
    href: "/ferie-permessi",
    icon: Calendar,
  },
  {
    title: "Progetti",
    href: "/progetti",
    icon: FolderOpen,
  },
  {
    title: "Clienti",
    href: "/clienti",
    icon: Building2,
    permission: Permissions.CAN_SEE_CLIENT,
  },
  {
    title: "Commesse",
    href: "/commesse",
    icon: Briefcase,
    permission: Permissions.CAN_SEE_WORK_ITEM,
  },
  {
    title: "Utenti",
    href: "/utenti",
    icon: Users,
  },
  {
    title: "Skills",
    href: "/skills",
    icon: GraduationCap,
  },
  {
    title: "Team",
    href: "/team",
    icon: HandMetal,
  },
  {
    title: "Saturazione",
    href: "/saturation",
    icon: BarChart3,
    permission: Permissions.CAN_SEE_SATURATION,
  },
  {
    title: "Permessi",
    href: "/permissions",
    icon: Settings,
    permission: Permissions.CAN_SEE_PERMISSIONS,
  },
];

export default function Sidebar({
  user,
  permissions,
  version,
}: Readonly<{
  user: user;
  permissions: Permissions[];
  version: string;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "settings">(
    "profile"
  );
  const pathname = usePathname();

  useEffect(() => {
    const savedCollapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (savedCollapsed !== null) {
      setCollapsed(savedCollapsed === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  }, [collapsed]);

  return (
    <div className="relative">
      <motion.div
        className={cn(
          "h-screen bg-background border-r flex flex-col",
          collapsed ? "w-16" : "w-64"
        )}
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div
          className={cn(
            "flex items-center",
            collapsed ? "py-4 justify-center" : "p-4 justify-between"
          )}
        >
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-xl flex items-center space-x-4"
            >
              <Image src="/logo.png" alt="Logo" width={32} height={32} />
              Bitrock Hours
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-2">
            {navItems
              .filter(
                (el) =>
                  !el.permission ||
                  (el.permission && permissions.includes(el.permission))
              )
              .map((item) => (
                <li key={item.href}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={item.href}>
                          <Button
                            variant={
                              pathname.startsWith(item.href)
                                ? "secondary"
                                : "ghost"
                            }
                            className="w-full px-2 justify-center"
                          >
                            <item.icon className="h-5 w-5 flex justify-center" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <span>{item.title}</span>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Link href={item.href}>
                      <Button
                        variant={
                          pathname.startsWith(item.href) ? "secondary" : "ghost"
                        }
                        className="w-full px-4 justify-start"
                      >
                        <item.icon className="h-5 w-5 mr-2" />
                        <span>{item.title}</span>
                      </Button>
                    </Link>
                  )}
                </li>
              ))}
          </ul>
        </nav>
        <div className={cn("border-t", collapsed ? "py-4" : "p-4")}>
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={!collapsed ? "p-0" : "p-auto"}
                asChild
              >
                <Button variant="ghost">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-8 w-8">
                        {user.avatar_url && (
                          <AvatarImage
                            src={user.avatar_url}
                            alt="user avatar"
                          />
                        )}
                        <AvatarFallback>
                          {user.name
                            .trim()
                            .split(" ")
                            .map((l) => l[0].toUpperCase())
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="ml-2 text-sm font-medium">
                        {user.name || "Utente"}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Il mio account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setActiveSection("profile");
                    setRightSidebarOpen(true);
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profilo</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setActiveSection("settings");
                    setRightSidebarOpen(true);
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Impostazioni</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled
                  className="opacity-100 cursor-default"
                >
                  <span className="text-xs text-muted-foreground">
                    Versione {version}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {!collapsed && <ModeToggle />}
          </div>
        </div>
      </motion.div>
      <RightSidebar
        isOpen={rightSidebarOpen}
        onClose={() => setRightSidebarOpen(false)}
        user={user}
        activeSection={activeSection}
        version={version}
      />
    </div>
  );
}
