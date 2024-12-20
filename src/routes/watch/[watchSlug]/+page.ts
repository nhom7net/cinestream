/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
    
    const url: string = `https://phimapi.com/phim/${params.watchSlug}`;

    const resp = await fetch(url);

    if (!resp.ok) {
        throw new Error(`Failed to fetch data: ${resp.statusText}`);
    }

    const data = await resp.json();

    return {
        slug: params.watchSlug,
        name: data.movie.name,
        episode_current: data.movie.episode_current,
        episode: data.episodes
            .flatMap((ep: { server_data: any[] }) => ep.server_data)
            .map((ep: { name: string; slug: string; filename: string; link_embed: string; link_m3u8: string }) => ({
                name: ep.name.replace('Tập ', ''),
                slug: ep.slug,
                filename: ep.filename,
                link_embed: ep.link_embed,
                link_m3u8: ep.link_m3u8
            }))
            .sort((a: { name: string; }, b: { name: string; }) => {
                const aNumber = parseInt(a.name.replace(/\D/g, ''));
                const bNumber = parseInt(b.name.replace(/\D/g, ''));
                return bNumber - aNumber;
            })
    };
};