import FileUpload from '../components/FileUpload';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-4 pt-12 pb-8">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 tracking-tight">
            GrowEasy CRM Importer
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload any CSV format. Our AI will automatically map and extract CRM fields with high accuracy.
          </p>
        </header>

        <section className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-8">
          <FileUpload />
        </section>
      </div>
    </main>
  );
}
