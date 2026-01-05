import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'task-board-data'

const defaultColumns = [
  {
    id: 'todo',
    title: '待处理',
    tasks: [
      {
        id: '1',
        title: '完成项目需求分析',
        description: '整理用户需求，输出需求文档，明确功能范围和优先级',
        priority: 'high',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: '设计数据库结构',
        description: '根据需求设计数据表，定义字段和索引',
        priority: 'medium',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'in-progress',
    title: '进行中',
    tasks: [
      {
        id: '3',
        title: '开发用户认证模块',
        description: '实现登录、注册、Token 鉴权等功能',
        priority: 'high',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'done',
    title: '已完成',
    tasks: [
      {
        id: '4',
        title: '项目初始化',
        description: '搭建项目结构，配置开发环境',
        priority: 'low',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      }
    ]
  }
]

export const useTaskStore = defineStore('task', () => {
  const columns = ref([])
  const isLoading = ref(true)

  const init = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && Array.isArray(parsed.columns)) {
          columns.value = parsed.columns
        } else {
          columns.value = defaultColumns
        }
      } else {
        columns.value = defaultColumns
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
      columns.value = defaultColumns
    } finally {
      isLoading.value = false
    }
  }

  const saveToStorage = () => {
    try {
      const data = {
        columns: columns.value,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  const totalTasks = computed(() => {
    return columns.value.reduce((sum, col) => sum + col.tasks.length, 0)
  })

  const completedTasks = computed(() => {
    const doneColumn = columns.value.find(col => col.id === 'done')
    return doneColumn ? doneColumn.tasks.length : 0
  })

  const completionRate = computed(() => {
    if (totalTasks.value === 0) return 0
    return Math.round((completedTasks.value / totalTasks.value) * 100)
  })

  const getTasksByColumn = (columnId) => {
    const column = columns.value.find(col => col.id === columnId)
    return column ? column.tasks : []
  }

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const addTask = (columnId, taskData) => {
    const column = columns.value.find(col => col.id === columnId)
    if (column) {
      const newTask = {
        id: generateId(),
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || null,
        createdAt: new Date().toISOString()
      }
      column.tasks.push(newTask)
      saveToStorage()
      return newTask
    }
    return null
  }

  const updateTask = (taskId, updates) => {
    for (const column of columns.value) {
      const taskIndex = column.tasks.findIndex(t => t.id === taskId)
      if (taskIndex !== -1) {
        column.tasks[taskIndex] = { ...column.tasks[taskIndex], ...updates }
        if (column.id === 'done' && !column.tasks[taskIndex].completedAt) {
          column.tasks[taskIndex].completedAt = new Date().toISOString()
        }
        saveToStorage()
        return true
      }
    }
    return false
  }

  const deleteTask = (taskId) => {
    for (const column of columns.value) {
      const taskIndex = column.tasks.findIndex(t => t.id === taskId)
      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1)
        saveToStorage()
        return true
      }
    }
    return false
  }

  const moveTask = (taskId, fromColumnId, toColumnId, toIndex) => {
    const fromColumn = columns.value.find(col => col.id === fromColumnId)
    const toColumn = columns.value.find(col => col.id === toColumnId)
    
    if (!fromColumn || !toColumn) return false
    
    const taskIndex = fromColumn.tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) return false
    
    const [task] = fromColumn.tasks.splice(taskIndex, 1)
    
    if (toColumn.id === 'done' && !task.completedAt) {
      task.completedAt = new Date().toISOString()
    } else if (toColumn.id !== 'done') {
      task.completedAt = null
    }
    
    if (toIndex !== undefined && toIndex >= 0) {
      toColumn.tasks.splice(toIndex, 0, task)
    } else {
      toColumn.tasks.push(task)
    }
    
    saveToStorage()
    return true
  }

  const exportData = (format = 'json', columnIds = null) => {
    let exportColumns = columns.value
    
    if (columnIds && columnIds.length > 0) {
      exportColumns = columns.value.filter(col => columnIds.includes(col.id))
    }
    
    const exportData = {
      columns: exportColumns,
      exportedAt: new Date().toISOString(),
      totalTasks: exportColumns.reduce((sum, col) => sum + col.tasks.length, 0)
    }
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      downloadBlob(blob, `tasks-${Date.now()}.json`)
    } else if (format === 'csv') {
      const csvContent = generateCSV(exportColumns)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      downloadBlob(blob, `tasks-${Date.now()}.csv`)
    }
  }

  const generateCSV = (exportColumns) => {
    const rows = [['状态', '标题', '描述', '优先级', '截止日期', '创建时间', '完成时间']]
    
    for (const column of exportColumns) {
      for (const task of column.tasks) {
        const escapeCSV = (text) => {
          if (!text) return ''
          const escaped = String(text).replace(/"/g, '""')
          return `"${escaped}"`
        }
        
        rows.push([
          escapeCSV(column.title),
          escapeCSV(task.title),
          escapeCSV(task.description),
          escapeCSV(task.priority),
          escapeCSV(task.dueDate ? new Date(task.dueDate).toLocaleString('zh-CN') : ''),
          escapeCSV(task.createdAt ? new Date(task.createdAt).toLocaleString('zh-CN') : ''),
          escapeCSV(task.completedAt ? new Date(task.completedAt).toLocaleString('zh-CN') : '')
        ])
      }
    }
    
    return '\uFEFF' + rows.map(row => row.join(',')).join('\n')
  }

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const checkDueDate = (dueDate) => {
    if (!dueDate) return 'none'
    
    const now = new Date()
    const due = new Date(dueDate)
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'expired'
    if (diffDays <= 2) return 'due-soon'
    return 'normal'
  }

  watch(columns, () => {
    saveToStorage()
  }, { deep: true })

  return {
    columns,
    isLoading,
    init,
    totalTasks,
    completedTasks,
    completionRate,
    getTasksByColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    exportData,
    checkDueDate
  }
})
