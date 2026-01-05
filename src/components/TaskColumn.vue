<template>
  <div
    class="task-column"
    @dragover.prevent
    @drop="handleDrop"
  >
    <div class="column-header">
      <span class="column-title">
        <el-icon><Folder /></el-icon>
        {{ column.title }}
        <span class="column-count">{{ column.tasks.length }}</span>
      </span>
      <el-button size="small" type="primary" @click="handleAddTask">
        <el-icon><Plus /></el-icon>
        新增
      </el-button>
    </div>
    
    <div
      ref="taskListRef"
      class="task-list"
    >
      <TaskCard
        v-for="(task, index) in column.tasks"
        :key="task.id"
        :task="task"
        :column-id="column.id"
        :draggable="true"
        :show-actions="true"
        @edit="handleEditTask"
        @delete="handleDeleteTask"
        @dragstart="(e) => handleTaskDragStart(e, task.id)"
      />
      
      <div
        v-if="column.tasks.length === 0"
        class="placeholder-pulse"
      >
        <el-empty description="暂无任务" :image-size="60" />
      </div>
    </div>
    
    <el-button
      v-if="column.tasks.length > 0"
      class="add-task-btn"
      type="primary"
      plain
      @click="handleAddTask"
    >
      <el-icon><Plus /></el-icon>
      添加任务
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Folder, Plus } from '@element-plus/icons-vue'
import TaskCard from './TaskCard.vue'
import { useTaskStore } from '../stores/taskStore'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  column: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['addTask', 'editTask'])

const store = useTaskStore()
const taskListRef = ref(null)
const draggedTaskId = ref(null)
const draggedFromColumnId = ref(null)

const handleAddTask = () => {
  emit('addTask', props.column.id)
}

const handleEditTask = (task) => {
  emit('editTask', task)
}

const handleDeleteTask = async (taskId) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个任务吗？此操作不可恢复。',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const success = store.deleteTask(taskId)
    if (success) {
      ElMessage.success('任务已删除')
    }
  } catch {
    // 用户取消
  }
}

const handleTaskDragStart = (event, taskId) => {
  draggedTaskId.value = taskId
  draggedFromColumnId.value = props.column.id
  event.dataTransfer.effectAllowed = 'move'
  event.target.classList.add('dragging')
}

const handleDrop = (event) => {
  event.preventDefault()
  
  const taskId = draggedTaskId.value
  const fromColumnId = draggedFromColumnId.value
  const toColumnId = props.column.id
  
  if (taskId && fromColumnId && toColumnId) {
    const rect = taskListRef.value?.getBoundingClientRect()
    if (rect) {
      const mouseY = event.clientY - rect.top
      const children = taskListRef.value?.children
      let toIndex = props.column.tasks.length
      
      if (children) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i]
          if (child.classList.contains('task-card')) {
            const childRect = child.getBoundingClientRect()
            const childCenterY = childRect.top + childRect.height / 2
            if (mouseY < childCenterY) {
              toIndex = i
              break
            }
          }
        }
      }
      
      store.moveTask(taskId, fromColumnId, toColumnId, toIndex)
    }
  }
  
  draggedTaskId.value = null
  draggedFromColumnId.value = null
}
</script>

<style scoped>
.task-column {
  background: #f5f7fa;
  border-radius: 12px;
  padding: 16px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e4e7ed;
}

.column-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.column-count {
  background: #409eff;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.task-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 200px;
  padding: 4px;
}

.add-task-btn {
  margin-top: 12px;
}

.placeholder-pulse {
  background: #e4e7ed;
  border-radius: 8px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
