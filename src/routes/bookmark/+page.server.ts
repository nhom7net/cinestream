import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { error } from 'console';

export const load: PageServerLoad = async ({ url, locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (!session) {
		throw redirect(302, '/');
	}

	const { data } = await supabase
		.from('favorites') // Replace 'movies' with your table name
		.select('movie_id')
		.eq('user_id', session.user.id);

	if (!data || data.length === 0) {
		return { slugMovies: [], url: url.origin };
	}

	const slugMovies = await Promise.all(
		data.map(async (element) => {
			const response = await fetch(`https://phimapi.com/phim/${element.movie_id}`);
			if (!response.ok) {
				throw new Error(`Failed to fetch movie with slug: ${element.movie_id}`);
			}
			const movieData = await response.json();
			return {
				slug: movieData.movie.slug,
				name: movieData.movie.name,
				poster_url: movieData.movie.poster_url,
			};
		})
	);

	return { slugMovies, url: url.origin };
};
