
import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface FileUploaderProps {
  onFileProcessed: (data: any[], filename: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileProcessed }) => {
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    setProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first worksheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Convert to objects with headers
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1) as any[][];
          
          const processedData = rows.map(row => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = row[index] || '';
            });
            return obj;
          });

          onFileProcessed(processedData, file.name);
          setSuccess(`Successfully processed ${processedData.length} records from ${file.name}`);
        } catch (err) {
          setError('Error parsing file. Please ensure it\'s a valid Excel or CSV file.');
        }
        setProcessing(false);
      };

      reader.onerror = () => {
        setError('Error reading file.');
        setProcessing(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError('Error processing file.');
      setProcessing(false);
    }
  }, [onFileProcessed]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('sheet') || file.type.includes('csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        processFile(file);
      } else {
        setError('Please upload an Excel (.xlsx, .xls) or CSV file.');
      }
    }
  }, [processFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-slate-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            {processing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <Upload className="w-8 h-8 text-slate-400" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-medium text-slate-700">
              {processing ? 'Processing file...' : 'Drop your file here'}
            </p>
            <p className="text-sm text-slate-500">
              or click to browse
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Supports Excel (.xlsx, .xls) and CSV files
          </div>

          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={processing}
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors disabled:opacity-50"
          >
            Choose File
          </label>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <div className="bg-slate-50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 mb-2 flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Supported Features
        </h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Excel files (.xlsx, .xls)</li>
          <li>• CSV files (.csv)</li>
          <li>• Automatic data extraction</li>
          <li>• Customer search functionality</li>
        </ul>
      </div>
    </div>
  );
};
