/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {

    const url: string = `https://phimapi.com/phim/${params.movieSlug}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    const episodes = data.episodes[0]?.server_data.map((ep: { name: string; slug: string; filename: string; link_embed: string; link_m3u8: string }) => ({
        name: ep.name.replace('Tập ', ''),
        slug: ep.slug,
        filename: ep.filename,
        link_embed: ep.link_embed,
        link_m3u8: ep.link_m3u8
    })) ?? [];

    // Sắp xếp các tập phim từ mới nhất đến cũ nhất
    const sortedEpisodes = episodes.sort((a: { name: string; }, b: { name: string; }) => {
        const aNumber = parseInt(a.name.replace(/\D/g, ''), 10); // Lấy số từ tên
        const bNumber = parseInt(b.name.replace(/\D/g, ''), 10); // Lấy số từ tên
        return bNumber - aNumber; // Sắp xếp theo số giảm dần (mới nhất trước)
    });

    return {
        slug: params.movieSlug,
        name: data.movie.name,
        poster: data.movie.poster_url,
        origin_name: data.movie.origin_name,
        content: data.movie.content,
        category: data.movie.category,
        country: data.movie.country,
        episode_current: data.movie.episode_current,
        time: data.movie.time,
        quality: data.movie.quality,
        film: params.movieSlug,
        episode: sortedEpisodes
    };
};

