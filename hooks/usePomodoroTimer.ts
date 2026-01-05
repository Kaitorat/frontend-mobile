import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import type { PomodoroType } from '@/types/pomodoro';

/**
 * Hook para manejar el timer de Pomodoro.
 * - Maneja el loop de tick cada segundo
 * - Sincroniza cuando la app vuelve del background
 * - Detecta cuando el timer llega a 0
 */
export function usePomodoroTimer() {
    const {
        timeRemaining,
        isRunning,
        mode,
        sessionsCompleted,
        isInitialized,
        isLoading,
        error,
        workDuration,
        shortBreakDuration,
        longBreakDuration,
        tick,
        start,
        pause,
        reset,
        skip,
        changeMode,
        initialize,
        getDurationForMode,
    } = usePomodoroStore();

    const appState = useRef<AppStateStatus>(AppState.currentState);
    const timerCompletedRef = useRef(false);

    // ========================================
    // INICIALIZACIÓN
    // ========================================
    useEffect(() => {
        if (!isInitialized && !isLoading) {
            initialize();
        }
    }, [isInitialized, isLoading, initialize]);

    // ========================================
    // TIMER LOOP
    // ========================================
    useEffect(() => {
        if (!isRunning) {
            timerCompletedRef.current = false;
            return;
        }

        const interval = setInterval(() => {
            tick();
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, tick]);

    // ========================================
    // DETECTAR TIMER COMPLETADO
    // ========================================
    useEffect(() => {
        if (timeRemaining <= 0 && isRunning && !timerCompletedRef.current) {
            timerCompletedRef.current = true;
            // Auto-skip al siguiente modo cuando termina
            skip();
        }
    }, [timeRemaining, isRunning, skip]);

    // ========================================
    // APP STATE (Background/Foreground)
    // ========================================
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            // App volviendo al foreground
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // Recalcular tiempo desde timestamps
                tick();
            }
            appState.current = nextAppState;
        });

        return () => subscription.remove();
    }, [tick]);

    // ========================================
    // VALORES CALCULADOS
    // ========================================
    const totalDuration = getDurationForMode(mode);
    const progress = totalDuration > 0 ? (timeRemaining / totalDuration) * 100 : 0;

    // Formatear tiempo para display
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    // Mapeo de modo interno a modo del UI
    const timerModeMap: Record<PomodoroType, 'Pomodoro' | 'Short Break' | 'Long Break'> = {
        work: 'Pomodoro',
        shortBreak: 'Short Break',
        longBreak: 'Long Break',
    };

    const timerMode = timerModeMap[mode];

    // Función para cambiar modo desde el UI
    const setTimerMode = (uiMode: 'Pomodoro' | 'Short Break' | 'Long Break') => {
        const modeMap: Record<string, PomodoroType> = {
            Pomodoro: 'work',
            'Short Break': 'shortBreak',
            'Long Break': 'longBreak',
        };
        changeMode(modeMap[uiMode]);
    };

    // Toggle start/pause
    const toggleTimer = () => {
        if (isRunning) {
            pause();
        } else {
            start();
        }
    };

    return {
        // Estado del timer
        timeRemaining,
        minutes,
        seconds,
        isRunning,
        mode,
        timerMode,
        sessionsCompleted,
        progress,

        // Duraciones
        workDuration,
        shortBreakDuration,
        longBreakDuration,
        totalDuration,

        // Estado de carga
        isInitialized,
        isLoading,
        error,

        // Acciones
        start,
        pause,
        reset,
        skip,
        toggleTimer,
        setTimerMode,
        changeMode,
        initialize,
    };
}
