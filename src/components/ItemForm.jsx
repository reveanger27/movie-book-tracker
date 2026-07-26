import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import FormField, { inputClassName } from "./FormField";
import useSupabaseQuery from "../hooks/useSupabaseQuery";

function ItemForm() {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState('');
  const [creator, setCreator] = useState('');
  const [note, setNote] = useState('');
  const [cover, setCover] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState('')

  const { itemId } = useParams();
  const isEditMode = Boolean(itemId);
  const  { currentUser } = useAuth();
  const navigate = useNavigate();

  const { data: allGenres, loading: genresLoading } = useSupabaseQuery(
    () => supabase
      .from('genres')
      .select('*'),
      []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let coverUrl = cover || null;
    let ratingItem = rating || null;

    if (cover instanceof File) {
      // STEP 1: Upload cover
      const fileName = `${Date.now()}-${cover.name}`;

      const { error: uploadError } = await supabase.storage
        .from('item-covers')
        .upload(fileName, cover);
        
      if (uploadError) {
          setError(uploadError.message);
          setLoading(false);
          return; // <- STOP di sini kalau upload gagal, jangan lanjut ke step 2
        }

      // Ambil URL publik dari file yg baru di upload
      const { data: urlData } = supabase.storage
        .from('item-covers')
        .getPublicUrl(fileName);

      coverUrl = urlData.publicUrl; //update coverUrl dengan yang baru
    }

    let newItemId; //buat nampung id item, baik dari insert baru atau dari itemId yang udah ada

    if(isEditMode){
      const {error: updateError} = await supabase
        .from('items')
        .update({
          type,
          title,
          rating: ratingItem,
          creator,
          status,
          cover_url: coverUrl,
          notes: note,
        })
        .eq('id', itemId);

        if(updateError) {
          setError(updateError.message);
          setLoading(false);
          return;
        }

        newItemId = itemId;  //pakae item id yang udah ada

    } else {
      const { data: newItem, error: insertError } = await supabase
        .from('items')
        .insert({
          type,
          title,
          user_id: currentUser.id,
          rating: ratingItem,
          creator,
          status,
          cover_url: coverUrl,
          notes: note,
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      newItemId = newItem.id //pake id yang baru dibuat
    }  

    
    if(isEditMode) {
      //hapus semua relasi genre lama buat item ini
      const { error: deleteError } = await supabase
        .from('item_genres')
        .delete()
        .eq('item_id', newItemId);
      
      if (deleteError) {
        setError(deleteError.message);
        setLoading(false);
        return;
      }
    }

    // lanjut insert ulang (sama untuk new atau edit)
    const genreRows = selectedGenres.map((genreId) => ({
      item_id: newItemId,
      genre_id: genreId,
    }));

    const { error: genreError } = await supabase
      .from('item_genres')
      .insert(genreRows);

      if(genreError) {
        alert("Item berhasil dibuat, tapi ada masalah saat menambahkan genre. Silakan edit manual.");
        navigate(`/item/${newItemId}`);
        
      } else {
        navigate(`/item/${newItemId}`)

      }
      setLoading(false);
  }

  //Edit item
  useEffect(() => {
    if(!isEditMode) return;

    const fetchItemForEdit = async () => {
      const {data: dataEdit, error: errorEdit } = await supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single();

        if(errorEdit) {
          setError(errorEdit.message)
          return;
        }
        setTitle(dataEdit.title);
        setType(dataEdit.type);
        setCreator(dataEdit.creator);
        setStatus(dataEdit.status);
        setRating(dataEdit.rating);
        setNote(dataEdit.notes);
        setCover(dataEdit.cover_url);

        const {data: dataGenreLinks, error: genreLinksError} = await supabase
          .from('item_genres')
          .select('genre_id')
          .eq('item_id', itemId);

        if(genreLinksError) {
          setError(genreLinksError.message);
          return;
        }

        const genreIds = dataGenreLinks.map((row) => row.genre_id);
        setSelectedGenres(genreIds);
    };

    fetchItemForEdit();
  }, [itemId]);

  

  

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-serif font-bold text-amber-100 mb-6">Tambah judul film/buku</h1>
        <form
          onSubmit={handleSubmit}
        >
          {error && (<p>{error}</p>)}

          <FormField label="Judul">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputClassName}
            />
          </FormField>

          <FormField label="Tipe">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={inputClassName}
            >
              <option value="" disabled>-- Pilih Satu --</option>
              <option value="movie">Film</option>
              <option value="book">Buku</option>
            </select>
          </FormField>

          <FormField label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClassName}
            >
              <option value="" disabled>-- Pilih Satu --</option>
              <option value="watching">sedang menikmati</option>
              <option value="planning">masuk list</option>
              <option value="notwatch">belum dimulai</option>         
            </select>
          </FormField>
          
          <FormField label="Rating">
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className={inputClassName}
            />
          </FormField>

          <FormField label="Karya">
            <input
              type="text"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              className={inputClassName}
            />
          </FormField>

          <FormField label="Catatan">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="2"
              className={inputClassName}
            />
          </FormField>

          <FormField label="Genre">
            <select
              value={selectedGenres}
              multiple
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setSelectedGenres(values);
              }}
              className={`${inputClassName} h-32`}  
            >
              {(allGenres || []).map((genre) => (
                <option 
                  key={genre.id} 
                  value={genre.id}
                >
                  {genre.name}
                </option>
              ))}
            </select>
          </FormField>

          <label className="block text-sm text-stone-400 mb-1">Cover</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setCover(e.target.files[0])}
            className="w-full text-stone-300 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-amber-600 file:text-slate-900 file:font-medium file:cursor-pointer"
          />

        <button
            type="submit"
            className="w-full bg-amber-600 text-slate-900 py-2 rounded-md font-medium hover:bg-amber-500 transition-colors"
          >
            Tambah
          </button>

        </form>
      </div>
    </div>
  )

  

}
export default ItemForm;