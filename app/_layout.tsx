import '../global.css';
import { PortalHost } from '@rn-primitives/portal';
import { Slot } from 'expo-router';
import { useFonts, Anton_400Regular } from '@expo-google-fonts/anton';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Mantiene el Splash Screen visible mientras cargamos recursos
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  // Cargamos la fuente y obtenemos un booleano (loaded)
  const [loaded, error] = useFonts({
    Anton: Anton_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      // Ocultamos el splash screen cuando la fuente está lista
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
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