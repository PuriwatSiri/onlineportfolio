import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchIssues,
  updateIssueAsync,
  Issue,
} from "@/store/slices/issuesSlice";

function ReportList({
  items,
  onSelectReport,
}: {
  items: Issue[];
  onSelectReport: (issue: Issue) => void;
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const filteredItems = items.filter((issue) => {
    const firstName = (issue.user_id?.firstname || "").toLowerCase();
    const lastName = (issue.user_id?.lastname || "").toLowerCase();
    const title = (issue.title || "").toLowerCase();
    const category = (issue.category || "").toLowerCase();
    const reportId = (issue.issueId || issue._id || "").toLowerCase();

    let statusStr = (issue.status || "").toLowerCase();
    if (statusStr === "in_progress") statusStr = "in progress";

    const searchStr = search.toLowerCase();

    return (
      reportId.includes(searchStr) ||
      firstName.includes(searchStr) ||
      lastName.includes(searchStr) ||
      title.includes(searchStr) ||
      category.includes(searchStr) ||
      statusStr.includes(searchStr)
    );
  });

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const sortedItems = [...filteredItems].sort((a: any, b: any) => {
    const isPendingA = a.status === "pending" || a.status === "open";
    const isPendingB = b.status === "pending" || b.status === "open";

    if (isPendingA && !isPendingB) return -1;
    if (!isPendingA && isPendingB) return 1;

    const dateA = new Date(a.report_date || a.reportDate || 0).getTime();
    const dateB = new Date(b.report_date || b.reportDate || 0).getTime();
    return dateB - dateA;
  });

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const displayedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports Management</h1>
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
        Total Reports: {filteredItems.length}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="table w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="font-bold text-gray-700">Report ID</th>
              <th className="font-bold text-gray-700">User Name</th>
              <th className="font-bold text-gray-700">Title</th>
              <th className="font-bold text-gray-700">Category</th>
              <th className="font-bold text-gray-700">Status</th>
              <th className="font-bold text-gray-700">Date</th>
              <th className="font-bold text-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.length > 0 ? (
              displayedItems.map((issue: any) => {
                const fullName =
                  `${issue.user_id?.firstname || ""} ${issue.user_id?.lastname || ""}`.trim();

                return (
                  <tr
                    key={issue._id}
                    className="hover:bg-gray-50 border-b-gray-100"
                  >
                    <td className="font-mono text-gray-600">
                      {issue.issueId || issue._id.substring(0, 8)}
                    </td>

                    <td title={fullName}>{truncateText(fullName, 15)}</td>

                    <td className="font-medium" title={issue.title}>
                      {truncateText(issue.title, 10)}
                    </td>

                    <td>{issue.category || "System"}</td>

                    <td>
                      <span
                        className={`badge text-white ${
                          issue.status === "resolved"
                            ? "badge-success"
                            : issue.status === "in_progress"
                              ? "badge-warning"
                              : issue.status === "rejected"
                                ? "badge-error"
                                : "badge-info"
                        }`}
                      >
                        {issue.status}
                      </span>
                    </td>

                    <td className="text-gray-600">
                      {new Date(
                        issue.report_date ||
                          issue.reportDate ||
                          issue.createdAt,
                      ).toLocaleDateString()}
                    </td>

                    <td className="text-center space-x-2">
                      <button
                        className="btn btn-xs bg-gray-800 text-white hover:bg-gray-700"
                        onClick={() => onSelectReport(issue)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No reports found.
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

function ReportDetailForm({
  issue,
  onBack,
  onSave,
}: {
  issue: Issue;
  onBack: () => void;
  onSave: (issue: Issue) => void;
}) {
  const [formData, setFormData] = useState(issue);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-xl mx-auto">
      <button className="btn btn-ghost mb-4" onClick={onBack}>
        ← Back
      </button>
      <h1 className="text-2xl font-semibold mb-6">Report Detail</h1>

      <div className="p-8 border rounded-lg shadow-lg bg-white">
        <div className="text-xl font-bold mb-4 border-b pb-2">
          {issue.user_id?.firstname} {issue.user_id?.lastname}
        </div>

        <div className="grid grid-cols-3 gap-y-4 text-md mb-4 mt-4">
          <div className="font-medium text-gray-500">Title</div>
          <div className="col-span-2 font-bold">{formData.title}</div>
          <div className="font-medium text-gray-500">Category</div>
          <div className="col-span-2 font-bold">
            {formData.category || "System"}
          </div>
          <div className="font-medium text-gray-500 flex items-center">
            Status
          </div>
          <div className="col-span-2 font-bold">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="select select-bordered w-full max-w-xs"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="font-medium text-gray-500">Detail</div>
          <div className="col-span-2 font-normal whitespace-normal bg-gray-50 p-3 rounded border">
            {formData.description}
          </div>
        </div>

        <div className="form-control mt-6">
          <label className="label">
            <span className="label-text font-bold text-gray-700">
              Admin Note
            </span>
          </label>
          <textarea
            name="note"
            value={formData.note || ""}
            onChange={handleChange}
            className="textarea textarea-bordered h-24 w-full"
          ></textarea>
        </div>

        <div className="flex justify-end mt-8 pt-4 border-t space-x-2">
          <button className="btn btn-ghost" onClick={onBack}>
            Cancel
          </button>
          <button
            className="btn bg-gray-800 text-white hover:bg-gray-700"
            onClick={() => onSave(formData)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminIssues() {
  const items = useAppSelector((s) => s.issues.items);
  const dispatch = useAppDispatch();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    dispatch(fetchIssues());
  }, [dispatch]);

  const handleSave = async (issue: Issue) => {
    if (issue._id) {
      await dispatch(updateIssueAsync({ id: issue._id, data: issue })).unwrap();
      alert("Saved successfully!");
      setSelectedIssue(null);
      dispatch(fetchIssues());
    }
  };

  return (
    <div className="p-6">
      {selectedIssue ? (
        <ReportDetailForm
          issue={selectedIssue}
          onBack={() => setSelectedIssue(null)}
          onSave={handleSave}
        />
      ) : (
        <ReportList items={items} onSelectReport={(u) => setSelectedIssue(u)} />
      )}
    </div>
  );
}
