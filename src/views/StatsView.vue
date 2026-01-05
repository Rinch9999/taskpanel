<template>
  <div class="stats-view">
    <header class="page-header">
      <div class="header-content">
        <el-page-header @back="goBack">
          <template #content>
            <span class="page-title">数据统计</span>
          </template>
        </el-page-header>
      </div>
    </header>

    <div class="stats-container">
      <el-row :gutter="20" class="stats-cards">
        <el-col :span="8">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-icon total">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ store.totalTasks }}</div>
              <div class="stat-label">总任务数</div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-icon completed">
              <el-icon><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ store.completedTasks }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-icon rate">
              <el-icon><DataLine /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ store.completionRate }}%</div>
              <div class="stat-label">完成率</div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-card class="progress-card">
        <template #header>
          <div class="card-header">
            <span>任务进度</span>
          </div>
        </template>
        <div class="progress-content">
          <el-progress
            :percentage="store.completionRate"
            :stroke-width="20"
            :color="getProgressColor(store.completionRate)"
          />
          <div class="progress-stats">
            <span>已完成: {{ store.completedTasks }} / {{ store.totalTasks }}</span>
          </div>
        </div>
      </el-card>

      <el-card class="distribution-card">
        <template #header>
          <div class="card-header">
            <span>任务分布</span>
          </div>
        </template>
        <div class="distribution-content">
          <div
            v-for="column in store.columns"
            :key="column.id"
            class="distribution-item"
          >
            <div class="distribution-header">
              <span class="distribution-title">{{ column.title }}</span>
              <span class="distribution-count">{{ column.tasks.length }} 个任务</span>
            </div>
            <el-progress
              :percentage="getColumnPercentage(column.tasks.length)"
              :stroke-width="12"
              :show-text="false"
            />
          </div>
        </div>
      </el-card>

      <el-card class="priority-card">
        <template #header>
          <div class="card-header">
            <span>优先级统计</span>
          </div>
        </template>
        <div class="priority-stats">
          <div class="priority-item">
            <el-tag type="danger" size="large">高优先级</el-tag>
            <span class="priority-count">{{ priorityStats.high }}</span>
          </div>
          <div class="priority-item">
            <el-tag type="warning" size="large">中优先级</el-tag>
            <span class="priority-count">{{ priorityStats.medium }}</span>
          </div>
          <div class="priority-item">
            <el-tag type="success" size="large">低优先级</el-tag>
            <span class="priority-count">{{ priorityStats.low }}</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Document, CircleCheck, DataLine } from '@element-plus/icons-vue'
import { useTaskStore } from '../stores/taskStore'

const router = useRouter()
const store = useTaskStore()

const goBack = () => {
  router.push('/')
}

const getProgressColor = (percentage) => {
  if (percentage >= 80) return '#67c23a'
  if (percentage >= 50) return '#e6a23c'
  return '#f56c6c'
}

const getColumnPercentage = (count) => {
  if (store.totalTasks === 0) return 0
  return Math.round((count / store.totalTasks) * 100)
}

const priorityStats = computed(() => {
  const stats = { high: 0, medium: 0, low: 0 }
  for (const column of store.columns) {
    for (const task of column.tasks) {
      if (stats[task.priority] !== undefined) {
        stats[task.priority]++
      }
    }
  }
  return stats
})
</script>

<style scoped>
.stats-view {
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

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-cards {
  margin-bottom: 0 !important;
}

.stat-card {
  text-align: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 28px;
}

.stat-icon.total {
  background: rgba(64, 158, 255, 0.1);
  color: #409eff;
}

.stat-icon.completed {
  background: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.stat-icon.rate {
  background: rgba(230, 162, 60, 0.1);
  color: #e6a23c;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 8px;
}

.card-header {
  font-weight: 600;
  font-size: 16px;
}

.progress-content {
  padding: 20px 0;
}

.progress-stats {
  margin-top: 16px;
  text-align: center;
  color: #606266;
}

.distribution-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.distribution-item {
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
}

.distribution-item:last-child {
  border-bottom: none;
}

.distribution-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.distribution-title {
  font-weight: 500;
}

.distribution-count {
  color: #909399;
  font-size: 14px;
}

.priority-stats {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}

.priority-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.priority-count {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}
</style>
