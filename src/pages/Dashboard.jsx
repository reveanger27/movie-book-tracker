import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/authContext";
import { Link, useSearchParams } from "react-router-dom";
import useSupabaseQuery from "../hooks/useSupabaseQuery";
import StarRating from "../components/StarRating";
import StatusBadge from "../components/StatusBadge";
import GenreChips from "../components/GenreChips";
import EmptyState from "../components/EmptyState";


function Dashboard () {
    const {currentUser} = useAuth();
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("search") || "";
    const genre = searchParams.get("genre") || "";
    const status = searchParams.get("status") || "";

    const { data: items, loading } = useSupabaseQuery(
        () => supabase
            .from('items')
            .select(`
                *,
                item_genres ( genres ( id, name ) )
            `),
            [currentUser]
    );

    const safeItems = items || []; // biar .filter() gak error pas data masih null
    const getGenreNames = (item) => 
        item.item_genres?.map((ig) => ig.genres.name) || [];

    //search
    const filteredItem = safeItems.filter((item) => {
        const matchKeyword = item.title.toLowerCase().includes(keyword.toLowerCase());
        const matchGenre = genre ? getGenreNames(item).includes(genre) : true;
        const matchStatus = status ? item.status === status : true;
        return matchKeyword && matchGenre && matchStatus;
    });

    return (
        <div>
            <div className="p-6 pb-0 bg-slate-950">
                <GenreChips />
            </div>
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-6 bg-slate-950 min-h-screen content-start">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="bg-slate-800 rounded-lg overflow-hidden shadow-lg animate-pulse">
                            <div className="w-full h-64 bg-slate-700"></div>
                            <div className="p-4 space-y-2">
                                <div className="h-5 bg-slate-700 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                                <div className="h-3 bg-slate-700 rounded w-1/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : safeItems.length === 0 ? (
                <EmptyState
                    title="Rak kamu masih kosong"
                    description="Belum ada film atau buku yang ditambahkan.."
                >
                    <Link
                        to="/item/new"
                        className="bg-amber-600 text-slate-900 px-6 py-3 rounded-md font-medium hover:bg-amber-500 transition-colors"
                    >
                        + Tambah Item Pertama
                    </Link>
                </EmptyState>
            ) : (
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-6 bg-slate-950 min-h-screen content-start">
                    {filteredItem.map((item) => (
                        <li
                            key={item.id}
                            className="group bg-slate-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                        >
                            <img
                                src={item.cover_url}
                                alt={item.title}
                                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="p-4 border-t-2 border-dashed border-slate-600">
                                <Link to={`/item/${item.id}`}>
                                    <h3 className="text-lg font-serif font-semibold text-amber-100 mb-1">{item.title}</h3>
                                </Link>
                                <p className="text-sm text-stone-400">{item.type}</p>
                                <StarRating rating={item.rating} />
                                <p className="text-sm text-stone-400">{item.creator}</p>
                                <StatusBadge status={item.status} />
                                <p className="text-sm text-stone-400">{item.notes}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )

}

export default Dashboard;