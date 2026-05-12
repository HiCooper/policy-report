import { useState } from 'react';
import './index.css';
import { reports, categories, type Report } from './data/reports';

function ReportCard({ report }: { report: Report }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            report.category === '产业政策' ? 'bg-green-100 text-green-700' :
            report.category === '金融政策' ? 'bg-blue-100 text-blue-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {report.category}
          </span>
          <span className="text-sm text-gray-400">{report.date}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
          {report.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {report.summary}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {report.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-transparent border-t border-gray-100">
        <a 
          href={report.file} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
        >
          <span>查看完整报告</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const filteredReports = selectedCategory === '全部' 
    ? [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : reports.filter(r => r.category === selectedCategory).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">政策投资分析报告</h1>
              <p className="text-blue-100 mt-1">中国产业政策深度解读 · 投资机会追踪</p>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2">
              <div className="text-2xl font-bold">{reports.length}</div>
              <div className="text-sm text-blue-100">报告总数</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2">
              <div className="text-2xl font-bold">{categories.length - 1}</div>
              <div className="text-sm text-blue-100">政策领域</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-3 mb-8 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </main>

      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>政策投资分析报告平台 · 数据来源：中国政府网、国家发改委、国家医保局等</p>
      </footer>
    </div>
  );
}

export default App;