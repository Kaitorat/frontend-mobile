import { View, Platform, Pressable, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text as UIText } from '@/components/ui/text';
import { ProgressRing } from '@/components/ui/progress-ring';
import { TimerDisplay } from '@/components/ui/timer-display';
import { ModeSwitcher } from '@/components/ui/mode-switcher';
import { MissionCard } from '@/components/ui/mission-card';
import { P5Background } from '@/components/p5-background';
import { COLORS } from '@/lib/colors';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Zap,
  Menu,
} from 'lucide-react-native';

type HeistScreenProps = {
  onOpenMenu: () => void;
};

export default function HeistScreen({ onOpenMenu }: HeistScreenProps) {
  const {
    minutes,
    seconds,
    isRunning,
    timerMode,
    progress,
    isLoading,
    isInitialized,
    error,
    toggleTimer,
    reset,
    skip,
    setTimerMode,
  } = usePomodoroTimer();

  // Loading state
  if (isLoading || !isInitialized) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <UIText className="text-foreground mt-4" style={{ fontFamily: 'Anton' }}>
          {error ? `Error: ${error}` : 'INITIALIZING...'}
        </UIText>
      </View>
    );
  }

  return (
    <View className="flex-1 relative overflow-hidden" style={{ backgroundColor: COLORS.background }}>
      {/* P5 Background */}
      <P5Background />

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

      {/* Header Section: CURRENT TARGET: HEIST MODE */}
      <View className="absolute top-0 left-5 right-0 z-30 pt-12 px-5">
        <View className="flex-row items-start justify-between">
          {/* Left: CURRENT TARGET y HEIST MODE */}
          <View className="flex-1">
            {/* CURRENT TARGET label */}
            <UIText
              className="text-accent text-xs font-bold uppercase tracking-wider mb-1"
              style={{ letterSpacing: 2 }}>
              CURRENT TARGET
            </UIText>
            {/* HEIST MODE title */}
            <UIText
              className="text-white text-3xl font-black uppercase tracking-wider"
              style={{
                fontFamily: 'Anton',
                fontStyle: 'italic',
                letterSpacing: 2,
                textShadowColor: 'rgba(230, 27, 35, 0.6)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              }}>
              HEIST MODE
            </UIText>
          </View>

          {/* Right: Menu Button */}
          <Pressable
            onPress={onOpenMenu}
            className="p-2 rounded-full"
            style={{
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
            }}>
            <Icon as={Menu} size={24} className="text-white" />
          </Pressable>
        </View>
      </View>

      {/* Contenido Principal */}
      <View className="flex-1 items-center justify-center z-10 relative mt-32 px-5">
        {/* Mode Switcher */}
        <ModeSwitcher value={timerMode} onValueChange={setTimerMode} />

        {/* Indicador de Fase */}
        <View
          className="flex-row items-center gap-2 mb-6 px-4 py-1 rounded-full"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderWidth: 1,
            borderColor: 'rgba(230,27,35,0.3)',
            ...Platform.select({
              web: { transform: [{ skewX: '-6deg' }] as any },
              default: {}, // Sin skew en Android
            }),
          }}>
          <View
            style={Platform.select({
              web: { transform: [{ skewX: '6deg' }] as any },
              default: {}, // Sin skew en Android
            })}>
            <Icon as={Zap} size={16} color={isRunning ? COLORS.accent : COLORS.greyBackground} />
          </View>
          <View
            style={Platform.select({
              web: { transform: [{ skewX: '6deg' }] as any },
              default: {}, // Sin skew en Android
            })}>
            <UIText
              className={`text-sm font-bold tracking-widest ${isRunning ? 'text-foreground' : 'text-gray-400'
                }`}
              style={{ fontFamily: 'Anton' }}>
              TARGET:{' '}
              <UIText className="text-accent" style={{ fontFamily: 'Anton' }}>
                DEEP FOCUS
              </UIText>
            </UIText>
          </View>
        </View>

        {/* Timer Ring con Display */}
        <ProgressRing progress={progress}>
          <TimerDisplay minutes={minutes} seconds={seconds} />
        </ProgressRing>

        {/* Current Task Card */}
        <View className="w-full max-w-xs mt-8">
          <MissionCard mission="Finalize app navigation logic and UI" />
        </View>
      </View>

      {/* Controls Area */}
      <View className="flex-col gap-4 mb-8 z-20 w-full max-w-xs mx-auto px-5">
        {/* Main Action Button */}
        <Button
          variant={isRunning ? 'destructive' : 'default'}
          size="lg"
          style={{
            shadowColor: isRunning ? COLORS.accent : COLORS.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 10,
          }}
          onPress={toggleTimer}>
          <Icon
            as={isRunning ? Pause : Play}
            className={isRunning ? 'text-accent-foreground' : 'text-primary-foreground'}
            size={20}
          />
          <UIText
            className={isRunning ? 'text-accent-foreground' : 'text-primary-foreground'}
            style={{ fontFamily: 'Anton' }}>
            {isRunning ? 'PAUSE HEIST' : 'START HEIST'}
          </UIText>
        </Button>

        {/* Secondary Actions */}
        <View className="flex-row justify-between gap-4">
          <Button variant="outline" size="sm" className="flex-1" onPress={reset}>
            <Icon as={RotateCcw} className="text-primary" size={18} />
            <UIText className="text-primary" style={{ fontFamily: 'Anton' }}>
              RESET
            </UIText>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onPress={skip}>
            <Icon as={FastForward} className="text-primary" size={18} />
            <UIText className="text-primary" style={{ fontFamily: 'Anton' }}>
              SKIP
            </UIText>
          </Button>
        </View>
      </View>
    </View>
  );
}
