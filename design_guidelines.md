# 工作日历管理小程序 - 设计指南

## 品牌定位
- **应用定位**：日历式工作管理工具，集工作内容记录与待办事项管理于一体
- **设计风格**：专业、简洁、高效，注重信息密度与操作便捷性
- **目标用户**：需要管理日常工作内容和待办事项的职场人士

## 配色方案
- **主色**：`bg-blue-600` / `text-blue-600` — 专业、信任、效率
- **辅色**：`bg-indigo-50` / `text-indigo-600` — 柔和的辅助强调
- **中性色**：
  - 背景：`bg-gray-50`（页面）、`bg-white`（卡片）
  - 文字：`text-gray-900`（标题）、`text-gray-600`（正文）、`text-gray-400`（辅助）
  - 边框：`border-gray-200`
- **语义色**：
  - 重要紧急：`text-red-600` / `bg-red-50`
  - 重要不紧急：`text-orange-600` / `bg-orange-50`
  - 紧急不重要：`text-yellow-600` / `bg-yellow-50`
  - 不重要不紧急：`text-green-600` / `bg-green-50`
  - 完成状态：`text-emerald-600` / `bg-emerald-50`
  - 进行中：`text-blue-600` / `bg-blue-50`
  - 未开始：`text-gray-500` / `bg-gray-50`
- **日历标记色**：`bg-blue-100`（有记录的日期）、`bg-blue-600 text-white`（选中日期）

## 字体规范
- 页面标题：`text-xl font-bold text-gray-900`
- 区域标题：`text-lg font-semibold text-gray-900`
- 卡片标题：`text-base font-medium text-gray-900`
- 正文内容：`text-sm text-gray-600`
- 辅助信息：`text-xs text-gray-400`

## 间距系统
- 页面边距：`px-4`
- 卡片内边距：`p-4`
- 区块间距：`gap-4` 或 `space-y-4`
- 列表项间距：`gap-2` 或 `gap-3`
- 紧凑元素间距：`gap-1`

## 组件使用原则
- 通用 UI 组件优先使用 `@/components/ui/*`
- 按钮：`Button`（主操作用 variant="default"，次要用 variant="outline"）
- 输入框：`Input`（配合 View 包裹）
- 卡片：`Card` + `CardContent`
- 弹窗：`Dialog`（表单弹层）、`AlertDialog`（危险操作确认）
- 标签：`Badge`（优先级、状态标记）
- 切换：`Tabs`（工作内容/待办事项切换）
- 底部抽屉：`Drawer`（添加/编辑表单）
- 折叠：`Collapsible`（待办事项详情折叠）
- 选择器：`Select`（分类、优先级选择）
- 复选框：`Checkbox`（完成情况勾选）
- 分隔线：`Separator`

## 导航结构
- 单页面应用，日历视图为默认界面
- 通过 Tabs 切换"工作内容"和"待办事项"
- 通过 Drawer 弹出添加/编辑表单

## 小程序约束
- 图片通过 TOS 对象存储管理
- 避免大包体积，按需加载
- 列表使用虚拟滚动优化性能
