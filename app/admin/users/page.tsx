import { createClient } from "@/lib/supabase/server";
import UserRoleSelect from "./UserRoleSelect";
import { UserRole } from "@/types/user";
import AdminUserSearch from "../components/AdminUserSearch";
import AdminAddUserDrawer from "../components/AdminAddUserDrawer";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function AdminUsersPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q as string;
  const supabase = await createClient();

  let query = supabase
    .from("user_roles")
    .select("id, email, role")
    .order("email");

  if (q) {
    query = query.ilike('email', `%${q}%`);
  }

  const { data: users, error } = await query;

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Error al cargar usuarios: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            User Directory
          </h2>
          <p className="text-sm text-gray-500">Manage user access and roles for your properties.</p>
        </div>
        <div className="flex items-center gap-4">
          <AdminUserSearch />
          <AdminAddUserDrawer />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol Actual
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {u.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {u.id.split("-")[0]}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <UserRoleSelect
                    userId={u.id}
                    currentRole={u.role as UserRole}
                  />
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
