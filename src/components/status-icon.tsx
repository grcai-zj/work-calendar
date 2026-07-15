import { View, Text } from '@tarojs/components'

interface StatusIconProps {
  status: string
  size?: number
  onClick?: () => void
}

// Square status icons:
// - completed: green fill + black checkmark (✓)
// - in_progress: light yellow fill + black triangle (▶)
// - not_started: no fill + gray border + no symbol
export function StatusIcon({ status, size = 20, onClick }: StatusIconProps) {
  const iconSize = size

  if (status === 'completed') {
    return (
      <View
        className="flex items-center justify-center rounded"
        style={{ width: iconSize, height: iconSize, backgroundColor: '#10b981', lineHeight: `${iconSize}px` }}
        onClick={onClick}
      >
        <Text style={{ fontSize: iconSize * 0.65, color: '#000000', fontWeight: 'bold', lineHeight: `${iconSize}px` }}>
          ✓
        </Text>
      </View>
    )
  }

  if (status === 'in_progress') {
    return (
      <View
        className="flex items-center justify-center rounded"
        style={{ width: iconSize, height: iconSize, backgroundColor: '#fef3c7', lineHeight: `${iconSize}px` }}
        onClick={onClick}
      >
        <Text style={{ fontSize: iconSize * 0.45, color: '#000000', fontWeight: 'bold', lineHeight: `${iconSize}px` }}>
          ▶
        </Text>
      </View>
    )
  }

  // not_started
  return (
    <View
      className="rounded border border-gray-300"
      style={{ width: iconSize, height: iconSize }}
      onClick={onClick}
    />
  )
}
