import { useEffect, useState } from 'react'
import { POSSIBLE_DOMAINS } from '../data/skills'

interface SkillData {
  id: string
  name: string
  description: string
  progress: number
  projected: number
  domains: string[]
  color: string
}

export default function CharacterStats() {
  const [skills, setSkills] = useState<SkillData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(window as any).electronAPI.getSkillsData().then((d: SkillData[]) => {
      setSkills(d)
      setLoading(false)
    })
  }, [])

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: '40px 0', fontSize: 14 }}>Loading...</div>

  const overallProgress = skills.length
    ? Math.round(skills.reduce((s, sk) => s + sk.progress, 0) / skills.length)
    : 0

  return (
    <div>
      <div className="page-header">
        <div className="page-date">If you follow through completely</div>
        <div className="page-title">
          Your Final <span>Form</span>
        </div>
      </div>

      {/* Overall */}
      <div className="graph-wrap" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>Overall mastery unlocked</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>{overallProgress}%</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>At 100% you can operate in</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{POSSIBLE_DOMAINS.length} domains</div>
          </div>
        </div>
        <div className="progress-bar-wrap" style={{ height: 6 }}>
          <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
        </div>
      </div>

      {/* What you'll be able to do */}
      <div className="section-header">
        <span className="section-title">Domains Unlocked</span>
        <span className="section-subtitle">at full completion</span>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
          If you complete everything, you will be one of very few people who can sit at the intersection of{' '}
          <strong style={{ color: 'var(--text-primary)' }}>AI engineering, computational neuroscience, behavioral influence, and macro-economic thinking</strong>.
          That combination does not exist in most people.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {POSSIBLE_DOMAINS.map((d) => (
            <span key={d} className="domain-tag" style={{ fontSize: 12, padding: '4px 10px' }}>{d}</span>
          ))}
        </div>
      </div>

      {/* Skill bars */}
      <div className="section-header">
        <span className="section-title">Skill Stats</span>
        <span className="section-subtitle">current vs projected at 100%</span>
      </div>

      <div className="card" style={{ padding: '24px 24px 16px' }}>
        {skills.map((skill) => (
          <div key={skill.id} className="skill-item">
            <div className="skill-header">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-pct">{skill.progress}%</span>
            </div>
            <div className="skill-desc">{skill.description}</div>
            <div className="skill-bar-wrap">
              <div className="skill-bar-projected" />
              <div
                className="skill-bar-current"
                style={{
                  width: `${skill.progress}%`,
                  background: skill.progress > 0 ? skill.color : 'transparent'
                }}
              />
            </div>
            <div className="domain-tags">
              {skill.domains.map((d) => (
                <span key={d} className="domain-tag">{d}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Motivation quote */}
      <div style={{
        marginTop: 24,
        padding: '16px 20px',
        background: 'var(--accent-glow)',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--radius-lg)',
        fontSize: 13,
        color: 'var(--text-secondary)',
        lineHeight: 1.7,
        fontStyle: 'italic'
      }}>
        "The person you will be in 6 months is built by what you do today. These bars do not fill themselves."
      </div>
    </div>
  )
}
