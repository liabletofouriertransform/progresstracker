import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getTodayData: () => ipcRenderer.invoke('get-today-data'),
  getProgressData: () => ipcRenderer.invoke('get-progress-data'),
  getSkillsData: () => ipcRenderer.invoke('get-skills-data'),
  getGoalsData: () => ipcRenderer.invoke('get-goals-data'),
  completeTask: (taskId: string, taskType: string, pagesRead?: number) =>
    ipcRenderer.invoke('complete-task', taskId, taskType, pagesRead ?? 0),
  uncompleteTask: (taskId: string, taskType: string) =>
    ipcRenderer.invoke('uncomplete-task', taskId, taskType),
  exportData: () => ipcRenderer.invoke('export-data'),
  importData: (jsonString: string) => ipcRenderer.invoke('import-data', jsonString)
})
