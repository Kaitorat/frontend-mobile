import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Menu } from 'lucide-react-native';
import { COLORS } from '@/lib/colors';

type ScreenHeaderProps = {
  onOpenMenu: () => void;
  title: string | React.ReactNode;
  subtitle?: string;
};

export function ScreenHeader({ onOpenMenu, title, subtitle }: ScreenHeaderProps) {
  return (
    <View className="flex-row justify-between items-start mb-6 pt-4">
      <View>
        {subtitle && (
          <Text className="text-accent text-xs font-bold mb-1" style={{ fontFamily: 'Anton' }}>
            {subtitle}
          </Text>
        )}
        <Text className="text-foreground text-3xl font-black tracking-tighter" style={{ fontFamily: 'Anton' }}>
          {title}
        </Text>
      </View>
      <Pressable
        onPress={onOpenMenu}
        className="p-2"
      >
        <Icon as={Menu} size={32} color={COLORS.text} />
      </Pressable>
    </View>
  );
}
