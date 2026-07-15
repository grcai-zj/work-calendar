import { View, Text } from '@tarojs/components'

interface StatusIconProps {
  status: string
  size?: number
  onClick?: () => void
}

// Square status icons:
// - completed: green fill + black checkmark
// - in_progress: light yellow fill + black triangle
// - not_started: no fill + no symbol
export function StatusIcon({ status, size = 20, onClick }: StatusIconProps) {
  const iconSize = size

  if (status === 'completed') {
    return (
      <View
        className="items-center justify-center rounded"
        style={{ width: iconSize, height: iconSize, backgroundColor: '#10b981' }}
        onClick={onClick}
      >
        <Text className="text-white font-bold" style={{ fontSize: iconSize * 0.6, lineHeight: iconSize * 0.6 }}>
          ✓
        </Text>
      </View>
    )
  }

  if (status === 'in_progress') {
    return (
      <View
        className="items-center justify-center rounded"
        style={{ width: iconSize, height: iconSize, backgroundColor: '#fef3c7' }}
        onClick={onClick}
      >
        <Text className="text-gray-800 font-bold" style={{ fontSize: iconSize * 0.5, lineHeight: iconSize * 0.5 }}>
          ▶
        </Text>
      </View>
    )
  }

  // not_started
  return (
    <View
      className="items-center justify-center rounded border border-gray-300"
      style={{ width: iconSize, height: iconSize }}
      onClick={onClick}
    />
  )
}
