import { SuccessCode } from "../utils/enums/enums";
import config from "../utils/environments/environment";
import * as enSuccess from "../utils/language/en/success";
import * as vnSuccess from "../utils/language/vn/success";

const translations: { [key: string]: any } = {
    en: {
        success: enSuccess.success,
    },
    vi: {
        success: vnSuccess.success,
    },
};

export class LanguageService {
    private static readonly defaultLanguage: string = 'en';

    private static getCurrentLanguage(): string {
        return (process.env.LANG || this.defaultLanguage).toLowerCase();
    }

    public static getSuccessMessage(code: SuccessCode): string {
        const language = this.getCurrentLanguage();
        const lang = translations[language] ? language : this.defaultLanguage;
        
        if (translations[lang] && translations[lang].success && 
            translations[lang].success[code] !== undefined) {
            return translations[lang].success[code];
        }
        
        return String(code);
    }
    
    public static getCurrentLanguageCode(): string {
        return this.getCurrentLanguage();
    }
}

export class GeneralResponse {
    message?: string;
    data?: any;
    code!: SuccessCode;

    // Overload signatures
    constructor(code: SuccessCode);
    constructor(code: SuccessCode, data: any);

    // Actual implementation
    constructor(code: SuccessCode, data?: any) {
        this.code = code;
        if (data) {
            this.data = data;
        } else {
            this.data = "";
        }
        this.message = LanguageService.getSuccessMessage(code);
    }

    toJSON() {
        return {
            message: this.message,
            code: this.code,
            data: this.data
        };
    }
}