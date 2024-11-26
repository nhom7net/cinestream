/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {

    const url: string = `https://phimapi.com/phim/${params.movieSlug}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    return {
        name: data.movie.name,
        poster: data.movie.poster_url,
        origin_name: data.movie.origin_name,
        content: data.movie.content,
        category: data.movie.category,
        country: data.movie.country,
        episode_current: data.movie.episode_current,
        time: data.movie.time,
        quality: data.movie.quality,
        episode: data.episodes
            .flatMap((ep: { server_data: any[] }) => ep.server_data)
            .map((ep: { name: string; slug: string; filename: string; link_embed: string; link_m3u8: string }) => ({
                name: ep.name,
                slug: ep.slug,
                filename: ep.filename,
                link_embed: ep.link_embed,
                link_m3u8: ep.link_m3u8
            }))
    };    
};

