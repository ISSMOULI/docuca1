
import React, { useState } from 'react';
import { Download, Eye, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface CSVExtractorProps {
  data: any[];
}

export const CSVExtractor: React.FC<CSVExtractorProps> = ({ data }) => {
  const [showPreview, setShowPreview] = useState(false);

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  };

  const downloadCSV = () => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, 'extracted_data.csv');
    } else {
      link.href = URL.createObjectURL(blob);
      link.download = 'extracted_data.csv';
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500">
        <FileText className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm">No data to extract</p>
      </div>
    );
  }

  const headers = Object.keys(data[0]);
  const previewRows = data.slice(0, 5);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-slate-700">
            Extracted Data ({data.length} records)
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-1 px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
            {showPreview ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <button
            onClick={downloadCSV}
            className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  {headers.map(header => (
                    <th key={header} className="px-3 py-2 text-left font-medium text-slate-700 border-b border-slate-200">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    {headers.map(header => (
                      <td key={header} className="px-3 py-2 text-slate-600 border-b border-slate-100">
                        {String(row[header]) || 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.length > 5 && (
            <div className="bg-slate-50 px-3 py-2 text-xs text-slate-500 text-center border-t border-slate-200">
              Showing 5 of {data.length} records. Download CSV to see all data.
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-slate-500 bg-slate-50 rounded-md p-2">
        <strong>Fields detected:</strong> {headers.join(', ')}
      </div>
    </div>
  );
};
