import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FaTrash, FaEdit, FaCopy } from 'react-icons/fa';

// Define Type to match data from Mongo
interface Portfolio {
  _id: string;
  title: string;
  cover_image: string;
  is_public: boolean;
  updatedAt: string;
}

export default function MyPorts() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Function to fetch data from Backend
  const fetchPortfolios = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const res = await fetch('https://onlineportfolio-4i6c.onrender.com/api/portfolios/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setPortfolios(data);
      }
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Function to delete portfolio
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://onlineportfolio-4i6c.onrender.com/api/portfolios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchPortfolios(); // Reload after deletion is complete
      }
    } catch (error) {
      alert('Error deleting');
    }
  };

  // 3. Function to Copy Link (for sharing with others)
  const handleCopy = (portId: string) => {
    // Link to view the portfolio (we need to create this page later)
    const url = `${window.location.origin}/view/${portId}`;
    navigator.clipboard.writeText(url);
    alert(`Link copied: ${url}`);
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  // Separate Public / Private groups
  const publicPorts = portfolios.filter(p => p.is_public);
  const privatePorts = portfolios.filter(p => !p.is_public);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen">
      

      {/* --- PUBLIC SECTION --- */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Public</h2>
        <div className="flex flex-wrap gap-6">
          {publicPorts.length > 0 ? (
            publicPorts.map(port => (
              <PortfolioCard 
                key={port._id} 
                port={port} 
                onDelete={() => handleDelete(port._id)} 
                onCopy={() => handleCopy(port._id)}
                onEdit={() => navigate(`/editor?id=${port._id}`)}
              />
            ))
          ) : (
            <p className="text-gray-400 italic">No published portfolios yet</p>
          )}
        </div>
      </div>

      <hr className="my-8 border-gray-200" />

      {/* --- PRIVATE SECTION --- */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Private</h2>
        <div className="flex flex-wrap gap-6">
          {privatePorts.length > 0 ? (
            privatePorts.map(port => (
              <PortfolioCard 
                key={port._id} 
                port={port} 
                onDelete={() => handleDelete(port._id)} 
                onCopy={() => handleCopy(port._id)}
                onEdit={() => navigate(`/editor?id=${port._id}`)}
              />
            ))
          ) : (
            <p className="text-gray-400 italic">No private portfolios yet</p>
          )}
        </div>
      </div>

    </div>
  );
}

// --- Sub Component: Portfolio Card ---
function PortfolioCard({ port, onDelete, onCopy, onEdit }: any) {
    return (
        <div className="w-52 group">
            <div className="flex justify-between items-center mb-1 px-1">
                <p className="text-sm font-medium text-gray-700 truncate w-32" title={port.title}>
                    {port.title}
                </p>
                {/* Delete button */}
                <button onClick={onDelete} className="text-gray-300 hover:text-red-500 transition">
                    <FaTrash size={12} />
                </button>
            </div>
            
            {/* Cover Image Container */}
            <div 
                className="w-52 h-72 bg-gray-100 rounded-xl overflow-hidden relative cursor-pointer border border-gray-200 hover:shadow-lg transition duration-300"
                onClick={onEdit}
            >
                {port.cover_image ? (
                    <img
                        src={port.cover_image} // Base64 can display directly
                        alt={port.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                        <span className="text-4xl mb-2">🖼️</span>
                        <span className="text-xs">No Preview</span>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold flex items-center gap-2">
                        <FaEdit /> Edit
                    </span>
                </div>
            </div>

            {/* Copy Link Button */}
            <button 
                onClick={onCopy} 
                className="btn btn-sm w-full mt-3 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 border-none normal-case font-medium flex items-center justify-center gap-2"
            >
                <FaCopy size={14} />
                Copy link
            </button>
        </div>
    );
}