import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '@/lib/colors';

type ProgressRingProps = {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
};

export function ProgressRing({
  progress,
  size = 280,
  strokeWidth = 12,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View className="relative items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Circle */}
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute' }}
        className="absolute">
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#27272A"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
      </Svg>

      {/* Progress Circle with Glow */}
      <Svg
        width={size}
        height={size}
        style={{
          position: 'absolute',
          transform: [{ rotate: '-90deg' }],
        }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.accent}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="butt"
          style={{
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 8,
          }}
        />
      </Svg>

      {/* Children (Timer Display) */}
      <View className="absolute items-center justify-center">{children}</View>
    </View>
  );
}
