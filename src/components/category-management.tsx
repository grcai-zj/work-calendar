import { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { Plus, Trash2, Folder, FolderOpen, Pencil, Eye, EyeOff } from 'lucide-react-taro'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Network } from '@/network'

interface CategoryItem {
  id: string
  parent_id: string | null
  name: string
  type: string
  level: number
  hidden?: boolean
  children?: CategoryItem[]
}

interface CategoryManagementProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCategoriesChanged: () => void
  userId?: string
}

export function CategoryManagement({ open, onOpenChange, onCategoriesChanged, userId }: CategoryManagementProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newSubCategoryName, setNewSubCategoryName] = useState('')
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  const [showAddSubDialog, setShowAddSubDialog] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [editName, setEditName] = useState('')
  const [showHidden, setShowHidden] = useState(false)

  const fetchCategories = async () => {
    // 未登录时清空数据
    if (!userId) {
      setCategories([])
      return
    }
    setLoading(true)
    try {
      const header = { 'x-user-id': userId }
      const res = await Network.request({ url: '/api/categories/tree', header })
      setCategories(res.data?.data || [])
    } catch (e) {
      console.error('Failed to fetch categories', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchCategories()
    }
  }, [open, userId])

  // Check if category name already exists
  const checkDuplicate = (name: string, parentId: string | null): CategoryItem | null => {
    const normalizedName = name.trim().toLowerCase()
    for (const cat of categories) {
      if (parentId === null) {
        // Check top-level categories
        if (cat.name.toLowerCase() === normalizedName) {
          return cat
        }
      } else {
        // Check sub-categories under the parent
        if (cat.id === parentId && cat.children) {
          for (const sub of cat.children) {
            if (sub.name.toLowerCase() === normalizedName) {
              return sub
            }
          }
        }
      }
    }
    return null
  }

  const handleAddCategory = async () => {
    const name = newCategoryName.trim()
    if (!name) return
    
    // Check for duplicate
    const existing = checkDuplicate(name, null)
    if (existing) {
      // Category already exists, just close the dialog
      setNewCategoryName('')
      return
    }
    
    try {
      const header = userId ? { 'x-user-id': userId } : {}
      await Network.request({
        url: '/api/categories',
        method: 'POST',
        data: { name, type: 'shared' },
        header,
      })
      setNewCategoryName('')
      await fetchCategories()
      onCategoriesChanged()
    } catch (e) {
      console.error('Failed to add category', e)
    }
  }

  const handleAddSubCategory = async () => {
    const name = newSubCategoryName.trim()
    if (!name || !selectedParentId) return
    
    // Check for duplicate
    const existing = checkDuplicate(name, selectedParentId)
    if (existing) {
      // Sub-category already exists, just close the dialog
      setNewSubCategoryName('')
      setSelectedParentId(null)
      setShowAddSubDialog(false)
      return
    }
    
    try {
      const header = userId ? { 'x-user-id': userId } : {}
      await Network.request({
        url: '/api/categories',
        method: 'POST',
        data: { name, type: 'shared', parent_id: selectedParentId },
        header,
      })
      setNewSubCategoryName('')
      setSelectedParentId(null)
      setShowAddSubDialog(false)
      await fetchCategories()
      onCategoriesChanged()
    } catch (e) {
      console.error('Failed to add sub category', e)
    }
  }

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return
    try {
      const header = userId ? { 'x-user-id': userId } : {}
      await Network.request({
        url: `/api/categories/${deletingCategory.id}`,
        method: 'DELETE',
        header,
      })
      setDeletingCategory(null)
      await fetchCategories()
      onCategoriesChanged()
    } catch (e) {
      console.error('Failed to delete category', e)
    }
  }

  const handleEditCategory = async () => {
    if (!editingCategory || !editName.trim()) return
    try {
      const header = userId ? { 'x-user-id': userId } : {}
      await Network.request({
        url: `/api/categories/${editingCategory.id}`,
        method: 'PUT',
        data: { name: editName.trim() },
        header,
      })
      setEditingCategory(null)
      setEditName('')
      await fetchCategories()
      onCategoriesChanged()
    } catch (e) {
      console.error('Failed to edit category', e)
    }
  }

  const handleToggleHidden = async (category: CategoryItem) => {
    try {
      const header = userId ? { 'x-user-id': userId } : {}
      await Network.request({
        url: `/api/categories/${category.id}`,
        method: 'PUT',
        data: { hidden: !category.hidden },
        header,
      })
      await fetchCategories()
      onCategoriesChanged()
    } catch (e) {
      console.error('Failed to toggle hidden', e)
    }
  }

  const openAddSubDialog = (parentId: string) => {
    setSelectedParentId(parentId)
    setShowAddSubDialog(true)
  }

  const openEditDialog = (category: CategoryItem) => {
    setEditingCategory(category)
    setEditName(category.name)
  }

  // Filter categories based on showHidden state
  const filteredCategories = showHidden 
    ? categories 
    : categories
        .filter(cat => !cat.hidden)
        .map(cat => ({
          ...cat,
          children: cat.children?.filter(sub => !sub.hidden) || []
        }))

  // Count hidden categories
  const hiddenCount = categories.filter(cat => cat.hidden).length + 
    categories.reduce((acc, cat) => acc + (cat.children?.filter(sub => sub.hidden).length || 0), 0)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>分类管理</DialogTitle>
          </DialogHeader>
          <View className="py-4">
            {/* Add new category */}
            <View className="flex flex-row items-center gap-2 mb-4">
              <View className="flex-1">
                <Input
                  placeholder="输入大类名称"
                  value={newCategoryName}
                  onInput={(e) => setNewCategoryName(e.detail.value)}
                />
              </View>
              <Button size="sm" onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
                <View className="flex flex-row items-center gap-1">
                  <Plus size={14} color="#ffffff" />
                  <Text className="text-xs text-white">添加大类</Text>
                </View>
              </Button>
            </View>

            {/* Category list */}
            {loading ? (
              <View className="items-center py-8">
                <Text className="text-sm text-gray-400">加载中...</Text>
              </View>
            ) : filteredCategories.length === 0 ? (
              <View className="items-center py-8">
                <Folder size={40} color="#d1d5db" />
                <Text className="block text-sm text-gray-400 mt-2">暂无分类</Text>
              </View>
            ) : (
              <ScrollView scrollY style={{ height: "50vh" }}>
                <View className="gap-3">
                  {filteredCategories.map((cat) => (
                    <Card key={cat.id} className={cat.hidden ? "opacity-50" : ""}>
                      <CardContent className="p-3">
                        <View className="flex flex-row items-center justify-between">
                          <View className="flex flex-row items-center gap-2 flex-1">
                            <Checkbox 
                              checked={cat.hidden} 
                              onCheckedChange={() => handleToggleHidden(cat)}
                            />
                            <FolderOpen size={18} color="#3b82f6" />
                            <Text className="text-sm font-medium text-gray-800">{cat.name}</Text>
                          </View>
                          <View className="flex flex-row items-center gap-0">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => openEditDialog(cat)}
                            >
                              <Pencil size={12} color="#3b82f6" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => openAddSubDialog(cat.id)}
                            >
                              <Plus size={12} color="#3b82f6" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => setDeletingCategory(cat)}
                            >
                              <Trash2 size={12} color="#ef4444" />
                            </Button>
                          </View>
                        </View>
                        {/* Sub categories */}
                        {cat.children && cat.children.length > 0 && (
                          <View className="mt-3 ml-6 gap-2">
                            {cat.children
                              .filter(sub => showHidden || !sub.hidden)
                              .map((sub) => (
                              <View key={sub.id} className={`flex flex-row items-center justify-between ${sub.hidden ? "opacity-50" : ""}`}>
                                <View className="flex flex-row items-center gap-2">
                                  <Checkbox 
                                    checked={sub.hidden} 
                                    onCheckedChange={() => handleToggleHidden(sub)}
                                  />
                                  <Text className="text-sm text-gray-600">{sub.name}</Text>
                                </View>
                                <View className="flex flex-row items-center gap-0">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={() => openEditDialog(sub)}
                                  >
                                    <Pencil size={12} color="#3b82f6" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={() => setDeletingCategory(sub)}
                                  >
                                    <Trash2 size={12} color="#ef4444" />
                                  </Button>
                                </View>
                              </View>
                            ))}
                          </View>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
          <DialogFooter className="flex flex-row justify-between">
            {hiddenCount > 0 ? (
              <Button variant="outline" onClick={() => setShowHidden(!showHidden)}>
                <View className="flex flex-row items-center gap-1">
                  {showHidden ? <EyeOff size={14} color="#6b7280" /> : <Eye size={14} color="#6b7280" />}
                  <Text className="text-gray-600">{showHidden ? "隐藏勾选" : "显示全部"}</Text>
                </View>
              </Button>
            ) : (
              <View />
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <Text className="text-gray-600">关闭</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add sub category dialog */}
      <Dialog open={showAddSubDialog} onOpenChange={setShowAddSubDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加小类</DialogTitle>
          </DialogHeader>
          <View className="py-4">
            <Input
              placeholder="输入小类名称"
              value={newSubCategoryName}
              onInput={(e) => setNewSubCategoryName(e.detail.value)}
            />
          </View>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSubDialog(false)}>
              <Text className="text-gray-600">取消</Text>
            </Button>
            <Button onClick={handleAddSubCategory} disabled={!newSubCategoryName.trim()}>
              <Text className="text-white">添加</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit category dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑分类</DialogTitle>
          </DialogHeader>
          <View className="py-4">
            <Input
              placeholder="输入新名称"
              value={editName}
              onInput={(e) => setEditName(e.detail.value)}
            />
            <Text className="block text-xs text-gray-400 mt-2">
              修改后对已有和后续的记录都会同时生效。
            </Text>
          </View>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              <Text className="text-gray-600">取消</Text>
            </Button>
            <Button onClick={handleEditCategory} disabled={!editName.trim()}>
              <Text className="text-white">保存</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <View className="py-4">
            <Text className="text-sm text-gray-600">
              确定要删除分类「{deletingCategory?.name}」吗？
            </Text>
            <Text className="text-xs text-gray-400 mt-2">
              删除后仅影响后续的可选项，不影响之前的记录。
            </Text>
          </View>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingCategory(null)}>
              <Text className="text-gray-600">取消</Text>
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              <Text className="text-white">删除</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
