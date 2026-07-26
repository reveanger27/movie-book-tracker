import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import StatusBadge from "./StatusBadge";
import BackToDashboard from "./BackToDashboard";
import EmptyState from "./EmptyState";


function ItemDetail() {
  const [items, setItems] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { itemId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async() => {
      setLoading(true);
      const {data, error} = await supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single();

        if(error) {
          if (error.code === 'PGRST116') {
            //kode khusus supabase kalo .single() gak nemuy baris samsek
            setItems(null); 
          } else {
            setError(error.message);
          }
          setLoading(false);
          return;
        }
          setItems(data);
          setLoading(false);                
    }
    fetchItems();

    const fetchGenres = async () => {
      const { data: dataGenres, error: genreError } = await supabase
        .from('item_genres')
        .select(`
            genre_id,
            genres (id, name)
        `)
        .eq('item_id', itemId);

        if (genreError) {
          setError(genreError.message);
          setLoading(false);
          return;
        }
        setGenres(dataGenres);
        setLoading(false);
    }
    fetchGenres(); 

  }, [itemId]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Yakin mau hapus item ini?");
    if(!confirmDelete) return;

    //hapus cover dari database
    if (items.cover_url) {
      const fileName = items.cover_url.split('/').pop();
      const { error: storageError} = await supabase.storage
      .from('item-covers')
      .remove([fileName]);

      if (storageError) {
        console.error(storageError);
        //lanjut walo gagal hapus cover, gk perlu stop total
      }
    }
    const { error: genreDeleteError } = await supabase
    .from('item_genres')
    .delete()
    .eq('item_id', itemId);

    if (genreDeleteError) {
      setError(genreDeleteError.message);
      return;
    }

    //hapus item dari database
    const {error: deleteError} = await supabase
    .from('items')
    .delete()
    .eq('id', itemId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    navigate('/');
  }

  if (error) {
    return (
      <EmptyState 
        title="Ups, ada masalah!" 
        description={error}
      >
        <BackToDashboard />
      </EmptyState>
    );
  }

  if (!items) {
    return (
      <EmptyState
        title="Item tidak ditemukan"
        description="Mungkin item ini sudah dihapus atau link salah!"
      >
        <BackToDashboard />
      </EmptyState>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 animate-pulse">
          <div className="w-full md:w-72 h-96 bg-slate-800 rounded-lg shrink-0"></div>
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
            <div className="h-6 bg-slate-800 rounded w-1/4"></div>
            <div className="h-4 bg-slate-800 rounded w-2/3"></div>
            <div className="flex gap-2 mt-4">
              <div className="h-8 w-20 bg-slate-800 rounded-full"></div>
              <div className="h-8 w-20 bg-slate-800 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-slate-950 p-6">
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      {items.cover_url && (
        <img src={items.cover_url} alt={items.title} 
          className="w-full md:w-72 h-auto rounded-lg shadow-xl shrink-0"
        />
      )}
      <div className="flex-1 text-stone-200">
        <h1 className="text-3xl font-serif font-bold text-amber-100 mb-4">{items.title}</h1>
        <p>Tipe: {items.type}</p>
        <p>Karya: {items.creator}</p>
        <p className="flex items-center gap-2">Status: <StatusBadge status={items.status}/></p>
        <p className="flex items-center gap-2">Rating: <StarRating rating={items.rating}/></p>
        <p>Catatan: {items.notes}</p>
        
        <div className="flex-flex-wrap gap-2 mt-3 mb-4">
          {genres.map((genre) => (
            <Link
              key={genre.genre_id}
              to={`/?genre=${genre.genres.name}`}
              className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-amber-200 border border-slate-600 "
            >
              {genre.genres.name}
            </Link>
          ))}
        </div>

        <div className="flex gap-2">
          <Link to={`/item/${items.id}/edit`}>
            <button
              className="mt-4 bg-amber-600 text-slate-900 px-5 py-2 rounded-md font-medium hover:bg-amber-500 transition-colors"
            >
              Edit
            </button>
            
          </Link>

          <button
            onClick={handleDelete}
            className="mt-4 bg-red-700 text-slate-100 px-5 py-2 rounded-md font-medium hover:bg-red-500 transition-colors"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  </div>
  )
  

}
export default ItemDetail;