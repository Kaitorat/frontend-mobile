import { View, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Text as TextSvg } from 'react-native-svg';
import { COLORS } from '@/lib/colors';

const DOT_SIZE = 2;
const DOT_SPACING = 18;

export function P5Background() {
  const { width, height } = Dimensions.get('window');
  const redHeight = Math.min(height * 0.42, 360);
  const blackHeight = height - redHeight;
  const totalDots = Math.ceil((width / DOT_SPACING) * (height / DOT_SPACING));

  return (
    <View className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. Fondo Base gris oscuro (usa color global) */}
      <View className="absolute inset-0" style={{ backgroundColor: COLORS.greyBackground, width}} />



      {/* 3. Forma Roja Superior con borde diagonal (como referencia) */}
      <Svg
        width="100%"
        height={redHeight}
        viewBox="0 0 375 320"
        style={{ position: 'absolute', top: 0, left: 30 }}
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id="redShade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={COLORS.primary} stopOpacity="1" />
            <Stop offset="1" stopColor={COLORS.primary} stopOpacity="0.9" />
          </LinearGradient>
        </Defs>
        <Path
          d="M 0 0 L 375 0 L 375 210 L 0 260 Z"
          fill="url(#redShade)"
        />
      </Svg>

      {/* 2. Patrón de puntos único sobre toda la pantalla (debajo de formas) */}
      <View
        className="absolute inset-0"
        style={{ opacity: 0.85, flexDirection: 'row', flexWrap: 'wrap' }}
      >
        {Array.from({ length: totalDots }).map((_, i) => (
          <View
            key={`dot-${i}`}
            style={{ width: DOT_SPACING, height: DOT_SPACING, alignItems: 'center', justifyContent: 'center' }}
          >
            <View
              style={{
                width: DOT_SIZE,
                height: DOT_SIZE,
                backgroundColor: 'rgba(255,255,255,0.26)',
                borderRadius: DOT_SIZE / 2,
              }}
            />
          </View>
        ))}
      </View>

      {/* 4. Texto gigante de fondo tipo TAKE YOUR TIME */}
      <View
        className="absolute"
        style={{
          // Posición consistente entre web y móvil: asoma por el overlay negro de abajo
          // Usamos la misma posición que funciona en móvil
          bottom: blackHeight * 0.05 - 90,
          left: -50,
          opacity: 1,
          transform: [{ rotate: '-3deg' }],
        }}
      >
        <Svg 
          width={width * 2.2} 
          height={600} 
          viewBox="0 0 2400 600"
        >
          <TextSvg
            x="150"
            y="480"
            fill={COLORS.foreground}
            opacity={0.12}
            fontSize="480"
            fontWeight="900"
            fontFamily="Anton"
            letterSpacing="-8"
          >
            TAKE YOUR TIME
          </TextSvg>
        </Svg>
      </View>

      {/* 4. Overlay diagonal oscuro en la base (similar a transición en mock) */}
      <Svg
        width="100%"
        height={blackHeight * 0.5}
        viewBox="0 0 375 200"
        style={{ position: 'absolute', bottom: 0, left: 0 }}
        preserveAspectRatio="none"
      >
        <Path
          d="M 0 40 L 375 0 L 375 200 L 0 200 Z"
          fill="rgba(0,0,0)"
        />
      </Svg>
    </View>
  );
}
