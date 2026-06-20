"use client";

import { useState, useMemo } from "react";
import { UserPlus, Users, UserCheck, UserX } from "lucide-react";
import { mockUsers } from "@/lib/usersData";
import type { User } from "@/lib/types";
import { UserFilters }  from "@/components/users/UserFilters";
import { UsersTable }   from "@/components/users/UsersTable";
import { Pagination }   from "@/components/users/Pagination";
import { AddUserModal } from "@/components/users/AddUserModal";

const PAGE_SIZE_DEFAULT = 10;

function SummaryCard({
  label, value, icon: Icon, color,
}: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className={`bg-white rounded-2xl px-4 py-3.5 ring-1 ring-inset ${color} flex items-center gap-3`}>
      <div className="flex-shrink-0">
        <Icon size={18} className="text-zinc-400" />
      </div>
      <div>
        <p className="text-xl font-bold text-zinc-900 leading-none">{value}</p>
        <p className="text-xs text-zinc-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users,        setUsers]        = useState<User[]>(mockUsers);
  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState<User["role"] | "All">("All");
  const [statusFilter, setStatusFilter] = useState<User["status"] | "All">("All");
  const [page,         setPage]         = useState(1);
  const [pageSize,     setPageSize]     = useState(PAGE_SIZE_DEFAULT);
  const [showModal,    setShowModal]    = useState(false);

  /* Derived summary counts */
  const activeCount    = users.filter((u) => u.status === "Active").length;
  const inactiveCount  = users.filter((u) => u.status !== "Active").length;

  /* Filter */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchRole   = roleFilter   === "All" || u.role   === roleFilter;
      const matchStatus = statusFilter === "All" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  /* Paginate */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* Reset page when filters change */
  function handleSearch(v: string)               { setSearch(v);       setPage(1); }
  function handleRoleChange(v: User["role"] | "All")     { setRoleFilter(v);   setPage(1); }
  function handleStatusChange(v: User["status"] | "All") { setStatusFilter(v); setPage(1); }

  function handleAddUser(data: Omit<User, "id" | "sessions" | "avatar">) {
    const initials = data.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    const newUser: User = {
      ...data,
      id:       `u${Date.now()}`,
      avatar:   initials,
      sessions: 0,
    };
    setUsers((prev) => [newUser, ...prev]);
  }

  function handleDelete(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto relative">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <AddUserModal
            open={showModal}
            onClose={() => setShowModal(false)}
            onAdd={handleAddUser}
          />
        </div>
      )}

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-zinc-900 font-bold text-xl tracking-tight">Users</h2>
          <p className="text-zinc-400 text-sm mt-0.5">
            Manage team members, roles, and access permissions.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[.98] text-white text-sm font-medium transition-all shadow-sm shadow-violet-200"
        >
          <UserPlus size={15} />
          Add user
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <SummaryCard label="Total users"   value={users.length}  icon={Users}     color="ring-zinc-100" />
        <SummaryCard label="Active users"  value={activeCount}   icon={UserCheck} color="ring-emerald-100" />
        <SummaryCard label="Inactive / suspended" value={inactiveCount} icon={UserX} color="ring-red-100" />
      </div>

      {/* Filters */}
      <UserFilters
        search={search}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onSearch={handleSearch}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        totalShown={filtered.length}
        totalAll={users.length}
      />

      {/* Table */}
      <UsersTable users={paginated} onDelete={handleDelete} />

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        total={filtered.length}
        onPage={setPage}
        onPageSize={(s) => { setPageSize(s); setPage(1); }}
      />
    </div>
  );
}
