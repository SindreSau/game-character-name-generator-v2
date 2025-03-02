// This file should only be imported in server components or server actions

/**
 * Gets an environment variable with proper type checking
 * Only use this in server components or server actions
 */
export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return value;
};

/**
 * Check if we're in a development environment
 */
export const isDev = process.env.NODE_ENV === 'development';
