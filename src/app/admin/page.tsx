import {
  AdminDashboard,
  AdminDashboardUnavailable,
} from "@/components/admin/admin-dashboard";
import { getAdminDashboardData } from "@/lib/admin/dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function loadDashboardData() {
  try {
    return await getAdminDashboardData();
  } catch (error) {
    console.error("Admin dashboard failed to load", error);

    return null;
  }
}

export default async function AdminPage() {
  const data = await loadDashboardData();

  if (!data) {
    return <AdminDashboardUnavailable />;
  }

  return <AdminDashboard data={data} />;
}
