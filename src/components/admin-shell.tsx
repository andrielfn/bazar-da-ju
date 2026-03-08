"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon, LinkSquare01Icon, Package01Icon, ClipboardIcon } from "@hugeicons-pro/core-stroke-rounded";
import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Itens", icon: Package01Icon },
  { href: "/admin/reservations", label: "Reservas", icon: ClipboardIcon },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-50 bg-card/95 shadow-sm ring-1 ring-border/50 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-5">
            <Link
              href="/admin/dashboard"
              className="text-base font-extrabold tracking-tight text-foreground"
            >
              Bazar da Ju
            </Link>

            <div className="h-5 w-px bg-border" />

            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin/dashboard"
                    ? pathname === "/admin/dashboard" ||
                      pathname.startsWith("/admin/dashboard/")
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <HugeiconsIcon icon={item.icon} size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <HugeiconsIcon icon={LinkSquare01Icon} size={14} />
              <span className="hidden sm:inline">Ver site</span>
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <HugeiconsIcon icon={Logout01Icon} size={14} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
