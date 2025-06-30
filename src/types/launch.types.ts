import * as z from "zod";

/**
 * Definiciones de tipos y esquemas de validación para la aplicación SpaceX Launches
 *
 * Este archivo centraliza todas las definiciones de tipos TypeScript y esquemas Zod
 * para garantizar la consistencia de datos entre la API de SpaceX y nuestra aplicación.
 * Los esquemas Zod proporcionan validación en tiempo de ejecución, lo que es crucial
 * cuando trabajamos con APIs externas donde la estructura de datos puede cambiar.
 *
 * Estructura:
 * 1. Enums y tipos básicos (LandingType, Launchpad, etc.)
 * 2. Esquemas de objetos complejos (Core, Fairings, Links)
 * 3. Esquema principal de Launch
 * 4. Tipos adicionales para funcionalidad de la UI
 */

// ===== ENUMS Y TIPOS BÁSICOS =====
// Estos enums reflejan los valores específicos que maneja la API de SpaceX
// Tipos de aterrizaje de los boosters: ASDS (barco), Ocean (océano), RTLS (regreso al sitio de lanzamiento)
export const LandingTypeSchema = z.enum([
    "ASDS",
    "Ocean",
    "RTLS",
]);
export type LandingType = z.infer<typeof LandingTypeSchema>;

// IDs de plataformas de aterrizaje específicas de SpaceX
// Estos valores son constantes en la API y se usan para referencia cruzada
export const LandpadSchema = z.enum([
    "5e9e3032383ecb267a34e7c7",
    "5e9e3032383ecb554034e7c9",
    "5e9e3032383ecb6bb234e7ca",
    "5e9e3032383ecb761634e7cb",
    "5e9e3032383ecb90a834e7c8",
    "5e9e3033383ecb075134e7cd",
    "5e9e3033383ecbb9e534e7cc",
]);
export type Landpad = z.infer<typeof LandpadSchema>;

// Precisión de fechas en los datos de SpaceX - importante para mostrar información correcta al usuario
export const DatePrecisionSchema = z.enum([
    "day",    // Fecha exacta conocida
    "hour",   // Hora exacta conocida
    "month",  // Solo mes/año conocido
]);
export type DatePrecision = z.infer<typeof DatePrecisionSchema>;

// IDs de plataformas de lanzamiento de SpaceX (KSC, Vandenberg, etc.)
export const LaunchpadSchema = z.enum([
    "5e9e4501f509094ba4566f84",
    "5e9e4502f509092b78566f87",
    "5e9e4502f509094188566f88",
    "5e9e4502f5090995de566f86",
]);
export type Launchpad = z.infer<typeof LaunchpadSchema>;

// IDs de cohetes SpaceX (Falcon 9, Falcon Heavy, etc.)
export const RocketSchema = z.enum([
    "5e9d0d95eda69955f709d1eb",
    "5e9d0d95eda69973a809d1ec",
    "5e9d0d95eda69974db09d1ed",
]);
export type Rocket = z.infer<typeof RocketSchema>;

// ===== ESQUEMAS DE OBJETOS COMPLEJOS =====

/**
 * Esquema para información de boosters/cores de cohetes
 * Incluye datos críticos sobre reutilización y aterrizaje - elementos clave del modelo de negocio de SpaceX
 */
export const CoreSchema = z.object({
    "core": z.union([z.null(), z.string()]),                    // ID del core específico (null para cores nuevos)
    "flight": z.union([z.number(), z.null()]),                  // Número de vuelo de este core
    "gridfins": z.union([z.boolean(), z.null()]),               // Si usa grid fins para control aerodinámico
    "legs": z.union([z.boolean(), z.null()]),                   // Si despliega patas de aterrizaje
    "reused": z.union([z.boolean(), z.null()]),                 // Si es un core reutilizado
    "landing_attempt": z.union([z.boolean(), z.null()]),        // Si intentó aterrizar
    "landing_success": z.union([z.boolean(), z.null()]),        // Si el aterrizaje fue exitoso
    "landing_type": z.union([LandingTypeSchema, z.null()]),     // Tipo de aterrizaje intentado
    "landpad": z.union([LandpadSchema, z.null()]),              // Plataforma de aterrizaje utilizada
});
export type Core = z.infer<typeof CoreSchema>;

/**
 * Esquema para fallos en lanzamientos
 * Información crucial para análisis de confiabilidad y aprendizaje de errores
 */
