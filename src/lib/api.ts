export async function fetchMovies(page = 1) {
    const url = `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`API Error ${response.status}: ${response.statusText}`);
            throw new Error(`Lỗi khi lấy dữ liệu từ API: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}