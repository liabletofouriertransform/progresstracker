import { useState, useCallback } from 'react'
import TodayTasks from './components/TodayTasks'
import ProgressGraph from './components/ProgressGraph'
import CharacterStats from './components/CharacterStats'
import GoalsOverview from './components/GoalsOverview'

type View = 'today' | 'progress' | 'character' | 'goals'

const NAV_ITEMS: { id: View; icon: string; label: string }[] = [
  { id: 'today', icon: '◈', label: 'Today' },
  { id: 'progress', icon: '◉', label: 'Progress' },
  { id: 'character', icon: '◆', label: 'Character' },
  { id: 'goals', icon: '◇', label: 'Goals' }
]

export default function App() {
  const [view, setView] = useState<View>('today')
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  async function handleExport() {
    const json = await (window as any).electronAPI.exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `progress-tracker-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const text = await file.text()
      const result = await (window as any).electronAPI.importData(text)
      if (result.success) {
        refresh()
      } else {
        alert('Import failed: ' + result.error)
      }
    }
    input.click()
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">Progress</div>
          <div className="sidebar-subtitle">tracker</div>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item${view === item.id ? ' active' : ''}`}
              onClick={() => setView(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="export-btn" onClick={handleExport}>
            ↑ Export data
          </button>
          <button className="export-btn" style={{ marginTop: 6 }} onClick={handleImport}>
            ↓ Import data
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="content-inner">
          {view === 'today' && <TodayTasks key={refreshKey} onTaskChange={refresh} />}
          {view === 'progress' && <ProgressGraph key={refreshKey} />}
          {view === 'character' && <CharacterStats key={refreshKey} />}
          {view === 'goals' && <GoalsOverview key={refreshKey} />}
        </div>
      </main>
    </div>
  )
}
