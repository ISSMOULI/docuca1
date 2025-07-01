
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
    if (name.includes('name')) return <User className="w-4 h-4 flex-shrink-0" />;
    if (name.includes('email')) return <Mail className="w-4 h-4 flex-shrink-0" />;
    if (name.includes('phone')) return <Phone className="w-4 h-4 flex-shrink-0" />;
    if (name.includes('address') || name.includes('city')) return <MapPin className="w-4 h-4 flex-shrink-0" />;
    return <Filter className="w-4 h-4 flex-shrink-0" />;
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
    <div className="space-y-4 h-full flex flex-col">
      {/* Search Controls */}
      <div className="space-y-3 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
      <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 rounded-lg p-3 flex-shrink-0">
        <span className="truncate">
          {filteredData.length} of {data.length} records
        </span>
        {searchTerm && (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs ml-2 flex-shrink-0">
            "{searchTerm.length > 10 ? searchTerm.substring(0, 10) + '...' : searchTerm}"
          </span>
        )}
      </div>

    
     {/*Results
      <div className="flex-1 overflow-y-auto space-y-3 h-full ">
        {filteredData.length === 0 && searchTerm ? (
          <div className="text-center py-8 h-full">
            <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500">No results found</p>
            <p className="text-sm text-slate-400">Try a different search term</p>
          </div>
        ) : (
          filteredData.map((row, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow  flex flex-col">
              {{/* Displaying each row's data */}
             {/* <div className="flex-1 overflow-y-auto space-y-3">
                {headers.map(header => (
                  <div key={header} className="flex items-start space-x-3 min-w-0">
                    <div className="flex-shrink-0 mt-0.5">
                      {getFieldIcon(header)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-slate-500 flex-shrink-0">
                          {header}:
                        </span>
                        <span className="text-sm text-slate-800 break-words whitespace-pre-wrap word-wrap leading-relaxed">
                          {String(row[header]) || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div> */}
      
    <div className="space-y-4 h-full flex flex-col">
  {/* Search Controls - unchanged */}
  
  {/* Results Summary - unchanged */}
  <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
    {/* ... existing summary content ... */}
  </div>

  {/* Enhanced Results Section with increased height */}
  <div className="flex-1 min-h-[400px] overflow-hidden flex flex-col border border-slate-200 rounded-lg">
    {filteredData.length === 0 && searchTerm ? (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg">
        <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-slate-500">No results found</p>
        <p className="text-sm text-slate-400">Try a different search term</p>
      </div>
    ) : (
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {filteredData.map((row, index) => (
          <div 
            key={index} 
            className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {headers.map(header => (
                <div key={header} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getFieldIcon(header)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-slate-500">
                        {header}:
                      </span>
                      <span className="text-sm text-slate-800 break-words">
                        {String(row[header]) || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Data Overview - unchanged */}
  <div className="bg-slate-50 rounded-lg p-4">
    {/* ... existing data overview content ... */}
  </div>
</div>


      {/* Data Stats */}
      <div className="bg-slate-50 rounded-lg p-4 flex-shrink-0">
        <h4 className="font-medium text-slate-800 mb-2 text-sm">Data Overview</h4>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Total Records:</span>
            <span className="font-medium">{data.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Fields:</span>
            <span className="font-medium">{headers.length}</span>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-slate-500 text-sm">Available Fields:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {headers.map(header => (
              <span key={header} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs break-all">
                {header.length > 12 ? header.substring(0, 12) + '...' : header}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