export const FailureSchema = z.object({
    "time": z.number(),                                          // Tiempo en segundos desde el lanzamiento
    "altitude": z.union([z.number(), z.null()]),                // Altitud en metros donde ocurrió el fallo
    "reason": z.string(),                                        // Descripción técnica del fallo
});
export type Failure = z.infer<typeof FailureSchema>;

/**
 * Esquema para las cubiertas protectoras (fairings) de la carga útil
 * Otro elemento que SpaceX está trabajando en hacer reutilizable
 */
export const FairingsSchema = z.object({
    "reused": z.union([z.boolean(), z.null()]),                 // Si se reutilizaron fairings previos
    "recovery_attempt": z.union([z.boolean(), z.null()]),       // Si intentaron recuperar los fairings
    "recovered": z.union([z.boolean(), z.null()]),              // Si la recuperación fue exitosa
    "ships": z.array(z.string()),                               // Barcos utilizados para la recuperación
});
export type Fairings = z.infer<typeof FairingsSchema>;

/**
 * Esquemas para enlaces e imágenes asociadas al lanzamiento
 * Estos datos son esenciales para crear una experiencia rica en contenido multimedia
 */
export const FlickrSchema = z.object({
    "small": z.array(z.any()),                                  // Imágenes en miniatura (array vacío si no hay)
    "original": z.array(z.string()),                            // URLs de imágenes en resolución completa
});
export type Flickr = z.infer<typeof FlickrSchema>;

// Patches de misión - los emblemas oficiales de cada lanzamiento
export const PatchSchema = z.object({
    "small": z.union([z.null(), z.string()]),                   // URL del patch en tamaño pequeño
    "large": z.union([z.null(), z.string()]),                   // URL del patch en tamaño grande
});
export type Patch = z.infer<typeof PatchSchema>;

// Enlaces a discusiones en Reddit organizadas por SpaceX
export const RedditSchema = z.object({
    "campaign": z.union([z.null(), z.string()]),                // Thread de campaña general
    "launch": z.union([z.null(), z.string()]),                  // Thread específico del lanzamiento
    "media": z.union([z.null(), z.string()]),                   // Thread de medios y fotos
    "recovery": z.union([z.null(), z.string()]),                // Thread de recuperación de hardware
});
export type Reddit = z.infer<typeof RedditSchema>;

// Colección completa de enlaces externos relacionados con el lanzamiento
export const LinksSchema = z.object({
    "patch": PatchSchema,                                        // Emblemas de la misión
    "reddit": RedditSchema,                                      // Enlaces a Reddit
    "flickr": FlickrSchema,                                      // Galería de fotos
    "presskit": z.union([z.null(), z.string()]),                // Kit de prensa oficial
    "webcast": z.union([z.null(), z.string()]),                 // Transmisión en vivo
    "youtube_id": z.union([z.null(), z.string()]),              // ID del video de YouTube
    "article": z.union([z.null(), z.string()]),                 // Artículo relacionado
    "wikipedia": z.union([z.null(), z.string()]),               // Página de Wikipedia
});
export type Links = z.infer<typeof LinksSchema>;

// ===== ESQUEMA PRINCIPAL DE LAUNCH =====

/**
 * Esquema principal que define la estructura completa de un lanzamiento SpaceX
 * Este es el corazón de nuestra aplicación - cada Launch contiene toda la información
 * necesaria para mostrar detalles completos al usuario, desde datos técnicos hasta multimedia
 */
