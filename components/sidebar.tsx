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
import { Permissions, user } from "@/db";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
    title: "AI Assistant",
    href: "/ai-assistant",
    icon: Bot,
  },
];

export default function Sidebar({
  user,
  permissions,
}: {
  user: user;
  permissions: Permissions[];
}) {
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
        <div
          className={cn(
            "flex items-center",
            collapsed ? "py-4 justify-center" : "p-4 justify-between",
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
                  (el.permission && permissions.includes(el.permission)),
              )
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <Button
                      variant={
                        pathname.startsWith(item.href) ? "secondary" : "ghost"
                      }
                      className={cn(
                        "w-full",
                        collapsed
                          ? "px-2 justify-center"
                          : "px-4 justify-start",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5",
                          collapsed ? "flex justify-center" : "mr-2",
                        )}
                      />
                      {!collapsed && <span>{item.title}</span>}
                    </Button>
                  </Link>
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
                        <AvatarImage
                          src={
                            user.avatar_url ||
                            "/placeholder.svg?height=32&width=32"
                          }
                          alt="user avatar"
                        />
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
