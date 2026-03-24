"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "@/lib/actions/admin";
import { UserRole } from "@/types/user";

export default function UserRoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: UserRole;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    setError(null);
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error updating role");
      }
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <select
        className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50 bg-white px-3 py-2 border"
        defaultValue={currentRole}
        onChange={handleRoleChange}
        disabled={isPending}
        aria-label="User role"
        title="User role"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      {error && (
        <span className="text-xs text-red-600 absolute mt-10">{error}</span>
      )}
      {isPending && (
        <span className="text-xs text-blue-500 absolute mt-10">
          Actualizando...
        </span>
      )}
    </div>
  );
}
