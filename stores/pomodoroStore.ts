import { create } from 'zustand';
import { pb, getCurrentUserId } from '@/lib/pocketbase';
import type { PomodoroState, PomodoroType, TimerStateRecord, UserRecord } from '@/types/pomodoro';

// Duraciones por defecto (en segundos)
const DEFAULT_WORK_DURATION = 25 * 60; // 25 minutos
const DEFAULT_SHORT_BREAK_DURATION = 5 * 60; // 5 minutos
const DEFAULT_LONG_BREAK_DURATION = 15 * 60; // 15 minutos
const SESSIONS_BEFORE_LONG_BREAK = 4;

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
    // Estado inicial
    timeRemaining: DEFAULT_WORK_DURATION,
    isRunning: false,
    mode: 'work',
    sessionsCompleted: 0,
    startTime: null,
    initialTimeRemaining: DEFAULT_WORK_DURATION,

    // Duraciones
    workDuration: DEFAULT_WORK_DURATION,
    shortBreakDuration: DEFAULT_SHORT_BREAK_DURATION,
    longBreakDuration: DEFAULT_LONG_BREAK_DURATION,

    // IDs
    timerStateId: null,
    userId: null,

    // Estado de conexión
    isInitialized: false,
    isLoading: false,
    error: null,

    // ========================================
    // CALCULAR TIEMPO RESTANTE (desde timestamps)
    // ========================================
    calculateTimeRemaining: () => {
        const state = get();
        if (!state.isRunning || !state.startTime) {
            return state.timeRemaining;
        }

        const start = state.startTime.getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - start) / 1000);
        return Math.max(0, state.initialTimeRemaining - elapsed);
    },

    // Obtener duración para un modo específico
    getDurationForMode: (mode: PomodoroType) => {
        const state = get();
        switch (mode) {
            case 'work':
                return state.workDuration;
            case 'shortBreak':
                return state.shortBreakDuration;
            case 'longBreak':
                return state.longBreakDuration;
        }
    },

    // ========================================
    // INICIALIZAR
    // ========================================
    initialize: async () => {
        const userId = getCurrentUserId();
        if (!userId) {
            set({ error: 'No user authenticated', isLoading: false });
            return;
        }

        set({ isLoading: true, error: null, userId });

        try {
            // 1. Cargar preferencias del usuario
            const user = await pb.collection('users').getOne<UserRecord>(userId);
            const workDuration = user.workDuration || DEFAULT_WORK_DURATION;
            const shortBreakDuration = user.shortBreakDuration || DEFAULT_SHORT_BREAK_DURATION;
            const longBreakDuration = user.longBreakDuration || DEFAULT_LONG_BREAK_DURATION;

            set({ workDuration, shortBreakDuration, longBreakDuration });

            // 2. Buscar o crear timer_state
            let timerState: TimerStateRecord;

            try {
                const existing = await pb.collection('timer_states').getFirstListItem<TimerStateRecord>(
                    `user = "${userId}"`
                );
                timerState = existing;
            } catch {
                // No existe, crear uno nuevo
                timerState = await pb.collection('timer_states').create<TimerStateRecord>({
                    user: userId,
                    startTime: null,
                    initialTimeRemaining: workDuration,
                    mode: 'work',
                    isRunning: false,
                    sessionsCompleted: 0,
                });
            }

            // 3. Calcular tiempo restante desde el estado del servidor
            let calculatedTime = timerState.initialTimeRemaining;
            let startTime: Date | null = null;

            if (timerState.isRunning && timerState.startTime) {
                startTime = new Date(timerState.startTime);
                const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
                calculatedTime = Math.max(0, timerState.initialTimeRemaining - elapsed);
            }

            set({
                timerStateId: timerState.id,
                isRunning: timerState.isRunning,
                mode: timerState.mode,
                sessionsCompleted: timerState.sessionsCompleted,
                startTime,
                initialTimeRemaining: timerState.initialTimeRemaining,
                timeRemaining: calculatedTime,
                isInitialized: true,
                isLoading: false,
            });

            // 4. Suscribirse a cambios en tiempo real
            await pb.collection('timer_states').subscribe<TimerStateRecord>(timerState.id, (e) => {
                if (e.action === 'update' && e.record) {
                    const record = e.record;

                    let calculatedTime = record.initialTimeRemaining;
                    let startTime: Date | null = null;

                    if (record.isRunning && record.startTime) {
                        startTime = new Date(record.startTime);
                        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
                        calculatedTime = Math.max(0, record.initialTimeRemaining - elapsed);
                    }

                    set({
                        isRunning: record.isRunning,
                        mode: record.mode,
                        sessionsCompleted: record.sessionsCompleted,
                        startTime,
                        initialTimeRemaining: record.initialTimeRemaining,
                        timeRemaining: calculatedTime,
                    });
                }
            });

            console.log('[PomodoroStore] Initialized successfully');
        } catch (error) {
            console.error('[PomodoroStore] Initialization failed:', error);
            set({
                error: error instanceof Error ? error.message : 'Initialization failed',
                isLoading: false,
            });
        }
    },

    // ========================================
    // TICK - Actualiza el display (no decrementa)
    // ========================================
    tick: () => {
        const state = get();
        if (!state.isRunning || !state.startTime) return;

        const newTime = state.calculateTimeRemaining();

        // Si el tiempo llegó a 0, pausar automáticamente
        if (newTime <= 0) {
            set({ timeRemaining: 0 });
            // El manejo de completar sesión se hace en el hook
        } else {
            set({ timeRemaining: newTime });
        }
    },

    // ========================================
    // START
    // ========================================
    start: async () => {
        const state = get();
        if (!state.timerStateId || state.isRunning) return;

        const now = new Date();

        try {
            await pb.collection('timer_states').update(state.timerStateId, {
                isRunning: true,
                startTime: now.toISOString(),
                initialTimeRemaining: state.timeRemaining,
            });

            // El estado se actualizará vía suscripción, pero actualizamos localmente para respuesta inmediata
            set({
                isRunning: true,
                startTime: now,
                initialTimeRemaining: state.timeRemaining,
            });
        } catch (error) {
            console.error('[PomodoroStore] Start failed:', error);
            set({ error: error instanceof Error ? error.message : 'Start failed' });
        }
    },

    // ========================================
    // PAUSE
    // ========================================
    pause: async () => {
        const state = get();
        if (!state.timerStateId || !state.isRunning) return;

        const remainingTime = state.calculateTimeRemaining();

        try {
            await pb.collection('timer_states').update(state.timerStateId, {
                isRunning: false,
                startTime: null,
                initialTimeRemaining: remainingTime,
            });

            set({
                isRunning: false,
                startTime: null,
                timeRemaining: remainingTime,
                initialTimeRemaining: remainingTime,
            });
        } catch (error) {
            console.error('[PomodoroStore] Pause failed:', error);
            set({ error: error instanceof Error ? error.message : 'Pause failed' });
        }
    },

    // ========================================
    // RESET
    // ========================================
    reset: async () => {
        const state = get();
        if (!state.timerStateId) return;

        const duration = state.getDurationForMode(state.mode);

        try {
            await pb.collection('timer_states').update(state.timerStateId, {
                isRunning: false,
                startTime: null,
                initialTimeRemaining: duration,
            });

            set({
                isRunning: false,
                startTime: null,
                timeRemaining: duration,
                initialTimeRemaining: duration,
            });
        } catch (error) {
            console.error('[PomodoroStore] Reset failed:', error);
            set({ error: error instanceof Error ? error.message : 'Reset failed' });
        }
    },

    // ========================================
    // SKIP (pasar al siguiente modo)
    // ========================================
    skip: async () => {
        const state = get();
        if (!state.timerStateId) return;

        let nextMode: PomodoroType;
        let newSessionsCompleted = state.sessionsCompleted;

        if (state.mode === 'work') {
            // Completar sesión de trabajo
            newSessionsCompleted = state.sessionsCompleted + 1;

            // ¿Es hora de un descanso largo?
            if (newSessionsCompleted % SESSIONS_BEFORE_LONG_BREAK === 0) {
                nextMode = 'longBreak';
            } else {
                nextMode = 'shortBreak';
            }
        } else {
            // Después de cualquier break, volver a work
            nextMode = 'work';
        }

        const duration = state.getDurationForMode(nextMode);

        try {
            await pb.collection('timer_states').update(state.timerStateId, {
                mode: nextMode,
                isRunning: false,
                startTime: null,
                initialTimeRemaining: duration,
                sessionsCompleted: newSessionsCompleted,
            });

            set({
                mode: nextMode,
                isRunning: false,
                startTime: null,
                timeRemaining: duration,
                initialTimeRemaining: duration,
                sessionsCompleted: newSessionsCompleted,
            });
        } catch (error) {
            console.error('[PomodoroStore] Skip failed:', error);
            set({ error: error instanceof Error ? error.message : 'Skip failed' });
        }
    },

    // ========================================
    // CHANGE MODE
    // ========================================
    changeMode: async (mode: PomodoroType) => {
        const state = get();
        if (!state.timerStateId || state.mode === mode) return;

        const duration = state.getDurationForMode(mode);

        try {
            await pb.collection('timer_states').update(state.timerStateId, {
                mode,
                isRunning: false,
                startTime: null,
                initialTimeRemaining: duration,
            });

            set({
                mode,
                isRunning: false,
                startTime: null,
                timeRemaining: duration,
                initialTimeRemaining: duration,
            });
        } catch (error) {
            console.error('[PomodoroStore] Change mode failed:', error);
            set({ error: error instanceof Error ? error.message : 'Change mode failed' });
        }
    },
}));
