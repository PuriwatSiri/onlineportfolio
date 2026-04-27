import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  updateTemplateAsync,
  deleteTemplateAsync,
  fetchTemplates,
} from "@/store/slices/templatesSlice";

const TemplateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { items, loading } = useAppSelector((state) => state.templates);

  const template = items.find((t) => t.id === id || t._id === id);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Academic");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (!template && !loading) {
      dispatch(fetchTemplates());
    }
  }, [dispatch, template, loading]);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setCategory(template.category);
      setStatus(template.active);
    }
  }, [template]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Template not found</div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!template) return;

    try {
      const targetId = template._id || template.id;

      if (!targetId) {
        alert("Error: Missing Template ID");
        return;
      }

      const payload = {
        ...template,
        name: name,
        category: category,
        active: status,
      };

      delete (payload as any)._id;

      console.log("Sending Update:", targetId, payload);

      await dispatch(
        updateTemplateAsync({
          id: targetId,
          data: payload,
        }),
      ).unwrap();

      alert("Template updated successfully");
    } catch (error: any) {
      console.error("Update Failed:", error);

      alert(
        "Error updating template: " +
          (error.message || "Check Console (F12) for details"),
      );
    }
  };

  const handleDelete = async () => {
    if (
      !template ||
      !window.confirm("Are you sure you want to delete this template?")
    )
      return;

    try {
      const templateId = template._id || template.id || "";
      if (!templateId) {
        alert("Error: Missing Template ID");
        return;
      }
      await dispatch(deleteTemplateAsync(templateId)).unwrap();
      alert("Template deleted successfully");
      navigate("/admin/templates");
    } catch (error: any) {
      console.error("Delete error:", error);
      alert("Error deleting template: " + error.message || error);
    }
  };

  const handleEditTemplate = () => {
    const templateId = template._id || template.id;

    navigate(`/admin/editor?template=${templateId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Template Management</h1>

      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="text-xl font-semibold mb-8">{template.id}</div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-[120px_1fr] items-center">
              <label className="font-semibold">Template ID</label>
              <div className="text-gray-700 font-medium">{template.id}</div>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center">
              <label className="font-semibold">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full max-w-xs"
              />
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center">
              <label className="font-semibold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select select-bordered w-full max-w-xs"
              >
                <option value="Academic">Academic</option>
                <option value="Technology">Technology</option>
                <option value="Sports">Sports</option>
                <option value="Arts">Arts</option>
                <option value="Food">Food</option>
                <option value="Music">Music</option>
              </select>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center">
              <label className="font-semibold">Status</label>
              <select
                value={status ? "Published" : "Unpublished"}
                onChange={(e) => setStatus(e.target.value === "Published")}
                className="select select-bordered w-full max-w-xs"
              >
                <option>Published</option>
                <option>Unpublished</option>
              </select>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center">
              <label className="font-semibold">Used</label>
              <div className="font-medium">{template?.usageCount || 0}</div>
            </div>

            <button
              className="btn btn-neutral max-w-xs mt-4"
              onClick={handleEditTemplate}
            >
              Edit Template
            </button>
          </div>

          <div className="flex-1">
            <label className="font-semibold mb-2 block">Preview</label>
            <div className="bg-white aspect-[3/4] w-full max-w-sm rounded border flex items-center justify-center">
              {template.preview ? (
                <img
                  src={template.preview}
                  alt={template.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-400">Preview</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handleDelete}
          className="btn bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </button>

        <div className="space-x-2">
          <button
            onClick={() => navigate("/admin/templates")}
            className="btn bg-gray-600 text-white hover:bg-gray-700"
          >
            Back
          </button>
          <button
            onClick={handleSave}
            className="btn bg-gray-900 text-white hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetail;
