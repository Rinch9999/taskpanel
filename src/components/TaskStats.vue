<template>
  <div class="stats-section">
    <h3 class="stats-title">任务统计</h3>
    <div class="stats-content">
      <div class="stat-item">
        <div class="stat-value">{{ totalTasks }}</div>
        <div class="stat-label">总任务数</div>
      </div>
      <div class="stat-item completed">
        <div class="stat-value">{{ completedTasks }}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ pendingTasks }}</div>
        <div class="stat-label">待完成</div>
      </div>
      <div class="stat-item rate">
        <div class="stat-value">{{ completionRate }}%</div>
        <div class="stat-label">完成率</div>
      </div>
    </div>
    
    <div class="progress-bar">
      <el-progress 
        :percentage="completionRate" 
        :stroke-width="10"
        :color="progressColor"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'

const store = useTaskStore()

const totalTasks = computed(() => store.totalTasks)
const completedTasks = computed(() => store.completedTasks)
const pendingTasks = computed(() => store.totalTasks - store.completedTasks)
const completionRate = computed(() => store.completionRate)

const progressColor = computed(() => {
  if (completionRate.value >= 80) return '#67c23a'
  if (completionRate.value >= 50) return '#e6a23c'
  return '#409eff'
})
</script>

<style scoped>
.stats-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.stats-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.stats-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #409eff;
}

.stat-item.completed .stat-value {
  color: #67c23a;
}

.stat-item.rate .stat-value {
  color: #e6a23c;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.progress-bar {
  margin-top: 16px;
}
</style>
