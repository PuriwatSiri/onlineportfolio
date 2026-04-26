import { useAppDispatch, useAppSelector } from '../hooks'
import { setFilter, fetchTemplates } from '@/store/slices/templatesSlice'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const categories = ['All', 'Academic', 'Sports', 'Arts', 'Technology', 'Food', 'Music']

export default function Templates() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const { items, filter } = useAppSelector(s => s.templates)
  const { currentUser } = useAppSelector(s => s.auth)

  useEffect(() => {
    dispatch(fetchTemplates())
  }, [dispatch])
  
  const [activeCategory, setActiveCategory] = useState('All')

  const handleTemplateClick = (templateId: string) => {
    if (!currentUser) {
      alert('Please log in to edit this template');
      navigate('/login');
      return;
    }
    navigate(`/editor?template=${templateId}`);
  }

  const filtered = items.filter(i => {
    if (!i.active) return false;
    
    const categoryMatch = activeCategory === 'All' 
      ? true 
      : i.category.toLowerCase() === activeCategory.toLowerCase();
    
    const searchMatch = filter === '' ? true :
      i.name.toLowerCase().includes(filter.toLowerCase()) ||
      i.category.toLowerCase().includes(filter.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <div className="container-max mx-auto p-4">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        
        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`btn btn-sm ${activeCategory === category ? 'btn-neutral' : 'btn-ghost'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Bar */}
         <div className="flex items-center gap-4">
          <span className="text-gray-700 font-semibold">Search</span>
            <input 
                type="text" 
                className="input input-bordered w-full md:w-64"
                value={filter}
                onChange={(e) => dispatch(setFilter(e.target.value))}
            />
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filtered.map(template => (
          <div
            key={template._id || template.id}
            className="cursor-pointer group"
            onClick={() => handleTemplateClick(template._id || template.id || '')}
          >
            <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden mb-2 transition-opacity group-hover:opacity-80 border border-gray-300 relative">
              {template.preview || template.thumbnail ? (
                <img 
                  src={template.preview || template.thumbnail} 
                  alt={template.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                  <span className="text-gray-500 text-sm">No Preview</span>
                </div>
              )}
              
              {/* Hover Effect (Optional) */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <span className="text-white font-medium border border-white px-4 py-1 rounded-full">Use Template</span>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-800 truncate">{template.name}</h3>
            <p className="text-sm text-gray-500">{template.category}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
              No templates found matching your criteria.
          </div>
      )}
    </div>
  )
}