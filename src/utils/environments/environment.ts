import dotenv from "dotenv";
import path from "path";

// Load environment-specific .env file
const environment = process.env.NODE_ENV || "development";
const envPath = path.resolve(process.cwd(), `.env`);

// Load env file
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error("Error loading .env file:", result.error);
    throw result.error;
}

export interface DatabaseConfig {
    connectionString?: string;
    ssl: boolean;
}

export interface AuthConfig {
    saltRounds: number;
    accessTokenExpires: string;
    refreshTokenExpires: string;
    jwtSecret: string;
}

export interface Config {
    env: string;
    port: number;
    database: DatabaseConfig;
    auth: AuthConfig;
}

function getDatabaseConfig(): DatabaseConfig {
    return {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    };
}

const config: Config = {
    env: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "3000", 10),
    database: getDatabaseConfig(),
    auth: {
        jwtSecret: process.env.JWT_SECRET || "default_secret", // Giá trị mặc định
        saltRounds: parseInt(process.env.AUTH_SALT_ROUNDS || "10", 10),
        accessTokenExpires: process.env.AUTH_ACCESS_TOKEN_EXPIRES || "15m",
        refreshTokenExpires: process.env.AUTH_REFRESH_TOKEN_EXPIRES || "7d",
    }
};

function validateAuthConfig(auth: AuthConfig) {
    if (!auth.jwtSecret || auth.jwtSecret === "default_secret") {
        console.warn("Warning: Using default JWT secret. This is not secure for production.");
    }

    if (auth.saltRounds < 10) {
        throw new Error("AUTH_SALT_ROUNDS must be at least 10");
    }

    // Validate token expiration format
    const timeRegex = /^(\d+)(m|h|d)$/;
    if (!timeRegex.test(auth.accessTokenExpires)) {
        throw new Error("Invalid AUTH_ACCESS_TOKEN_EXPIRES format. Use format: 15m, 1h, 7d");
    }
    if (!timeRegex.test(auth.refreshTokenExpires)) {
        throw new Error("Invalid AUTH_REFRESH_TOKEN_EXPIRES format. Use format: 15m, 1h, 7d");
    }
}
// Validate required environment variables
function validateConfig() {
    const { database } = config;
    if (!database.connectionString) {
        throw new Error("DATABASE_URL are required for local database");
    }
}

validateAuthConfig(config.auth);
validateConfig();

export default config;
