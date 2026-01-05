<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑任务' : '新增任务'"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form 
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="任务标题" prop="title">
        <el-input 
          v-model="formData.title"
          placeholder="请输入任务标题"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item label="任务描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入任务描述（可选）"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item label="优先级" prop="priority">
        <el-radio-group v-model="formData.priority">
          <el-radio-button label="high">
            <el-icon><Top /></el-icon>
            高
          </el-radio-button>
          <el-radio-button label="medium">
            <el-icon><Minus /></el-icon>
            中
          </el-radio-button>
          <el-radio-button label="low">
            <el-icon><Bottom /></el-icon>
            低
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="截止日期" prop="dueDate">
        <el-date-picker
          v-model="formData.dueDate"
          type="datetime"
          placeholder="选择截止日期（可选）"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DDTHH:mm:ss"
          :disabled-date="disabledDate"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="isSubmitting" @click="handleSubmit">
        {{ isEdit ? '保存' : '创建' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Top, Minus, Bottom } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    default: null
  },
  columnId: {
    type: String,
    default: 'todo'
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const formRef = ref(null)
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEdit = computed(() => !!props.task)
const isSubmitting = ref(false)

const formData = ref({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: null
})

const rules = {
  title: [
    { required: true, message: '请输入任务标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2-100 个字符之间', trigger: 'blur' }
  ]
}

const disabledDate = (date) => {
  return date.getTime() < Date.now() - 8.64e7
}

watch(visible, (newVal) => {
  if (newVal) {
    if (props.task) {
      formData.value = {
        title: props.task.title || '',
        description: props.task.description || '',
        priority: props.task.priority || 'medium',
        dueDate: props.task.dueDate || null
      }
    } else {
      formData.value = {
        title: '',
        description: '',
        priority: 'medium',
        dueDate: null
      }
    }
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }
})

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    isSubmitting.value = true
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    emit('save', { ...formData.value })
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
