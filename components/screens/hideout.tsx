import { View, ScrollView, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/screen-header';
import { COLORS } from '@/lib/colors';
import { Plus, Check } from 'lucide-react-native';
import { useState } from 'react';

// Mock data
const MOCK_HABITS = [
  { id: '1', title: 'Code Kaitorat', streak: 5, done: false },
  { id: '2', title: 'Read Systems Design', streak: 12, done: true },
  { id: '3', title: 'Workout', streak: 0, done: false },
];

type HideoutScreenProps = {
  onOpenMenu: () => void;
};

export default function HideoutScreen({ onOpenMenu }: HideoutScreenProps) {
  const [habits, setHabits] = useState(MOCK_HABITS);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  return (
    <View className="flex-1 relative">
      {/* Swipe Indicator - Only on Mobile */}
      {Platform.OS !== 'web' && (
        <View 
          className="absolute left-0 top-1/2 z-30"
          style={{
            width: 4,
            height: 60,
            backgroundColor: COLORS.primary,
            opacity: 0.3,
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            transform: [{ translateY: -30 }],
          }}
        />
      )}
      
      <ScrollView 
        className="flex-1 p-5" 
        style={{ backgroundColor: COLORS.background }}
      >
        {/* Header */}
        <ScreenHeader
        onOpenMenu={onOpenMenu}
        title={
          <>
            PHANTOM <Text className="text-primary">DASHBOARD</Text>
          </>
        }
        subtitle="CURRENT DATE: 12/31"
      />

      {/* Section Header */}
      <View className="flex-row justify-between items-center mb-4">
        <View 
          className="px-2 py-1"
          style={{
            backgroundColor: COLORS.primary,
            ...Platform.select({
              web: { transform: [{ skewX: '-6deg' }] as any },
              default: {},
            }),
          }}
        >
          <Text 
            className="text-white font-bold text-lg"
            style={{
              fontFamily: 'Anton',
              ...Platform.select({
                web: { transform: [{ skewX: '6deg' }] },
                default: {},
              }),
            }}
          >
            CALLING CARDS
          </Text>
        </View>
        <Button variant="ghost" size="icon">
          <Icon as={Plus} size={24} className="text-primary" />
        </Button>
      </View>

      {/* Habits List */}
      <View className="flex-col gap-2">
        {habits.map(habit => (
          <View
            key={habit.id}
            className="p-4 mb-3"
            style={{
              backgroundColor: COLORS.card,
              ...Platform.select({
                web: { transform: [{ skewX: '-3deg' }] as any },
                default: {},
              }),
              borderLeftWidth: 3,
              borderLeftColor: COLORS.primary,
              opacity: habit.done ? 0.6 : 1,
            }}
          >
            <View 
              className="flex-row justify-between items-center"
              style={Platform.select({
                web: { transform: [{ skewX: '3deg' }] },
                default: {},
              })}
            >
              <View>
                <Text 
                  className="text-foreground text-lg font-bold"
                  style={{ 
                    textDecorationLine: habit.done ? 'line-through' : 'none',
                    fontFamily: 'Anton',
                  }}
                >
                  {habit.title}
                </Text>
                <Text className="text-accent text-xs mt-1" style={{ fontFamily: 'Anton' }}>
                  STREAK: {habit.streak} DAYS
                </Text>
              </View>
              <Button
                variant="ghost"
                size="icon"
                onPress={() => toggleHabit(habit.id)}
                style={{
                  transform: [{ rotate: '45deg' }],
                  width: 32,
                  height: 32,
                  borderWidth: 2,
                  borderColor: habit.done ? COLORS.accent : COLORS.muted,
                  backgroundColor: habit.done ? COLORS.accent : 'transparent',
                }}
              >
                <View style={{ transform: [{ rotate: '-45deg' }] }}>
                  {habit.done && <Icon as={Check} size={20} color={COLORS.background} />}
                </View>
              </Button>
            </View>
          </View>
        ))}
      </View>

      {/* Activity Heatmap */}
      <View className="mt-8">
        <Text className="text-foreground text-xl font-bold mb-4" style={{ fontFamily: 'Anton' }}>
          MEMENTOS LOG
        </Text>
        <View className="flex-row flex-wrap gap-1">
          {[...Array(35)].map((_, i) => (
            <View
              key={i}
              className="w-5 h-5"
              style={{
                backgroundColor: Math.random() > 0.6 ? COLORS.primary : COLORS.muted,
                opacity: Math.random() > 0.6 ? 1 : 0.3,
              }}
            />
          ))}
        </View>
      </View>
    </ScrollView>
    </View>
  );
}
