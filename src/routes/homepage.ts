export async function fetchMovies(page = 1) {
	const url = `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page+1}`;
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`API returned: ${response.status} (${response.statusText})`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
}
