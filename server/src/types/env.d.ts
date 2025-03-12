declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;

      // Database connection strings
      POSTGRES_URL?: string;
      POSTGRES_PRISMA_URL?: string;
      POSTGRES_URL_NON_POOLING?: string;
      POSTGRES_USER?: string;
      POSTGRES_HOST?: string;
      POSTGRES_PASSWORD?: string;
      POSTGRES_DATABASE?: string;

      // Other environment variables
      FRONTEND_URL?: string;
    }
  }
}

export {};
