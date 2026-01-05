<template>
  <div class="app-container">
    <el-container>
      <el-aside width="220px" class="app-aside" :class="{ 'is-collapsed': isCollapsed }">
        <div class="aside-header">
          <el-icon class="logo-icon"><Grid /></el-icon>
          <span v-show="!isCollapsed" class="logo-text">任务看板</span>
        </div>
        
        <el-menu
          :default-active="activeRoute"
          class="aside-menu"
          :collapse="isCollapsed"
          router
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <template #title>首页</template>
          </el-menu-item>
          
          <el-menu-item index="/tasks">
            <el-icon><Document /></el-icon>
            <template #title>任务列表</template>
          </el-menu-item>
          
          <el-menu-item index="/stats">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>数据统计</template>
          </el-menu-item>
        </el-menu>
        
        <div class="aside-footer">
          <el-button
            class="collapse-btn"
            :icon="isCollapsed ? 'Expand' : 'Fold'"
            @click="toggleCollapse"
            :title="isCollapsed ? '展开菜单' : '收起菜单'"
          />
        </div>
      </el-aside>
      
      <el-container>
        <el-main class="app-main">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Grid, HomeFilled, Document, DataAnalysis, Expand, Fold } from '@element-plus/icons-vue'

const route = useRoute()
const isCollapsed = ref(false)

const activeRoute = computed(() => route.path)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
.app-container {
  height: 100vh;
}

.app-aside {
  background: linear-gradient(180deg, #304156 0%, #1f2d3d 100%);
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
}

.app-aside.is-collapsed {
  width: 64px !important;
}

.aside-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-icon {
  font-size: 28px;
  color: #409eff;
}

.logo-text {
  margin-left: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.aside-menu {
  flex: 1;
  border-right: none;
  background: transparent;
}

.aside-menu:not(.el-menu--collapse) {
  width: 220px;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  color: #a0a4b0;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.1);
}

:deep(.el-menu-item.is-active) {
  color: #409eff;
  background: rgba(64, 158, 255, 0.1);
}

.aside-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.collapse-btn {
  width: 100%;
  background: transparent;
  border: none;
  color: #a0a4b0;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.app-main {
  background: #f5f7fa;
  padding: 0;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .app-aside {
    position: fixed;
    z-index: 1000;
    height: 100%;
  }
  
  .app-aside.is-collapsed {
    width: 0 !important;
    overflow: hidden;
  }
}
</style>
