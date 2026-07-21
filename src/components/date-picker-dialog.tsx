import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { ChevronLeft, ChevronRight } from 'lucide-react-taro'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DatePickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: string
  onConfirm: (date: string) => void
  title?: string
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

function formatDateStr(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

function getDaysInMonth(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  return days
}

export function DatePickerDialog({ open, onOpenChange, value, onConfirm, title = '选择日期' }: DatePickerDialogProps) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  useEffect(() => {
    if (open && value) {
      const parts = value.split('-')
      if (parts.length === 3) {
        setYear(parseInt(parts[0]))
        setMonth(parseInt(parts[1]) - 1)
        setSelectedDay(parseInt(parts[2]))
      }
    } else if (open) {
      setYear(today.getFullYear())
      setMonth(today.getMonth())
      setSelectedDay(null)
    }
  }, [open, value])

  const days = getDaysInMonth(year, month)

  const prevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11) }
    else setMonth(month - 1)
  }

  const nextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0) }
    else setMonth(month + 1)
  }

  const handleConfirm = () => {
    if (selectedDay) {
      onConfirm(formatDateStr(year, month, selectedDay))
      onOpenChange(false)
    }
  }

  const isSelected = (day: number) => selectedDay === day
  const isToday = (day: number) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <View className="px-2 gap-3">
          {/* Month navigation */}
          <View className="flex flex-row items-center justify-between">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft size={16} color="#6b7280" />
            </Button>
            <Text className="block text-base font-semibold text-gray-900">
              {year}年{month + 1}月
            </Text>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight size={16} color="#6b7280" />
            </Button>
          </View>

          {/* Weekday headers */}
          <View className="flex flex-row">
            {WEEKDAYS.map((day) => (
              <View key={day} className="flex-1 items-center py-1">
                <Text className="block text-xs text-gray-400 text-center">{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar grid */}
          <View className="flex flex-row flex-wrap">
            {days.map((day, idx) => {
              if (day === null) {
                return <View key={`empty-${idx}`} className="flex-1 h-10" />
              }
              const selected = isSelected(day)
              const todayMark = isToday(day)
              return (
                <View
                  key={day}
                  className="flex-1 h-10 items-center justify-center"
                  onClick={() => setSelectedDay(day)}
                >
                  <View
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selected ? 'bg-blue-600' : todayMark ? 'bg-blue-100' : ''
                    }`}
                  >
                    <Text
                      className={`text-sm text-center leading-8 ${
                        selected ? 'text-white font-semibold' : todayMark ? 'text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>

          {/* Selected date display */}
          {selectedDay && (
            <View className="items-center py-1">
              <Text className="block text-sm text-blue-600 font-medium">
                已选: {formatDateStr(year, month, selectedDay)}
              </Text>
            </View>
          )}

          {/* Confirm button */}
          <Button
            className="w-full"
            disabled={!selectedDay}
            onClick={handleConfirm}
          >
            <Text className="text-white text-sm">确认</Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  )
}
