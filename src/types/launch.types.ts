import * as z from "zod";

// Esquemas Zod generados con quicktype.io
export const LandingTypeSchema = z.enum([
    "ASDS",
    "Ocean",
    "RTLS",
]);
export type LandingType = z.infer<typeof LandingTypeSchema>;

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

export const DatePrecisionSchema = z.enum([
    "day",
    "hour",
    "month",
]);
export type DatePrecision = z.infer<typeof DatePrecisionSchema>;

export const LaunchpadSchema = z.enum([
    "5e9e4501f509094ba4566f84",
    "5e9e4502f509092b78566f87",
    "5e9e4502f509094188566f88",
    "5e9e4502f5090995de566f86",
]);
export type Launchpad = z.infer<typeof LaunchpadSchema>;

export const RocketSchema = z.enum([
    "5e9d0d95eda69955f709d1eb",
    "5e9d0d95eda69973a809d1ec",
    "5e9d0d95eda69974db09d1ed",
]);
export type Rocket = z.infer<typeof RocketSchema>;

export const CoreSchema = z.object({
    "core": z.union([z.null(), z.string()]),
    "flight": z.union([z.number(), z.null()]),
    "gridfins": z.union([z.boolean(), z.null()]),
    "legs": z.union([z.boolean(), z.null()]),
    "reused": z.union([z.boolean(), z.null()]),
    "landing_attempt": z.union([z.boolean(), z.null()]),
    "landing_success": z.union([z.boolean(), z.null()]),
    "landing_type": z.union([LandingTypeSchema, z.null()]),
    "landpad": z.union([LandpadSchema, z.null()]),
});
export type Core = z.infer<typeof CoreSchema>;

export const FailureSchema = z.object({
    "time": z.number(),
    "altitude": z.union([z.number(), z.null()]),
    "reason": z.string(),
});
export type Failure = z.infer<typeof FailureSchema>;

export const FairingsSchema = z.object({
    "reused": z.union([z.boolean(), z.null()]),
    "recovery_attempt": z.union([z.boolean(), z.null()]),
    "recovered": z.union([z.boolean(), z.null()]),
    "ships": z.array(z.string()),
});
export type Fairings = z.infer<typeof FairingsSchema>;

export const FlickrSchema = z.object({
    "small": z.array(z.any()),
    "original": z.array(z.string()),
});
export type Flickr = z.infer<typeof FlickrSchema>;

export const PatchSchema = z.object({
    "small": z.union([z.null(), z.string()]),
    "large": z.union([z.null(), z.string()]),
});
export type Patch = z.infer<typeof PatchSchema>;

export const RedditSchema = z.object({
    "campaign": z.union([z.null(), z.string()]),
    "launch": z.union([z.null(), z.string()]),
    "media": z.union([z.null(), z.string()]),
    "recovery": z.union([z.null(), z.string()]),
});
export type Reddit = z.infer<typeof RedditSchema>;

export const LinksSchema = z.object({
    "patch": PatchSchema,
    "reddit": RedditSchema,
    "flickr": FlickrSchema,
    "presskit": z.union([z.null(), z.string()]),
    "webcast": z.union([z.null(), z.string()]),
    "youtube_id": z.union([z.null(), z.string()]),
    "article": z.union([z.null(), z.string()]),
    "wikipedia": z.union([z.null(), z.string()]),
});
export type Links = z.infer<typeof LinksSchema>;

// Esquema principal de Launch
export const LaunchSchema = z.object({
    "fairings": z.union([FairingsSchema, z.null()]),
    "links": LinksSchema,
    "static_fire_date_utc": z.union([z.coerce.date(), z.null()]),
    "static_fire_date_unix": z.union([z.number(), z.null()]),
    "net": z.boolean(),
    "window": z.union([z.number(), z.null()]),
    "rocket": RocketSchema,
    "success": z.union([z.boolean(), z.null()]),
    "failures": z.array(FailureSchema),
    "details": z.union([z.null(), z.string()]),
    "crew": z.array(z.string()),
    "ships": z.array(z.string()),
    "capsules": z.array(z.string()),
    "payloads": z.array(z.string()),
    "launchpad": LaunchpadSchema,
    "flight_number": z.number(),
    "name": z.string(),
    "date_utc": z.coerce.date(),
    "date_unix": z.number(),
    "date_local": z.coerce.date(),
    "date_precision": DatePrecisionSchema,
    "upcoming": z.boolean(),
    "cores": z.array(CoreSchema),
    "auto_update": z.boolean(),
    "tbd": z.boolean(),
    "launch_library_id": z.union([z.null(), z.string()]),
    "id": z.string(),
});

// Tipo principal de Launch
export type Launch = z.infer<typeof LaunchSchema>;

// Esquemas adicionales para datos relacionados (necesarios para la app)
export const RocketDetailSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string().optional(),
    description: z.string().optional(),
    height: z.object({
        meters: z.number().optional(),
        feet: z.number().optional(),
    }).optional(),
    diameter: z.object({
        meters: z.number().optional(),
        feet: z.number().optional(),
    }).optional(),
});

export const LaunchpadDetailSchema = z.object({
    id: z.string(),
    name: z.string(),
    full_name: z.string(),
    locality: z.string().optional(),
    region: z.string().optional(),
    timezone: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    launch_attempts: z.number().optional(),
    launch_successes: z.number().optional(),
    status: z.string().optional(),
});

export type RocketDetail = z.infer<typeof RocketDetailSchema>;
export type LaunchpadDetail = z.infer<typeof LaunchpadDetailSchema>;

// Tipos para la UI
export type LaunchStatus = 'success' | 'failed' | 'upcoming';
export type SortOption = 'date_asc' | 'date_desc' | 'name_asc' | 'name_desc';
export type FilterOption = 'all' | 'success' | 'failed';