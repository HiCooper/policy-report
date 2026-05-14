import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Tracker } from '@gate-flow/tracker-sdk'

// Tracker 端点 - 支持环境变量配置
const TRACKER_ENDPOINT = import.meta.env.VITE_TRACKER_ENDPOINT || '/api/v1/collect'
const APP_ID = import.meta.env.VITE_APP_ID || 'policy-report'

const tracker = new Tracker({
  endpoint: TRACKER_ENDPOINT,
  appId: APP_ID,
  autoTrack: {
    pageView: true,
    click: true,
    scroll: true,
    exposure: {
      enabled: true,
      selector: ['[data-track-id]'],
    },
  },
  batch: { maxSize: 20, interval: 3000 },
  offline: { enabled: true, maxQueueSize: 100 },
})

window.__tracker = tracker

// 延迟初始化 Tracker，确保 React 已渲染 DOM 元素
requestAnimationFrame(() => {
  tracker.init()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
