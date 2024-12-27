import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch, data }) => {
    
    const url: string = `https://phimapi.com/phim/${params.watchSlug}`;

    const resp = await fetch(url);

    if (!resp.ok) {
        throw new Error(`Failed to fetch data: ${resp.statusText}`);
    }

    const dataApi = await resp.json();

    const episodes = dataApi.episodes[0]?.server_data.map((ep: { name: string; slug: string; filename: string; link_embed: string; link_m3u8: string }) => ({
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
        slug: params.watchSlug,
        name: dataApi.movie.name,
        episode_current: dataApi.movie.episode_current,
        episode: sortedEpisodes,
        comment: data.comment
    };
};