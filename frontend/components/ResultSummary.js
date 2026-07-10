import { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import DataTable from './DataTable';

export default function ResultSummary({ result, onReset }) {
  const [activeTab, setActiveTab] = useState('imported');

  const crmColumns = [
    'created_at', 'name', 'email', 'country_code', 
    'mobile_without_country_code', 'company', 'city', 'state', 
    'country', 'lead_owner', 'crm_status', 'crm_note', 
    'data_source', 'possession_time', 'description'
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex items-center space-x-4">
          <div className="bg-emerald-100 p-3 rounded-full">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider">Successfully Imported</p>
            <p className="text-3xl font-bold text-emerald-700">{result.totalImported}</p>
          </div>
        </div>
        
        <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 flex items-center space-x-4">
          <div className="bg-rose-100 p-3 rounded-full">
            <XCircle className="w-8 h-8 text-rose-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-rose-600 uppercase tracking-wider">Skipped Records</p>
            <p className="text-3xl font-bold text-rose-700">{result.totalSkipped}</p>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button 
            onClick={() => setActiveTab('imported')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'imported' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            Imported Records ({result.totalImported})
          </button>
          <button 
            onClick={() => setActiveTab('skipped')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'skipped' ? 'text-rose-600 border-b-2 border-rose-600 bg-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            Skipped Records ({result.totalSkipped})
          </button>
        </div>

        <div className="p-6 bg-white">
          {activeTab === 'imported' ? (
            result.totalImported > 0 ? (
              <DataTable columns={crmColumns} data={result.successfullyParsed} />
            ) : (
              <p className="text-slate-500 text-center py-8">No records were imported.</p>
            )
          ) : (
            result.totalSkipped > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Records skipped usually because they are missing both an email and a mobile number.</p>
                <div className="overflow-x-auto max-h-96 border border-slate-200 rounded-xl">
                  <pre className="text-xs text-slate-600 p-4 bg-slate-50">
                    {JSON.stringify(result.skipped, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No records were skipped.</p>
            )
          )}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={onReset}
          className="flex items-center space-x-2 px-6 py-2.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 font-medium text-slate-700 transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Upload Another File</span>
        </button>
      </div>
    </div>
  );
}
