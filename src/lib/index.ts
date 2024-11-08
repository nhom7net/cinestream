// place files you want to import through the `$lib` alias in this folder.
export interface PaginationSettings {
    page: number;           // Trang hiện tại
    limit: number;          // Giới hạn số lượng phần tử trên mỗi trang
    size: number;           // Tổng số phần tử (ví dụ từ source.length)
    amounts: number[];      // Các tùy chọn số lượng phần tử trên mỗi trang (ví dụ: [1, 2, 5, 10])
}
