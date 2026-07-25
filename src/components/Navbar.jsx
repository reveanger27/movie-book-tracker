import { Link, useNavigate, useSearchParams} from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/authContext";
import { useState } from "react";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();

    const  keyword = searchParams.get("search") || "";
    const {currentUser} = useAuth();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchParams(value ? { search: value } : {});
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    if(!currentUser) return null;

    return (
        <nav className="sticky top-0 z-50 bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-700 relative">
            <Link to="/" className="text-amber-100 font-serif font-bold text-lg">Rak Koleksi</Link>

            {/* Menu versi DESKTOP - selalu ada, disembunyikan di HP */}
            <div className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-stone-300 hover:text-amber-200 transition-colors text-sm font-medium">
                    Home
                </Link>
                <Link to="/item/new" className="text-stone-300 hover:text-amber-200 transition-colors text-sm font-medium">
                    Tambah
                </Link>
                <input 
                    type="text"
                    placeholder="Cari item..."
                    value={keyword}
                    onChange={handleSearch}
                    className="w-full max-w-md placeholder-amber-50 bg-slate-800 border border-slate-600 rounded-md px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
                />
                <span className="text-stone-200 text-sm">{currentUser.email}</span>
                <button
                    onClick={handleLogout}
                    className="bg-amber-600 text-slate-900 px-4 py-2 rounded-md font-medium hover:bg-amber-500 transition-colors"
                >
                    Keluar
                </button>
            </div>

            {/* Tombol hamburger - SELALU ada di HP, disembunyikan di desktop */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-stone-200 text-2xl"
            >
                ☰
            </button>

            {/* Menu versi MOBILE - kondisional, cuma muncul kalau menuOpen true */}
            {menuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full flex flex-col gap-4 bg-slate-900 px-6 py-4 border-b border-slate-700">
                    <Link to="/" onClick={() => setMenuOpen(false)} className="text-stone-300 hover:text-amber-200 transition-colors text-sm font-medium">
                        Home
                    </Link>
                    <Link to="/item/new" onClick={() => setMenuOpen(false)} className="text-stone-300 hover:text-amber-200 transition-colors text-sm font-medium">
                        Tambah
                    </Link>
                    <input 
                        type="text"
                        placeholder="Cari item..."
                        value={keyword}
                        onChange={handleSearch}
                        className="w-full max-w-md placeholder-amber-50 bg-slate-800 border border-slate-600 rounded-md px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-stone-200 text-sm">{currentUser.email}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-amber-600 text-slate-900 px-4 py-2 rounded-md font-medium hover:bg-amber-500 transition-colors"
                    >
                        Keluar
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;