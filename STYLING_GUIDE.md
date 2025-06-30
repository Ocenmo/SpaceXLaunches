# Sistema de Estilos con NativeWind

Este proyecto utiliza [NativeWind](https://www.nativewind.dev/) para aplicar utilidades de Tailwind CSS directamente en componentes de React Native. Esto permite escribir clases Tailwind en los props `className`, facilitando la escritura y mantenimiento de estilos.

## Uso

### Instalación

Asegúrate de tener NativeWind instalado y configurado en tu proyecto. Consulta la [documentación oficial](https://www.nativewind.dev/quick-starts/expo) para detalles de instalación.

### Ejemplos de uso

#### Layout básico
```tsx
<View className="flex-1 bg-gray-100">
  <Text className="text-lg font-bold">
    Mi título
  </Text>
</View>
```

#### Tarjeta con sombra
```tsx
<View className="bg-white p-4 rounded-lg shadow-lg">
  <Text>Contenido de la tarjeta</Text>
</View>
```

#### Botón
```tsx
<TouchableOpacity className="bg-blue-500 px-4 py-2 rounded">
  <Text className="text-white">Mi botón</Text>
</TouchableOpacity>
```

#### Flexbox
```tsx
<View className="flex-row justify-between items-center">
  <Text>Izquierda</Text>
  <Text>Derecha</Text>
</View>
```

## Ventajas

1. **Sintaxis familiar**: Usa clases Tailwind directamente en React Native
2. **Compatibilidad**: Integración nativa con React Native y Expo
3. **Tipado completo**: Soporte para TypeScript
4. **Fácil mantenimiento**: Utilidades centralizadas y reutilizables
5. **Extendible**: Puedes agregar clases personalizadas

## Colores y Espaciado

- Utiliza los mismos nombres de colores y espaciados que Tailwind CSS (`bg-gray-100`, `text-blue-700`, `p-4`, etc.).
- Consulta la [referencia de utilidades](https://www.nativewind.dev/docs/utilities) para ver todas las opciones disponibles.

## Combinando estilos

```tsx
// Múltiples utilidades Tailwind
<View className="flex-1 bg-white" />

// Utilidades Tailwind + estilos personalizados
<View className="bg-blue-500" style={{ borderWidth: 2, borderColor: '#1e40af' }} />
//Probando pipeline de CI/CD
```
