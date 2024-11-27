import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { error } from 'console';

export const load: PageServerLoad = async ({ url, locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (!session) {
		redirect(302, '/');
	}
	const { data } = await supabase
		.from('favorites') // Replace 'movies' with your table name
		.select('movie_id')
		.eq('user_id', session.user.id)
	let slugMovies: { slug: string, name: string, poster_url: string }[] = [];
	data?.forEach(async (element) => {
		const response = await fetch(`https://phimapi.com/phim/${element.movie_id}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch movie with slug: ${element.movie_id}`);
		}
		const data = await response.json();
		slugMovies.push({
			slug: data.movie.slug,
			name: data.movie.name,
			poster_url: data.movie.poster_url,
		});
	})
	return { slugMovies, url: url.origin };
};