import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { ScreenHeader } from '@/components/screen-header';
import { COLORS } from '@/lib/colors';
import { BarChart2 } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

type StatsScreenProps = {
  onOpenMenu: () => void;
};

export default function StatsScreen({ onOpenMenu }: StatsScreenProps) {
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
      
      <View 
        className="flex-1 p-5" 
        style={{ backgroundColor: COLORS.background }}
      >
        <ScreenHeader onOpenMenu={onOpenMenu} title="COGNITION" subtitle="ANALYTICS" />
      <View className="flex-1 items-center justify-center">
        <Icon as={BarChart2} size={64} className="text-muted mb-4" />
        <Text className="text-muted text-sm text-center">
          Coming soon...
        </Text>
      </View>
    </View>
    </View>
  );
}
