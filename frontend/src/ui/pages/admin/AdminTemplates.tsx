import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchTemplates } from '@/store/slices/templatesSlice'; // ลบ Template, addTemplate ออกถ้าไม่ได้ใช้ในหน้านี้
import { useNavigate } from 'react-router-dom';

export default function AdminTemplates() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const templates = useAppSelector(s => s.templates.items);
  
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTemplates()); 
  }, [dispatch]);

  const filteredTemplates = templates
    .filter((t: any) => 
      (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.category || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a: any, b: any) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

  const itemsPerPage = 7;
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const displayedTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = () => {
    navigate('/admin/editor');
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Template Management</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-semibold">Search</span>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-64"
            />
           
          </div>
          <button 
            className="btn bg-gray-800 text-white hover:bg-gray-700" 
            onClick={handleAdd}
          >
            Add +
          </button>
        </div>
      </div>

      {/* Templates Count */}
      <div className="text-sm text-gray-600 mb-4 font-bold">
        Total Templates: {filteredTemplates.length}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
        <table className="table w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="font-bold text-gray-700">No.</th>
              <th className="font-bold text-gray-700">Name</th>
              <th className="font-bold text-gray-700">Category</th>
              <th className="font-bold text-gray-700">Created Date</th>
              <th className="font-bold text-gray-700">Status</th>
              <th className="font-bold text-gray-700">Created By</th>
            </tr>
          </thead>
          <tbody>
            {displayedTemplates.length > 0 ? (
              displayedTemplates.map((template: any, index: number) => {
                const actualIndex = (currentPage - 1) * itemsPerPage + index + 1;
                const displayId = String(actualIndex).padStart(2, '0');

                return (
                  <tr 
                    key={template.id || template._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/admin/templates/${template._id || template.id}`)}
                  >
                    <td className="font-bold text-gray-500">{displayId}</td>
                    <td className="font-medium">{template.name}</td>
                    <td>{template.category}</td>
                    <td className="text-gray-600">
                      {template.createdAt 
                        ? new Date(template.createdAt).toLocaleDateString('en-GB') 
                        : '-'}
                    </td>
                    <td>
                      
                      <span className={`badge ${
                        template.active ? 'badge-success text-white' : 'badge-ghost text-gray-500'
                      }`}>
                        {template.active ? 'Published' : 'Unpublished'}
                      </span>
                    </td>
                    <td>
                      {template.createdBy ? (
                        <span className="badge badge-ghost text-xs font-medium">
                          {template.createdBy.firstname} {template.createdBy.lastname}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
               <tr>
                 <td colSpan={6} className="text-center py-8 text-gray-500">
                   No template found
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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