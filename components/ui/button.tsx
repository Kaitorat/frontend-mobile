import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { COLORS } from '@/lib/colors';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, Pressable, View } from 'react-native';

const buttonVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-2 shadow-none',
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    })
  ),
  {
    variants: {
      variant: {
        default: cn(
          'bg-primary active:opacity-80',
          Platform.select({
            web: 'hover:brightness-110',
          })
        ),
        destructive: cn(
          'bg-accent active:opacity-80',
          Platform.select({
            web: 'hover:brightness-110',
          })
        ),
        outline: cn(
          'bg-transparent border-2 border-primary active:opacity-80',
          Platform.select({
            web: 'hover:brightness-110',
          })
        ),
        secondary: cn(
          'bg-secondary active:opacity-80',
          Platform.select({ web: 'hover:brightness-110' })
        ),
        ghost: cn(
          'bg-transparent active:opacity-80',
          Platform.select({ web: 'hover:opacity-80' })
        ),
        link: '',
      },
      size: {
        default: cn('py-3 px-6', Platform.select({ web: 'has-[>svg]:px-3' })),
        sm: cn('gap-1.5 py-2 px-4', Platform.select({ web: 'has-[>svg]:px-2.5' })),
        lg: cn('py-4 px-8', Platform.select({ web: 'has-[>svg]:px-4' })),
        icon: 'h-10 w-10 sm:h-9 sm:w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva(
  cn(
    'text-foreground font-bold uppercase tracking-wider',
    Platform.select({ web: 'pointer-events-none transition-colors' })
  ),
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-background',
        outline: 'text-primary',
        secondary: 'text-secondary-foreground',
        ghost: 'text-muted-foreground',
        link: cn(
          'text-primary group-active:underline',
          Platform.select({ web: 'underline-offset-4 hover:underline group-hover:underline' })
        ),
      },
      size: {
        default: 'text-base',
        sm: 'text-sm',
        lg: 'text-lg',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  const { style, children, ...pressableProps } = props;

  // Skew transform para estilo Persona 5
  // Web: usa skewX nativo
  // Android: usa efectos alternativos (bordes diagonales, sombras)
  const skewOuter = Platform.select({
    web: { transform: [{ skewX: '-10deg' }] as any },
    default: {}, // Sin skew en Android
  });
  const skewInner = Platform.select({
    web: { transform: [{ skewX: '10deg' }] as any },
    default: {}, // Sin skew en Android
  });

  // Efectos adicionales para Android (estilo P5 sin skew)
  const androidP5Style = Platform.select({
    web: {},
    default: {
      borderLeftWidth: 3,
      borderLeftColor: variant === 'destructive' ? COLORS.accent : COLORS.primary,
      elevation: 8,
    },
  });

  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(props.disabled && 'opacity-50', buttonVariants({ variant, size }), className)}
        role="button"
        style={[typeof style === 'function' ? undefined : style, skewOuter, androidP5Style]}
        {...pressableProps}>
        {(pressableState) => (
          <View style={skewInner}>
            <View className="flex-row items-center justify-center gap-2">
              {typeof children === 'function' ? children(pressableState) : children}
            </View>
          </View>
        )}
      </Pressable>
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
