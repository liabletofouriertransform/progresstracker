export interface SDKTask {
  id: string
  dayNumber: number
  weekNumber: number
  title: string
  description: string
  isBufferDay: boolean
  isRestDay: boolean
}

export interface Book {
  id: string
  title: string
  author: string
  totalPages: number
  startPageOverride?: number // for books already partially read
  deadline: string // YYYY-MM-DD
  queuePosition: number // 1 = active, 2 = next, etc.
  category: 'neuroscience' | 'psychology' | 'economics' | 'philosophy' | 'history'
}

export const SDK_TASKS: SDKTask[] = [
  // Week 1: Python fluency floor
  {
    id: 'sdk-1', dayNumber: 1, weekNumber: 1, isBufferDay: false, isRestDay: false,
    title: 'Python setup + Chapter 1',
    description: 'Install Python 3.11+ and uv. Read Chapter 1 of "Automate the Boring Stuff" in a browser tab. Type every example into day1.py and run it — do not copy-paste. Goal: ~15 snippets using variables, arithmetic, and strings.'
  },
  {
    id: 'sdk-2', dayNumber: 2, weekNumber: 1, isBufferDay: false, isRestDay: false,
    title: 'Flow control',
    description: 'Chapter 2 (Flow Control). Type the examples. Then close the book and write from memory a script that asks the user their age and prints minor/adult/senior. Extend it: loop until the user enters "quit".'
  },
  {
    id: 'sdk-3', dayNumber: 3, weekNumber: 1, isBufferDay: false, isRestDay: false,
    title: 'Functions',
    description: 'Chapter 3 (Functions). Write three functions: square a number, return the largest in a list, reverse a string. Test each. Break each deliberately by passing wrong types. Read the error messages carefully.'
  },
  {
    id: 'sdk-4', dayNumber: 4, weekNumber: 1, isBufferDay: false, isRestDay: true,
    title: 'Read-only day — Lists & Dicts',
    description: 'No coding. Skim Chapter 4 (Lists) and Chapter 5 (Dictionaries). Get the shape in your head. Sleep on it.'
  },
  {
    id: 'sdk-5', dayNumber: 5, weekNumber: 1, isBufferDay: false, isRestDay: false,
    title: 'Lists + Dicts hands-on',
    description: 'Chapters 4 and 5 hands-on. Type examples. Then write: a function that takes a sentence and returns a dict mapping each word to how many times it appears. This is the classic first exercise — if you can do it Friday evening, you have crossed the fluency floor.'
  },
  {
    id: 'sdk-6', dayNumber: 6, weekNumber: 1, isBufferDay: false, isRestDay: false,
    title: 'Strings + File I/O — fluency test',
    description: 'Chapter 6 (Strings) and Chapter 9 (File I/O). Skip 7 and 8. End of day: write a script that reads a text file, counts word frequencies, and prints the top 10 words. If you can do it without googling, you are done with Week 1.'
  },
  {
    id: 'sdk-7', dayNumber: 7, weekNumber: 1, isBufferDay: false, isRestDay: true,
    title: 'Rest day',
    description: 'Look back at Day 6\'s script and make it cleaner. That is it. Read something unrelated. Let the week consolidate.'
  },
  // Week 2: The API layer
  {
    id: 'sdk-8', dayNumber: 8, weekNumber: 2, isBufferDay: false, isRestDay: false,
    title: 'First Anthropic API script',
    description: 'Get an API key from console.anthropic.com. Load $10. Install the anthropic Python library: uv add anthropic. Read the Quickstart at docs.claude.com. Write your first script: send "Hello, what can you do?" to Claude and print the response. Play with system prompt, temperature, model choice.'
  },
  {
    id: 'sdk-9', dayNumber: 9, weekNumber: 2, isBufferDay: false, isRestDay: false,
    title: 'Multi-turn chatbot',
    description: 'Write a script that keeps a list of messages, asks the user for input, appends it, sends the whole list to Claude, appends Claude\'s response, and loops. ~30 lines. When you finish this session with a working CLI chatbot, you understand the Messages API.'
  },
  {
    id: 'sdk-10', dayNumber: 10, weekNumber: 2, isBufferDay: false, isRestDay: false,
    title: 'Tool use — the click moment',
    description: 'Read the Tool Use documentation. Write a script where you define get_current_time() and give Claude access to it. Send "What time is it?" and watch Claude request the tool, execute your function, and return the result. Sit with what just happened — this is the fundamental agent pattern.'
  },
  {
    id: 'sdk-11', dayNumber: 11, weekNumber: 2, isBufferDay: false, isRestDay: true,
    title: 'Read-only — agent mental model',
    description: 'Read the "Building agents with the Messages API" page in Anthropic docs. No coding. Just take in the mental model.'
  },
  {
    id: 'sdk-12', dayNumber: 12, weekNumber: 2, isBufferDay: false, isRestDay: false,
    title: 'Tool loop — hand-built agent',
    description: 'Extend Day 10\'s script so Claude can call multiple tools in sequence. Add a second tool: get_weather(city). Ask Claude: "What time is it, and how\'s the weather in Chennai?" Watch it call both tools then combine results. You now have a hand-built agent.'
  },
  {
    id: 'sdk-13', dayNumber: 13, weekNumber: 2, isBufferDay: false, isRestDay: false,
    title: 'Structured output',
    description: 'Instead of Claude returning free text, use a tool with a specific schema to force it to return structured data — a paper\'s title, authors, and abstract as a dictionary. This is the technique that makes agents useful for downstream code.'
  },
  {
    id: 'sdk-14', dayNumber: 14, weekNumber: 2, isBufferDay: false, isRestDay: true,
    title: 'Rest day — mental bridge',
    description: 'Review the week. Look at your Day 12 script and note: this is exactly what the Agent SDK gives you, but the SDK handles the loop, sub-agents, sessions, and tool registry. That is the mental transition.'
  },
  // Week 3: The SDK layer
  {
    id: 'sdk-15', dayNumber: 15, weekNumber: 3, isBufferDay: false, isRestDay: false,
    title: 'SDK — modules 0 and 1',
    description: 'uv add claude-agent-sdk. Clone Kenneth Liao\'s claude-agent-sdk-intro. Run module 0 and module 1. Read every line. What took 30 lines in Week 2 takes 5 lines with the SDK — that\'s the value.'
  },
  {
    id: 'sdk-16', dayNumber: 16, weekNumber: 3, isBufferDay: false, isRestDay: false,
    title: 'SDK — modules 2 and 3',
    description: 'Module 2 (custom tools) and module 3 (agent options). Type the examples yourself into your own files — do not just run Kenneth\'s. Modify each: change the tool, system prompt, model. Watch what breaks.'
  },
  {
    id: 'sdk-17', dayNumber: 17, weekNumber: 3, isBufferDay: false, isRestDay: true,
    title: 'Read-only — subagents and MCP',
    description: 'No coding. Read the Anthropic docs on subagents and MCP. Get the concept.'
  },
  {
    id: 'sdk-18', dayNumber: 18, weekNumber: 3, isBufferDay: false, isRestDay: false,
    title: 'SDK — modules 4 and 5 (MCP)',
    description: 'Module 4 (conversation loops) and module 5 (MCP). MCP is important — it is how agents connect to external systems. Even the toy MCP calculator example teaches you the pattern.'
  },
  {
    id: 'sdk-19', dayNumber: 19, weekNumber: 3, isBufferDay: false, isRestDay: false,
    title: 'SDK — module 6 (subagents)',
    description: 'Module 6 (subagents). This is the deepest primitive. Spend real time here. Read the multi-agent research demo in anthropics/claude-agent-sdk-demos alongside it. Understand how the orchestrator decides what subagents to spawn and how it recombines results.'
  },
  {
    id: 'sdk-20', dayNumber: 20, weekNumber: 3, isBufferDay: false, isRestDay: true,
    title: 'Read — Dabit3 gist',
    description: 'Read the Dabit3 gist end-to-end. Do not code — just read. This is where you consolidate the mental model across all the pieces.'
  },
  {
    id: 'sdk-21', dayNumber: 21, weekNumber: 3, isBufferDay: false, isRestDay: true,
    title: 'Rest day — write it out',
    description: 'Write in a notebook, by hand: what is the shape of an agent? What are its parts? What are the tradeoffs of subagents vs one big agent? This is where the intuition consolidates.'
  },
  // Week 4: Paper decomposer v0
  {
    id: 'sdk-22', dayNumber: 22, weekNumber: 4, isBufferDay: false, isRestDay: false,
    title: 'Design on paper',
    description: 'Do not code. Draw the shape of the data and the shape of the agent. Input: a PDF URL or arxiv ID. Output: JSON with fields — claims, assumptions, methods, citations. Get the shape right before writing code.'
  },
  {
    id: 'sdk-23', dayNumber: 23, weekNumber: 4, isBufferDay: false, isRestDay: false,
    title: 'PDF-to-text',
    description: 'Get PDF-to-text working. uv add pypdf. Write a small function that takes a PDF path and returns its text. Test on 2–3 real papers.'
  },
  {
    id: 'sdk-24', dayNumber: 24, weekNumber: 4, isBufferDay: false, isRestDay: false,
    title: 'Single-shot decomposition',
    description: 'Wire the text into a single-shot Claude call with a system prompt asking for structured JSON decomposition. No agent loop yet. Just text in, JSON out (~40 lines). Iterate on the prompt until output is reasonable.'
  },
  {
    id: 'sdk-25', dayNumber: 25, weekNumber: 4, isBufferDay: false, isRestDay: true,
    title: 'Read your outputs',
    description: 'Read the decomposer outputs. What is it getting right? What is it missing? What kinds of claims does it identify well, and where does it hallucinate? Note the patterns.'
  },
  {
    id: 'sdk-26', dayNumber: 26, weekNumber: 4, isBufferDay: false, isRestDay: false,
    title: 'Add tools — arxiv search',
    description: 'Give the agent tools: search_arxiv(query) and fetch_paper(arxiv_id). Now the agent is not just decomposing — it can enrich its understanding by looking up citations.'
  },
  {
    id: 'sdk-27', dayNumber: 27, weekNumber: 4, isBufferDay: false, isRestDay: false,
    title: 'Add subagents',
    description: 'Have the main agent delegate "claim extraction" and "methods extraction" to two subagents that work independently, then have the main agent combine and cross-check them. Sub-agent architecture in action.'
  },
  {
    id: 'sdk-28', dayNumber: 28, weekNumber: 4, isBufferDay: false, isRestDay: true,
    title: 'Rest day',
    description: 'Look at what you built. Do not touch it. Take a walk.'
  },
  // Weeks 5-6: Polish, publish, write
  {
    id: 'sdk-29', dayNumber: 29, weekNumber: 5, isBufferDay: false, isRestDay: false,
    title: 'Polish — clean up code',
    description: 'Clean up the code. Fix obvious messiness. Add a README. Make sure it runs cleanly from a fresh clone.'
  },
  {
    id: 'sdk-30', dayNumber: 30, weekNumber: 5, isBufferDay: false, isRestDay: false,
    title: 'Test on real papers',
    description: 'Test the paper decomposer on 5–10 real papers. Note failure modes. Where does it struggle? What patterns emerge?'
  },
  {
    id: 'sdk-31', dayNumber: 31, weekNumber: 5, isBufferDay: false, isRestDay: false,
    title: 'Start blog post',
    description: 'Start writing a blog post — 1200–2000 words — about what you built, why, what surprised you, and what you would do differently. Write the first draft today.'
  },
  {
    id: 'sdk-32', dayNumber: 32, weekNumber: 5, isBufferDay: false, isRestDay: false,
    title: 'Finish and edit blog post',
    description: 'Edit the blog post draft. Cut what is not interesting. Make the technical parts concrete with code examples.'
  },
  {
    id: 'sdk-33', dayNumber: 33, weekNumber: 5, isBufferDay: false, isRestDay: false,
    title: 'Push to GitHub',
    description: 'Push the paper decomposer to GitHub. Set up the repo properly: README, requirements, example output. Public repo.'
  },
  {
    id: 'sdk-34', dayNumber: 34, weekNumber: 5, isBufferDay: false, isRestDay: false,
    title: 'Publish blog post',
    description: 'Publish the blog post on Medium, Substack, or your personal site. Tell three people about it. That is your first portfolio artifact shipped.'
  },
  {
    id: 'sdk-35', dayNumber: 35, weekNumber: 5, isBufferDay: false, isRestDay: true,
    title: 'Rest',
    description: 'Rest. You shipped something. Let it land.'
  },
  {
    id: 'sdk-36', dayNumber: 36, weekNumber: 6, isBufferDay: false, isRestDay: true,
    title: 'Rest',
    description: 'Rest a few days. Do not force the next thing yet.'
  },
  {
    id: 'sdk-37', dayNumber: 37, weekNumber: 6, isBufferDay: false, isRestDay: true,
    title: 'Rest',
    description: 'Rest. Recharge.'
  },
  {
    id: 'sdk-38', dayNumber: 38, weekNumber: 6, isBufferDay: false, isRestDay: false,
    title: 'Retrospective',
    description: 'Write a private retrospective. What worked in the 6-week plan? What would you change? What do you understand now that you did not at the start?'
  },
  {
    id: 'sdk-39', dayNumber: 39, weekNumber: 6, isBufferDay: false, isRestDay: false,
    title: 'Identify project 2',
    description: 'Start thinking about project 2. What problem do you want to solve with agents? Write 3 candidate ideas and why each one is interesting. Do not start building yet.'
  },
  {
    id: 'sdk-40', dayNumber: 40, weekNumber: 6, isBufferDay: false, isRestDay: false,
    title: 'Deep dive into one idea',
    description: 'Pick the most compelling project 2 idea. Write a short design doc: what does it take as input, what does it produce, what tools does it need, what subagents make sense?'
  },
  {
    id: 'sdk-41', dayNumber: 41, weekNumber: 6, isBufferDay: false, isRestDay: false,
    title: 'Scaffold project 2',
    description: 'Set up the repo for project 2. Write the skeleton — just the entry point, a placeholder agent, and a TODO list. No pressure to build it today, just open the door.'
  },
  {
    id: 'sdk-42', dayNumber: 42, weekNumber: 6, isBufferDay: false, isRestDay: true,
    title: 'End of 6-week arc',
    description: 'You completed the 6-week plan. Look back at Day 1 and where you are now. That gap is the proof.'
  },
  // Buffer days 43-54
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `sdk-buffer-${i + 1}`,
    dayNumber: 43 + i,
    weekNumber: 7,
    isBufferDay: true,
    isRestDay: false,
    title: `Buffer Day ${i + 1} — Catch up`,
    description: 'Use this buffer day to revisit any task from the 6-week plan that you did not fully complete, or to go deeper on something that felt rushed. The plan is done — this is your margin.'
  }))
]

