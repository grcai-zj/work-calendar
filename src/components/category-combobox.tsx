import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { ChevronDown, Plus, Search } from 'lucide-react-taro'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Network } from '@/network'

interface CategoryItem {
  id: string
  parent_id: string | null
  name: string
  type: string
  level: number
  children?: CategoryItem[]
}

interface CategoryComboboxProps {
  categories: CategoryItem[]
  value: string
  onValueChange: (id: string) => void
  placeholder?: string
  type: 'work' | 'todo'
  parentId?: string | null
  label: string
}

export function CategoryCombobox({
  categories,
  value,
  onValueChange,
  placeholder = '选择或输入',
  type,
  parentId = null,
  label,
}: CategoryComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState('')

  const selectedItem = categories.find((c) => c.id === value)

  useEffect(() => {
    if (!isOpen) setSearchText('')
  }, [isOpen])

  const filteredItems = searchText
    ? categories.filter((c) => c.name.toLowerCase().includes(searchText.toLowerCase()))
    : categories

  const handleCreateNew = async () => {
    if (!searchText.trim()) return
    try {
      const body: any = { name: searchText.trim(), type }
      if (parentId) body.parent_id = parentId
      const res = await Network.request({ url: '/api/categories', method: 'POST', data: body })
      console.log('[API] create category:', res.data)
      const newId = res.data?.data?.id
      if (newId) {
        onValueChange(newId)
      }
      setSearchText('')
      setIsOpen(false)
    } catch (e) {
      console.error('Failed to create category', e)
    }
  }

  return (
    <View className="relative">
      <Text className="block text-sm text-gray-600 mb-1">{label}</Text>
      <View
        className="flex flex-row items-center bg-gray-50 rounded-xl px-3 py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Text className="block flex-1 text-sm text-gray-700 truncate">
          {selectedItem ? selectedItem.name : searchText || placeholder}
        </Text>
        <ChevronDown size={16} color="#9ca3af" />
      </View>

      {isOpen && (
        <View className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
          {/* Search input */}
          <View className="flex flex-row items-center gap-2 px-3 py-2 border-b border-gray-100">
            <Search size={14} color="#9ca3af" />
            <Input
              className="flex-1 bg-transparent text-sm"
              placeholder="搜索或输入新建..."
              value={searchText}
              onInput={(e) => setSearchText(e.detail.value)}
            />
          </View>

          {/* Options list */}
          <View className="max-h-48">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <View
                  key={item.id}
                  className={`px-3 py-2 ${value === item.id ? 'bg-blue-50' : ''}`}
                  onClick={() => {
                    onValueChange(item.id)
                    setIsOpen(false)
                    setSearchText('')
                  }}
                >
                  <Text className="block text-sm text-gray-700">{item.name}</Text>
                </View>
              ))
            ) : searchText.trim() ? (
              <View className="px-3 py-2">
                <Text className="block text-xs text-gray-400">无匹配项</Text>
              </View>
            ) : null}
          </View>

          {/* Create new button */}
          {searchText.trim() && !categories.some((c) => c.name === searchText.trim()) && (
            <View className="border-t border-gray-100 px-3 py-2">
              <Button variant="ghost" size="sm" className="w-full" onClick={handleCreateNew}>
                <View className="flex flex-row items-center gap-1">
                  <Plus size={14} color="#2563eb" />
                  <Text className="text-sm text-blue-600">新建「{searchText.trim()}」</Text>
                </View>
              </Button>
            </View>
          )}
        </View>
      )}
    </View>
  )
}
