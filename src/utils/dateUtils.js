/**
 * 日期格式化工具函数
 * 提供常用的日期格式转换功能
 */

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param {string|Date} date - 日期字符串或Date对象
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm:ss 格式
 * @param {string|Date} date - 日期字符串或Date对象
 * @returns {string} 格式化后的日期时间字符串
 */
export const formatDateTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 格式化日期为中文友好格式
 * @param {string|Date} date - 日期字符串或Date对象
 * @returns {string} 格式化后的中文日期字符串
 */
export const formatFriendlyDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * 计算距离截止日期的天数
 * @param {string|Date} dueDate - 截止日期
 * @returns {number} 距离天数（负数表示已过期）
 */
export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null
  const now = new Date()
  const due = new Date(dueDate)
  const diffMs = due - now
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * 检查日期状态
 * @param {string|Date} dueDate - 截止日期
 * @returns {string} 状态：'expired'(已过期)、'urgent'(即将到期)、'normal'(正常)、'none'(无日期)
 */
export const checkDateStatus = (dueDate) => {
  if (!dueDate) return 'none'
  const days = getDaysUntilDue(dueDate)
  if (days < 0) return 'expired'
  if (days <= 2) return 'urgent'
  return 'normal'
}

/**
 * 相对时间格式化（如：3分钟前、2小时前）
 * @param {string|Date} date - 日期字符串或Date对象
 * @returns {string} 相对时间字符串
 */
export const formatRelativeTime = (date) => {
  if (!date) return ''
  const now = new Date()
  const d = new Date(date)
  const diffMs = now - d
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  
  if (diffSec < 60) return '刚刚'
  if (diffMin < 60) return `${diffMin}分钟前`
  if (diffHour < 24) return `${diffHour}小时前`
  if (diffDay < 7) return `${diffDay}天前`
  
  return formatDate(date)
}
