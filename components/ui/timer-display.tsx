import { Text, View } from 'react-native';
import { COLORS } from '@/lib/colors';

type TimerDisplayProps = {
  minutes: number;
  seconds: number;
};

export function TimerDisplay({ minutes, seconds }: TimerDisplayProps) {
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return (
    <View className="items-center">
      <Text
        className="text-7xl font-black tracking-tighter leading-none"
        style={{
          fontFamily: 'Anton',
          color: COLORS.foreground,
          textShadowColor: COLORS.primary,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 10,
        }}>
        {formattedMinutes}:{formattedSeconds}
      </Text>
      <Text className="text-[#3F3F46] font-mono text-sm mt-2">REMAINING</Text>
    </View>
  );
}
