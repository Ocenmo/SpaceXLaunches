# Sistema de Estilos Tailwind Nativo

Este proyecto usa un sistema de estilos nativo que replica las utilidades de Tailwind CSS usando StyleSheet de React Native. Esto garantiza compatibilidad, performance y confiabilidad.

## Uso

### Importar los estilos

```typescript
import { commonStyles, colors, combineStyles } from '@/styles/tailwindStyles';
```

### Ejemplos de uso

#### Layout básico
```tsx
<View style={combineStyles(commonStyles.flex1, commonStyles.bgGray100)}>
  <Text style={combineStyles(commonStyles.textLg, commonStyles.fontBold)}>
    Mi título
  </Text>
</View>
```

#### Tarjeta con sombra
```tsx
<View style={combineStyles(
  commonStyles.bgWhite,
  commonStyles.p4,
  commonStyles.roundedLg,
  commonStyles.shadowLg
)}>
  <Text>Contenido de la tarjeta</Text>
</View>
```

#### Botón
```tsx
<TouchableOpacity style={combineStyles(
  commonStyles.bgBlue500,
  commonStyles.px4,
  commonStyles.py2,
  commonStyles.rounded
)}>
  <Text style={commonStyles.textWhite}>Mi botón</Text>
</TouchableOpacity>
```

#### Flexbox
```tsx
<View style={combineStyles(
  commonStyles.flexRow,
  commonStyles.justifyBetween,
  commonStyles.itemsCenter
)}>
  <Text>Izquierda</Text>
  <Text>Derecha</Text>
</View>
```

## Ventajas

1. **Compatibilidad garantizada**: Usa StyleSheet nativo de React Native
2. **Performance optimizada**: No hay overhead de compilación en tiempo real
3. **Tipado completo**: TypeScript support completo
4. **Fácil mantenimiento**: Colores y spacing centralizados
5. **Extendible**: Fácil agregar nuevos estilos

## Colores disponibles

- `colors.gray100` a `colors.gray900`
- `colors.blue100` a `colors.blue900`
- `colors.red100` a `colors.red900`
- `colors.green100` a `colors.green900`
- `colors.white`, `colors.black`, `colors.transparent`

## Espaciado

- `spacing[1]` = 4px
- `spacing[2]` = 8px
- `spacing[4]` = 16px
- `spacing[6]` = 24px
- etc.

## Combinando estilos

```tsx
// Múltiples estilos predefinidos
<View style={combineStyles(commonStyles.flex1, commonStyles.bgWhite)} />

// Estilos predefinidos + customizados
<View style={combineStyles(
  commonStyles.bgBlue500,
  { borderWidth: 2, borderColor: colors.blue700 }
)} />
```
