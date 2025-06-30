// Exportar todos los adapters desde un punto central
export { SpaceXDataAdapter } from './SpaceXDataAdapter';
export { ApiResponseAdapter } from './ApiResponseAdapter';
export { StorageAdapter } from './StorageAdapter';
export { UIFormatAdapter } from './UIFormatAdapter';
export { DataValidationAdapter } from './DataValidationAdapter';
export { ImageAdapter } from './ImageAdapter';

// Tipos para los adapters
export type AdapterError = {
    message: string;
    code: string;
    retryable: boolean;
};

export type ValidationResult<T> = {
    isValid: boolean;
    data: T | null;
    errors: string[];
};
