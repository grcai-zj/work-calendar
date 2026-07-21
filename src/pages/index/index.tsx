import { useState, useEffect, useCallback } from 'react'
// eslint-disable-next-line no-restricted-syntax
import { View, Text, ScrollView, Image, Button as TaroButton } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
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
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Network } from '@/network'
import { CategoryCombobox } from '@/components/category-combobox'
import { DatePickerDialog } from '@/components/date-picker-dialog'
import { StatusIcon } from '@/components/status-icon'
import { CategoryManagement } from '@/components/category-management'
import './index.css'

// ========== Types ==========
interface UserInfo {
  id: string
  openid: string
  phone?: string
  nickname?: string
  avatar_url?: string
}

interface CategoryItem {
  id: string
  parent_id: string | null
  name: string
  type: string
  level: number
  hidden?: boolean
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
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null)
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [exportStartDate, setExportStartDate] = useState('')
  const [exportEndDate, setExportEndDate] = useState('')
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showWorkDatePicker, setShowWorkDatePicker] = useState(false)
  const [showExportStartDatePicker, setShowExportStartDatePicker] = useState(false)
  const [showExportEndDatePicker, setShowExportEndDatePicker] = useState(false)
  const [loginPhone, setLoginPhone] = useState('')
  const [loginCode, setLoginCode] = useState('')
  const [codeSending, setCodeSending] = useState(false)
  const [codeCountdown, setCodeCountdown] = useState(0)
  const [loginLoading, setLoginLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
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
  const [workForm, setWorkForm] = useState({ category_id: '', sub_category_id: '', content: '', hours: '', record_date: '' })
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
        record_date: editingWork.record_date || selectedDate,
      })
    } else if (!showAddWork) {
      setWorkForm({ category_id: '', sub_category_id: '', content: '', hours: '', record_date: '' })
    } else if (!editingWork) {
      // 新建时默认使用当前选中日期
      setWorkForm(prev => ({ ...prev, record_date: selectedDate }))
    }
  }, [editingWork, showAddWork, selectedDate])

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
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())
  const [showAddSubItem, setShowAddSubItem] = useState(false)
  const [subItemParentId, setSubItemParentId] = useState('')
  const [subItemContent, setSubItemContent] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'work' | 'todo'; id: string } | null>(null)

  // ========== Helper Functions ==========
  const getRequestHeaders = useCallback(() => {
    if (!currentUser) return {}
    return { 'x-user-id': currentUser.id }
  }, [currentUser])

  // ========== User Management ==========
  const currentEnv = Taro.getEnv()
  const isMiniApp = currentEnv === Taro.ENV_TYPE.WEAPP || currentEnv === Taro.ENV_TYPE.TT

  // 发送验证码
  const handleSendCode = useCallback(async () => {
    if (!loginPhone || !/^1[3-9]\d{9}$/.test(loginPhone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    setCodeSending(true)
    try {
      const res = await Network.request({
        url: '/api/users/send-code',
        method: 'POST',
        data: { phone: loginPhone },
      })

      if (res.data?.code === 200) {
        Taro.showToast({ title: '验证码已发送', icon: 'success' })
        // 开发环境显示验证码
        if (res.data?.data?.code) {
          console.log('[验证码]', res.data.data.code)
        }
        // 开始倒计时
        setCodeCountdown(60)
        const timer = setInterval(() => {
          setCodeCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        Taro.showToast({ title: '发送失败', icon: 'none' })
      }
    } catch (e) {
      console.error('Send code failed', e)
      Taro.showToast({ title: '发送失败', icon: 'none' })
    } finally {
      setCodeSending(false)
    }
  }, [loginPhone])

  // 手机号登录
  const handlePhoneLogin = useCallback(async () => {
    if (!loginPhone || !/^1[3-9]\d{9}$/.test(loginPhone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (!loginCode || loginCode.length !== 6) {
      Taro.showToast({ title: '请输入6位验证码', icon: 'none' })
      return
    }

    setLoginLoading(true)
    try {
      const res = await Network.request({
        url: '/api/users/login-by-phone',
        method: 'POST',
        data: { phone: loginPhone, code: loginCode },
      })

      if (res.data?.code === 200 && res.data?.data) {
        const user = res.data.data as UserInfo
        setCurrentUser(user)
        Taro.setStorageSync('userId', user.id)
        setShowUserDialog(false)
        setLoginPhone('')
        setLoginCode('')
        Taro.showToast({ title: '登录成功', icon: 'success' })
      } else {
        Taro.showToast({ title: res.data?.msg || '登录失败', icon: 'none' })
      }
    } catch (e) {
      console.error('Phone login failed', e)
      Taro.showToast({ title: '登录失败', icon: 'none' })
    } finally {
      setLoginLoading(false)
    }
  }, [loginPhone, loginCode])

  const handleLogin = useCallback(async () => {
    if (!isMiniApp) {
      // H5 使用手机号登录（在弹窗中处理）
      return
    }

    try {
      console.log('[handleLogin] 开始登录...')
      // 调用微信登录获取 code
      const loginRes = await Taro.login()
      console.log('[handleLogin] Taro.login 结果:', loginRes)
      if (!loginRes.code) {
        console.error('[handleLogin] 获取 code 失败')
        Taro.showToast({ title: '登录失败：获取 code 失败', icon: 'none' })
        return
      }

      // 调用后端登录接口
      console.log('[handleLogin] 调用后端登录接口...')
      const res = await Network.request({
        url: '/api/users/login',
        method: 'POST',
        data: {
          code: loginRes.code, // 实际项目中应该用 code 换取 openid
          nickname: '用户',
          avatarUrl: avatarUrl || undefined,
        },
      })
      console.log('[handleLogin] 后端响应:', res.data)

      if (res.data?.code === 200 && res.data?.data) {
        const user = res.data.data as UserInfo
        setCurrentUser(user)
        Taro.setStorageSync('userId', user.id)
        Taro.setStorageSync('lastLoginTime', Date.now())
        setShowUserDialog(false)
        Taro.showToast({ title: '登录成功', icon: 'success' })
      } else {
        console.error('[handleLogin] 登录失败，响应:', res.data)
        Taro.showToast({ title: res.data?.msg || '登录失败', icon: 'none' })
      }
    } catch (e) {
      console.error('[handleLogin] 登录异常:', e)
      Taro.showToast({ title: '登录失败：网络错误', icon: 'none' })
    }
  }, [isMiniApp, avatarUrl])

  const handleLogout = useCallback(() => {
    setCurrentUser(null)
    Taro.removeStorageSync('userId')
    Taro.removeStorageSync('lastLoginTime')
    setShowUserDialog(false)
    // 清空数据
    setCategories([])
    setWorkRecords([])
    setTodos([])
  }, [])


  // 导出指定日期范围的工作内容
  const handleExportByDateRange = useCallback(async () => {
    if (!currentUser) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    if (!exportStartDate || !exportEndDate) {
      Taro.showToast({ title: '请选择日期范围', icon: 'none' })
      return
    }
    if (exportStartDate > exportEndDate) {
      Taro.showToast({ title: '起始日期不能大于结束日期', icon: 'none' })
      return
    }

    try {
      // 获取指定日期范围的工作记录
      const res = await Network.request({
        url: `/api/work-records/range?start_date=${exportStartDate}&end_date=${exportEndDate}`,
        header: getRequestHeaders(),
      })
      console.log('[API] export range:', res.data)
      
      const records = res.data?.data || []
      if (records.length === 0) {
        Taro.showToast({ title: '该日期范围没有工作记录', icon: 'none' })
        return
      }

      // 构建 CSV 内容
      const headers = ['日期', '大类', '小类', '内容', '耗时(h)']
      const rows = records.map((record: any) => {
        const categoryName = record.category_name || ''
        const subCategoryName = record.sub_category_name || ''
        const content = (record.content || '').replace(/,/g, '，')
        return [record.record_date, categoryName, subCategoryName, content, record.hours?.toString() || '0']
      })

      const csvContent = [
        headers.join(','),
        ...rows.map((row: string[]) => row.join(','))
      ].join('\n')

      // 在小程序中使用文件系统保存
      const fs = Taro.getFileSystemManager()
      const filePath = `${Taro.env.USER_DATA_PATH}/work_records_${exportStartDate}_${exportEndDate}.csv`
      
      fs.writeFile({
        filePath,
        data: csvContent,
        encoding: 'utf8',
        success: () => {
          Taro.openDocument({
            filePath,
            showMenu: true,
            success: () => {
              Taro.showToast({ title: '导出成功', icon: 'success' })
            },
            fail: (err) => {
              console.error('打开文档失败', err)
              Taro.setClipboardData({
                data: csvContent,
                success: () => {
                  Taro.showToast({ title: '已复制到剪贴板', icon: 'success' })
                }
              })
            }
          })
        },
        fail: (err) => {
          console.error('保存文件失败', err)
          Taro.setClipboardData({
            data: csvContent,
            success: () => {
              Taro.showToast({ title: '已复制到剪贴板', icon: 'success' })
            }
          })
        }
      })
    } catch (err) {
      console.error('导出失败', err)
      Taro.showToast({ title: '导出失败', icon: 'none' })
    }
  }, [currentUser, exportStartDate, exportEndDate, getRequestHeaders])

  // 初始化时检查本地存储的用户信息
  // 获取用户信息的函数
  const fetchUserInfo = useCallback(async () => {
    const userId = Taro.getStorageSync('userId')
    if (!userId) {
      console.log('[fetchUserInfo] 没有 userId，跳过')
      return
    }
    
    // 检查是否超过两天未登录
    const lastLoginTime = Taro.getStorageSync('lastLoginTime')
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000
    const now = Date.now()
    
    console.log('[fetchUserInfo] userId:', userId, 'lastLoginTime:', lastLoginTime, 'now:', now)
    
    // 如果没有 lastLoginTime（旧版本登录的），设置当前时间，不登出
    if (!lastLoginTime) {
      console.log('[fetchUserInfo] 没有 lastLoginTime，设置当前时间')
      Taro.setStorageSync('lastLoginTime', now)
    } else if ((now - lastLoginTime) > twoDaysInMs) {
      // 超过两天，自动登出
      console.log('[fetchUserInfo] 超过两天未登录，自动登出')
      setCurrentUser(null)
      Taro.removeStorageSync('userId')
      Taro.removeStorageSync('lastLoginTime')
      return
    }
    
    try {
      const res = await Network.request({
        url: '/api/users/me',
        header: { 'x-user-id': userId },
      })
      console.log('[fetchUserInfo] /api/users/me 响应:', res.data)
      if (res.data?.code === 200 && res.data?.data) {
        setCurrentUser(res.data.data as UserInfo)
        // 更新登录时间
        Taro.setStorageSync('lastLoginTime', Date.now())
      } else if (res.data?.code === 404) {
        // 用户不存在，清除本地存储
        console.log('[fetchUserInfo] 用户不存在，清除本地存储')
        setCurrentUser(null)
        Taro.removeStorageSync('userId')
        Taro.removeStorageSync('lastLoginTime')
      }
    } catch (err) {
      // 请求失败时不要立即登出，可能是网络问题
      console.error('[fetchUserInfo] 获取用户信息失败:', err)
    }
  }, [])

  // 初始化时获取用户信息
  useEffect(() => {
    fetchUserInfo()
  }, [fetchUserInfo])

  // 小程序从后台回到前台时重新获取用户信息
  useEffect(() => {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP || Taro.getEnv() === Taro.ENV_TYPE.TT) {
      const onShow = () => {
        fetchUserInfo()
      }
      Taro.onAppShow(onShow)
      return () => {
        Taro.offAppShow(onShow)
      }
    }
  }, [fetchUserInfo])

  // ========== Data Fetching ==========
  const fetchCategories = useCallback(async () => {
    if (!currentUser) { setCategories([]); return }
    try {
      const res = await Network.request({
        url: '/api/categories/tree',
        header: getRequestHeaders(),
      })
      console.log('[API] categories:', res.data)
      setCategories(res.data?.data || [])
    } catch (e) {
      console.error('Failed to fetch categories', e)
    }
  }, [currentUser, getRequestHeaders])

  const fetchWorkRecords = useCallback(async () => {
    if (!currentUser) { setWorkRecords([]); return }
    try {
      const res = await Network.request({
        url: `/api/work-records?date=${selectedDate}`,
        header: getRequestHeaders(),
      })
      console.log('[API] work records:', res.data)
      setWorkRecords(res.data?.data || [])
    } catch (e) {
      console.error('Failed to fetch work records', e)
    }
  }, [selectedDate, currentUser, getRequestHeaders])

  const fetchTodos = useCallback(async () => {
    if (!currentUser) { setTodos([]); return }
    try {
      const status = showCompleted ? 'completed' : ''
      const url = status ? `/api/todos?status=${status}` : '/api/todos'
      const res = await Network.request({ url, header: getRequestHeaders() })
      console.log('[API] todos:', res.data)
      setTodos(res.data?.data || [])
    } catch (e) {
      console.error('Failed to fetch todos', e)
    }
  }, [showCompleted, currentUser, getRequestHeaders])


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
  
  // Filter out hidden categories for display in forms
  const visibleCategories = categories.filter(c => !c.hidden).map(c => ({
    ...c,
    children: c.children?.filter(sub => !sub.hidden) || []
  }))
  const visibleWorkSubCategories = workSubCategories.filter(sub => !sub.hidden)
  const visibleTodoSubCategories = todoSubCategories.filter(sub => !sub.hidden)

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
    if (!workForm.record_date) {
      Taro.showToast({ title: '请选择日期', icon: 'none' })
      return
    }
    try {
      const body: any = {
        category_id: workForm.category_id,
        content: workForm.content,
        hours: parseFloat(workForm.hours) || 0,
        record_date: workForm.record_date,
      }
      if (workForm.sub_category_id) body.sub_category_id = workForm.sub_category_id
      
      if (editingWork) {
        // Update existing work record
        await Network.request({ url: `/api/work-records/${editingWork.id}`, method: 'PUT', data: body, header: getRequestHeaders() })
        console.log('[API] update work record:', editingWork.id)
      } else {
        // Create new work record
        const res = await Network.request({ url: '/api/work-records', method: 'POST', data: body, header: getRequestHeaders() })
        console.log('[API] create work record:', res.data)
      }
      setShowAddWork(false)
      setEditingWork(null)
      setWorkForm({ category_id: '', sub_category_id: '', content: '', hours: '', record_date: '' })
      fetchWorkRecords()
      fetchCategories()
    } catch (e) {
      console.error('Failed to save work record', e)
      Taro.showToast({ title: editingWork ? '更新失败' : '添加失败', icon: 'none' })
    }
  }

  const handleDeleteWork = async (id: string) => {
    setDeleteTarget({ type: 'work', id })
    setShowDeleteConfirm(true)
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
        await Network.request({ url: `/api/todos/${editingTodo.id}`, method: 'PUT', data: body, header: getRequestHeaders() })
        console.log('[API] update todo:', editingTodo.id)
      } else {
        // Create new todo
        const res = await Network.request({ url: '/api/todos', method: 'POST', data: body, header: getRequestHeaders() })
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
      await Network.request({ url: `/api/todos/${todo.id}`, method: 'PUT', data: { status: nextStatus }, header: getRequestHeaders() })
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
      const res = await Network.request({ url: `/api/todos?parent_todo_id=${parentId}`, header: getRequestHeaders() })
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
      
      await Network.request({ url: `/api/todos/${parentId}`, method: 'PUT', data: { status: newStatus }, header: getRequestHeaders() })
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
      await Network.request({ url: `/api/todos/${completingTodo.id}`, method: 'PUT', data: { status: 'completed', hours }, header: getRequestHeaders() })
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
          header: getRequestHeaders(),
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
    setDeleteTarget({ type: 'todo', id })
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      if (deleteTarget.type === 'work') {
        await Network.request({ url: `/api/work-records/${deleteTarget.id}`, method: 'DELETE', header: getRequestHeaders() })
        fetchWorkRecords()
      } else {
        await Network.request({ url: `/api/todos/${deleteTarget.id}`, method: 'DELETE', header: getRequestHeaders() })
        fetchTodos()
      }
    } catch (e) {
      console.error('Failed to delete', e)
    } finally {
      setShowDeleteConfirm(false)
      setDeleteTarget(null)
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
        header: getRequestHeaders(),
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

  const toggleGroupCollapse = (groupKey: string) => {
    const next = new Set(collapsedGroups)
    if (next.has(groupKey)) next.delete(groupKey)
    else next.add(groupKey)
    setCollapsedGroups(next)
  }

  // ========== Render ==========
  return (
    <ScrollView scrollY className="h-full bg-gray-50">
      <View className="min-h-full pb-8">
        {/* ===== Calendar Header ===== */}
        <View className="bg-white px-4 pt-3 pb-1">
          <View className="flex flex-row items-center justify-between mb-2">
            {/* User Button */}
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-2 border-blue-300 bg-blue-50"
              onClick={() => setShowUserDialog(true)}
            >
              {currentUser ? (
                currentUser.avatar_url ? (
                  <Image src={currentUser.avatar_url} className="h-9 w-9 rounded-full" mode="aspectFill" />
                ) : (
                  <Text className="block text-sm font-bold text-blue-600">
                    {currentUser.nickname?.charAt(0) || 'U'}
                  </Text>
                )
              ) : (
                <Text className="block text-sm font-medium text-blue-400">登录</Text>
              )}
            </Button>

            {/* Month Navigation */}
            <View className="flex flex-row items-center gap-2">
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={prevMonth}>
                <ChevronLeft size={14} color="#6b7280" />
              </Button>
              <Text className="block text-base font-bold text-gray-900">
                {currentYear}年{currentMonth + 1}月
              </Text>
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={nextMonth}>
                <ChevronRight size={14} color="#6b7280" />
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
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%' }}
                    className={`${
                      isSelected ? 'bg-blue-600' : isToday ? 'bg-blue-100' : ''
                    }`}
                  >
                    <Text
                      style={{ lineHeight: '1', fontSize: '12px', textAlign: 'center' }}
                      className={`block text-center ${
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
            <TabsList className="grid grid-cols-2 mb-1">
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
              <View className="gap-1">
                <View className="flex flex-row justify-end">
                  <Button
                    variant="outline"
                    className="w-1/2 border-dashed border-gray-300"
                    onClick={() => setShowAddWork(true)}
                  >
                    <View className="flex flex-row items-center gap-1">
                      <Plus size={16} color="#6b7280" />
                      <Text className="text-sm text-gray-500">记录工作</Text>
                    </View>
                  </Button>
                </View>

                {workRecords.length === 0 ? (
                  <View className="items-center py-8">
                    <Briefcase size={40} color="#d1d5db" />
                    <Text className="block text-sm text-gray-400 mt-2">暂无工作记录</Text>
                  </View>
                ) : (
                  <View className="gap-2">
                    {workRecords.map((record) => (
                      <View key={record.id} className="flex flex-row items-stretch gap-0">
                        <Card className="flex-1 rounded-r-none" onClick={() => { setEditingWork(record); setShowAddWork(true) }}>
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
                        <View
                          className="w-10 bg-gray-100 border border-gray-200 border-l-0 rounded-r-lg flex items-center justify-center"
                          onClick={() => handleDeleteWork(record.id)}
                        >
                          <Text className="text-gray-400 text-lg">-</Text>
                        </View>
                      </View>
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
              <View className="gap-1">
                {/* Add button + Toggle completed */}
                <View className="flex flex-row items-center justify-between gap-2">
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
                  <Button 
                    variant="outline" 
                    className="w-1/2 border-dashed border-gray-300"
                    onClick={() => setShowAddTodo(true)}
                  >
                    <View className="flex flex-row items-center gap-1">
                      <Plus size={16} color="#6b7280" />
                      <Text className="text-sm text-gray-500">添加待办</Text>
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
                    {groupedTodos.map((group) => {
                      const isGroupCollapsed = collapsedGroups.has(group.key)
                      return (
                      <View key={group.key}>
                        {/* Priority group header - clickable to collapse/expand */}
                        <View 
                          className="flex flex-row items-center gap-2 mt-3 mb-1 px-1"
                          onClick={() => toggleGroupCollapse(group.key)}
                        >
                          {isGroupCollapsed ? <ChevronRight size={14} color="#6b7280" /> : <ChevronDown size={14} color="#6b7280" />}
                          <View className={`w-2 h-2 rounded-full ${group.bgColor.replace('50', '500')}`} />
                          <Text className={`block text-sm font-medium ${group.color}`}>{group.label}</Text>
                          <Text className="block text-xs text-gray-400">({group.items.length})</Text>
                        </View>

                        {/* Todo items - hidden when collapsed */}
                        {!isGroupCollapsed && (
                        <View className="gap-4">
                          {group.items.map((todo) => {
                            const isExpanded = expandedTodos.has(todo.id)
                            const hasChildren = todo.children && todo.children.length > 0
                            const completedCount = todo.children?.filter(c => c.status === 'completed').length || 0
                            return (
                              <View key={todo.id}>
                                {/* Parent todo row - buttons only cover parent height */}
                                <View className="flex flex-row items-stretch gap-0">
                                  <Card className="flex-1 rounded-r-none" onClick={() => { setEditingTodo(todo); setShowAddTodo(true) }}>
                                    <CardContent className="p-2">
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
                                    </CardContent>
                                  </Card>
                                  {/* Action buttons */}
                                  <View className="w-10 flex flex-col border border-gray-200 border-l-0 rounded-r-lg overflow-hidden">
                                    <View
                                      className="flex-1 bg-gray-100 flex items-center justify-center border-b border-gray-200"
                                      onClick={() => {
                                        setSubItemParentId(todo.id)
                                        setShowAddSubItem(true)
                                      }}
                                    >
                                      <Text className="text-gray-400 text-lg">+</Text>
                                    </View>
                                    <View
                                      className="flex-1 bg-gray-100 flex items-center justify-center"
                                      onClick={() => handleDeleteTodo(todo.id)}
                                    >
                                      <Text className="text-gray-400 text-lg">-</Text>
                                    </View>
                                  </View>
                                </View>

                                {/* Sub items section - separate from parent buttons */}
                                {hasChildren && (
                                  <View className="ml-4">
                                    <View
                                      className="flex flex-row items-center gap-1 py-1"
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
                                      <View className="gap-1">
                                        {todo.children!.map((child) => (
                                          <View key={child.id} className="flex flex-row items-stretch gap-0">
                                            <View 
                                              className="flex-1 flex flex-row items-center gap-2 py-2 px-3 bg-gray-50 rounded-l-lg"
                                              onClick={() => { setEditingTodo(child); setShowAddTodo(true) }}
                                            >
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
                                            <View
                                              className="w-10 flex items-center justify-center bg-gray-100 border border-gray-200 rounded-r-lg"
                                              onClick={() => handleDeleteTodo(child.id)}
                                            >
                                              <Text className="text-gray-400 text-lg">-</Text>
                                            </View>
                                          </View>
                                        ))}
                                      </View>
                                    )}
                                  </View>
                                )}
                              </View>
                            )
                          })}
                        </View>
                        )}
                        {/* Load more button for completed todos */}
                        {showCompleted && hasMoreCompleted && !isGroupCollapsed && (
                          <Button
                            variant="outline"
                            className="mt-2"
                            onClick={() => setCompletedPage(p => p + 1)}
                          >
                            <Text className="text-sm text-gray-600">加载更多 (还有 {completedTodos.length - completedPage * COMPLETED_PAGE_SIZE} 条)</Text>
                          </Button>
                        )}
                      </View>
                      )
                    })}
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
              categories={visibleCategories}
              value={workForm.category_id}
              onValueChange={(val) => setWorkForm({ ...workForm, category_id: val, sub_category_id: '' })}
              placeholder="选择或输入大类"
              type="work"
              label="大类"
              onCategoryCreated={() => fetchCategories()}
              userId={currentUser?.id}
            />
            <CategoryCombobox
              categories={visibleWorkSubCategories}
              value={workForm.sub_category_id}
              onValueChange={(val) => setWorkForm({ ...workForm, sub_category_id: val })}
              placeholder="选择或输入小类（可选）"
              type="work"
              parentId={workForm.category_id || undefined}
              label="小类"
              onCategoryCreated={() => fetchCategories()}
              userId={currentUser?.id}
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
              <Text className="block text-sm text-gray-600 mb-1">日期</Text>
              <View
                className="flex flex-row items-center bg-gray-50 rounded-xl px-4 py-2"
                onClick={() => setShowWorkDatePicker(true)}
              >
                <Calendar size={16} color="#9ca3af" />
                <Text className="block flex-1 text-sm text-gray-700 ml-2">
                  {workForm.record_date || '点击选择日期'}
                </Text>
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
              categories={visibleCategories}
              value={todoForm.category_id}
              onValueChange={(val) => setTodoForm({ ...todoForm, category_id: val, sub_category_id: '' })}
              placeholder="选择或输入大类"
              type="todo"
              label="大类"
              onCategoryCreated={() => fetchCategories()}
              userId={currentUser?.id}
            />
            <CategoryCombobox
              categories={visibleTodoSubCategories}
              value={todoForm.sub_category_id}
              onValueChange={(val) => setTodoForm({ ...todoForm, sub_category_id: val })}
              placeholder="选择或输入小类（可选）"
              type="todo"
              parentId={todoForm.category_id || undefined}
              label="小类"
              onCategoryCreated={() => fetchCategories()}
              userId={currentUser?.id}
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
                  <SelectValue placeholder="选择优先级">
                    {todoForm.priority ? PRIORITY_MAP[todoForm.priority]?.label : null}
                  </SelectValue>
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

      {/* ===== User Dialog ===== */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>用户管理</DialogTitle>
            <Text className="block text-xs text-gray-500 mt-1">
              {currentUser ? `已登录：${currentUser.phone || currentUser.openid || '未知'}` : '未登录'}
            </Text>
          </DialogHeader>
          <View className="py-4">
            {currentUser ? (
              <View className="flex flex-col gap-4">
                <Text className="block text-sm text-gray-600">
                  账号：{currentUser.phone || currentUser.openid || '未知'}
                </Text>
                
                {/* 操作按钮 */}
                <View className="flex flex-row gap-3 pt-2 border-t border-gray-100">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowExportDialog(true)}
                  >
                    <Text>导出数据</Text>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleLogout}
                  >
                    <Text>退出登录</Text>
                  </Button>
                </View>
              </View>
            ) : isMiniApp ? (
              <View className="flex flex-col gap-4 items-center">
                <Text className="block text-sm text-gray-500 text-center">
                  登录后可以保存您的工作记录和待办事项
                </Text>
                <View className="flex flex-col items-center gap-2">
                  <TaroButton
                    open-type="chooseAvatar"
                    onChooseAvatar={(e) => {
                      console.log('选择头像:', e.detail.avatarUrl)
                      setAvatarUrl(e.detail.avatarUrl || '')
                    }}
                    className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden"
                    style={{ padding: 0, margin: 0, lineHeight: 1 }}
                  >
                    {avatarUrl ? (
                      <Image src={avatarUrl} className="h-16 w-16 rounded-full" mode="aspectFill" />
                    ) : (
                      <Text className="block text-xs text-gray-400">选择头像</Text>
                    )}
                  </TaroButton>
                  <Text className="block text-xs text-gray-400">点击选择头像</Text>
                </View>
                <Button
                  onClick={handleLogin}
                >
                  <Text>微信登录</Text>
                </Button>
              </View>
            ) : (
              <View className="gap-4">
                <Text className="block text-sm text-gray-500 text-center">
                  登录后可以保存您的工作记录和待办事项
                </Text>
                <View className="gap-3">
                  <View>
                    <Text className="block text-sm text-gray-600 mb-1">手机号</Text>
                    <View className="bg-gray-50 rounded-lg px-3 py-2">
                      <Input
                        className="w-full bg-transparent"
                        type="number"
                        placeholder="请输入手机号"
                        maxlength={11}
                        value={loginPhone}
                        onInput={(e) => setLoginPhone(e.detail.value)}
                      />
                    </View>
                  </View>
                  <View>
                    <Text className="block text-sm text-gray-600 mb-1">验证码</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                      <View className="bg-gray-50 rounded-lg px-3 py-2" style={{ flex: 1 }}>
                        <Input
                          className="w-full bg-transparent"
                          type="number"
                          placeholder="请输入验证码"
                          maxlength={6}
                          value={loginCode}
                          onInput={(e) => setLoginCode(e.detail.value)}
                        />
                      </View>
                      <Button
                        variant="outline"
                        className="shrink-0"
                        disabled={codeSending || codeCountdown > 0}
                        onClick={handleSendCode}
                      >
                        <Text>{codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码'}</Text>
                      </Button>
                    </View>
                  </View>
                  <Button
                    className="w-full mt-2"
                    disabled={loginLoading}
                    onClick={handlePhoneLogin}
                  >
                    <Text>{loginLoading ? '登录中...' : '登录'}</Text>
                  </Button>
                </View>
              </View>
            )}
          </View>
        </DialogContent>
      </Dialog>

      {/* ===== Export Date Range Dialog ===== */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>导出工作内容</DialogTitle>
          </DialogHeader>
          <View className="px-2 gap-4">
            <View>
              <Text className="block text-sm text-gray-600 mb-1">起始日期</Text>
              <View
                className="flex flex-row items-center bg-gray-50 rounded-lg px-3 py-2"
                onClick={() => setShowExportStartDatePicker(true)}
              >
                <Calendar size={14} color="#9ca3af" />
                <Text className="block flex-1 text-sm text-gray-700 ml-2">
                  {exportStartDate || '点击选择日期'}
                </Text>
              </View>
            </View>
            <View>
              <Text className="block text-sm text-gray-600 mb-1">结束日期</Text>
              <View
                className="flex flex-row items-center bg-gray-50 rounded-lg px-3 py-2"
                onClick={() => setShowExportEndDatePicker(true)}
              >
                <Calendar size={14} color="#9ca3af" />
                <Text className="block flex-1 text-sm text-gray-700 ml-2">
                  {exportEndDate || '点击选择日期'}
                </Text>
              </View>
            </View>
            <Text className="block text-xs text-gray-400">
              导出内容为 CSV 格式
            </Text>
          </View>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowExportDialog(false)}>
              <Text>取消</Text>
            </Button>
            <Button className="flex-1" onClick={() => { setShowExportDialog(false); handleExportByDateRange() }}>
              <Text>导出</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Date Picker Dialog ===== */}
      <DatePickerDialog
        open={showDatePicker}
        onOpenChange={setShowDatePicker}
        value={todoForm.deadline}
        onConfirm={(date) => setTodoForm({ ...todoForm, deadline: date })}
      />

      {/* ===== Work Record Date Picker ===== */}
      <DatePickerDialog
        open={showWorkDatePicker}
        onOpenChange={setShowWorkDatePicker}
        value={workForm.record_date}
        onConfirm={(date) => setWorkForm({ ...workForm, record_date: date })}
      />

      {/* ===== Export Start Date Picker ===== */}
      <DatePickerDialog
        open={showExportStartDatePicker}
        onOpenChange={setShowExportStartDatePicker}
        value={exportStartDate}
        onConfirm={(date) => setExportStartDate(date)}
      />

      {/* ===== Export End Date Picker ===== */}
      <DatePickerDialog
        open={showExportEndDatePicker}
        onOpenChange={setShowExportEndDatePicker}
        value={exportEndDate}
        onConfirm={(date) => setExportEndDate(date)}
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
        userId={currentUser?.id}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这条记录吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </ScrollView>
  )
}