export const LaunchSchema = z.object({
    // Información técnica del hardware
    "fairings": z.union([FairingsSchema, z.null()]),            // Datos de los fairings (si aplica)
    "links": LinksSchema,                                        // Todos los enlaces multimedia y documentación

    // Datos temporales del lanzamiento
    "static_fire_date_utc": z.union([z.coerce.date(), z.null()]),   // Fecha de prueba estática del motor
    "static_fire_date_unix": z.union([z.number(), z.null()]),       // Timestamp Unix de la prueba estática
    "date_utc": z.coerce.date(),                                     // Fecha oficial del lanzamiento (UTC)
    "date_unix": z.number(),                                         // Timestamp Unix del lanzamiento
    "date_local": z.coerce.date(),                                   // Fecha en tiempo local del sitio de lanzamiento
    "date_precision": DatePrecisionSchema,                          // Qué tan precisa es la fecha/hora

    // Configuración de la misión
    "net": z.boolean(),                                          // No Earlier Than - si la fecha puede cambiar
    "window": z.union([z.number(), z.null()]),                  // Ventana de lanzamiento en segundos
    "tbd": z.boolean(),                                          // To Be Determined - fecha por confirmar
    "upcoming": z.boolean(),                                     // Si es un lanzamiento futuro

    // Referencias a otros objetos
    "rocket": RocketSchema,                                      // ID del cohete utilizado
    "launchpad": LaunchpadSchema,                                // ID de la plataforma de lanzamiento
    "cores": z.array(CoreSchema),                                // Array de cores utilizados

    // Resultado y detalles de la misión
    "success": z.union([z.boolean(), z.null()]),                // Si la misión fue exitosa
    "failures": z.array(FailureSchema),                         // Array de fallos (si los hubo)
    "details": z.union([z.null(), z.string()]),                 // Descripción detallada de la misión

    // Carga útil y participantes
    "crew": z.array(z.string()),                                // IDs de tripulación (misiones tripuladas)
    "ships": z.array(z.string()),                               // IDs de barcos de soporte
    "capsules": z.array(z.string()),                            // IDs de cápsulas utilizadas
    "payloads": z.array(z.string()),                            // IDs de cargas útiles

    // Metadatos del lanzamiento
    "flight_number": z.number(),                                 // Número secuencial del vuelo
    "name": z.string(),                                          // Nombre oficial de la misión
    "auto_update": z.boolean(),                                  // Si los datos se actualizan automáticamente
    "launch_library_id": z.union([z.null(), z.string()]),       // ID en Launch Library (base de datos externa)
    "id": z.string(),                                            // ID único del lanzamiento
});

// Tipo principal de Launch inferido del esquema
export type Launch = z.infer<typeof LaunchSchema>;

// ===== ESQUEMAS ADICIONALES PARA DATOS RELACIONADOS =====

/**
 * Esquemas para información extendida de cohetes y plataformas de lanzamiento
 * Estos tipos complementan los IDs de referencia con datos descriptivos completos
 * Útiles para mostrar información detallada sin hacer múltiples llamadas a la API
 */
export const RocketDetailSchema = z.object({
    id: z.string(),                                              // ID único del cohete
    name: z.string(),                                            // Nombre comercial (ej: "Falcon 9")
    type: z.string().optional(),                                 // Tipo de cohete
    description: z.string().optional(),                          // Descripción técnica del cohete
    height: z.object({                                           // Dimensiones de altura
        meters: z.number().optional(),
        feet: z.number().optional(),
    }).optional(),
    diameter: z.object({                                         // Dimensiones de diámetro
        meters: z.number().optional(),
        feet: z.number().optional(),
    }).optional(),
});

export const LaunchpadDetailSchema = z.object({
    id: z.string(),                                              // ID único de la plataforma
    name: z.string(),                                            // Nombre corto (ej: "KSC LC-39A")
    full_name: z.string(),                                       // Nombre completo oficial
    locality: z.string().optional(),                             // Ciudad más cercana
    region: z.string().optional(),                               // Estado/región
    timezone: z.string().optional(),                             // Zona horaria local
    latitude: z.number().optional(),                             // Coordenadas geográficas
    longitude: z.number().optional(),
    launch_attempts: z.number().optional(),                      // Total de intentos de lanzamiento
    launch_successes: z.number().optional(),                     // Total de lanzamientos exitosos
    status: z.string().optional(),                               // Estado actual (activa, retirada, etc.)
});

export type RocketDetail = z.infer<typeof RocketDetailSchema>;
export type LaunchpadDetail = z.infer<typeof LaunchpadDetailSchema>;

// ===== TIPOS PARA LA INTERFAZ DE USUARIO =====

/**
 * Tipos específicos para la funcionalidad de la aplicación
 * Estos tipos simplifican la lógica de UI y proporcionan opciones consistentes
 * para filtrado, ordenamiento y visualización de estados
 */

// Estados simplificados para mostrar al usuario (más fácil de entender que success/null/boolean)
export type LaunchStatus = 'success' | 'failed' | 'upcoming';

// Opciones de ordenamiento para la lista de lanzamientos
export type SortOption = 'date_asc' | 'date_desc' | 'name_asc' | 'name_desc';

// Opciones de filtrado por resultado de la misión
export type FilterOption = 'all' | 'success' | 'failed';