import {
  AdminDashboard,
  AdminDashboardUnavailable,
} from "@/components/admin/admin-dashboard";
import { getAdminDashboardData } from "@/lib/admin/dashboard";
import {
  TIME_ZONE_QUERY_PARAM,
  resolveBusinessTimeZone,
} from "@/lib/time/options";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchParamValue(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  key: string,
) {
  const value = searchParams?.[key];

  return Array.isArray(value) ? value[0] : value;
}

async function loadDashboardData() {
  try {
    return await getAdminDashboardData();
  } catch (error) {
    console.error("Admin dashboard failed to load", error);

    return null;
  }
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedTimeZone = resolveBusinessTimeZone(
    getSearchParamValue(resolvedSearchParams, TIME_ZONE_QUERY_PARAM),
  );
  const data = await loadDashboardData();

  if (!data) {
    return <AdminDashboardUnavailable />;
  }

  return <AdminDashboard data={data} selectedTimeZone={selectedTimeZone} />;
}
