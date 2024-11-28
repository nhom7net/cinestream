import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, locals: { safeGetSession, supabase } }) => {

	const { session } = await safeGetSession();

	if (!session) {
		throw redirect(303, '/');
	}

	const { data } = await supabase.from("history").select("user,movie,watched_at,episodes").eq("user", session.user.id);

  /// handle data film
	const history = await Promise.all(
		(data || []).map(async (element) => {
			const response = await fetch(`https://phimapi.com/phim/${element.movie}`);
			const moviedata = await response.json();

			return {
				name: moviedata.movie.name,
				poster: moviedata.movie.poster_url,
				episode: element.episodes,
				time: element.watched_at
			};
		})
	);

	return { url: url.origin, history };
};
