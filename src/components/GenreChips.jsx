import { useSearchParams } from "react-router-dom";
import useSupabaseQuery from "../hooks/useSupabaseQuery";
import { supabase } from "../lib/supabaseClient";


function GenreChips () {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeGenre = searchParams.get("genre") || "";

    const { data: allGenres, loading: genresLoading } = useSupabaseQuery(
        () => supabase.from('genres').select('*'),
        []
    );

    let genreChip = allGenres || [];

    const handleClick = (genre) => {
        const params = Object.fromEntries(searchParams);
        if(activeGenre === genre) {
            delete params.genre;
        } else {
            params.genre = genre;
        }
        setSearchParams(params)
    };

    return (
        <div className="flex gap-2 flex-wrap">
            {genreChip.map((genre) => (
                <button
                key={genre.id}
                onClick={() => handleClick(genre.name)}
                className={`px-3 py-1 rounded-full text-sm ${
                    activeGenre === genre.name
                    ? "bg-stone-200 text-stone-900"
                    : "bg-stone-800 text-stone-400"
                }`}
                >
                {genre.name}
                </button>
            ))}
        </div>
    );
}

export default GenreChips;