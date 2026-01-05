<template>
  <div class="task-board">
    <header class="board-header">
      <h1 class="board-title">
        <el-icon><Grid /></el-icon>
        任务看板
      </h1>
      <div class="board-actions">
        <el-button type="primary" @click="handleAddTask(null)">
          <el-icon><Plus /></el-icon>
          新增任务
        </el-button>
        <el-button @click="showExportModal = true">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
        <el-button @click="handleClearAll" type="danger" plain>
          <el-icon><Delete /></el-icon>
          清空所有
        </el-button>
      </div>
    </header>
    
    <div v-if="store.isLoading" class="loading-state">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <span>加载中...</span>
    </div>
    
    <template v-else>
      <TaskStats />
      
      <div class="board-columns">
        <TaskColumn
          v-for="column in store.columns"
          :key="column.id"
          :column="column"
          @add-task="handleAddTask"
          @edit-task="handleEditTask"
        />
      </div>
    </template>
    
    <TaskFormModal
      v-model="formModalVisible"
      :task="currentTask"
      :column-id="currentColumnId"
      @save="handleSaveTask"
    />
    
    <ExportModal v-model="showExportModal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Grid, Plus, Download, Delete, Loading } from '@element-plus/icons-vue'
import { useTaskStore } from '../stores/taskStore'
import TaskStats from '../components/TaskStats.vue'
import TaskColumn from '../components/TaskColumn.vue'
import ExportModal from '../components/ExportModal.vue'
import TaskFormModal from '../components/TaskFormModal.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const store = useTaskStore()

const formModalVisible = ref(false)
const showExportModal = ref(false)
const currentTask = ref(null)
const currentColumnId = ref(null)

onMounted(() => {
  store.init()
})

const handleAddTask = (columnId) => {
  currentTask.value = null
  currentColumnId.value = columnId || 'todo'
  formModalVisible.value = true
}

const handleEditTask = (task) => {
  currentTask.value = { ...task }
  currentColumnId.value = null
  formModalVisible.value = true
}

const handleSaveTask = (taskData) => {
  if (currentTask.value) {
    store.updateTask(currentTask.value.id, taskData)
    ElMessage.success('任务已更新')
  } else {
    store.addTask(currentColumnId.value, taskData)
    ElMessage.success('任务已创建')
  }
  formModalVisible.value = false
  currentTask.value = null
}

const handleClearAll = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有任务吗？此操作不可恢复。',
      '确认清空',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    store.columns.forEach(col => {
      col.tasks = []
    })
    store.saveToStorage()
    ElMessage.success('所有任务已清空')
  } catch {
  }
}
</script>

<style scoped>
.task-board {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.board-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.board-actions {
  display: flex;
  gap: 12px;
}

.board-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px;
  background: white;
  border-radius: 12px;
  color: #909399;
  font-size: 16px;
}

.loading-icon {
  font-size: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .board-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .board-actions {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .board-columns {
    grid-template-columns: 1fr;
  }
}
</style>
