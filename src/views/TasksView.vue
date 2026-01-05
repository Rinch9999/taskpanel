<template>
  <div class="tasks-view">
    <header class="page-header">
      <div class="header-content">
        <el-page-header @back="goBack">
          <template #content>
            <span class="page-title">任务列表管理</span>
          </template>
        </el-page-header>
      </div>
    </header>

    <div class="tasks-container">
      <el-table :data="allTasks" stripe style="width: 100%" v-loading="store.isLoading">
        <el-table-column prop="title" label="任务标题" min-width="150">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priority)" size="small">
              {{ getPriorityLabel(row.priority) }}
            </el-tag>
            <span class="task-title">{{ row.title }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="所属列" min-width="100">
          <template #default="{ row }">
            <el-tag>{{ getColumnName(row) }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="截止日期" min-width="120">
          <template #default="{ row }">
            <span :class="['due-date', getDateClass(row.dueDate)]">
              {{ formatDate(row.dueDate) }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column label="创建时间" min-width="150">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" min-width="150" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" @click="handleEdit(row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      
      <el-empty v-if="allTasks.length === 0 && !store.isLoading" description="暂无任务数据" />
    </div>

    <TaskFormModal
      v-model="formModalVisible"
      :task="currentTask"
      :column-id="currentColumnId"
      @save="handleSaveTask"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Edit, Delete } from '@element-plus/icons-vue'
import { useTaskStore } from '../stores/taskStore'
import TaskFormModal from '../components/TaskFormModal.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const store = useTaskStore()

const formModalVisible = ref(false)
const currentTask = ref(null)
const currentColumnId = ref(null)

const allTasks = computed(() => {
  const tasks = []
  for (const column of store.columns) {
    for (const task of column.tasks) {
      tasks.push({
        ...task,
        columnId: column.id
      })
    }
  }
  return tasks
})

const goBack = () => {
  router.push('/')
}

const getPriorityType = (priority) => {
  const types = {
    high: 'danger',
    medium: 'warning',
    low: 'success'
  }
  return types[priority] || 'info'
}

const getPriorityLabel = (priority) => {
  const labels = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return labels[priority] || priority
}

const getColumnName = (task) => {
  const column = store.columns.find(col => col.id === task.columnId)
  return column ? column.title : '未知'
}

const getDateClass = (dueDate) => {
  if (!dueDate) return ''
  const now = new Date()
  const due = new Date(dueDate)
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'expired'
  if (diffDays <= 2) return 'urgent'
  return ''
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

const handleEdit = (task) => {
  currentTask.value = { ...task }
  currentColumnId.value = null
  formModalVisible.value = true
}

const handleDelete = async (task) => {
  try {
    await ElMessageBox.confirm('确定要删除该任务吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    store.deleteTask(task.id)
    ElMessage.success('任务已删除')
  } catch {
  }
}

const handleSaveTask = (taskData) => {
  if (currentTask.value) {
    store.updateTask(currentTask.value.id, taskData)
    ElMessage.success('任务已更新')
  }
  formModalVisible.value = false
  currentTask.value = null
}
</script>

<style scoped>
.tasks-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
}

.tasks-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.task-title {
  margin-left: 8px;
  font-weight: 500;
}

.due-date.expired {
  color: #f56c6c;
}

.due-date.urgent {
  color: #e6a23c;
}
</style>
