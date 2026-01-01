import { View, Pressable, Animated } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { COLORS } from '@/lib/colors';
import { Clock, List, Settings, BarChart2, User, X } from 'lucide-react-native';
import { useEffect, useRef } from 'react';

type MenuItem = {
  id: string;
  label: string;
  icon: any;
  sub: string;
  disabled?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  { id: 'heist', label: 'Heist Mode', icon: Clock, sub: 'Timer' },
  { id: 'hideout', label: 'Hideout', icon: List, sub: 'Habits', disabled: true },
  { id: 'vault', label: 'The Vault', icon: Settings, sub: 'Config', disabled: true },
  { id: 'stats', label: 'Cognition', icon: BarChart2, sub: 'Analytics', disabled: true },
  { id: 'profile', label: 'Phantom Thief', icon: User, sub: 'Profile', disabled: true },
];

type NavMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
};

export function NavMenu({ isOpen, onClose, activeTab, onNavigate }: NavMenuProps) {
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, slideAnim]);

  if (!isOpen) return null;

  return (
    <View className="absolute inset-0 z-50 flex-row">
      {/* Backdrop */}
      <Pressable 
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
        onPress={onClose}
      />

      {/* Menu Panel */}
      <Animated.View 
        className="w-3/4 h-full border-r-4 pt-10 pb-10"
        style={{
          backgroundColor: COLORS.background,
          borderRightColor: COLORS.primary,
          transform: [{ translateX: slideAnim }],
        }}
      >
        {/* Decorative Background */}
        <View 
          className="absolute top-0 right-0 w-full h-full opacity-10"
          style={{
            backgroundColor: COLORS.primary,
            transform: [{ skewX: '-12deg' }, { translateX: 100 }],
          }}
        />

        {/* Header */}
        <View className="px-8 mb-10">
          <Text className="text-accent text-xs font-bold mb-1" style={{ fontFamily: 'Anton' }}>
            METANAV VER. 1.0
          </Text>
          <Text className="text-foreground text-4xl font-black tracking-tighter" style={{ fontFamily: 'Anton' }}>
            MENU
          </Text>
        </View>

        {/* Menu Items */}
        <View className="flex-col gap-6 px-6">
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                if (!item.disabled) {
                  onNavigate(item.id);
                  onClose();
                }
              }}
              className="flex-row items-center p-2"
              style={{ opacity: item.disabled ? 0.5 : 1 }}
              disabled={item.disabled}
            >
              {/* Diamond Icon */}
              <View
                className="w-12 h-12 flex items-center justify-center mr-6 border-2"
                style={{
                  transform: [{ rotate: '45deg' }],
                  borderColor: activeTab === item.id ? COLORS.primary : COLORS.muted,
                  backgroundColor: activeTab === item.id ? COLORS.primary : 'transparent',
                }}
              >
                <View style={{ transform: [{ rotate: '-45deg' }] }}>
                  <Icon
                    as={item.icon}
                    size={20}
                    color={activeTab === item.id ? COLORS.background : COLORS.muted}
                  />
                </View>
              </View>

              {/* Labels */}
              <View className="flex-col items-start">
                <Text
                  className="text-2xl font-black leading-none"
                  style={{
                    fontFamily: 'Anton',
                    color: activeTab === item.id ? COLORS.primary : COLORS.foreground,
                  }}
                >
                  {item.label}
                </Text>
                <Text className="text-accent text-[10px] font-bold" style={{ fontFamily: 'Anton' }}>
                  {item.sub}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Footer */}
        <View className="mt-auto px-8">
          <Text className="text-muted text-xs font-mono">KAITORAT // PHANTOM OS</Text>
        </View>
      </Animated.View>

      {/* Close Button */}
      <View className="flex-1 items-start justify-start pt-6 pl-4">
        <Pressable
          onPress={onClose}
          className="p-2 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <Icon as={X} size={32} className="text-white" />
        </Pressable>
      </View>
    </View>
  );
}
