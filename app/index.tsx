import { View, PanResponder, Platform } from 'react-native';
import { useState, useRef } from 'react';
import { NavMenu } from '@/components/nav-menu';
import { COLORS } from '@/lib/colors';

// Import screens
import HeistScreen from '@/components/screens/heist';
import HideoutScreen from '@/components/screens/hideout';
import VaultScreen from '@/components/screens/vault';
import StatsScreen from '@/components/screens/stats';

export default function Index() {
  const [activeTab, setActiveTab] = useState('heist');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // PanResponder for swipe gesture (mobile only)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Only activate if swipe starts from left edge (first 50px)
        return Platform.OS !== 'web' && evt.nativeEvent.pageX < 50;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Activate if horizontal swipe is detected
        return Platform.OS !== 'web' && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // If swiped right more than 100px, open menu
        if (gestureState.dx > 100) {
          setIsMenuOpen(true);
        }
      },
    })
  ).current;

  const renderContent = () => {
    const screenProps = { onOpenMenu: () => setIsMenuOpen(true) };
    
    switch (activeTab) {
      case 'heist':
        return <HeistScreen {...screenProps} />;
      case 'hideout':
        return <HideoutScreen {...screenProps} />;
      case 'vault':
        return <VaultScreen {...screenProps} />;
      case 'stats':
        return <StatsScreen {...screenProps} />;
      default:
        return <HeistScreen {...screenProps} />;
    }
  };

  return (
    <View 
      className="flex-1" 
      style={{ backgroundColor: COLORS.background }}
      {...panResponder.panHandlers}
    >
      {renderContent()}
      <NavMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeTab={activeTab}
        onNavigate={setActiveTab}
      />
    </View>
  );
}
