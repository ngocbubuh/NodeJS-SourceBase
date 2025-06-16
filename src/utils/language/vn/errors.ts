import { ErrorCode } from "../../enums/enums";

export const errors = {
    [ErrorCode.INTERNAL_ERROR]: "Lỗi máy chủ nội bộ",
    [ErrorCode.VALIDATION_FAILED]: "Xác thực thất bại",
    [ErrorCode.REQUIRED_TOKEN]: "Yêu cầu mã thông báo xác thực",
    [ErrorCode.EXPIRED_TOKEN]: "Mã thông báo xác thực đã hết hạn",
    [ErrorCode.INVALID_TOKEN_TYPE]: "Loại mã thông báo không hợp lệ",
    [ErrorCode.INVALID_TOKEN_CLAIM]: "Yêu cầu mã thông báo không hợp lệ",
    [ErrorCode.INVALID_ROLES_CLAIM]: "Không có quyền truy cập",
    [ErrorCode.INVALID_CREDENTIALS]: "Tên đăng nhập hoặc mật khẩu không đúng",
    [ErrorCode.INVALID_REQUEST]: "Yêu cầu không hợp lệ",
    [ErrorCode.NOT_FOUND_USER]: "Không tìm thấy người dùng",
    [ErrorCode.DUPLICATE_USER]: "Người dùng đã tồn tại",
    [ErrorCode.DELETED_USER]: "Người dùng đã bị xóa",
    [ErrorCode.MISSING_REQUIRED_DATA]: "Thiếu dữ liệu bắt buộc",
};
