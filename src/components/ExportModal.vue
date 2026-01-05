<template>
  <el-dialog
    v-model="visible"
    title="导出任务数据"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form label-position="top">
      <el-form-item label="选择导出格式">
        <el-radio-group v-model="selectedFormat">
          <el-radio-button label="json">JSON</el-radio-button>
          <el-radio-button label="csv">CSV</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="选择导出的任务列">
        <el-checkbox-group v-model="selectedColumns">
          <el-checkbox 
            v-for="col in columns" 
            :key="col.id" 
            :label="col.id"
          >
            {{ col.title }} ({{ col.tasks.length }}个任务)
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      
      <el-alert
        v-if="selectedColumns.length === 0"
        title="请至少选择一个任务列"
        type="warning"
        :closable="false"
        show-icon
      />
      
      <el-alert
        v-if="selectedFormat === 'csv'"
        title="CSV 格式说明"
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          CSV 格式适合在 Excel 等电子表格软件中打开
        </template>
      </el-alert>
    </el-form>
    
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button 
        type="primary" 
        :disabled="selectedColumns.length === 0"
        :loading="isExporting"
        @click="handleExport"
      >
        <el-icon><Download /></el-icon>
        导出
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { useTaskStore } from '../stores/taskStore'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const store = useTaskStore()
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedFormat = ref('json')
const selectedColumns = ref([])
const isExporting = ref(false)

const columns = computed(() => store.columns)

watch(visible, (newVal) => {
  if (newVal) {
    selectedColumns.value = store.columns.map(col => col.id)
  }
})

const handleExport = async () => {
  if (selectedColumns.value.length === 0) {
    ElMessage.warning('请至少选择一个任务列')
    return
  }
  
  isExporting.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    store.exportData(selectedFormat.value, selectedColumns.value)
    ElMessage.success('导出成功')
    visible.value = false
  } catch (error) {
    ElMessage.error('导出失败')
  } finally {
    isExporting.value = false
  }
}
</script>
