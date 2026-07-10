'use client';
import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { UploadCloud, FileType, CheckCircle2, AlertCircle } from 'lucide-react';
import DataTable from './DataTable';
import ResultSummary from './ResultSummary';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState('');

  const onDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }
    setError('');
    setFile(selectedFile);
    setImportResult(null);

    // Parse for preview
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      preview: 5, // preview first 5 rows
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setColumns(Object.keys(results.data[0]));
          setPreviewData(results.data);
        }
      },
      error: () => {
        setError('Failed to parse CSV preview.');
      }
    });
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  }, []);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  };

  const confirmImport = async () => {
    if (!file) return;
    setIsUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Import failed. Please check the backend connection.');
      }

      const data = await response.json();
      setImportResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during import.');
    } finally {
      setIsUploading(false);
    }
  };

  if (importResult) {
    return <ResultSummary result={importResult} onReset={() => { setFile(null); setImportResult(null); setPreviewData([]); }} />;
  }

  return (
    <div className="space-y-8">
      {!file && (
        <div 
          onDragOver={onDragOver}
          onDrop={onDrop}
          className="border-2 border-dashed border-indigo-300 rounded-2xl p-16 text-center hover:bg-indigo-50 transition-colors cursor-pointer flex flex-col items-center justify-center space-y-4"
        >
          <div className="bg-indigo-100 p-4 rounded-full">
            <UploadCloud className="w-10 h-10 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-700">Drag & Drop your CSV file here</h3>
            <p className="text-slate-500 mt-2">or click to browse files</p>
          </div>
          <input 
            type="file" 
            accept=".csv" 
            onChange={onFileChange} 
            className="hidden" 
            id="file-upload"
          />
          <label 
            htmlFor="file-upload" 
            className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg shadow-sm hover:bg-slate-50 cursor-pointer"
          >
            Select File
          </label>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {file && previewData.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <FileType className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">{file.name}</h4>
                <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button 
              onClick={() => { setFile(null); setPreviewData([]); }}
              className="text-sm text-slate-500 hover:text-slate-700 underline"
            >
              Change file
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-slate-700 flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              Data Preview (First 5 rows)
            </h4>
            <DataTable columns={columns} data={previewData} />
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={confirmImport}
              disabled={isUploading}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing with AI...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Import</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
