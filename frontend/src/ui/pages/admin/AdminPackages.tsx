import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchPackages,
  addPackageAsync,
  updatePackageAsync,
  deletePackageAsync,
  Package,
} from "@/store/slices/packagesSlice";

function PackageList({
  items,
  onAdd,
  onEdit,
}: {
  items: Package[];
  onAdd: () => void;
  onEdit: (pkg: Package) => void;
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const filteredItems = items.filter(
    (p) =>
      (p.package_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.package_detail || "").toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const displayedItems = filteredItems.slice(
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
        <h1 className="text-2xl font-bold">Packages Management</h1>
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
            onClick={onAdd}
          >
            Add +
          </button>
        </div>
      </div>

      <div className="mb-2 text-sm text-gray-600 font-bold">
        Total Packages: {filteredItems.length}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="table w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="font-bold text-gray-700">Package Name</th>
              <th className="font-bold text-gray-700">Duration (Days)</th>
              <th className="font-bold text-gray-700">Price (Baht)</th>
              <th className="font-bold text-gray-700">Detail</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.length > 0 ? (
              displayedItems.map((p) => (
                <tr
                  key={p._id || p.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onEdit(p)}
                >
                  <td className="font-medium">{p.package_name}</td>
                  <td>{p.duration} Days</td>
                  <td className="font-bold text-green-600">
                    ฿{p.price.toLocaleString()}
                  </td>
                  <td className="truncate max-w-xs text-gray-500">
                    {p.package_detail}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No packages found.
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

function PackageForm({
  pkg,
  onBack,
  onSave,
  onDelete,
}: {
  pkg: Package | null;
  onBack: () => void;
  onSave: (pkg: Package) => void;
  onDelete: (id: string) => void;
}) {
  const isEdit = pkg !== null;

  const initialData: Package = pkg || {
    package_name: "",
    duration: 30,
    price: 0,
    package_detail: "",
  };

  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "duration" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const handleDeleteClick = () => {
    if (pkg && (pkg._id || pkg.id)) {
      onDelete(pkg._id || pkg.id || "");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <button className="btn btn-ghost mb-4" onClick={onBack}>
        ← Back
      </button>
      <h1 className="text-2xl font-semibold mb-6">
        {isEdit ? "Edit Package" : "Create New Package"}
      </h1>
      <div className="p-6 border rounded-lg shadow-lg bg-white">
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text font-bold">Package Name</span>
          </label>
          <input
            type="text"
            name="package_name"
            value={formData.package_name}
            onChange={handleChange}

            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text font-bold">Duration (Days)</span>
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}

            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text font-bold">Price (Baht)</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}

            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text font-bold">Detail</span>
          </label>
          <input
            type="text"
            name="package_detail"
            value={formData.package_detail}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="flex justify-between pt-4 border-t mt-4">
          {isEdit ? (
            <button
              className="btn btn-error text-white"
              onClick={handleDeleteClick}
            >
              Delete Package
            </button>
          ) : (
            <div />
          )}

          <div className="space-x-2">
            <button className="btn btn-ghost" onClick={onBack}>
              Cancel
            </button>
            <button
              className="btn bg-gray-800 text-white hover:bg-gray-700"
              onClick={handleSubmit}
            >
              {isEdit ? "Save Changes" : "Create Package"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPackages() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.packages.items);
  const loading = useAppSelector((s) => s.packages.loading);

  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  const handleSave = async (pkg: Package) => {
    try {
      if (editingPackage && (pkg._id || pkg.id)) {
        await dispatch(
          updatePackageAsync({ id: pkg._id || pkg.id, data: pkg }),
        ).unwrap();
        alert("Updated successfully");
      } else {
        await dispatch(addPackageAsync(pkg)).unwrap();
        alert("Created successfully");
      }
      setMode("list");
    } catch (error: any) {
      alert("Error saving package: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await dispatch(deletePackageAsync(id)).unwrap();
        setMode("list");
      } catch (error: any) {
        alert("Delete failed: " + error.message);
      }
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setMode("edit");
  };

  const handleAdd = () => {
    setEditingPackage(null);
    setMode("add");
  };

  if (loading && items.length === 0) {
    return <div className="p-10 text-center">Loading packages...</div>;
  }

  return (
    <div className="p-6">
      {mode === "list" ? (
        <PackageList items={items} onAdd={handleAdd} onEdit={handleEdit} />
      ) : (
        <PackageForm
          pkg={editingPackage}
          onBack={() => setMode("list")}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
