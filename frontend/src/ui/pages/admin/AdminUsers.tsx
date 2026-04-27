import React, { useEffect, useState } from "react";

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  status?: "Active" | "Suspended";
  packageExpire?: string;
  createdAt?: string;
}

function UserList({
  users,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onAddUser,
}: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 7;

  const filteredUsers = users.filter(
    (u: any) =>
      (u.firstname || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.lastname || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-semibold">Search</span>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="input input-bordered w-64"
            />
          </div>
          <button
            className="btn bg-gray-800 text-white hover:bg-gray-700"
            onClick={onAddUser}
          >
            Add +
          </button>
        </div>
      </div>

      <div className="mb-2 text-sm text-gray-600 font-bold">
        Total Users : {filteredUsers.length}
      </div>

      <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
        <table className="table w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="font-bold text-gray-700">Name</th>
              <th className="font-bold text-gray-700">Email</th>
              <th className="font-bold text-gray-700">Role</th>
              <th className="font-bold text-gray-700">Status</th>
              <th className="font-bold text-gray-700">Package Expired</th>
              <th className="font-bold text-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.length > 0 ? (
              displayedUsers.map((u: any) => {
                const isExpired = u.packageExpire
                  ? new Date(u.packageExpire) < new Date()
                  : true;
                const expireText = u.packageExpire
                  ? new Date(u.packageExpire).toLocaleDateString("en-GB")
                  : "No Package";

                return (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td>
                      {u.firstname} {u.lastname}
                    </td>

                    <td>{u.email}</td>

                    <td>
                      <span
                        className={`badge ${u.role === "admin" ? "badge-primary text-white" : "badge-ghost"}`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${u.status === "Suspended" ? "badge-error text-white" : "badge-success text-white"}`}
                      >
                        {u.status || "Active"}
                      </span>
                    </td>

                    <td>
                      {u.role === "admin" ? (
                        <span className="badge badge-info text-white">
                          Lifetime Access
                        </span>
                      ) : u.packageExpire ? (
                        <span
                          className={`badge ${isExpired ? "badge-error text-white" : "badge-success text-white"}`}
                        >
                          {isExpired
                            ? `Expired on ${expireText}`
                            : `Active until ${expireText}`}
                        </span>
                      ) : (
                        <span className="badge badge-ghost text-gray-400">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-xs btn-outline btn-info mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditUser(u);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-xs btn-outline btn-error"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteUser(u._id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  User not found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-600 font-medium">
          Page {currentPage} of {totalPages === 0 ? 1 : totalPages}
        </span>
        <div className="space-x-2">
          <button
            className="btn btn-sm bg-gray-800 text-white hover:bg-gray-700 disabled:bg-gray-300 disabled:text-gray-500"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="btn btn-sm bg-gray-800 text-white hover:bg-gray-700 disabled:bg-gray-300 disabled:text-gray-500"
            onClick={handleNext}
            disabled={currentPage >= totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function UserForm({ user, onSave, onCancel }: any) {
  const isEdit = !!user;

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    role: user?.role || "user",
    status: user?.status || "Active",
    password: "",
    packageExpire: formatDateForInput(user?.packageExpire),
  });

  const addDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const offset = d.getTimezoneOffset() * 60000;
    const localDateTime = new Date(d.getTime() - offset)
      .toISOString()
      .slice(0, 16);
    setFormData({ ...formData, packageExpire: localDateTime });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && !formData.password)
      return alert("Password is required for new users.");

    let finalExpire = null;
    if (formData.packageExpire) {
      finalExpire = new Date(formData.packageExpire).toISOString();
    }

    const payload = { ...formData, packageExpire: finalExpire };
    onSave(payload);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <button className="btn btn-ghost mb-4" onClick={onCancel}>
        ← Back to List
      </button>
      <div className="card bg-base-100 shadow-xl border border-gray-200">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">
            {isEdit ? "Edit User & Package" : "Create New User"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label font-semibold">Firstname</label>
                <input
                  required
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.firstname}
                  onChange={(e) =>
                    setFormData({ ...formData, firstname: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label font-semibold">Lastname</label>
                <input
                  required
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.lastname}
                  onChange={(e) =>
                    setFormData({ ...formData, lastname: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="label font-semibold">Email</label>
              <input
                required
                type="email"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label font-semibold">Role</label>
                <select
                  className="select select-bordered w-full"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="label font-semibold">Status</label>
                <select
                  className="select select-bordered w-full"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="font-medium text-gray-500">Current Package</div>
            <div className="col-span-2 font-bold flex items-center gap-2">
              <span
                className={`badge text-white ${
                  user.role === "admin"
                    ? "badge-info"
                    : user.packageExpire &&
                        new Date(user.packageExpire) > new Date()
                      ? "badge-primary"
                      : "bg-gray-400 border-none"
                }`}
              >
                {user.role === "admin"
                  ? "Admin Access"
                  : user.packageExpire &&
                      new Date(user.packageExpire) > new Date()
                    ? user.packageId?.package_name ||
                      user.packageId?.name ||
                      "Active Plan"
                    : "Free"}
              </span>
            </div>

            <div className="font-medium text-gray-500">Expiration Date</div>
            <div className="col-span-2 font-bold">
              {user.role === "admin" ? (
                <span className="text-green-600">Lifetime (Admin)</span>
              ) : user.packageExpire ? (
                <span className="text-red-500">
                  Expire on :{" "}
                  {new Date(user.packageExpire).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              ) : (
                <span className="text-gray-400">No active package</span>
              )}
            </div>

            <div className="card-actions justify-end mt-6 pt-4 border-t">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary text-white">
                {isEdit ? "Save Changes" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function UserDetailForm({ user, onBack, onStatusChange }: any) {
  const currentStatus = user.status || "Active";
  const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <button className="btn btn-ghost mb-4" onClick={onBack}>
        ← Back to List
      </button>
      <div className="card bg-base-100 shadow-xl border border-gray-200">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">User Details</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="label text-gray-500 pb-0">Name</label>
              <div className="font-bold text-lg">
                {user.firstname} {user.lastname}
              </div>
            </div>
            <div>
              <label className="label text-gray-500 pb-0">Email</label>
              <div className="font-bold text-lg">{user.email}</div>
            </div>
            <div>
              <label className="label text-gray-500 pb-0">Role</label>
              <div className="badge badge-lg badge-outline">{user.role}</div>
            </div>
            <div>
              <label className="label text-gray-500 pb-0">Status</label>
              <div
                className={`badge badge-lg ${currentStatus === "Active" ? "badge-success text-white" : "badge-error text-white"}`}
              >
                {currentStatus}
              </div>
            </div>
          </div>
          <div className="card-actions justify-end mt-8 pt-4 border-t">
            <button
              className={`btn ${nextStatus === "Suspended" ? "btn-error text-white" : "btn-success text-white"}`}
              onClick={() => onStatusChange(user._id, nextStatus)}
            >
              {nextStatus === "Suspended" ? "Suspend User" : "Activate User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "detail" | "form">("list");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "https://onlineportfolio-4i6c.onrender.com/api/users",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();

      console.log("backend", data);

      if (res.ok) {
        if (Array.isArray(data)) setUsers(data);
        else if (data.users && Array.isArray(data.users)) setUsers(data.users);
        else setUsers([]);
      } else {
        alert(`Error! : ${data.message || "Access Denied"}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveUser = async (formData: any) => {
    const token = localStorage.getItem("token");
    const isEdit = !!selectedUser;
    if (isEdit && !formData.password) delete formData.password;

    const url = isEdit
      ? `https://onlineportfolio-4i6c.onrender.com/api/users/${selectedUser._id}`
      : `https://onlineportfolio-4i6c.onrender.com/api/users`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert(isEdit ? "Updated successfully!" : "Created successfully!");
        fetchUsers();
        setViewMode("list");
      } else {
        const err = await res.json();
        alert(`Failed: ${err.message}`);
      }
    } catch (error) {
      alert("Error saving user.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://onlineportfolio-4i6c.onrender.com/api/users/${userId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.ok) fetchUsers();
    } catch (error) {
      alert("Error deleting user.");
    }
  };

  const handleStatusChange = async (
    userId: string,
    newStatus: "Active" | "Suspended",
  ) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://onlineportfolio-4i6c.onrender.com/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u)),
        );
        if (selectedUser && selectedUser._id === userId)
          setSelectedUser((prev) =>
            prev ? { ...prev, status: newStatus } : null,
          );
        alert("Status updated!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading users...</div>;

  return (
    <div className="p-6">
      {viewMode === "detail" && selectedUser && (
        <UserDetailForm
          user={selectedUser}
          onBack={() => setViewMode("list")}
          onStatusChange={handleStatusChange}
        />
      )}
      {viewMode === "form" && (
        <UserForm
          user={selectedUser}
          onSave={handleSaveUser}
          onCancel={() => setViewMode("list")}
        />
      )}
      {viewMode === "list" && (
        <UserList
          users={users}
          onViewUser={(u: any) => {
            setSelectedUser(u);
            setViewMode("detail");
          }}
          onEditUser={(u: any) => {
            setSelectedUser(u);
            setViewMode("form");
          }}
          onDeleteUser={handleDeleteUser}
          onAddUser={() => {
            setSelectedUser(null);
            setViewMode("form");
          }}
        />
      )}
    </div>
  );
}
