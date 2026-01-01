import { Pressable, Text, View } from 'react-native';
import { COLORS } from '@/lib/colors';

type Mode = 'Pomodoro' | 'Short Break' | 'Long Break';

type ModeSwitcherProps = {
  value: Mode;
  onValueChange: (mode: Mode) => void;
};

export function ModeSwitcher({ value, onValueChange }: ModeSwitcherProps) {
  const modes: Mode[] = ['Pomodoro', 'Short Break', 'Long Break'];

  return (
    <View className="flex-row gap-4 mb-4 bg-black/40 p-2 rounded-lg border border-white/5">
      {modes.map((mode) => {
        const isActive = value === mode;
        return (
          <Pressable
            key={mode}
            onPress={() => {
              // TODO: Agregar lógica de cambio de modo
              console.log('Mode changed to:', mode);
              onValueChange(mode);
            }}
            className={`px-5 py-1 rounded transition-all ${
              isActive
                ? 'bg-accent'
                : 'bg-transparent'
            }`}
            style={{
              shadowColor: isActive ? COLORS.primary : 'transparent',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: isActive ? 0.2 : 0,
              shadowRadius: 10,
            }}>
            <Text
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isActive
                  ? 'text-background'
                  : 'text-gray-400'
              }`}
              style={{ fontFamily: 'Anton' }}>
              {mode}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