export const BOOKS: Book[] = [
  {
    id: 'neuronal-dynamics',
    title: 'Neuronal Dynamics',
    author: 'Wulfram Gerstner et al.',
    totalPages: 590,
    deadline: '2026-09-05',
    queuePosition: 1,
    category: 'neuroscience'
  },
  {
    id: 'transurfing-reality',
    title: 'Transurfing Reality (Steps I–V)',
    author: 'Vadim Zeland',
    totalPages: 766,
    startPageOverride: 298,
    deadline: '2026-12-31',
    queuePosition: 1,
    category: 'philosophy'
  },
  {
    id: 'wealth-of-nations',
    title: 'The Wealth of Nations',
    author: 'Adam Smith',
    totalPages: 1000,
    deadline: '2026-12-31',
    queuePosition: 2,
    category: 'economics'
  },
  {
    id: 'ordinary-men',
    title: 'Ordinary Men',
    author: 'Christopher R. Browning',
    totalPages: 231,
    deadline: '2026-12-31',
    queuePosition: 3,
    category: 'history'
  },
  {
    id: 'sovereign-individual',
    title: 'The Sovereign Individual',
    author: 'James Dale Davidson',
    totalPages: 446,
    deadline: '2026-12-31',
    queuePosition: 4,
    category: 'economics'
  },
  {
    id: 'what-every-body',
    title: 'What Every Body Is Saying',
    author: 'Joe Navarro',
    totalPages: 272,
    deadline: '2026-12-31',
    queuePosition: 5,
    category: 'psychology'
  },
  {
    id: 'dict-body-language',
    title: 'The Dictionary of Body Language',
    author: 'Joe Navarro',
    totalPages: 208,
    deadline: '2026-12-31',
    queuePosition: 6,
    category: 'psychology'
  },
  {
    id: 'influence',
    title: 'Influence: New and Expanded',
    author: 'Robert B. Cialdini',
    totalPages: 592,
    deadline: '2026-12-31',
    queuePosition: 7,
    category: 'psychology'
  },
  {
    id: 'prometheus-rising',
    title: 'Prometheus Rising',
    author: 'Robert Anton Wilson',
    totalPages: 322,
    deadline: '2026-12-31',
    queuePosition: 8,
    category: 'philosophy'
  }
]

export const START_DATE = '2026-07-05'
export const SDK_DEADLINE = '2026-08-28' // 54 days from start
export const BOOKS_DEADLINE = '2026-12-31'
export const NEURONAL_DEADLINE = '2026-09-05'
