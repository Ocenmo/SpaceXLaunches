/**
 * Componente LaunchCard - Tarjeta visual para mostrar información de lanzamientos
 *
 * Este es uno de los componentes más importantes de la aplicación. Se encarga de
 * presentar de forma atractiva y organizada toda la información relevante de un
 * lanzamiento en formato de tarjeta.
 *
 * Características clave:
 * - Diseño responsive que se adapta al contenido
 * - Uso intensivo de adapters para formatear datos
 * - Estados visuales distintos para lanzamientos pasados/futuros
 * - Integración con sistema de favoritos
 * - Accesibilidad con testIDs para testing automatizado
 * - Feedback visual para interacciones (active:scale-98)
 *
 * Datos que presenta:
 * - Nombre de la misión
 * - Fecha formateada y tiempo relativo
 * - Estado del lanzamiento con colores
 * - Imagen del patch de la misión
 * - Detalles truncados de la misión
 * - Indicadores especiales (TBD, NET)
 * - Botón de favoritos
 */

import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Launch } from "@/types/launch.types";
import { SpaceXDataAdapter, UIFormatAdapter, ImageAdapter } from "@/services/adapters";
import { FavoriteButton } from "@/components/FavoriteButton";

/**
 * Props del componente LaunchCard
 */
interface LaunchCardProps {
    launch: Launch;              // Datos completos del lanzamiento
    onPress: () => void;         // Callback cuando se toca la tarjeta
    showFavorite?: boolean;      // Si mostrar el botón de favoritos (default: true)
}

export const LaunchCard: React.FC<LaunchCardProps> = ({
    launch,
    onPress,
    showFavorite = true
}) => {
    // ===== PROCESAMIENTO DE DATOS CON ADAPTERS =====
    // Los adapters transforman datos crudos en información lista para mostrar

    const statusDisplay = SpaceXDataAdapter.getLaunchStatusDisplay(launch);    // Estado legible y color
    const relativeTime = SpaceXDataAdapter.getRelativeTime(launch);            // "hace 2 días" / "en 3 semanas"
    const patchImages = ImageAdapter.getPatchImages(launch.links?.patch || {}); // URLs de imágenes con fallback
    const formattedDate = UIFormatAdapter.formatDate(launch.date_utc, 'medium'); // Fecha formateada localmente
    const truncatedDetails = launch.details                                     // Descripción limitada para UI
        ? UIFormatAdapter.truncateText(launch.details, 120)
        : null;

    return (
        <TouchableOpacity
            testID="launch-card"                    // Para testing automatizado
            onPress={onPress}                       // Navegación a pantalla de detalle
            className="bg-white rounded-xl p-5 mx-4 my-2 shadow-lg border border-gray-100 active:scale-98"
            /*
             * Estilos aplicados:
             * - bg-white: fondo blanco limpio
             * - rounded-xl: bordes bien redondeados
             * - p-5: padding generoso para respirar
             * - mx-4 my-2: margins horizontales y verticales
             * - shadow-lg: sombra para elevar la tarjeta
             * - border border-gray-100: borde sutil
             * - active:scale-98: feedback táctil al tocar
             */
        >
            {/* ===== HEADER: TÍTULO E IMAGEN ===== */}
            <View className="flex-row justify-between items-start mb-3">

                {/* Información principal del lanzamiento */}
                <View className="flex-1 pr-4">
                    {/* Nombre de la misión - elemento más importante */}
                    <Text testID="launch-name" className="text-xl font-bold text-gray-900 mb-2">
                        {launch.name}
                    </Text>

                    {/* Información temporal con iconos para claridad visual */}
                    <View className="flex-row items-center mb-2">
                        <Text className="text-sm text-gray-500">
                            📅 {formattedDate}
                        </Text>
                        {/* Mostrar tiempo relativo solo para lanzamientos pasados */}
                        {!launch.upcoming && (
                            <Text className="text-xs text-gray-400 ml-2">
                                ({relativeTime.timeText})
                            </Text>
                        )}
                    </View>

                    {/* Countdown especial para lanzamientos futuros */}
                    {launch.upcoming && (
                        <View className="bg-blue-50 px-3 py-2 rounded-lg mb-2">
                            <Text className="text-blue-700 text-sm font-medium">
                                ⏰ {relativeTime.timeText}
                            </Text>
                        </View>
                    )}

                    {/* Número de vuelo - metadato importante para fans de SpaceX */}
                    <Text className="text-xs text-gray-400 mb-2">
                        Vuelo #{UIFormatAdapter.formatNumber(launch.flight_number)}
                    </Text>
                </View>

                {/* Columna derecha: imagen y favoritos */}
                <View className="items-end">
                    {/* Patch de la misión con dimensiones fijas para consistencia */}
                    <Image
                        source={{ uri: patchImages.medium }}
                        className="w-16 h-16 rounded-lg mb-2"
                        resizeMode="contain"                // Mantener aspect ratio
                    />

                    {/* Botón de favoritos condicional */}
                    {showFavorite && (
                        <FavoriteButton
                            launchId={launch.id}
                            size="small"
                            variant="icon"
                        />
                    )}
                </View>
            </View>

            {/* ===== DESCRIPCIÓN DE LA MISIÓN ===== */}
            {/* Mostrar solo si hay detalles disponibles */}
            {truncatedDetails && (
                <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
                    {truncatedDetails}
                </Text>
            )}

            {/* ===== FOOTER: ESTADO E INDICADORES ===== */}
            <View className="flex-row items-center justify-between">

                {/* Badge de estado con colores dinámicos */}
                <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: UIFormatAdapter.getStatusColor(statusDisplay.status).background }}
                >
                    <Text
                        testID="launch-status"          // Para testing de estados
                        className="text-xs font-semibold"
                        style={{ color: UIFormatAdapter.getStatusColor(statusDisplay.status).text }}
                    >
                        {statusDisplay.displayText}
                    </Text>
                </View>

                {/* Indicadores especiales para fechas inciertas */}
                <View className="flex-row space-x-2">
                    {/* TBD: To Be Determined - fecha por confirmar */}
                    {launch.tbd && (
                        <View className="bg-yellow-100 px-2 py-1 rounded">
                            <Text className="text-yellow-800 text-xs">TBD</Text>
                        </View>
                    )}
                    {/* NET: No Earlier Than - fecha mínima, puede retrasarse */}
                    {launch.net && !launch.tbd && (
                        <View className="bg-orange-100 px-2 py-1 rounded">
                            <Text className="text-orange-800 text-xs">NET</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* ===== CALL TO ACTION SUTIL ===== */}
            <View className="mt-4 pt-3 border-t border-gray-100">
                <Text className="text-xs text-gray-400 text-center">
                    Toca para ver más detalles →
                </Text>
            </View>
        </TouchableOpacity>
    );
};