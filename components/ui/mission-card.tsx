import { Text, View, Platform } from 'react-native';
import { Icon } from './icon';
import { List } from 'lucide-react-native';
import { COLORS } from '@/lib/colors';

type MissionCardProps = {
  mission: string;
};

export function MissionCard({ mission }: MissionCardProps) {
  return (
    <View
      className="p-4 mb-3"
      style={{
        backgroundColor: COLORS.card,
        ...Platform.select({
          web: { transform: [{ skewX: '-3deg' }] as any },
          default: {}, // Sin skew en Android
        }),
        borderLeftWidth: 3,
        borderLeftColor: COLORS.primary,
        borderTopWidth: Platform.select({ web: 2, default: 0 }),
        borderTopColor: COLORS.primary,
        opacity: 0.9,
        ...Platform.select({
          web: {},
          default: {
            shadowColor: COLORS.primary,
            shadowOffset: { width: -2, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: 4,
          },
        }),
      }}>
      <View style={Platform.select({
        web: { transform: [{ skewX: '3deg' }] as any },
        default: {}, // Sin skew en Android
      })} className="flex-row items-start gap-3">
        <View className="mt-1">
          <Icon as={List} size={18} className="text-[#FACC15]" />
        </View>
        <View className="flex-1">
          <Text className="text-[#3F3F46] text-xs font-bold uppercase tracking-wider mb-1">
            Current Mission
          </Text>
          <Text
            className="text-[#FAFAFA] font-bold text-lg leading-tight"
            style={{ fontFamily: 'Anton' }}>
            {mission}
          </Text>
        </View>
      </View>
    </View>
  );
}
