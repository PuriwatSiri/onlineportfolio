import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks";
import { reportIssueAsync, fetchMyIssues } from "@/store/slices/issuesSlice";
import { useNavigate } from "react-router-dom";

type CurrentUser = {
  id?: string;
  _id?: string;
  firstname?: string;
  lastname?: string;
  role: string;
  proExpiryDate?: string;
};

type Form = { title: string; description: string; category: string };

export default function ReportIssue() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = useAppSelector(
    (s) => s.auth.currentUser,
  ) as CurrentUser | null;

  const firstName = currentUser?.firstname || "Guest";
  const lastNameInitial =
    currentUser?.lastname && currentUser.lastname.length > 0
      ? currentUser.lastname.slice(0, 1)
      : "";

  const userIdForSubmit = currentUser?.id || currentUser?._id || "";

  const { register, handleSubmit, reset } = useForm<Form>({
    defaultValues: { category: "System" },
  });
  const dispatch = useAppDispatch();
  const myIssues = useAppSelector((s) => s.issues.items);
  const [viewMode, setViewMode] = useState<"form" | "list" | "detail">("form");
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(fetchMyIssues());
  }, [dispatch, navigate, token]);

  const submit = async (d: Form) => {
    await dispatch(reportIssueAsync({ ...d, user_id: userIdForSubmit }));
    reset();
    alert("Report submitted successfully!");
    dispatch(fetchMyIssues());
    setViewMode("list");
  };
  if (!token) return null;

  return (
    <div className="p-6 md:p-8 min-h-screen">
      {viewMode === "form" && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold mb-4">Report Issues</h1>
            <button
              className="btn btn-outline"
              onClick={() => setViewMode("list")}
            >
              📋 View My Report Issues
            </button>
          </div>

          <form
            className="space-y-6 max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            onSubmit={handleSubmit(submit)}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-2 flex-[2]">
                <label className="text-gray-700 font-semibold text-lg">
                  Title
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:outline-none focus:border-gray-400"
                  {...register("title", { required: true })}
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-700 font-semibold text-lg">
                  Category
                </label>
                <select
                  className="select select-bordered w-full focus:outline-none focus:border-gray-400"
                  {...register("category")}
                >
                  <option value="System">System</option>
                  <option value="Template Tool">Template Tool</option>
                  <option value="Payment">Payment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-semibold text-lg">
                Description
              </label>
              <textarea
                className="textarea textarea-bordered w-full min-h-[250px] resize-none focus:outline-none focus:border-gray-400"
                {...register("description", { required: true })}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                className="btn btn-ghost bg-gray-100 hover:bg-gray-200 text-gray-800 flex-1"
                onClick={() => reset()}
              >
                Clear All
              </button>
              <button
                type="submit"
                className="btn bg-gray-800 hover:bg-gray-900 text-white border-none flex-[2]"
              >
                Send Report
              </button>
            </div>
          </form>
        </div>
      )}

      {viewMode === "list" && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-8">
            <button
              onClick={() => setViewMode("form")}
              className="btn btn-ghost btn-circle -ml-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">My Report Issues</h1>
          </div>

          {myIssues.length === 0 ? (
            <div className="text-gray-500 bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
              No report issues submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
              <table className="table w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 font-bold text-gray-700">Report Issues ID</th>
                    <th className="py-4 font-bold text-gray-700">
                      Submission Date
                    </th>
                    <th className="py-4 font-bold text-gray-700">Title</th>
                    <th className="py-4 font-bold text-gray-700">Category</th>
                    <th className="py-4 font-bold text-gray-700">Status</th>
                    <th className="py-4 font-bold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myIssues.map((i) => {
                    const dateToFormat =
                      i.report_date || i.reportDate || new Date().toISOString();

                    return (
                      <tr
                        key={i._id}
                        className="hover:bg-gray-50 border-b-gray-100"
                      >
                        <td className="font-mono text-xs font-semibold text-gray-600">
                          {i.issueId || i._id}
                        </td>

                        <td className="text-sm">
                          {new Date(dateToFormat).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        <td className="font-semibold">{i.title}</td>
                        <td>{i.category || "System"}</td>
                        <td>
                          <span
                            className={`badge ${
                              i.status === "resolved"
                                ? "badge-success text-white"
                                : i.status === "rejected"
                                  ? "badge-error text-white"
                                  : i.status === "in_progress"
                                    ? "badge-info text-white"
                                    : "badge-warning"
                            }`}
                          >
                            {i.status === "in_progress"
                              ? "In Progress"
                              : i.status === "resolved"
                                ? "Resolved"
                                : i.status === "rejected"
                                  ? "Rejected"
                                  : "Pending"}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline btn-info px-4"
                            onClick={() => {
                              setSelectedIssue(i);
                              setViewMode("detail");
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {viewMode === "detail" && selectedIssue && (
        <div className="max-w-3xl animate-fade-in">
          <div className="mb-4">
            <button
              onClick={() => setViewMode("list")}
              className="btn btn-ghost btn-circle -ml-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-start mb-6 border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedIssue.title}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Category : {selectedIssue.category || "System"},{" "}
                  {new Date(
                    selectedIssue.report_date || selectedIssue.reportDate || "",
                  ).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span
                className={`badge ${
                  selectedIssue.status === "resolved"
                    ? "badge-success text-white"
                    : selectedIssue.status === "rejected"
                      ? "badge-error text-white"
                      : selectedIssue.status === "in_progress"
                        ? "badge-info text-white"
                        : "badge-warning"
                }`}
              >
                {selectedIssue.status === "in_progress"
                  ? "In Progress"
                  : selectedIssue.status === "resolved"
                    ? "Resolved"
                    : selectedIssue.status === "rejected"
                      ? "Rejected"
                      : "Pending"}
              </span>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl mb-4 border border-gray-100">
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed break-all">
                {selectedIssue.detail || selectedIssue.description}
              </p>
            </div>

            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <p className="text-sm font-semibold text-blue-800 mb-2">
                Admin Response :
              </p>
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed break-all">
                {selectedIssue.note || "No response from admin yet."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
