import './index.css'
import { reports, categories, type Report } from './data/reports'

// SPM 代码映射 - 对应后端创建的 SPMD 点位
const SPM_CODES = {
  1: 'd_xtqxme',   // 报告卡片-国家数字经济
  2: 'd_qbxfsc',   // 报告卡片-碳足迹
  3: 'd_kfvdcb',   // 报告卡片-服务消费
  4: 'd_yvzsdd',   // 报告卡片-货币政策
  5: 'd_khltvs',   // 报告卡片-AI能源
  6: 'd_xsneer',   // 报告卡片-AI教育
  7: 'd_iuwtdt',   // 报告卡片-智能体
  8: 'd_sxndfv',   // 报告卡片-无人机
  9: 'd_gscyzp',   // 报告卡片-模数共振
  10: 'd_adwkea',  // 报告卡片-节能降碳
  11: 'd_bipsxh',  // 报告卡片-汽车数据
  12: 'd_pabqws',  // 报告卡片-药品价格
}

// 报告卡片组件 - 直接在新窗口打开HTML报告
function ReportCard({ report }: { report: Report }) {
  const spmCode = SPM_CODES[report.id as keyof typeof SPM_CODES] || ''
  const baseUrl = import.meta.env.BASE_URL
  const reportUrl = `${baseUrl.replace(/\/$/, '')}${report.file}`

  const handleView = () => {
    window.open(reportUrl, '_blank')
  }

  return (
    <div
      data-track-id={`report-card-${report.id}`}
      data-track-spm={`${spmCode}@3`}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            report.category === '产业政策' ? 'bg-green-100 text-green-700' :
            report.category === '金融政策' ? 'bg-blue-100 text-blue-700' :
            report.category === '消费政策' ? 'bg-orange-100 text-orange-700' :
            report.category === 'AI政策' ? 'bg-purple-100 text-purple-700' :
            report.category === '低空经济' ? 'bg-cyan-100 text-cyan-700' :
            report.category === '医药政策' ? 'bg-pink-100 text-pink-700' :
            report.category === '数据政策' ? 'bg-indigo-100 text-indigo-700' :
            'bg-gray-100 text-gray-700'
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
        <button
          onClick={handleView}
          data-track-spm={`${spmCode}@3`}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
        >
          <span>查看完整报告</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// 主应用
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* 头部区域 - CPMC 区块层 */}
      <header
        className="bg-gradient-to-r from-primary to-blue-600 text-white"
        data-track-spm="c_qdpdli@2"
      >
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-start justify-between">
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
            {/* GitHub 跳转入口 */}
            <a
              href="https://github.com/HiCooper/policy-report"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
              title="查看项目源码"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
          <div className="flex gap-4 mt-6">
            {/* 统计区域 - CPMC 区块层 */}
            <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2" data-track-spm="c_wgispd@2">
              <div className="text-2xl font-bold">{reports.length}</div>
              <div className="text-sm text-blue-100">报告总数</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2" data-track-spm="c_wgispd@2">
              <div className="text-2xl font-bold">{categories.length - 1}</div>
              <div className="text-sm text-blue-100">政策领域</div>
            </div>
          </div>
        </div>
      </header>

      {/* 报告网格 - CPMC 区块层 */}
      <main className="max-w-6xl mx-auto px-6 py-8" data-track-spm="c_glmaxe@2">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
        </div>
      </main>

      {/* 底部区域 - CPMC 区块层 */}
      <footer className="text-center py-8 text-gray-500 text-sm" data-track-spm="c_lpkwci@2">
        <p>政策投资分析报告平台 · 数据来源：中国政府网、国家发改委、国家医保局等</p>
      </footer>
    </div>
  )
}

export default App