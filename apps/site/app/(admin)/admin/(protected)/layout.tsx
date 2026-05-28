import Link from "next/link";
import {
  FileText,
  FolderTree,
  Home,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  UploadCloud,
  Users
} from "lucide-react";
import { requireAdminSession } from "@/lib/auth";
import { logoutAction } from "@/app/(admin)/admin/auth-actions";
import type { UserRole } from "@global-trade/core";

type AdminNavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  roles?: UserRole[];
};

const navItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/post-categories", label: "Post Categories", icon: FolderTree },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/product-categories", label: "Product Categories", icon: FolderTree },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/migrations", label: "Migrations", icon: UploadCloud },
  { href: "/admin/users", label: "Users", icon: Users, roles: ["owner", "admin"] },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();

  return (
    <main className="payload-admin">
      <aside className="payload-sidebar">
        <Link className="payload-brand" href="/admin">
          <span className="payload-brand-mark">GT</span>
          <span>Admin</span>
        </Link>
        <nav className="payload-nav" aria-label="Admin navigation">
          {navItems.filter((item) => !item.roles || item.roles.includes(session.profile.role)).map((item) => {
            const Icon = item.icon;
            return (
              <Link className="payload-nav-item" href={item.href} key={item.href}>
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <section className="payload-workspace">
        <header className="payload-topbar">
          <div>
            <p className="payload-eyebrow">Dashboard</p>
            <strong>{session.profile.fullName || session.user.email || "Admin user"}</strong>
          </div>
          <div className="payload-topbar-actions">
            <Link className="payload-button payload-button--ghost" href="/" target="_blank">
              <Home size={16} />
              <span>View site</span>
            </Link>
            <form action={logoutAction}>
              <button className="payload-icon-button" title="Logout" type="submit">
                <LogOut size={17} />
              </button>
            </form>
          </div>
        </header>
        <div className="payload-content">{children}</div>
      </section>
    </main>
  );
}
