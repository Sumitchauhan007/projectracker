import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSingleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    if (value) {
      newParams.append(key, value);
    }
    setSearchParams(newParams);
  };

  const handleClear = () => {
    setSearchParams({});
  };

  const activeFiltersCount = ['status', 'priority'].filter((key) => searchParams.getAll(key).length > 0).length;
  const selectedStatus = searchParams.getAll('status')[0] ?? '';
  const selectedPriority = searchParams.getAll('priority')[0] ?? '';

  return (
    <div className="bg-white border-b px-4 py-2 flex items-center gap-3 shrink-0 overflow-x-auto text-sm">
      <span className="text-gray-500">Filters</span>
      <div className="flex items-center gap-2">
        <select 
          className="border rounded-md px-2 py-1 bg-white"
          onChange={(e) => handleSingleFilterChange('status', e.target.value)}
          value={selectedStatus}
        >
          <option value="">All statuses</option>
          {['To Do', 'In Progress', 'In Review', 'Done'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select 
          className="border rounded-md px-2 py-1 bg-white"
          onChange={(e) => handleSingleFilterChange('priority', e.target.value)}
          value={selectedPriority}
        >
          <option value="">All priorities</option>
          {['Critical', 'High', 'Medium', 'Low'].map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {activeFiltersCount > 0 && (
        <button 
          onClick={handleClear}
          className="ml-auto text-xs text-gray-600 hover:text-gray-900"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}