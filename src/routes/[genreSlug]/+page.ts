import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
    const allowedSelections: string[] = ["phim-moi-cap-nhat", "hoat-hinh", "phim-le", "phim-bo", "tv-shows"];
    let url: string = `https://phimapi.com/v1/api/danh-sach/${params.genreSlug}?page=`;
    
    if (!allowedSelections.includes(params.genreSlug)) throw new Error("Not Found");
    
    return {
        url
    }
};