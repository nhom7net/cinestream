import { getToastStore, type ToastStore } from "@skeletonlabs/skeleton";

/**
 * Các kiểu thông báo cho toast.
 * 
 * Kiểu khác nhau sẽ cho ra CSS khác nhau.
 * 
 */
export enum StatusType {
    Infomative = "variant-filled-secondary", 
    Success = "variant-filled-success",
    Error = "variant-filled-error",
    Warning = "variant-filled-warning",
}

/**
 * Class được tối giản hoá từ thư viện Skeleton.
 */
export default class ToastNotification {
    toastStore: ToastStore;

    constructor() {
        this.toastStore = getToastStore();
    }

    /**
     * Gửi thông báo đến người dùng.
     * @param type Kiểu thông báo, lấy từ `StatusType`.
     * @param message Thông điệp muốn gửi.
     * @returns Trả về ID của thông báo này.
     */

    notify(type: StatusType, message: string) {
        return this.toastStore.trigger({
			message: message || 'Có lỗi xảy ra, hãy thử lại sau!',
			hideDismiss: true,
			background: type
		});
    }

    /**
     * Xoá tất cả các thông báo.
     */

    clear() {
        this.toastStore.clear();
    }
}