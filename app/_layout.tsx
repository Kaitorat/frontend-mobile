import '../global.css';
import { PortalHost } from '@rn-primitives/portal';
import { Slot } from 'expo-router';
import { useFonts, Anton_400Regular } from '@expo-google-fonts/anton';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { initializeAuth } from '@/lib/pocketbase';

// Mantiene el Splash Screen visible mientras cargamos recursos
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [authReady, setAuthReady] = useState(false);

  // Cargamos la fuente y obtenemos un booleano (loaded)
  const [fontsLoaded, fontError] = useFonts({
    Anton: Anton_400Regular,
  });

  // Inicializar autenticación de PocketBase
  useEffect(() => {
    async function init() {
      try {
        await initializeAuth();
        console.log('[Layout] Auth initialized');
      } catch (error) {
        console.error('[Layout] Auth initialization failed:', error);
      } finally {
        setAuthReady(true);
      }
    }
    init();
  }, []);

  // Ocultar splash cuando todo esté listo
  useEffect(() => {
    if ((fontsLoaded || fontError) && authReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, authReady]);

  // Esperar a que todo esté listo
  if ((!fontsLoaded && !fontError) || !authReady) {
    return null;
  }

  return (
    <>
      <Slot />
      {/* Children of <Portal /> will render here */}
      <PortalHost />
    </>
  );
}