import { ErrorCode } from "../../enums/enums";

export const errors = {
    [ErrorCode.INTERNAL_ERROR]: "Internal server error",
    [ErrorCode.VALIDATION_FAILED]: "Validation failed",
    [ErrorCode.REQUIRED_TOKEN]: "Authentication token is required",
    [ErrorCode.EXPIRED_TOKEN]: "Authentication token has expired",
    [ErrorCode.INVALID_TOKEN_TYPE]: "Invalid token type",
    [ErrorCode.INVALID_TOKEN_CLAIM]: "Invalid token claim",
    [ErrorCode.INVALID_ROLES_CLAIM]: "Access denied",
    [ErrorCode.INVALID_CREDENTIALS]: "Invalid username or password",
    [ErrorCode.INVALID_REQUEST]: "Invalid request",
    [ErrorCode.NOT_FOUND_USER]: "User not found",
    [ErrorCode.DUPLICATE_USER]: "User already exists",
    [ErrorCode.DELETED_USER]: "User has been deleted",
    [ErrorCode.MISSING_REQUIRED_DATA]: "Required data is missing",
};