import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts'

interface DataPoint {
  date: string
  overall: number
  sdk: number
  books: number
}

function shortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 12
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  )
}

export default function ProgressGraph() {
  const [data, setData] = useState<DataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(window as any).electronAPI.getProgressData().then((d: DataPoint[]) => {
      setData(d)
      setLoading(false)
    })
  }, [])

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: '40px 0', fontSize: 14 }}>Loading...</div>

  const displayData = data.map((d) => ({ ...d, label: shortDate(d.date) }))

  // Stats
  const today = data[data.length - 1]
  const streak = (() => {
    let s = 0
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].overall > 0) s++
      else break
    }
    return s
  })()

  const totalDays = data.length
  const completedDays = data.filter((d) => d.overall === 100).length

  return (
    <div>
      <div className="page-header">
        <div className="page-date">Your trajectory</div>
        <div className="page-title">
          Progress <span>Graph</span>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-value">{today?.overall ?? 0}%</div>
          <div className="stat-label">Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{streak}</div>
          <div className="stat-label">Day streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completedDays}</div>
          <div className="stat-label">Full days</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalDays - completedDays}</div>
          <div className="stat-label">Missed</div>
        </div>
      </div>

      {/* Graph */}
      <div className="graph-wrap">
        <div className="section-header" style={{ marginBottom: 20 }}>
          <span className="section-title">Daily Completion</span>
          <span className="section-subtitle">% of tasks logged each day</span>
        </div>

        {data.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
            Start logging tasks to see your trajectory here.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={displayData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={100} stroke="rgba(22,163,74,0.2)" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="overall"
                name="Overall"
                stroke="#dc2626"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#dc2626' }}
              />
              <Line
                type="monotone"
                dataKey="sdk"
                name="Claude SDK"
                stroke="#f97316"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="4 2"
                activeDot={{ r: 3, fill: '#f97316' }}
              />
              <Line
                type="monotone"
                dataKey="books"
                name="Books"
                stroke="#991b1b"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="4 2"
                activeDot={{ r: 3, fill: '#991b1b' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, marginTop: 12, justifyContent: 'center' }}>
          {[
            { color: '#dc2626', label: 'Overall', dash: false },
            { color: '#f97316', label: 'Claude SDK', dash: true },
            { color: '#991b1b', label: 'Books', dash: true }
          ].map((l) => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
              <svg width="20" height="2">
                <line x1="0" y1="1" x2="20" y2="1" stroke={l.color} strokeWidth="2"
                  strokeDasharray={l.dash ? '4 2' : undefined} />
              </svg>
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap-style day grid */}
      <div className="graph-wrap">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <span className="section-title">Day Map</span>
          <span className="section-subtitle">each square = one day</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {data.map((d, i) => {
            const opacity = d.overall === 100 ? 1 : d.overall > 0 ? 0.4 : 0.1
            return (
              <div
                key={i}
                title={`${d.date}: ${d.overall}%`}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  background: d.overall === 0 ? 'var(--border)' : `rgba(220,38,38,${opacity})`,
                  cursor: 'default'
                }}
              />
            )
          })}
          {/* Future days placeholder */}
          {Array.from({ length: Math.max(0, 180 - data.length) }).map((_, i) => (
            <div
              key={`future-${i}`}
              style={{
                width: 14, height: 14, borderRadius: 3,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)'
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, fontSize: 11, color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--border)' }} /> None
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(220,38,38,0.4)' }} /> Partial
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: '#dc2626' }} /> Full
          </div>
        </div>
      </div>
    </div>
  )
}
