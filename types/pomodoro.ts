// Tipos para el sistema de Pomodoro Timer

export type PomodoroType = 'work' | 'shortBreak' | 'longBreak';

// Record de PocketBase: timer_states
export interface TimerStateRecord {
    id: string;
    user: string;
    startTime: string | null; // ISO datetime
    initialTimeRemaining: number; // segundos
    mode: PomodoroType;
    isRunning: boolean;
    sessionsCompleted: number;
    created: string;
    updated: string;
}

// Preferencias del usuario desde PocketBase
export interface UserPreferences {
    workDuration: number; // segundos (default: 1500 = 25min)
    shortBreakDuration: number; // segundos (default: 300 = 5min)
    longBreakDuration: number; // segundos (default: 900 = 15min)
}

// Record de PocketBase: users (extendido)
export interface UserRecord {
    id: string;
    email: string;
    username?: string;
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    created: string;
    updated: string;
}

// Estado del store de Zustand
export interface PomodoroState {
    // Estado del timer
    timeRemaining: number;
    isRunning: boolean;
    mode: PomodoroType;
    sessionsCompleted: number;
    startTime: Date | null;
    initialTimeRemaining: number;

    // Duraciones configurables
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;

    // IDs de PocketBase
    timerStateId: string | null;
    userId: string | null;

    // Estado de conexión
    isInitialized: boolean;
    isLoading: boolean;
    error: string | null;

    // Acciones
    initialize: () => Promise<void>;
    start: () => Promise<void>;
    pause: () => Promise<void>;
    reset: () => Promise<void>;
    skip: () => Promise<void>;
    tick: () => void;
    changeMode: (mode: PomodoroType) => Promise<void>;
    calculateTimeRemaining: () => number;
    getDurationForMode: (mode: PomodoroType) => number;
}
