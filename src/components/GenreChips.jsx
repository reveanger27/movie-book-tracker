import { useSearchParams } from "react-router-dom";

const GENRES = ["Action", "Thriller", "Romance", "Comedy", "Horror", "Drama", "Fantasy", "Non-Fiction", "Mistery", "Sci-Fi"];

function GenreChips () {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeGenre = searchParams.get("genre") || "";

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
            {GENRES.map((genre) => (
                <button
                key={genre}
                onClick={() => handleClick(genre)}
                className={`px-3 py-1 rounded-full text-sm ${
                    activeGenre === genre
                    ? "bg-stone-200 text-stone-900"
                    : "bg-stone-800 text-stone-400"
                }`}
                >
                {genre}
                </button>
            ))}
        </div>
    );
}

export default GenreChips;