import dotenv from "dotenv";
import nodemailer, { Transporter } from "nodemailer";
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

// Debug loaded values
console.log("Loaded ENV variables:");
console.log("DB_TYPE:", process.env.DB_TYPE);

export interface DatabaseConfig {
    type: "local" | "cloud";
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
    mailer: Transporter;
}

function getDatabaseConfig(): DatabaseConfig {
    const dbType = process.env.DB_TYPE || "local";
    if (dbType === "cloud") {
        return {
            type: "cloud",
            connectionString: process.env.DATABASE_URL_CLOUD,
            ssl: true,
        };
    }

    return {
        type: "local",
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    };
}

function createMailTransport(): Transporter {
    return nodemailer.createTransport({
        host: process.env.MAIL_HOST || "smtp.gmail.com",
        port: parseInt(process.env.MAIL_PORT || "587", 10),
        secure: process.env.MAIL_SECURE === "true", // true for 465, false for 587
        auth: {
            user: process.env.MAIL_USER || "", // SMTP email
            pass: process.env.MAIL_PASS || "", // SMTP password or App Password
        },
    });
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
    },
    mailer: createMailTransport()
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
    const { database, auth } = config;
    if (database.type === "cloud" && !database.connectionString) {
        throw new Error("DATABASE_URL_CLOUD is required for cloud database");
    }

    if (database.type === "local" && !database.connectionString) {
        throw new Error("DATABASE_URL_LOCAL are required for local database");
    }

    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        throw new Error("MAIL_USER and MAIL_PASS are required for SMTP email sending");
    }

}

validateAuthConfig(config.auth);
validateConfig();

export default config;
