export interface Skill {
  id: string
  name: string
  description: string
  sourceGoalIds: string[] // which book/goal IDs contribute to this skill
  maxLevel: number
  domains: string[]
  color: string
}

export const SKILLS: Skill[] = [
  {
    id: 'ai-engineering',
    name: 'AI / ML Engineering',
    description: 'Building real AI systems with LLMs, tool use, multi-agent orchestration',
    sourceGoalIds: ['sdk', 'neuronal-dynamics'],
    maxLevel: 100,
    domains: ['AI Research', 'AI Product Development', 'Autonomous Agents'],
    color: '#ef4444'
  },
  {
    id: 'python',
    name: 'Python Programming',
    description: 'Writing clean, functional Python scripts and production tools',
    sourceGoalIds: ['sdk'],
    maxLevel: 100,
    domains: ['Software Engineering', 'AI Development', 'Automation'],
    color: '#f97316'
  },
  {
    id: 'computational-neuroscience',
    name: 'Computational Neuroscience',
    description: 'Mathematical models of neurons, networks, and cognition from first principles',
    sourceGoalIds: ['neuronal-dynamics'],
    maxLevel: 100,
    domains: ['Neurotech', 'AI Research', 'Brain-Computer Interfaces'],
    color: '#dc2626'
  },
  {
    id: 'body-language',
    name: 'Body Language Mastery',
    description: 'Speed-reading non-verbal cues, micro-expressions, and behavioral tells',
    sourceGoalIds: ['what-every-body', 'dict-body-language'],
    maxLevel: 100,
    domains: ['Negotiation', 'Leadership', 'Intelligence Analysis'],
    color: '#b91c1c'
  },
  {
    id: 'behavioral-psychology',
    name: 'Behavioral Psychology',
    description: 'Understanding how humans make decisions, form habits, and respond to social pressure',
    sourceGoalIds: ['influence', 'what-every-body', 'dict-body-language'],
    maxLevel: 100,
    domains: ['Product Design', 'Marketing', 'Negotiation', 'Consulting'],
    color: '#991b1b'
  },
  {
    id: 'persuasion',
    name: 'Persuasion & Influence',
    description: 'The 7 principles of influence — reciprocity, commitment, social proof, authority, liking, scarcity, unity',
    sourceGoalIds: ['influence'],
    maxLevel: 100,
    domains: ['Sales', 'Leadership', 'Fundraising', 'Public Speaking'],
    color: '#7f1d1d'
  },
  {
    id: 'economics',
    name: 'Classical Economics',
    description: 'Division of labour, free markets, capital accumulation, and the foundations of economic thought',
    sourceGoalIds: ['wealth-of-nations', 'sovereign-individual'],
    maxLevel: 100,
    domains: ['Finance', 'Policy Analysis', 'Investment', 'Entrepreneurship'],
    color: '#c2410c'
  },
  {
    id: 'information-age',
    name: 'Information Age Thinking',
    description: 'How digital technology dissolves nation-states, creates sovereign individuals, and reshapes power',
    sourceGoalIds: ['sovereign-individual'],
    maxLevel: 100,
    domains: ['Crypto / Web3', 'Geopolitics', 'Long-range Strategy'],
    color: '#ea580c'
  },
  {
    id: 'philosophy-of-mind',
    name: 'Philosophy of Mind',
    description: 'Reality as a field of probability; the 8-circuit model of human consciousness',
    sourceGoalIds: ['transurfing-reality', 'prometheus-rising'],
    maxLevel: 100,
    domains: ['Personal Development', 'Cognitive Science', 'Systems Thinking'],
    color: '#e11d48'
  },
  {
    id: 'historical-analysis',
    name: 'Historical Analysis',
    description: 'How ordinary people commit extraordinary evil — obedience, authority, and moral disengagement',
    sourceGoalIds: ['ordinary-men'],
    maxLevel: 100,
    domains: ['Leadership Ethics', 'Political Science', 'Risk Analysis'],
    color: '#be123c'
  }
]

export const POSSIBLE_DOMAINS = [
  'AI Research & Development',
  'Neurotech & Brain-Computer Interfaces',
  'Behavioral Consulting',
  'Negotiation & Influence',
  'Economic & Policy Analysis',
  'Autonomous Agent Architecture',
  'Long-range Strategic Thinking',
  'Cognitive Science'
]
