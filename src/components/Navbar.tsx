"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, GraduationCap, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "学生端", href: "/student", icon: PenLine },
    { name: "教师端", href: "/teacher", icon: LayoutDashboard },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-indigo-600">
          <GraduationCap className="h-8 w-8" />
          <span>WriteSmart AI</span>
        </Link>

        <div className="flex gap-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
