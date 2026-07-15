import { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Trash2,
  ListChecks,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Calendar,
  Folder,
} from 'lucide-react-taro'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Network } from '@/network'
import { CategoryCombobox } from '@/components/category-combobox'
import { DatePickerDialog } from '@/components/date-picker-dialog'
import { SwipeableItem } from '@/components/swipeable-item'
import { StatusIcon } from '@/components/status-icon'
import { CategoryManagement } from '@/components/category-management'
import './index.css'

// ========== Types ==========
interface CategoryItem {
  id: string
  parent_id: string | null
  name: string
  type: string
  level: number
  children?: CategoryItem[]
}

interface WorkRecord {
  id: string
  category_id: string
  sub_category_id: string | null
  content: string
  hours: number
  record_date: string
  created_at: string
  category_name?: string
  sub_category_name?: string
}

interface TodoItem {
  id: string
  category_id: string
  sub_category_id: string | null
  content: string
  related_person: string | null
  priority: string
  deadline: string | null
  status: string
  parent_todo_id: string | null
  hours: number | null
  completed_at: string | null
  created_at: string
  category_name?: string
  sub_category_name?: string
  children?: TodoItem[]
}

// ========== Helpers ==========
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

const PRIORITY_MAP: Record<string, { label: string; color: string; bgColor: string; order: number }> = {
  urgent_important: { label: '重要紧急', color: 'text-red-600', bgColor: 'bg-red-50', order: 1 },
  important_not_urgent: { label: '重要不紧急', color: 'text-orange-600', bgColor: 'bg-orange-50', order: 2 },
  urgent_not_important: { label: '紧急不重要', color: 'text-yellow-600', bgColor: 'bg-yellow-50', order: 3 },
  not_urgent_not_important: { label: '不重要不紧急', color: 'text-green-600', bgColor: 'bg-green-50', order: 4 },
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const days: (Date | null)[] = []
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d))
  return days
}

