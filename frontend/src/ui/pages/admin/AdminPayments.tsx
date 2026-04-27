import React, { useEffect, useState } from "react";

interface Payment {
  _id: string;
  paymentId?: string;
  user_id:
    | { _id: string; firstname: string; lastname: string; email: string }
    | string;
  amount: number;
  payment_slip?: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
  created_at?: string;
  package_id?: any;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const fetchPayments = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "https://onlineportfolio-4i6c.onrender.com/api/admin/payments",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) setPayments(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleApprove = async (paymentId: string) => {
    if (
      !confirm(
        "Are you sure you want to approve this slip and add time to the user's package?",
      )
    )
      return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://onlineportfolio-4i6c.onrender.com/api/admin/payments/${paymentId}/approve`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        alert("Approved and updated package time successfully!");
        fetchPayments();
      } else {
        const err = await res.json();
        alert(`Error: ${err.message}`);
      }
    } catch (error) {
      alert("Network Error");
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!confirm("Are you sure you want to reject this slip?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://onlineportfolio-4i6c.onrender.com/api/admin/payments/${paymentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "rejected" }),
        },
      );
      if (res.ok) {
        alert("Slip rejected successfully.");
        fetchPayments();
      } else {
        const err = await res.json();
        alert(`Error: ${err.message}`);
      }
    } catch (error) {
      alert("Network Error");
    }
  };

  const filteredPayments = payments.filter((p: any) => {
    const user = typeof p.user_id === "object" ? p.user_id : null;

    const paymentId = (p.paymentId || p._id || "").toLowerCase();
    const firstName = (user?.firstname || "").toLowerCase();
    const lastName = (user?.lastname || "").toLowerCase();
    const email = (user?.email || "").toLowerCase();
    const pkgName = (p.package_id?.package_name || "").toLowerCase();
    const amountStr = (p.amount || "").toString();
    const statusStr = (p.status || "").toLowerCase();

    const searchStr = search.toLowerCase();

    return (
      paymentId.includes(searchStr) ||
      firstName.includes(searchStr) ||
      lastName.includes(searchStr) ||
      email.includes(searchStr) ||
      pkgName.includes(searchStr) ||
      amountStr.includes(searchStr) ||
      statusStr.includes(searchStr)
    );
  });
  const sortedPayments = [...filteredPayments].sort((a: any, b: any) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
    const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
    return dateB - dateA;
  });

  const totalPages = Math.ceil(sortedPayments.length / itemsPerPage);
  const displayedPayments = sortedPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  if (loading)
    return <div className="p-10 text-center">Loading payments...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payments Management</h1>
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
        </div>
      </div>

      <div className="mb-2 text-sm text-gray-600 font-bold">
        Total Payments: {filteredPayments.length}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="table w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="font-bold text-gray-700">Payment ID</th>
              <th className="font-bold text-gray-700">Submission Date</th>
              <th className="font-bold text-gray-700">User</th>
              <th className="font-bold text-gray-700">Package</th>
              <th className="font-bold text-gray-700">Paid Amount (Baht)</th>
              <th className="font-bold text-gray-700">Slip</th>
              <th className="font-bold text-gray-700">Status</th>
              <th className="font-bold text-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedPayments.length > 0 ? (
              displayedPayments.map((p) => {
                const userObj =
                  typeof p.user_id === "object" ? p.user_id : null;
                const dateToFormat =
                  p.createdAt || p.created_at || new Date().toISOString();
                return (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="font-mono text-xs font-semibold text-gray-600">
                      {p.paymentId || p._id}
                    </td>
                    <td>
                      {new Date(dateToFormat).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>
                      {userObj ? (
                        <>
                          <div className="font-bold">
                            {userObj.firstname} {userObj.lastname}
                          </div>
                          <div className="text-xs text-gray-500">
                            {userObj.email}
                          </div>
                        </>
                      ) : (
                        "User ID: " + p.user_id
                      )}
                    </td>
                    <td>{(p as any).package_id?.package_name || "-"}</td>
                    <td className="font-bold text-green-600">฿{p.amount}</td>
                    <td>
                      {p.payment_slip ? (
                        <a
                          href={
                            p.payment_slip.startsWith("http")
                              ? p.payment_slip
                              : `https://onlineportfolio-4i6c.onrender.com/${p.payment_slip}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-xs bg-gray-800 text-white hover:bg-gray-700"
                        >
                          View Slip
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${p.status === "approved" ? "badge-success text-white" : p.status === "rejected" ? "badge-error text-white" : "badge-warning"}`}
                      >
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>
                    <td className="text-center">
                      {p.status === "pending" ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleApprove(p._id)}
                            className="btn btn-xs btn-success text-white"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(p._id)}
                            className="btn btn-xs btn-error text-white"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm font-semibold">
                          Reviewed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  No payments found.
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
