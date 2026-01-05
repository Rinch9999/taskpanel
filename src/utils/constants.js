export const STORAGE_KEY = 'task-board-data'

export const DEFAULT_COLUMNS = [
  {
    id: 'todo',
    title: '待处理',
    tasks: []
  },
  {
    id: 'in-progress',
    title: '进行中',
    tasks: []
  },
  {
    id: 'done',
    title: '已完成',
    tasks: []
  }
]

export const PRIORITY_LEVELS = {
  high: { label: '高', color: '#f56c6c' },
  medium: { label: '中', color: '#e6a23c' },
  low: { label: '低', color: '#67c23a' }
}

export const DATE_FORMAT = {
  display: 'YYYY-MM-DD',
  datetime: 'YYYY-MM-DD HH:mm:ss',
  friendly: 'YYYY年M月D日'
}

export const EXPORT_FORMATS = ['json', 'csv']

export const ROUTE_PATHS = {
  HOME: '/',
  TASKS: '/tasks',
  STATS: '/stats'
}

export const COLUMN_CONFIG = {
  todo: { id: 'todo', title: '待处理' },
  'in-progress': { id: 'in-progress', title: '进行中' },
  done: { id: 'done', title: '已完成' }
}

export const VALIDATION_RULES = {
  title: {
    required: true,
    message: '请输入任务标题',
    trigger: 'blur'
  },
  titleMinLength: {
    min: 2,
    max: 50,
    message: '任务标题长度应在2-50个字符之间',
    trigger: 'blur'
  }
}

export const UI_CONSTANTS = {
  PAGE_SIZE: 10,
  ANIMATION_DURATION: 300,
  LOADING_TIMEOUT: 5000,
  DEBOUNCE_DELAY: 300
}

export const ERROR_MESSAGES = {
  LOAD_FAILED: '加载数据失败，请刷新页面重试',
  SAVE_FAILED: '保存数据失败，请稍后重试',
  DELETE_FAILED: '删除任务失败，请稍后重试',
  EXPORT_FAILED: '导出数据失败，请稍后重试',
  NETWORK_ERROR: '网络错误，请检查网络连接'
}

export const SUCCESS_MESSAGES = {
  TASK_CREATED: '任务创建成功',
  TASK_UPDATED: '任务更新成功',
  TASK_DELETED: '任务删除成功',
  DATA_EXPORTED: '数据导出成功',
  ALL_CLEARED: '所有任务已清空'
}
