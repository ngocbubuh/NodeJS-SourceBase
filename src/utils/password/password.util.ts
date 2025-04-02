import bcrypt from "bcrypt";
import config, { AuthConfig } from "../environments/environment";
export class PasswordUtil {
    private static readonly config: AuthConfig = config.auth;

    public static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.config.saltRounds);
    }

    /**
     * Compare password with hash
     */
    public static async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}