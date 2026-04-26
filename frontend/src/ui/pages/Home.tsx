import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks';
import { fetchTemplates } from '@/store/slices/templatesSlice';

interface Portfolio {
  _id: string;
  title: string;
  cover_image: string;
  updatedAt: string;
}

export default function Home() {
  const dispatch = useAppDispatch();
  const templates = useAppSelector((s) => s.templates.items);
  
  const { currentUser } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  
  const [myPortfolios, setMyPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token; 

  const handleEditClick = (templateId: string) => {
    if (!currentUser) {
      alert('Please log in to edit this template');
      navigate('/login');
      return;
    }
    
    navigate(`/editor?template=${templateId}`);
  };

  useEffect(() => {
    dispatch(fetchTemplates());

    const fetchPortfolios = async () => {
      if (!token) {
        setMyPortfolios([]);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch('https://onlineportfolio-4i6c.onrender.com/api/portfolios/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setMyPortfolios(data);
        }
      } catch (error) {
        console.error("Failed to fetch portfolios", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [dispatch, token]);

  return (
    <div className="container-max mx-auto p-4">
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Random Template</h2>
        
        {templates.length === 0 ? (
           <div className="text-gray-400">No templates available.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {templates
            .filter(x => x.active)
            .slice(0, 3).map(x => (
              <div key={x.id || x._id} className="card bg-base-100 shadow card-hover rounded-lg overflow-hidden border border-gray-100">
                <figure className="h-48 bg-gray-200">
                  <img 
                    src={x.preview || x.thumbnail || "https://via.placeholder.com/300x200?text=No+Preview"} 
                    alt={x.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Image+Error";
                    }}
                  />
                </figure>
                <div className="card-body p-4">
                  <h3 className="card-title text-lg font-semibold">{x.name}</h3>
                  <p className="text-sm opacity-70">{x.category}</p>
                  <div className="card-actions justify-end mt-2">
                    
                    <button 
                      onClick={() => handleEditClick(x.id || x._id || '')}
                      className="btn btn-sm bg-black text-white hover:bg-gray-800"
                    >
                      Edit
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Recents Portfolios</h2>
          {isLoggedIn && (
            <Link to="/editor" className="btn btn-sm btn-outline">
              + Create New
            </Link>
          )}
        </div>

        {!isLoggedIn ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
              <div className="text-center">
                  <p className="text-xl text-gray-600 font-medium mb-2">Please log in to continue.</p>
                  <Link to="/login" className="btn bg-black text-white hover:bg-gray-800 px-8 border-none">Login</Link>
              </div>
            </div>
        ) : (
            <>
                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : myPortfolios.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500 mb-2">You don't have a Portfolio yet</p>
                        <Link to="/editor" className="text-blue-600 hover:underline">Create your first one!</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {myPortfolios.map((port) => (
                        <div key={port._id} className="card bg-base-100 shadow-sm hover:shadow-md transition border border-gray-200">
                            <figure className="h-40 bg-gray-100 overflow-hidden relative">
                            {port.cover_image ? (
                                <img src={port.cover_image} alt={port.title} className="w-full h-full object-cover"/>
                            ) : (
                                <div className="flex items-center justify-center h-full w-full text-gray-400 bg-gray-200">No Image</div>
                            )}
                            </figure>
                            <div className="card-body p-4">
                            <h3 className="font-bold text-lg truncate">{port.title}</h3>
                            <p className="text-xs text-gray-500">Updated: {new Date(port.updatedAt).toLocaleDateString()}</p>
                            <div className="card-actions justify-end mt-2">
                                <Link to={`/view/${port._id}`} className="btn btn-xs btn-neutral">View</Link>
                                <Link to={`/editor?id=${port._id}`} className="btn btn-xs btn-outline">Edit</Link>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
}