import { app, BrowserWindow, ipcMain, Notification } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import Store from 'electron-store'
import cron from 'node-cron'
import { BOOKS, SDK_TASKS, START_DATE } from '../src/data/goals'
import { SKILLS } from '../src/data/skills'

// ─── Store schema ────────────────────────────────────────────────────────────

interface BookLog {
  id: string
  pagesLogged: number
}

interface DailyLog {
  sdkCompleted: boolean
  booksLogged: BookLog[]
}

interface BookState {
  id: string
  pagesRead: number
  active: boolean
  completed: boolean
  completedDate?: string
  startedDate?: string
}

interface StoreSchema {
  logs: Record<string, DailyLog>
  bookStates: BookState[]
  initialized: boolean
}

const store = new Store<StoreSchema>({
  defaults: {
    logs: {},
    bookStates: [],
    initialized: false
  }
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function daysBetween(a: string, b: string): number {
  const msA = new Date(a).getTime()
  const msB = new Date(b).getTime()
  return Math.round((msB - msA) / 86400000)
}

function dayNumber(): number {
  return daysBetween(START_DATE, today()) + 1
}

function initBookStates(): BookState[] {
  return BOOKS.map((book) => ({
    id: book.id,
    pagesRead: book.startPageOverride ?? 0,
    active: book.queuePosition === 1,
    completed: false,
    startedDate: book.queuePosition === 1 ? START_DATE : undefined
  }))
}

function getBookStates(): BookState[] {
  const states = store.get('bookStates')
  if (!states || states.length === 0) {
    const fresh = initBookStates()
    store.set('bookStates', fresh)
    return fresh
  }
  return states
}

function getLog(date: string): DailyLog {
  const logs = store.get('logs')
  return logs[date] ?? { sdkCompleted: false, booksLogged: [] }
}

function setLog(date: string, log: DailyLog): void {
  const logs = store.get('logs')
  logs[date] = log
  store.set('logs', logs)
}

function getActiveBooks(states: BookState[]) {
  return states.filter((s) => s.active && !s.completed)
}

function getDailyTarget(book: typeof BOOKS[0], state: BookState): number {
  const remaining = book.totalPages - state.pagesRead
  const daysLeft = daysBetween(today(), book.deadline)
  if (daysLeft <= 0) return remaining
  return Math.ceil(remaining / daysLeft)
}

function advanceBookQueue(states: BookState[]): BookState[] {
  const sorted = [...BOOKS].sort((a, b) => a.queuePosition - b.queuePosition)
  const activeCount = states.filter((s) => s.active && !s.completed).length

  if (activeCount < 2) {
    const nextBook = sorted.find((book) => {
      const state = states.find((s) => s.id === book.id)
      return state && !state.active && !state.completed
    })
    if (nextBook) {
      return states.map((s) =>
        s.id === nextBook.id ? { ...s, active: true, startedDate: today() } : s
      )
    }
  }
  return states
}

// ─── Initialize ───────────────────────────────────────────────────────────────

function initialize(): void {
  if (!store.get('initialized')) {
    store.set('bookStates', initBookStates())
    store.set('initialized', true)
  }
}

// ─── IPC Handlers ─────────────────────────────────────────────────────────────

ipcMain.handle('get-today-data', () => {
  const date = today()
  const dayNum = dayNumber()
  const log = getLog(date)
  const states = getBookStates()

  const sdkTask = SDK_TASKS.find((t) => t.dayNumber === dayNum) ?? null

  const activeBookData = getActiveBooks(states).map((state) => {
    const bookMeta = BOOKS.find((b) => b.id === state.id)!
    const dailyTarget = getDailyTarget(bookMeta, state)
    const daysLeft = daysBetween(date, bookMeta.deadline)
    const bookLog = log.booksLogged.find((bl) => bl.id === state.id)
    return {
      id: state.id,
      title: bookMeta.title,
      author: bookMeta.author,
      totalPages: bookMeta.totalPages,
      pagesRead: state.pagesRead,
      pagesRemaining: bookMeta.totalPages - state.pagesRead,
      dailyTarget,
      daysUntilDeadline: daysLeft,
      deadline: bookMeta.deadline,
      loggedToday: !!bookLog,
      pagesLoggedToday: bookLog?.pagesLogged ?? 0,
      category: bookMeta.category
    }
  })

  const allDone =
    (sdkTask ? log.sdkCompleted : true) &&
    activeBookData.every((b) => b.loggedToday)

  return {
    date,
    dayNumber: dayNum,
    sdkTask: sdkTask ? { ...sdkTask, completed: log.sdkCompleted } : null,
    activeBooks: activeBookData,
    allTasksCompleted: allDone
  }
})

// pagesRead is required for books, ignored for sdk
ipcMain.handle('complete-task', (_event, taskId: string, taskType: string, pagesRead: number) => {
  const date = today()
  const log = getLog(date)

  if (taskType === 'sdk') {
    log.sdkCompleted = true
  } else if (taskType === 'book') {
    // Remove existing entry for today if any, then add new one
    log.booksLogged = log.booksLogged.filter((bl) => bl.id !== taskId)
    log.booksLogged.push({ id: taskId, pagesLogged: pagesRead })

    let states = getBookStates()
    const state = states.find((s) => s.id === taskId)
    const bookMeta = BOOKS.find((b) => b.id === taskId)
    if (state && bookMeta) {
      const newPages = Math.min(state.pagesRead + pagesRead, bookMeta.totalPages)
      const completed = newPages >= bookMeta.totalPages
      states = states.map((s) =>
        s.id === taskId
          ? { ...s, pagesRead: newPages, completed, completedDate: completed ? date : undefined }
          : s
      )
      if (completed) states = advanceBookQueue(states)
      store.set('bookStates', states)
    }
  }

  setLog(date, log)
  return { success: true }
})

ipcMain.handle('uncomplete-task', (_event, taskId: string, taskType: string) => {
  const date = today()
  const log = getLog(date)

  if (taskType === 'sdk') {
    log.sdkCompleted = false
  } else if (taskType === 'book') {
    const existing = log.booksLogged.find((bl) => bl.id === taskId)
    log.booksLogged = log.booksLogged.filter((bl) => bl.id !== taskId)

    if (existing) {
      let states = getBookStates()
      const state = states.find((s) => s.id === taskId)
      const bookMeta = BOOKS.find((b) => b.id === taskId)
      if (state && bookMeta) {
        const newPages = Math.max(
          state.pagesRead - existing.pagesLogged,
          bookMeta.startPageOverride ?? 0
        )
        states = states.map((s) =>
          s.id === taskId
            ? { ...s, pagesRead: newPages, completed: false, completedDate: undefined }
            : s
        )
        store.set('bookStates', states)
      }
    }
  }

  setLog(date, log)
  return { success: true }
})

ipcMain.handle('get-progress-data', () => {
  const logs = store.get('logs')
  const startDay = new Date(START_DATE)
  const todayDate = new Date(today())

  const data: { date: string; overall: number; sdk: number; books: number }[] = []

  for (let d = new Date(startDay); d <= todayDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    const log = logs[dateStr] ?? { sdkCompleted: false, booksLogged: [] }
    const dayNum = daysBetween(START_DATE, dateStr) + 1
    const hasSdkTask = dayNum >= 1 && dayNum <= 54

    const sdkScore = hasSdkTask ? (log.sdkCompleted ? 100 : 0) : 100
    const activeBookIds = BOOKS.filter((b) => b.queuePosition === 1).map((b) => b.id)
    const loggedIds = log.booksLogged.map((bl: BookLog) => bl.id)
    const bookScore =
      activeBookIds.length > 0
        ? (loggedIds.filter((id: string) => activeBookIds.includes(id)).length / activeBookIds.length) * 100
        : 100

    data.push({
      date: dateStr,
      overall: Math.round((sdkScore + bookScore) / 2),
      sdk: sdkScore,
      books: bookScore
    })
  }

  return data
})

ipcMain.handle('get-skills-data', () => {
  const states = getBookStates()

  return SKILLS.map((skill) => {
    let totalWeight = 0
    let earnedWeight = 0

    skill.sourceGoalIds.forEach((goalId) => {
      if (goalId === 'sdk') {
        const logs = store.get('logs')
        const completedSdkDays = Object.values(logs).filter((l) => l.sdkCompleted).length
        totalWeight += 54
        earnedWeight += Math.min(completedSdkDays, 54)
      } else {
        const bookMeta = BOOKS.find((b) => b.id === goalId)
        const state = states.find((s) => s.id === goalId)
        if (bookMeta && state) {
          const startPage = bookMeta.startPageOverride ?? 0
          const readable = bookMeta.totalPages - startPage
          totalWeight += readable
          earnedWeight += Math.max(0, state.pagesRead - startPage)
        }
      }
    })

    const progress = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0
    return { ...skill, progress, projected: 100 }
  })
})

ipcMain.handle('get-goals-data', () => {
  const states = getBookStates()
  const logs = store.get('logs')

  const completedSdkDays = Object.values(logs).filter((l) => l.sdkCompleted).length
  const totalSdkDays = 54
  const sdkProgress = Math.round((completedSdkDays / totalSdkDays) * 100)

  const bookGoals = BOOKS.map((book) => {
    const state = states.find((s) => s.id === book.id)
    const pagesRead = state?.pagesRead ?? (book.startPageOverride ?? 0)
    const progress = Math.round((pagesRead / book.totalPages) * 100)
    const daysLeft = daysBetween(today(), book.deadline)
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      totalPages: book.totalPages,
      pagesRead,
      progress,
      daysUntilDeadline: daysLeft,
      deadline: book.deadline,
      active: state?.active ?? false,
      completed: state?.completed ?? false,
      category: book.category
    }
  })

  return {
    sdk: {
      completedDays: completedSdkDays,
      totalDays: totalSdkDays,
      progress: sdkProgress,
      deadline: '2026-08-28',
      daysUntilDeadline: daysBetween(today(), '2026-08-28')
    },
    books: bookGoals
  }
})

ipcMain.handle('export-data', () => {
  return JSON.stringify(
    {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      logs: store.get('logs'),
      bookStates: store.get('bookStates'),
      initialized: store.get('initialized')
    },
    null,
    2
  )
})

ipcMain.handle('import-data', (_event, jsonString: string) => {
  try {
    const data = JSON.parse(jsonString)
    if (data.logs) store.set('logs', data.logs)
    if (data.bookStates) store.set('bookStates', data.bookStates)
    store.set('initialized', true)
    return { success: true }
  } catch {
    return { success: false, error: 'Invalid JSON' }
  }
})

// ─── Window ───────────────────────────────────────────────────────────────────

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0d0d0d',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ─── 6 PM Notification ────────────────────────────────────────────────────────

function setupNotification(): void {
  cron.schedule('0 18 * * *', () => {
    const date = today()
    const log = getLog(date)
    const states = getBookStates()
    const activeBooks = getActiveBooks(states)

    const pendingBooks = activeBooks.filter(
      (s) => !log.booksLogged.some((bl) => bl.id === s.id)
    )
    const sdkPending = !log.sdkCompleted && SDK_TASKS.some((t) => t.dayNumber === dayNumber())

    if (pendingBooks.length > 0 || sdkPending) {
      const items: string[] = []
      if (sdkPending) items.push('Claude SDK task')
      pendingBooks.forEach((s) => {
        const book = BOOKS.find((b) => b.id === s.id)
        if (book) items.push(book.title)
      })

      new Notification({
        title: 'Progress Tracker — 6 PM Check',
        body: `Not logged yet: ${items.join(', ')}. Your end goal is waiting.`,
        urgency: 'normal'
      }).show()
    }
  })
}

// ─── App lifecycle ─────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  initialize()
  createWindow()
  setupNotification()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