// ========== Main Component ==========
export default function Index() {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(formatDate(today))
  const [activeTab, setActiveTab] = useState('work')

  // Data states
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [workRecords, setWorkRecords] = useState<WorkRecord[]>([])
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [showCompleted, setShowCompleted] = useState(false)
  const [showCategoryManagement, setShowCategoryManagement] = useState(false)
  const [editingWork, setEditingWork] = useState<WorkRecord | null>(null)
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null)
  const [completedPage, setCompletedPage] = useState(1)
  const COMPLETED_PAGE_SIZE = 10

  // Drawer states
  const [showAddWork, setShowAddWork] = useState(false)
  const [showAddTodo, setShowAddTodo] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [completingTodo, setCompletingTodo] = useState<TodoItem | null>(null)
  const [completeHours, setCompleteHours] = useState('')

  // Form states
  const [workForm, setWorkForm] = useState({ category_id: '', sub_category_id: '', content: '', hours: '' })
  const [todoForm, setTodoForm] = useState({
    category_id: '', sub_category_id: '', content: '', related_person: '',
    priority: 'urgent_important', deadline: '',
  })

  // Populate form when editing
  useEffect(() => {
    if (editingWork) {
      setWorkForm({
        category_id: editingWork.category_id || '',
        sub_category_id: editingWork.sub_category_id || '',
        content: editingWork.content || '',
        hours: editingWork.hours ? String(editingWork.hours) : '',
      })
    } else if (!showAddWork) {
      setWorkForm({ category_id: '', sub_category_id: '', content: '', hours: '' })
    }
  }, [editingWork, showAddWork])

  useEffect(() => {
    if (editingTodo) {
      setTodoForm({
        category_id: editingTodo.category_id || '',
        sub_category_id: editingTodo.sub_category_id || '',
        content: editingTodo.content || '',
        related_person: editingTodo.related_person || '',
        priority: editingTodo.priority || 'urgent_important',
        deadline: editingTodo.deadline || '',
      })
    } else if (!showAddTodo) {
      setTodoForm({
        category_id: '', sub_category_id: '', content: '', related_person: '',
        priority: 'urgent_important', deadline: '',
      })
    }
  }, [editingTodo, showAddTodo])

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Sub-item states
  const [expandedTodos, setExpandedTodos] = useState<Set<string>>(new Set())
  const [showAddSubItem, setShowAddSubItem] = useState(false)
  const [subItemParentId, setSubItemParentId] = useState('')
  const [subItemContent, setSubItemContent] = useState('')

  // ========== Data Fetching ==========
  const fetchCategories = useCallback(async () => {
    try {
      // Fetch all categories (both work and todo share the same categories)
      const res = await Network.request({ url: '/api/categories/tree' })
      console.log('[API] categories:', res.data)
      setCategories(res.data?.data || [])
    } catch (e) {
      console.error('Failed to fetch categories', e)
    }
  }, [])

  const fetchWorkRecords = useCallback(async () => {
    try {
      const res = await Network.request({ url: `/api/work-records?date=${selectedDate}` })
      console.log('[API] work records:', res.data)
      setWorkRecords(res.data?.data || [])
    } catch (e) {
      console.error('Failed to fetch work records', e)
    }
  }, [selectedDate])

  const fetchTodos = useCallback(async () => {
    try {
      const status = showCompleted ? 'completed' : ''
      const url = status ? `/api/todos?status=${status}` : '/api/todos'
      const res = await Network.request({ url })
      console.log('[API] todos:', res.data)
      setTodos(res.data?.data || [])
    } catch (e) {
      console.error('Failed to fetch todos', e)
    }
  }, [showCompleted])


  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchWorkRecords()
    
  }, [fetchWorkRecords])

  useEffect(() => {
    if (activeTab === 'todo') fetchTodos()
  }, [activeTab, fetchTodos])

  // ========== Calendar Navigation ==========
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1)
      setCurrentMonth(11)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1)
      setCurrentMonth(0)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const calendarDays = getCalendarDays(currentYear, currentMonth)

  // ========== Category helpers ==========
  const selectedWorkCategory = categories.find(c => c.id === workForm.category_id)
  const selectedTodoCategory = categories.find(c => c.id === todoForm.category_id)
  const workSubCategories = selectedWorkCategory?.children || []
  const todoSubCategories = selectedTodoCategory?.children || []

  // ========== Group todos by priority (only for incomplete) ==========
  const incompleteTodos = todos.filter(t => t.status !== 'completed')
  const completedTodos = todos.filter(t => t.status === 'completed')
  const paginatedCompletedTodos = completedTodos.slice(0, completedPage * COMPLETED_PAGE_SIZE)
  const hasMoreCompleted = completedTodos.length > completedPage * COMPLETED_PAGE_SIZE
  
  const groupedTodos = showCompleted
    ? [{ key: 'completed', label: '已完成', color: 'text-gray-500', bgColor: 'bg-gray-50', order: 0, items: paginatedCompletedTodos }]
    : Object.entries(PRIORITY_MAP)
        .sort(([, a], [, b]) => a.order - b.order)
        .map(([key, config]) => ({
          key,
          ...config,
          items: incompleteTodos.filter(t => t.priority === key),
        }))
        .filter(g => g.items.length > 0)

  // ========== Work Record Actions ==========
  const handleAddWork = async () => {
    if (!workForm.category_id || !workForm.content) {
      Taro.showToast({ title: '请填写分类和内容', icon: 'none' })
      return
    }
    try {
      const body: any = {
        category_id: workForm.category_id,
        content: workForm.content,
        hours: parseFloat(workForm.hours) || 0,
        record_date: selectedDate,
      }
      if (workForm.sub_category_id) body.sub_category_id = workForm.sub_category_id
      
      if (editingWork) {
        // Update existing work record
        await Network.request({ url: `/api/work-records/${editingWork.id}`, method: 'PUT', data: body })
        console.log('[API] update work record:', editingWork.id)
      } else {
        // Create new work record
        const res = await Network.request({ url: '/api/work-records', method: 'POST', data: body })
        console.log('[API] create work record:', res.data)
      }
      setShowAddWork(false)
      setEditingWork(null)
      setWorkForm({ category_id: '', sub_category_id: '', content: '', hours: '' })
      fetchWorkRecords()
      fetchCategories()
    } catch (e) {
      console.error('Failed to save work record', e)
      Taro.showToast({ title: editingWork ? '更新失败' : '添加失败', icon: 'none' })
    }
  }

  const handleDeleteWork = async (id: string) => {
    try {
      await Network.request({ url: `/api/work-records/${id}`, method: 'DELETE' })
      fetchWorkRecords()
    } catch (e) {
      console.error('Failed to delete work record', e)
    }
  }

  // ========== Todo Actions ==========
  const handleAddTodo = async () => {
    if (!todoForm.category_id || !todoForm.content) {
      Taro.showToast({ title: '请填写分类和内容', icon: 'none' })
      return
    }
    try {
      const body: any = {
        category_id: todoForm.category_id,
        content: todoForm.content,
        priority: todoForm.priority,
      }
      if (todoForm.sub_category_id) body.sub_category_id = todoForm.sub_category_id
      if (todoForm.related_person) body.related_person = todoForm.related_person
      if (todoForm.deadline) body.deadline = todoForm.deadline
      
      if (editingTodo) {
        // Update existing todo
        await Network.request({ url: `/api/todos/${editingTodo.id}`, method: 'PUT', data: body })
        console.log('[API] update todo:', editingTodo.id)
      } else {
        // Create new todo
        const res = await Network.request({ url: '/api/todos', method: 'POST', data: body })
        console.log('[API] create todo:', res.data)
      }
      setShowAddTodo(false)
      setEditingTodo(null)
      setTodoForm({ category_id: '', sub_category_id: '', content: '', related_person: '', priority: 'urgent_important', deadline: '' })
      fetchTodos()
      fetchCategories()
    } catch (e) {
      console.error('Failed to save todo', e)
      Taro.showToast({ title: editingTodo ? '更新失败' : '添加失败', icon: 'none' })
    }
  }

  const handleToggleStatus = async (todo: TodoItem) => {
    const nextStatus = todo.status === 'not_started' ? 'in_progress' : todo.status === 'in_progress' ? 'completed' : 'not_started'
    if (nextStatus === 'completed') {
      setCompletingTodo(todo)
      setCompleteHours('')
      setShowCompleteDialog(true)
      return
    }
    try {
      await Network.request({ url: `/api/todos/${todo.id}`, method: 'PUT', data: { status: nextStatus } })
      fetchTodos()
      // If this is a sub-item, also update parent status
      if (todo.parent_todo_id) {
        await updateParentStatus(todo.parent_todo_id)
      }
    } catch (e) {
      console.error('Failed to update todo status', e)
    }
  }

  const updateParentStatus = async (parentId: string) => {
    try {
      // Fetch all sub-items of this parent
      const res = await Network.request({ url: `/api/todos?parent_todo_id=${parentId}` })
      const subItems = res.data?.data || []
      
      if (subItems.length === 0) return
      
      // Check sub-items status
      // All not started → parent not started
      // All completed → parent completed
      // Other cases → parent in progress
      const allCompleted = subItems.every((t: TodoItem) => t.status === 'completed')
      const allNotStarted = subItems.every((t: TodoItem) => t.status === 'not_started')
      
      let newStatus = 'in_progress'
      if (allCompleted) {
        newStatus = 'completed'
      } else if (allNotStarted) {
        newStatus = 'not_started'
      }
      
      await Network.request({ url: `/api/todos/${parentId}`, method: 'PUT', data: { status: newStatus } })
      // Refresh todos list
      await fetchTodos()
    } catch (e) {
      console.error('Failed to update parent status', e)
    }
  }

  const handleCompleteTodo = async () => {
    if (!completingTodo) return
    try {
      const hours = parseFloat(completeHours) || 0
      await Network.request({ url: `/api/todos/${completingTodo.id}`, method: 'PUT', data: { status: 'completed', hours } })
      if (hours > 0) {
        await Network.request({
          url: '/api/work-records',
          method: 'POST',
          data: {
            category_id: completingTodo.category_id,
            sub_category_id: completingTodo.sub_category_id || undefined,
            content: `[完成待办] ${completingTodo.content}`,
            hours,
            record_date: selectedDate,
          },
        })
      }
      setShowCompleteDialog(false)
      setCompletingTodo(null)
      setCompleteHours('')
      fetchTodos()
      fetchWorkRecords()
      // If this is a sub-item, update parent status
      if (completingTodo.parent_todo_id) {
        await updateParentStatus(completingTodo.parent_todo_id)
      }
    } catch (e) {
      console.error('Failed to complete todo', e)
      Taro.showToast({ title: '操作失败', icon: 'none' })
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      await Network.request({ url: `/api/todos/${id}`, method: 'DELETE' })
      fetchTodos()
    } catch (e) {
      console.error('Failed to delete todo', e)
    }
  }

  // ========== Sub-item Actions ==========
  const handleAddSubItem = async () => {
    if (!subItemContent || !subItemParentId) return
    try {
      const parent = todos.find(t => t.id === subItemParentId)
      await Network.request({
        url: '/api/todos',
        method: 'POST',
        data: {
          category_id: parent?.category_id || '',
          content: subItemContent,
          parent_todo_id: subItemParentId,
          priority: parent?.priority || 'urgent_important',
        },
      })
      setShowAddSubItem(false)
      setSubItemContent('')
      setSubItemParentId('')
      fetchTodos()
    } catch (e) {
      console.error('Failed to add sub-item', e)
    }
  }

  const toggleExpand = (id: string) => {
    const next = new Set(expandedTodos)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpandedTodos(next)
  }

  // ========== Render ==========
  return (
    <ScrollView scrollY className="h-full bg-gray-50">
      <View className="min-h-full pb-8">
        {/* ===== Calendar Header ===== */}
        <View className="bg-white px-4 pt-3 pb-1">
          <View className="flex flex-row items-center justify-between mb-2">
            <Text className="block text-base font-bold text-gray-900">
              {currentYear}年{currentMonth + 1}月
            </Text>
            <View className="flex flex-row gap-1">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft size={16} color="#6b7280" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date()
                  setCurrentYear(now.getFullYear())
                  setCurrentMonth(now.getMonth())
                  setSelectedDate(formatDate(now))
                }}
              >
                <Text className="text-xs text-gray-600">今天</Text>
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight size={16} color="#6b7280" />
              </Button>
            </View>
          </View>

          {/* Weekday headers */}
          <View className="flex flex-row mb-1">
            {WEEKDAYS.map((day) => (
              <View key={day} className="flex-1 items-center">
                <Text className="block text-xs text-gray-400 text-center">{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View className="flex flex-row flex-wrap">
            {calendarDays.map((date, idx) => {
              if (!date) {
                return <View key={`empty-${idx}`} className="calendar-cell" />
              }
              const dateStr = formatDate(date)
              const isSelected = dateStr === selectedDate
              const isToday = dateStr === formatDate(today)
              return (
                <View
                  key={dateStr}
                  className="calendar-cell items-center justify-center"
                  onClick={() => setSelectedDate(dateStr)}
                >
                  <View
                    className={`w-6 h-6 rounded-full items-center justify-center ${
                      isSelected ? 'bg-blue-600' : isToday ? 'bg-blue-100' : ''
                    }`}
                  >
                    <Text
                      className={`block text-xs text-center ${
                        isSelected ? 'text-white font-semibold' : isToday ? 'text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {date.getDate()}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* ===== Selected Date Info ===== */}
        <View className="mx-4 mt-3">
          <View className="flex flex-row items-center justify-between mb-2">
            <Text className="block text-base font-semibold text-gray-900">
              {selectedDate === formatDate(today) ? '今天' : `${selectedDate}`}
            </Text>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCategoryManagement(true)}
            >
              <View className="flex flex-row items-center gap-1">
                <Folder size={14} color="#6b7280" />
                <Text className="text-xs text-gray-600">分类管理</Text>
              </View>
            </Button>
          </View>

          {/* ===== Tabs: Work / Todo ===== */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-3">
              <TabsTrigger value="work">
                <View className="flex flex-row items-center gap-1">
                  <Briefcase size={14} color={activeTab === 'work' ? '#2563eb' : '#6b7280'} />
                  <Text className="text-sm">工作内容</Text>
                </View>
              </TabsTrigger>
              <TabsTrigger value="todo">
                <View className="flex flex-row items-center gap-1">
                  <ListChecks size={14} color={activeTab === 'todo' ? '#2563eb' : '#6b7280'} />
                  <Text className="text-sm">待办事项</Text>
                </View>
              </TabsTrigger>
            </TabsList>

            {/* ===== Work Records Tab ===== */}
            <TabsContent value="work">
              <View className="gap-3">
                <Button
                  variant="outline"
                  className="w-full border-dashed border-gray-300"
                  onClick={() => setShowAddWork(true)}
                >
                  <View className="flex flex-row items-center gap-1">
                    <Plus size={16} color="#6b7280" />
                    <Text className="text-sm text-gray-500">记录工作内容</Text>
                  </View>
                </Button>

                {workRecords.length === 0 ? (
                  <View className="items-center py-8">
                    <Briefcase size={40} color="#d1d5db" />
                    <Text className="block text-sm text-gray-400 mt-2">暂无工作记录</Text>
                  </View>
                ) : (
                  <View className="gap-2">
                    {workRecords.map((record) => (
                      <SwipeableItem
                        key={record.id}
                        actions={
                          <View className="flex flex-row h-full items-stretch">
                            <View
                              className="h-full flex-1 bg-red-500 flex items-center justify-center"
                              onClick={() => handleDeleteWork(record.id)}
                            >
                              <Trash2 size={20} color="#fff" />
                            </View>
                          </View>
                        }
                      >
                        <Card onClick={() => { setEditingWork(record); setShowAddWork(true) }}>
                          <CardContent className="p-3">
                            <View className="flex-1">
                              <View className="flex flex-row items-center gap-2 mb-1">
                                <Badge variant="secondary" className="bg-blue-50">
                                  <Text className="text-xs text-blue-600">{record.category_name}</Text>
                                </Badge>
                                {record.sub_category_name && (
                                  <Badge variant="outline" className="border-gray-200">
                                    <Text className="text-xs text-gray-500">{record.sub_category_name}</Text>
                                  </Badge>
                                )}
                              </View>
                              <Text className="block text-sm text-gray-700">{record.content}</Text>
                              {record.hours > 0 && (
                                <View className="flex flex-row items-center gap-1 mt-1">
                                  <Clock size={12} color="#6b7280" />
                                  <Text className="block text-xs text-gray-500">{record.hours}h</Text>
                                </View>
                              )}
                            </View>
                          </CardContent>
                        </Card>
                      </SwipeableItem>
                    ))}
                    <View className="flex flex-row items-center justify-end gap-1">
                      <Clock size={14} color="#6b7280" />
                      <Text className="block text-sm text-gray-600">
                        合计: {workRecords.reduce((sum, r) => sum + (r.hours || 0), 0).toFixed(1)}h
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </TabsContent>

            {/* ===== Todos Tab (Grouped by Priority) ===== */}
            <TabsContent value="todo">
              <View className="gap-3">
                {/* Add button + Toggle completed */}
                <View className="flex flex-row items-center gap-2">
                  <Button
                    variant={showCompleted ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setShowCompleted(!showCompleted)
                      if (!showCompleted) setCompletedPage(1)
                    }}
                  >
                    <View className="flex flex-row items-center gap-1">
                      <StatusIcon status={showCompleted ? 'completed' : 'not_started'} size={14} />
                      <Text className={`text-xs ${showCompleted ? 'text-white' : 'text-gray-600'}`}>
                        {showCompleted ? '已完成' : '未完成'}
                      </Text>
                    </View>
                  </Button>
                  <Button size="sm" onClick={() => setShowAddTodo(true)}>
                    <View className="flex flex-row items-center gap-1">
                      <Plus size={14} color="#ffffff" />
                      <Text className="text-xs text-white">添加待办</Text>
                    </View>
                  </Button>
                </View>

                {/* Todos grouped by priority */}
                {todos.length === 0 ? (
                  <View className="items-center py-8">
                    <ListChecks size={40} color="#d1d5db" />
                    <Text className="block text-sm text-gray-400 mt-2">
                      {showCompleted ? '暂无已完成待办' : '暂无待办事项'}
                    </Text>
                  </View>
                ) : (
                  <View className="gap-4">
                    {groupedTodos.map((group) => (
                      <View key={group.key}>
                        {/* Priority group header */}
                        <View className="flex flex-row items-center gap-2 mb-2 px-1">
                          <View className={`w-2 h-2 rounded-full ${group.bgColor.replace('50', '500')}`} />
                          <Text className={`block text-sm font-medium ${group.color}`}>{group.label}</Text>
                          <Text className="block text-xs text-gray-400">({group.items.length})</Text>
                        </View>

                        {/* Todo items */}
                        <View className="gap-2">
                          {group.items.map((todo) => {
                            const isExpanded = expandedTodos.has(todo.id)
                            const hasChildren = todo.children && todo.children.length > 0
                            const completedCount = todo.children?.filter(c => c.status === 'completed').length || 0
                            return (
                              <SwipeableItem
                                key={todo.id}
                                actions={
                                  <View className="flex flex-row h-full items-stretch justify-end">
                                    <View
                                      className="h-full bg-blue-500 flex items-center justify-center"
                                      style={{ width: '70px' }}
                                      onClick={() => {
                                        setSubItemParentId(todo.id)
                                        setShowAddSubItem(true)
                                      }}
                                    >
                                      <Plus size={20} color="#ffffff" />
                                    </View>
                                    <View
                                      className="h-full bg-red-500 flex items-center justify-center"
                                      style={{ width: '70px' }}
                                      onClick={() => handleDeleteTodo(todo.id)}
                                    >
                                      <Trash2 size={20} color="#ffffff" />
                                    </View>
                                  </View>
                                }
                              >
                                <Card className="rounded-none" onClick={() => { setEditingTodo(todo); setShowAddTodo(true) }}>
                                  <CardContent className="p-3">
                                    <View className="flex flex-row items-start gap-2">
                                      {/* Status icon */}
                                      <View className="pt-1" onClick={(e) => e.stopPropagation()}>
                                        <StatusIcon status={todo.status} size={20} onClick={() => handleToggleStatus(todo)} />
                                      </View>
                                      {/* Content */}
                                      <View className="flex-1">
                                        <Text
                                          className={`block text-sm ${
                                            todo.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700'
                                          }`}
                                        >
                                          {todo.content}
                                        </Text>
                                        <View className="flex flex-row items-center gap-2 mt-1 flex-wrap">
                                          {todo.category_name && (
                                            <Text className="block text-xs text-gray-400">{todo.category_name}</Text>
                                          )}
                                          {todo.sub_category_name && (
                                            <Text className="block text-xs text-gray-300">/ {todo.sub_category_name}</Text>
                                          )}
                                          {todo.related_person && (
                                            <Text className="block text-xs text-gray-400">@{todo.related_person}</Text>
                                          )}
                                          {/* Show deadline or completed_at */}
                                          {showCompleted && todo.completed_at ? (
                                            <Text className="block text-xs text-emerald-500">
                                              完成: {todo.completed_at.slice(5, 10)}
                                            </Text>
                                          ) : todo.deadline ? (
                                            <Text className="block text-xs text-gray-400">
                                              截止: {todo.deadline.slice(5)}
                                            </Text>
                                          ) : null}
                                        </View>
                                      </View>
                                    </View>

                                    {/* Sub items section */}
                                    {hasChildren && (
                                      <View className="mt-2 pt-2 border-t border-gray-100">
                                        <View
                                          className="flex flex-row items-center gap-1"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            toggleExpand(todo.id)
                                          }}
                                        >
                                          {isExpanded ? <ChevronUp size={14} color="#6b7280" /> : <ChevronDown size={14} color="#6b7280" />}
                                          <Text className="block text-xs text-gray-500">
                                            子项 ({completedCount}/{todo.children!.length})
                                          </Text>
                                        </View>
                                        {isExpanded && (
                                          <View className="mt-2 ml-4 gap-2">
                                            {todo.children!.map((child) => (
                                              <SwipeableItem
                                                key={child.id}
                                                actionWidth={70}
                                                actions={
                                                  <View className="h-full bg-red-500 flex items-center justify-center" style={{ width: '70px' }} onClick={() => handleDeleteTodo(child.id)}>
                                                    <Trash2 size={18} color="#ffffff" />
                                                  </View>
                                                }
                                              >
                                                <View className="flex flex-row items-center gap-2 py-1 bg-gray-50 rounded-lg px-2">
                                                  <View onClick={(e) => e.stopPropagation()}>
                                                    <StatusIcon status={child.status} size={16} onClick={() => handleToggleStatus(child)} />
                                                  </View>
                                                  <Text
                                                    className={`block text-xs flex-1 ${
                                                      child.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-600'
                                                    }`}
                                                  >
                                                    {child.content}
                                                  </Text>
                                                </View>
                                              </SwipeableItem>
                                            ))}
                                          </View>
                                        )}
                                      </View>
                                    )}
                                  </CardContent>
                                </Card>
                              </SwipeableItem>
                            )
                          })}
                        </View>
                        {/* Load more button for completed todos */}
                        {showCompleted && hasMoreCompleted && (
                          <Button
                            variant="outline"
                            className="mt-2"
                            onClick={() => setCompletedPage(p => p + 1)}
                          >
                            <Text className="text-sm text-gray-600">加载更多 (还有 {completedTodos.length - completedPage * COMPLETED_PAGE_SIZE} 条)</Text>
                          </Button>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </TabsContent>
          </Tabs>
        </View>
      </View>

      {/* ===== Add Work Record Drawer ===== */}
      <Drawer open={showAddWork} onOpenChange={(open) => { setShowAddWork(open); if (!open) setEditingWork(null) }}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{editingWork ? "编辑工作内容" : "记录工作内容"}</DrawerTitle>
          </DrawerHeader>
          <View className="px-4 gap-4">
            <CategoryCombobox
              categories={categories}
              value={workForm.category_id}
              onValueChange={(val) => setWorkForm({ ...workForm, category_id: val, sub_category_id: '' })}
              placeholder="选择或输入大类"
              type="work"
              label="大类"
              onCategoryCreated={() => fetchCategories()}
            />
            <CategoryCombobox
              categories={workSubCategories}
              value={workForm.sub_category_id}
              onValueChange={(val) => setWorkForm({ ...workForm, sub_category_id: val })}
              placeholder="选择或输入小类（可选）"
              type="work"
              parentId={workForm.category_id || undefined}
              label="小类"
              onCategoryCreated={() => fetchCategories()}
            />
            <View>
              <Text className="block text-sm text-gray-600 mb-1">内容</Text>
              <View className="bg-gray-50 rounded-xl p-3">
                <Textarea
                  className="w-full bg-transparent min-h-24"
                  placeholder="输入工作内容..."
                  value={workForm.content}
                  onInput={(e) => setWorkForm({ ...workForm, content: e.detail.value })}
                  maxlength={500}
                />
              </View>
            </View>
            <View>
              <Text className="block text-sm text-gray-600 mb-1">耗时 (小时)</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-2">
                <Input
                  className="w-full bg-transparent"
                  placeholder="0"
                  type="digit"
                  value={workForm.hours}
                  onInput={(e) => setWorkForm({ ...workForm, hours: e.detail.value })}
                />
              </View>
            </View>
          </View>
          <DrawerFooter>
            <Button onClick={handleAddWork} className="w-full">
              <Text className="text-white text-sm">保存</Text>
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setShowAddWork(false)}>
              <Text className="text-sm">取消</Text>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* ===== Add Todo Drawer ===== */}
      <Drawer open={showAddTodo} onOpenChange={(open) => { setShowAddTodo(open); if (!open) setEditingTodo(null) }}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{editingTodo ? "编辑待办事项" : "添加待办事项"}</DrawerTitle>
          </DrawerHeader>
          <View className="px-4 gap-4">
            <CategoryCombobox
              categories={categories}
              value={todoForm.category_id}
              onValueChange={(val) => setTodoForm({ ...todoForm, category_id: val, sub_category_id: '' })}
              placeholder="选择或输入大类"
              type="todo"
              label="大类"
              onCategoryCreated={() => fetchCategories()}
            />
            <CategoryCombobox
              categories={todoSubCategories}
              value={todoForm.sub_category_id}
              onValueChange={(val) => setTodoForm({ ...todoForm, sub_category_id: val })}
              placeholder="选择或输入小类（可选）"
              type="todo"
              parentId={todoForm.category_id || undefined}
              label="小类"
              onCategoryCreated={() => fetchCategories()}
            />
            <View>
              <Text className="block text-sm text-gray-600 mb-1">内容</Text>
              <View className="bg-gray-50 rounded-xl p-3">
                <Textarea
                  className="w-full bg-transparent min-h-24"
                  placeholder="输入待办内容..."
                  value={todoForm.content}
                  onInput={(e) => setTodoForm({ ...todoForm, content: e.detail.value })}
                  maxlength={500}
                />
              </View>
            </View>
            <View>
              <Text className="block text-sm text-gray-600 mb-1">相关人员</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-2">
                <Input
                  className="w-full bg-transparent"
                  placeholder="输入相关人员（可选）"
                  value={todoForm.related_person}
                  onInput={(e) => setTodoForm({ ...todoForm, related_person: e.detail.value })}
                />
              </View>
            </View>
            <View>
              <Text className="block text-sm text-gray-600 mb-1">优先级</Text>
              <Select value={todoForm.priority} onValueChange={(val) => setTodoForm({ ...todoForm, priority: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="选择优先级" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_MAP).map(([key, val]) => (
                    <SelectItem key={key} value={key} className={val.color}>
                      {val.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </View>
            <View>
              <Text className="block text-sm text-gray-600 mb-1">截止时间</Text>
              <View
                className="flex flex-row items-center bg-gray-50 rounded-xl px-4 py-2"
                onClick={() => setShowDatePicker(true)}
              >
                <Calendar size={16} color="#9ca3af" />
                <Text className="block flex-1 text-sm text-gray-700 ml-2">
                  {todoForm.deadline || '点击选择日期'}
                </Text>
              </View>
            </View>
          </View>
          <DrawerFooter>
            <Button onClick={handleAddTodo} className="w-full">
              <Text className="text-white text-sm">保存</Text>
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setShowAddTodo(false)}>
              <Text className="text-sm">取消</Text>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* ===== Date Picker Dialog ===== */}
      <DatePickerDialog
        open={showDatePicker}
        onOpenChange={setShowDatePicker}
        value={todoForm.deadline}
        onConfirm={(date) => setTodoForm({ ...todoForm, deadline: date })}
      />

      {/* ===== Complete Todo Dialog ===== */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>完成待办</DialogTitle>
          </DialogHeader>
          <View className="px-2 gap-3">
            <Text className="block text-sm text-gray-600">
              确认将「{completingTodo?.content}」标记为完成？
            </Text>
            <View>
              <Text className="block text-sm text-gray-600 mb-1">记录耗时 (小时)</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-2">
                <Input
                  className="w-full bg-transparent"
                  placeholder="0"
                  type="digit"
                  value={completeHours}
                  onInput={(e) => setCompleteHours(e.detail.value)}
                />
              </View>
            </View>
            <Text className="block text-xs text-gray-400">
              填写耗时后将自动记录到当天的工作内容中
            </Text>
          </View>
          <DialogFooter>
            <Button onClick={handleCompleteTodo} className="flex-1">
              <Text className="text-white text-sm">确认完成</Text>
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setShowCompleteDialog(false)}>
              <Text className="text-sm">取消</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Add Sub-item Dialog ===== */}
      <Dialog open={showAddSubItem} onOpenChange={setShowAddSubItem}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加子项</DialogTitle>
          </DialogHeader>
          <View className="px-2 gap-3">
            <View>
              <Text className="block text-sm text-gray-600 mb-1">子项内容</Text>
              <View className="bg-gray-50 rounded-xl p-3">
                <Textarea
                  className="w-full bg-transparent min-h-16"
                  placeholder="输入子项内容"
                  value={subItemContent}
                  onInput={(e) => setSubItemContent(e.detail.value)}
                  maxlength={200}
                />
              </View>
            </View>
          </View>
          <DialogFooter>
            <Button onClick={handleAddSubItem} className="flex-1">
              <Text className="text-white text-sm">添加</Text>
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setShowAddSubItem(false)}>
              <Text className="text-sm">取消</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Category Management ===== */}
      <CategoryManagement
        open={showCategoryManagement}
        onOpenChange={setShowCategoryManagement}
        onCategoriesChanged={() => fetchCategories()}
      />

    </ScrollView>
  )
}
