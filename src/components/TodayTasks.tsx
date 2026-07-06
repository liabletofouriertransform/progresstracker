import { useEffect, useState } from 'react'

interface SDKTaskData {
  id: string
  dayNumber: number
  weekNumber: number
  title: string
  description: string
  completed: boolean
  isBufferDay: boolean
  isRestDay: boolean
}

interface BookData {
  id: string
  title: string
  author: string
  totalPages: number
  pagesRead: number
  pagesRemaining: number
  dailyTarget: number
  daysUntilDeadline: number
  deadline: string
  loggedToday: boolean
  pagesLoggedToday: number
  category: string
}

interface TodayData {
  date: string
  dayNumber: number
  sdkTask: SDKTaskData | null
  activeBooks: BookData[]
  allTasksCompleted: boolean
}

const CATEGORY_LABEL: Record<string, string> = {
  neuroscience: 'Neuroscience',
  psychology: 'Psychology',
  economics: 'Economics',
  philosophy: 'Philosophy',
  history: 'History'
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function BookCard({
  book,
  onLog,
  onUndo
}: {
  book: BookData
  onLog: (bookId: string, pages: number) => Promise<void>
  onUndo: (bookId: string) => Promise<void>
}) {
  const [input, setInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const pct = Math.round((book.pagesRead / book.totalPages) * 100)
  const newPage = book.pagesRead + (parseInt(input) || 0)

  async function handleSubmit() {
    const pages = parseInt(input)
    if (!pages || pages <= 0) return
    setSubmitting(true)
    await onLog(book.id, pages)
    setInput('')
    setSubmitting(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className={`card${book.loggedToday ? ' completed' : ''}`}>
      <div className="task-label">{CATEGORY_LABEL[book.category] ?? book.category}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div className={`task-title${book.loggedToday ? ' done' : ''}`} style={{ marginBottom: 2 }}>
            {book.title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{book.author}</div>
        </div>
        <div style={{ textAlign: 'right', minWidth: 80 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>{pct}%</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            p.{book.pagesRead} / {book.totalPages}
          </div>
        </div>
      </div>

      <div className="progress-bar-wrap" style={{ marginBottom: 12 }}>
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>

      {book.loggedToday ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 20, height: 20, borderRadius: '50%', background: 'var(--success)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: 'white', fontWeight: 700
            }}>✓</span>
            <span style={{ fontSize: 13, color: '#4ade80' }}>
              +{book.pagesLoggedToday} pages logged today
            </span>
          </div>
          <button
            onClick={() => onUndo(book.id)}
            style={{
              fontSize: 11, color: 'var(--text-muted)', background: 'none',
              border: '1px solid var(--border)', borderRadius: 4,
              padding: '3px 8px', cursor: 'pointer'
            }}
          >
            Undo
          </button>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
            Suggested today:{' '}
            <strong style={{ color: 'var(--text-primary)' }}>~{book.dailyTarget} pages</strong>
            <span style={{ color: 'var(--text-muted)' }}>
              {' '}· p.{book.pagesRead} → p.{Math.min(book.pagesRead + book.dailyTarget, book.totalPages)}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="number"
              min="1"
              max={book.pagesRemaining}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Pages read today`}
              style={{
                flex: 1,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '8px 12px',
                color: 'var(--text-primary)',
                fontSize: 13,
                outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
            {input && parseInt(input) > 0 && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                → p.{Math.min(newPage, book.totalPages)}
              </span>
            )}
            <button
              onClick={handleSubmit}
              disabled={submitting || !input || parseInt(input) <= 0}
              style={{
                background: 'var(--accent)',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                color: 'white',
                fontSize: 13,
                fontWeight: 600,
                cursor: submitting || !input || parseInt(input) <= 0 ? 'not-allowed' : 'pointer',
                opacity: submitting || !input || parseInt(input) <= 0 ? 0.5 : 1,
                whiteSpace: 'nowrap'
              }}
            >
              Log
            </button>
          </div>
          <div className="task-meta" style={{ marginTop: 8 }}>
            <span className="meta-tag">{book.pagesRemaining} pages left</span>
            <span className="meta-tag">{book.daysUntilDeadline}d remaining</span>
            <span className="meta-tag accent">{book.dailyTarget} pages/day to finish on time</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TodayTasks({ onTaskChange }: { onTaskChange: () => void }) {
  const [data, setData] = useState<TodayData | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    const result = await (window as any).electronAPI.getTodayData()
    setData(result)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleSDK(completed: boolean) {
    if (completed) {
      await (window as any).electronAPI.uncompleteTask('sdk', 'sdk')
    } else {
      await (window as any).electronAPI.completeTask('sdk', 'sdk', 0)
    }
    await load()
    onTaskChange()
  }

  async function logBook(bookId: string, pages: number) {
    await (window as any).electronAPI.completeTask(bookId, 'book', pages)
    await load()
    onTaskChange()
  }

  async function undoBook(bookId: string) {
    await (window as any).electronAPI.uncompleteTask(bookId, 'book')
    await load()
    onTaskChange()
  }

  if (loading || !data) {
    return <div style={{ color: 'var(--text-muted)', padding: '40px 0', fontSize: 14 }}>Loading...</div>
  }

  const sdkDayLabel = data.sdkTask
    ? data.sdkTask.isBufferDay
      ? 'Buffer Phase'
      : `Week ${data.sdkTask.weekNumber} · Day ${data.sdkTask.dayNumber}`
    : null

  return (
    <div>
      <div className="page-header">
        <div className="page-date">{formatDate(data.date)}</div>
        <div className="page-title">
          Day <span>{data.dayNumber}</span>
        </div>
      </div>

      {data.allTasksCompleted && (
        <div className="all-done-banner">
          <span className="all-done-icon">✦</span>
          <span className="all-done-text">All done for today. One more day closer.</span>
        </div>
      )}

      {/* Claude SDK Task */}
      {data.sdkTask && (
        <>
          <div className="section-header">
            <span className="section-title">Claude SDK</span>
            {sdkDayLabel && <span className="section-subtitle">{sdkDayLabel}</span>}
          </div>

          <div className={`card${data.sdkTask.completed ? ' completed' : ''}`}>
            <div className="task-row">
              <button
                className={`task-check${data.sdkTask.completed ? ' done' : ''}`}
                onClick={() => toggleSDK(data.sdkTask!.completed)}
              />
              <div className="task-body">
                <div className="task-label">
                  {data.sdkTask.isBufferDay ? 'Buffer' : data.sdkTask.isRestDay ? 'Rest Day' : 'Build'}
                </div>
                <div className={`task-title${data.sdkTask.completed ? ' done' : ''}`}>
                  {data.sdkTask.title}
                </div>
                {!data.sdkTask.completed && (
                  <div className="task-desc">{data.sdkTask.description}</div>
                )}
                <div className="task-meta">
                  <span className="meta-tag accent">Day {data.sdkTask.dayNumber} / 54</span>
                  <span className="meta-tag">Python + Anthropic SDK</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {data.sdkTask && <div className="divider" />}

      {/* Books */}
      <div className="section-header">
        <span className="section-title">Reading</span>
        <span className="section-subtitle">{data.activeBooks.length} active books</span>
      </div>

      {data.activeBooks.map((book) => (
        <BookCard key={book.id} book={book} onLog={logBook} onUndo={undoBook} />
      ))}

      {data.activeBooks.length === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: 14, padding: '20px 0' }}>
          All books complete.
        </div>
      )}
    </div>
  )
}
