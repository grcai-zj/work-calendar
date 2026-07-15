import { useState, useRef } from 'react'
import { View } from '@tarojs/components'

interface SwipeableItemProps {
  children: React.ReactNode
  actions: React.ReactNode
  actionWidth?: number
}

export function SwipeableItem({ children, actions, actionWidth = 140 }: SwipeableItemProps) {
  const [offset, setOffset] = useState(0)
  const startX = useRef(0)
  const isSwiping = useRef(false)
  const maxOffset = actionWidth

  const handleTouchStart = (e: any) => {
    e.stopPropagation()
    startX.current = e.touches[0].clientX
    isSwiping.current = true
  }

  const handleTouchMove = (e: any) => {
    e.stopPropagation()
    if (!isSwiping.current) return
    const currentX = e.touches[0].clientX
    const diff = startX.current - currentX
    if (diff > 0) {
      setOffset(Math.min(diff, maxOffset))
    } else {
      setOffset(Math.max(0, offset + diff))
    }
  }

  const handleTouchEnd = (e: any) => {
    e.stopPropagation()
    isSwiping.current = false
    if (offset > maxOffset / 2) {
      setOffset(maxOffset)
    } else {
      setOffset(0)
    }
  }

  const handleClose = () => {
    setOffset(0)
  }

  // Handle system back or click outside
  const handleMainClick = () => {
    if (offset > 0) {
      handleClose()
    }
  }

  return (
    <View className="relative overflow-hidden">
      {/* Actions (behind) - positioned on the right */}
      <View
        className="absolute right-0 top-0 bottom-0 flex flex-row items-stretch"
        style={{ width: `${maxOffset}px` }}
      >
        {actions}
      </View>
      {/* Main content (slides) */}
      <View
        className="relative bg-white"
        style={{
          transform: `translateX(-${offset}px)`,
          transition: isSwiping.current ? 'none' : 'transform 0.2s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleMainClick}
      >
        {children}
      </View>
    </View>
  )
}
