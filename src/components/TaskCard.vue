<template>
  <div
    :class="['task-card', `priority-${task.priority}`, dueStatusClass]"
    :draggable="draggable"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @click="handleClick"
  >
    <div class="task-header">
      <span :class="['task-priority', `priority-${task.priority}`]">
        {{ priorityText }}
      </span>
      <div class="task-actions" v-if="showActions">
        <el-button size="small" circle @click.stop="handleEdit">
          <el-icon><Edit /></el-icon>
        </el-button>
        <el-button size="small" circle type="danger" @click.stop="handleDelete">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
    </div>
    
    <h3 class="task-title">{{ task.title }}</h3>
    
    <p v-if="task.description" class="task-description">{{ task.description }}</p>
    
    <div v-if="task.dueDate" :class="['task-due-date', dueStatusClass]">
      <el-icon><Clock /></el-icon>
      <span>{{ formattedDueDate }}</span>
    </div>
    
    <div class="task-footer">
      <span class="task-created-at">创建于 {{ formattedCreatedAt }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Edit, Delete, Clock } from '@element-plus/icons-vue'
import { useTaskStore } from '../stores/taskStore'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  columnId: {
    type: String,
    required: true
  },
  draggable: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['edit', 'delete', 'dragstart', 'dragend'])

const store = useTaskStore()

const priorityText = computed(() => {
  const texts = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  }
  return texts[props.task.priority] || '普通'
})

const dueStatusClass = computed(() => {
  const status = store.checkDueDate(props.task.dueDate)
  return status === 'expired' ? 'expired' : status === 'due-soon' ? 'due-soon' : ''
})

const formattedDueDate = computed(() => {
  if (!props.task.dueDate) return ''
  return new Date(props.task.dueDate).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const formattedCreatedAt = computed(() => {
  if (!props.task.createdAt) return ''
  return new Date(props.task.createdAt).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
})

const handleDragStart = (event) => {
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('taskId', props.task.id)
  event.dataTransfer.setData('fromColumnId', props.columnId)
  emit('dragstart', event)
}

const handleDragEnd = (event) => {
  emit('dragend', event)
}

const handleClick = () => {
  if (props.showActions) {
    emit('edit', props.task)
  }
}

const handleEdit = () => {
  emit('edit', props.task)
}

const handleDelete = () => {
  emit('delete', props.task.id)
}
</script>

<style scoped>
.task-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: grab;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.task-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.task-card.dragging {
  opacity: 0.8;
  transform: rotate(3deg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.task-card.priority-high {
  border-left-color: #f56c6c;
}

.task-card.priority-medium {
  border-left-color: #e6a23c;
}

.task-card.priority-low {
  border-left-color: #67c23a;
}

.task-card.expired {
  background: #fef0f0;
}

.task-card.due-soon {
  background: #fdf6ec;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.task-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.task-card:hover .task-actions {
  opacity: 1;
}

.task-title {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 8px 0;
  word-break: break-word;
}

.task-description {
  font-size: 13px;
  color: #606266;
  margin: 0 0 12px 0;
  line-height: 1.5;
  word-break: break-word;
}

.task-due-date {
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.task-due-date.expired {
  color: #f56c6c;
}

.task-due-date.due-soon {
  color: #e6a23c;
}

.task-priority {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.task-priority.priority-high {
  background: #fef0f0;
  color: #f56c6c;
}

.task-priority.priority-medium {
  background: #fdf6ec;
  color: #e6a23c;
}

.task-priority.priority-low {
  background: #f0f9eb;
  color: #67c23a;
}

.task-footer {
  border-top: 1px solid #ebeef5;
  padding-top: 8px;
  margin-top: 8px;
}

.task-created-at {
  font-size: 11px;
  color: #c0c4cc;
}
</style>
