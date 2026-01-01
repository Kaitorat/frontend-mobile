import { View, ScrollView, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/screen-header';
import { COLORS } from '@/lib/colors';
import { Settings, BarChart2, User } from 'lucide-react-native';

type VaultScreenProps = {
  onOpenMenu: () => void;
};

export default function VaultScreen({ onOpenMenu }: VaultScreenProps) {
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
            THE <Text className="text-accent">VAULT</Text>
          </>
        }
      />

      {/* Stats Card */}
      <View
        className="p-4 mb-4"
        style={{
          backgroundColor: COLORS.card,
          ...Platform.select({
            web: { transform: [{ skewX: '-3deg' }] as any },
            default: {},
          }),
          borderLeftWidth: 3,
          borderLeftColor: COLORS.primary,
        }}
      >
        <View style={Platform.select({
          web: { transform: [{ skewX: '3deg' }] },
          default: {},
        })}>
          <View className="flex-row items-center mb-3">
            <Icon as={BarChart2} className="text-primary mr-3" size={24} />
            <Text className="text-foreground text-xl font-bold" style={{ fontFamily: 'Anton' }}>
              STATS
            </Text>
          </View>
          <View className="mt-2">
            <Text className="text-muted mt-2">Total Focus Time: 124h</Text>
            <Text className="text-muted">Heists Completed: 42</Text>
          </View>
        </View>
      </View>

      {/* Settings Card */}
      <View
        className="p-4 mb-4"
        style={{
          backgroundColor: COLORS.card,
          ...Platform.select({
            web: { transform: [{ skewX: '-3deg' }] as any },
            default: {},
          }),
          borderLeftWidth: 3,
          borderLeftColor: COLORS.primary,
        }}
      >
        <View style={Platform.select({
          web: { transform: [{ skewX: '3deg' }] },
          default: {},
        })}>
          <View className="flex-row items-center mb-3">
            <Icon as={Settings} className="text-primary mr-3" size={24} />
            <Text className="text-foreground text-xl font-bold" style={{ fontFamily: 'Anton' }}>
              CONFIG
            </Text>
          </View>
          <View className="flex-col gap-3 mt-2">
            <View className="flex-row justify-between border-b pb-2 items-center" style={{ borderBottomColor: COLORS.muted }}>
              <Text className="text-foreground text-sm font-bold">Pomodoro Duration</Text>
              <Text className="text-accent font-mono">25m</Text>
            </View>
            <View className="flex-row justify-between border-b pb-2 items-center" style={{ borderBottomColor: COLORS.muted }}>
              <Text className="text-foreground text-sm font-bold">Sound Effects</Text>
              <Text className="text-primary font-bold">ON</Text>
            </View>
            <View className="flex-row justify-between border-b pb-2 items-center" style={{ borderBottomColor: COLORS.muted }}>
              <Text className="text-foreground text-sm font-bold">Theme</Text>
              <Text className="text-muted text-xs">Dark Phantom</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Profile Card */}
      <View
        className="p-4 mb-4"
        style={{
          backgroundColor: COLORS.card,
          ...Platform.select({
            web: { transform: [{ skewX: '-3deg' }] as any },
            default: {},
          }),
          borderLeftWidth: 3,
          borderLeftColor: COLORS.primary,
        }}
      >
        <View style={Platform.select({
          web: { transform: [{ skewX: '3deg' }] },
          default: {},
        })}>
          <View className="flex-row items-center mb-3">
            <Icon as={User} className="text-primary mr-3" size={24} />
            <Text className="text-foreground text-xl font-bold" style={{ fontFamily: 'Anton' }}>
              PHANTOM THIEF
            </Text>
          </View>
          <View className="mt-2">
            <Text className="text-muted">Code Name: Anonymous</Text>
            <Text className="text-muted">Level: 1</Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <View className="mt-8">
        <Button variant="outline">
          <Text className="text-primary" style={{ fontFamily: 'Anton' }}>LOGOUT</Text>
        </Button>
      </View>
    </ScrollView>
    </View>
  );
}
