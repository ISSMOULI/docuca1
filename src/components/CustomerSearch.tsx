
import React, { useState, useMemo } from 'react';
import { Search, User, Mail, Phone, MapPin, Filter } from 'lucide-react';

interface CustomerSearchProps {
  data: any[];
}

export const CustomerSearch: React.FC<CustomerSearchProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('all');

  const headers = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(row => {
      if (selectedField === 'all') {
        return Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        return String(row[selectedField])
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
    });
  }, [data, searchTerm, selectedField]);

  const getFieldIcon = (fieldName: string) => {
    const name = fieldName.toLowerCase();
    if (name.includes('name')) return <User className="w-4 h-4" />;
    if (name.includes('email')) return <Mail className="w-4 h-4" />;
    if (name.includes('phone')) return <Phone className="w-4 h-4" />;
    if (name.includes('address') || name.includes('city')) return <MapPin className="w-4 h-4" />;
    return <Filter className="w-4 h-4" />;
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500">No data available</p>
        <p className="text-sm text-slate-400">Upload a file to start searching</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Controls */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Search all fields</option>
          {headers.map(header => (
            <option key={header} value={header}>
              Search in {header}
            </option>
          ))}
        </select>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
        <span>
          {filteredData.length} of {data.length} records
        </span>
        {searchTerm && (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            "{searchTerm}"
          </span>
        )}
      </div>

      {/* Results */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredData.length === 0 && searchTerm ? (
          <div className="text-center py-8">
            <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500">No results found</p>
            <p className="text-sm text-slate-400">Try a different search term</p>
          </div>
        ) : (
          filteredData.map((row, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 gap-2">
                {headers.map(header => (
                  <div key={header} className="flex items-center space-x-2">
                    {getFieldIcon(header)}
                    <span className="text-xs font-medium text-slate-500 min-w-20">
                      {header}:
                    </span>
                    <span className="text-sm text-slate-800 flex-1">
                      {String(row[header]) || 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Data Stats */}
      <div className="bg-slate-50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 mb-2">Data Overview</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500">Total Records:</span>
            <span className="ml-2 font-medium">{data.length}</span>
          </div>
          <div>
            <span className="text-slate-500">Fields:</span>
            <span className="ml-2 font-medium">{headers.length}</span>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-slate-500 text-sm">Available Fields:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {headers.map(header => (
              <span key={header} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {header}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
