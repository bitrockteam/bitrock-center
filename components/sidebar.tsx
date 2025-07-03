"use client";

import { logout } from "@/app/login/actions";
import { ModeToggle } from "@/components/mode-toggle";
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
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Bot,
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
import { useState } from "react";
import { user } from "../db";

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
  },
  {
    title: "Commesse",
    href: "/commesse",
    icon: Briefcase,
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
    title: "AI Assistant",
    href: "/ai-assistant",
    icon: Bot,
  },
];

export default function Sidebar({ user }: { user: user }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative">
      <motion.div
        className={cn(
          "h-screen bg-background border-r flex flex-col",
          collapsed ? "w-16" : "w-64",
        )}
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="p-4 flex justify-between items-center">
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
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={
                      pathname.startsWith(item.href) ? "secondary" : "ghost"
                    }
                    className={cn(
                      "w-full justify-start",
                      collapsed ? "px-2" : "px-4",
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {!collapsed && <span>{item.title}</span>}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-1.5">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <span className="ml-2 text-sm font-medium">
                      {user.name || "Utente"}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Il mio account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profilo</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Impostazioni</span>
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
    </div>
  );
}
