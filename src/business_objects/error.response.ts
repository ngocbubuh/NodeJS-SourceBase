import { ErrorCode } from "../utils/enums/enums";
import * as enErrors from "../utils/language/en/errors";
import * as viErrors from "../utils/language/vn/errors";
class ErrorV2 {
    message?: string;
    data?: any;
    code!: ErrorCode;

    // Overload signatures
    constructor(code: ErrorCode);
    constructor(code: ErrorCode, data: any);

    // Actual implementation
    constructor(code: ErrorCode, data?: any) {
        this.code = code;
        if (data) {
            this.data = data;
        } else {
            this.data = "";
        }
        this.message = LanguageService.getErrorMessage(code);
    }

    toJSON() {
        return {
            message: this.message,
            code: this.code,
            data: this.data
        };
    }
}

export class ErrorResponseV2 extends ErrorV2 {

}

export class UnAuthResponseV2 extends ErrorV2 {

}

export class RejectResponseV2 extends ErrorV2 {

}

const translations: { [key: string]: any } = {
    en: {
        errors: enErrors.errors,
    },
    vi: {
        errors: viErrors.errors,
    },
};

export class LanguageService {
    private static readonly defaultLanguage: string = 'en';

    private static getCurrentLanguage(): string {
        return (process.env.LANG || this.defaultLanguage).toLowerCase();
    }

    public static getErrorMessage(code: ErrorCode): string {
        const language = this.getCurrentLanguage();
        const lang = translations[language] ? language : this.defaultLanguage;

        if (translations[lang] && translations[lang].errors &&
            translations[lang].errors[code] !== undefined) {
            return translations[lang].errors[code];
        }

        return String(code);
    }

    public static getCurrentLanguageCode(): string {
        return this.getCurrentLanguage();
    }
}