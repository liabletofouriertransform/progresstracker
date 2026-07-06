import { useEffect, useState } from 'react'

interface SDKGoal {
  completedDays: number
  totalDays: number
  progress: number
  deadline: string
  daysUntilDeadline: number
}

interface BookGoal {
  id: string
  title: string
  author: string
  totalPages: number
  pagesRead: number
  progress: number
  daysUntilDeadline: number
  deadline: string
  active: boolean
  completed: boolean
  category: string
}

interface GoalsData {
  sdk: SDKGoal
  books: BookGoal[]
}

const CATEGORY_COLOR: Record<string, string> = {
  neuroscience: '#dc2626',
  psychology: '#b91c1c',
  economics: '#c2410c',
  philosophy: '#e11d48',
  history: '#be123c'
}

function deadlineLabel(daysLeft: number): string {
  if (daysLeft < 0) return 'Overdue'
  if (daysLeft === 0) return 'Due today'
  if (daysLeft === 1) return '1 day left'
  return `${daysLeft} days left`
}

export default function GoalsOverview() {
  const [data, setData] = useState<GoalsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(window as any).electronAPI.getGoalsData().then((d: GoalsData) => {
      setData(d)
      setLoading(false)
    })
  }, [])

  if (loading || !data) {
    return <div style={{ color: 'var(--text-muted)', padding: '40px 0', fontSize: 14 }}>Loading...</div>
  }

  const totalBooks = data.books.length
  const completedBooks = data.books.filter((b) => b.completed).length
  const overallBooksProgress = Math.round(
    data.books.reduce((s, b) => s + b.progress, 0) / Math.max(totalBooks, 1)
  )

  return (
    <div>
      <div className="page-header">
        <div className="page-date">Everything you're working toward</div>
        <div className="page-title">
          Goals <span>Overview</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-value">{data.sdk.progress}%</div>
          <div className="stat-label">SDK done</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overallBooksProgress}%</div>
          <div className="stat-label">Books avg</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completedBooks}/{totalBooks}</div>
          <div className="stat-label">Books done</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: data.sdk.daysUntilDeadline < 10 ? 22 : 28 }}>
            {data.sdk.daysUntilDeadline}d
          </div>
          <div className="stat-label">SDK deadline</div>
        </div>
      </div>

      {/* Claude SDK */}
      <div className="section-header">
        <span className="section-title">Claude SDK Goal</span>
        <span className="section-subtitle">42 days + 12 buffer</span>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
              Build a Claude tool-use agent in Python
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Anthropic API · Agent SDK · Paper Decomposer project
            </div>
          </div>
          <div style={{ textAlign: 'right', minWidth: 80 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{data.sdk.progress}%</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {data.sdk.completedDays}/{data.sdk.totalDays} days
            </div>
          </div>
        </div>
        <div className="progress-bar-wrap" style={{ height: 6, marginBottom: 10 }}>
          <div className="progress-bar-fill" style={{ width: `${data.sdk.progress}%` }} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span className="meta-tag accent">{deadlineLabel(data.sdk.daysUntilDeadline)}</span>
          <span className="meta-tag">Aug 28, 2026</span>
        </div>
      </div>

      {/* Books */}
      <div className="section-header">
        <span className="section-title">Reading List</span>
        <span className="section-subtitle">{totalBooks} books · Dec 31 deadline</span>
      </div>

      {data.books.map((book) => {
        const dotClass = book.completed ? 'done' : book.active ? 'active' : ''
        const cardClass = book.completed ? 'done' : book.active ? 'active' : 'queued'
        const accentColor = CATEGORY_COLOR[book.category] ?? 'var(--accent)'

        return (
          <div key={book.id} className={`book-card ${cardClass}`}>
            <div className={`book-status-dot ${dotClass}`} />
            <div className="book-info">
              <div className="book-title">{book.title}</div>
              <div className="book-author">{book.author}</div>
              <div className="progress-bar-wrap" style={{ marginTop: 8, width: '100%' }}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${book.progress}%`, background: accentColor }}
                />
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: 90 }}>
              <div className="book-progress-text" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {book.progress}%
              </div>
              <div className="book-progress-text" style={{ marginTop: 2 }}>
                {book.pagesRead}/{book.totalPages}p
              </div>
              {book.active && !book.completed && (
                <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 2 }}>
                  {deadlineLabel(book.daysUntilDeadline)}
                </div>
              )}
              {book.completed && (
                <div style={{ fontSize: 11, color: 'var(--success)', marginTop: 2 }}>Complete</div>
              )}
              {!book.active && !book.completed && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Queued</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
