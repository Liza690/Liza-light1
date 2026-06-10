import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/app/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
    redirect("/admin/login");
  }

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "var(--deeper)",
      color: "var(--white)",
      fontFamily: "'Jost', sans-serif",
    }}>
      <AdminSidebar userName={session.user.name ?? "Administrator"} />
      <main style={{
        marginLeft: 230,
        flex: 1,
        padding: "40px 44px",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}>
        {children}
      </main>
    </div>
  );
}
