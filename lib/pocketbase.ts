import PocketBase from 'pocketbase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Polyfill EventSource para React Native (requerido para suscripciones en tiempo real)
import { Platform } from 'react-native';
// @ts-ignore - react-native-sse no tiene tipos
import RNEventSource from 'react-native-sse';

if (Platform.OS !== 'web') {
    // @ts-ignore - asignar polyfill global
    global.EventSource = RNEventSource;
}

// ========================================
// CONFIGURACIÓN - CAMBIA ESTA URL
// ========================================
const POCKETBASE_URL = 'http://TU_IP:8090';

// ========================================
// Usuario hardcodeado para desarrollo
// ========================================
export const DEV_USER = {
    email: 'dev@kaitorat.local',
    password: 'devpassword123',
};

// ========================================
// Instancia de PocketBase
// ========================================
export const pb = new PocketBase(POCKETBASE_URL);

// Desactivar auto-cancelación de requests (útil para React)
pb.autoCancellation(false);

// ========================================
// Persistencia de Auth Token
// ========================================
const AUTH_STORAGE_KEY = 'pb_auth';

// Guardar auth cuando cambie
pb.authStore.onChange(async () => {
    try {
        if (pb.authStore.isValid) {
            await AsyncStorage.setItem(
                AUTH_STORAGE_KEY,
                JSON.stringify({
                    token: pb.authStore.token,
                    record: pb.authStore.record,
                })
            );
        } else {
            await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        }
    } catch (error) {
        console.error('[PocketBase] Error saving auth to storage:', error);
    }
});

// Cargar auth desde storage al iniciar
export async function loadAuthFromStorage(): Promise<boolean> {
    try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
            const { token, record } = JSON.parse(stored);
            pb.authStore.save(token, record);

            // Verificar que el token siga siendo válido
            if (pb.authStore.isValid) {
                try {
                    // Refrescar el token si es posible
                    await pb.collection('users').authRefresh();
                    return true;
                } catch {
                    // Token expirado, limpiar
                    pb.authStore.clear();
                    return false;
                }
            }
        }
        return false;
    } catch (error) {
        console.error('[PocketBase] Error loading auth from storage:', error);
        return false;
    }
}

// Login con credenciales del usuario de desarrollo
export async function loginWithDevUser(): Promise<boolean> {
    try {
        await pb.collection('users').authWithPassword(DEV_USER.email, DEV_USER.password);
        console.log('[PocketBase] Logged in as dev user');
        return true;
    } catch (error) {
        console.error('[PocketBase] Dev user login failed:', error);
        return false;
    }
}

// Inicializar auth: primero intenta cargar del storage, si no, login con dev user
export async function initializeAuth(): Promise<boolean> {
    const loaded = await loadAuthFromStorage();
    if (loaded) {
        console.log('[PocketBase] Auth loaded from storage');
        return true;
    }

    console.log('[PocketBase] No stored auth, logging in with dev user...');
    return await loginWithDevUser();
}

// Obtener ID del usuario actual
export function getCurrentUserId(): string | null {
    return pb.authStore.record?.id ?? null;
}

// Verificar si está autenticado
export function isAuthenticated(): boolean {
    return pb.authStore.isValid;
}
