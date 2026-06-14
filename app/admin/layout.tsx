import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import RoleGuard from "@/components/auth/RoleGuard";

export default function AdminLayout({ children }: { children?: ReactNode }) {
  return (
    /*
     * RoleGuard wraps the entire admin shell.
     * - isRestoring → full-screen spinner (no flash of admin UI)
     * - Not authenticated → opens login modal, redirects to "/"
     * - Authenticated but role !== "admin" → redirects to /unauthorized
     * - role === "admin" → renders admin shell normally
     */
    <RoleGuard role="admin" loginRedirect="/" unauthorizedRedirect="/unauthorized">
      <div className="min-h-screen bg-[#fafaf4]">
        {/* Fixed left sidebar */}
        <AdminSidebar />

        {/* Main content — offset by sidebar width */}
        <div className="md:pl-64 flex flex-col min-h-screen">
          <AdminHeader />
          <main className="flex-1 p-6 md:p-8">
            {children}
          </main>
        </div>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#f4f4ee] border-t border-[#c1c8c1]/30 z-50 px-2 py-2 flex items-center justify-around">
          <MobileNavItem href="/admin/dashboard" label="Overview" icon={<DashboardIconSm />} />
          <MobileNavItem href="/admin/products" label="Products" icon={<PlantIconSm />} />
          <MobileNavItem href="/admin/orders" label="Orders" icon={<ShippingIconSm />} />
          <MobileNavItem href="/admin/customers" label="Customers" icon={<GroupIconSm />} />
          <MobileNavItem href="/admin/settings" label="Settings" icon={<SettingsIconSm />} />
        </nav>
      </div>
    </RoleGuard>
  );
}

function MobileNavItem({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <a href={href} className="flex flex-col items-center gap-0.5 px-3 py-1 text-[#424843] hover:text-[#032616]">
      {icon}
      <span className="text-[9px] font-bold uppercase tracking-wide font-[var(--font-work-sans)]">{label}</span>
    </a>
  );
}

function DashboardIconSm() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}
function PlantIconSm() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2 3.7-1.2.2-2.5.1-3.5-.6C7 11.7 6.5 10 7 9c1 0 2 .4 2.5 1.4z" />
    </svg>
  );
}
function ShippingIconSm() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
      <rect width="13" height="8" x="9" y="11" rx="1" /><circle cx="12" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
    </svg>
  );
}
function GroupIconSm() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function SettingsIconSm() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
