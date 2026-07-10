export default function DataTable({ columns, data }) {
  if (!columns || !columns.length || !data || !data.length) return null;

  return (
    <div className="overflow-x-auto overflow-y-auto max-h-96 rounded-xl border border-slate-200 shadow-sm relative">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
          <tr>
            {columns.map((col, i) => (
              <th key={i} scope="col" className="px-6 py-3 whitespace-nowrap font-semibold border-b border-slate-200">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
              {columns.map((col, j) => (
                <td key={j} className="px-6 py-4 whitespace-nowrap">
                  {row[col] ? String(row[col]) : <span className="text-slate-300 italic">Empty</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
