import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Login () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({email, password});

        if (error) {
            setError(error.message);
        } else {
            navigate('/');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            <div className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-sm">
                <h1 className="text-2xl font-serif font-bold text-amber-100 mb-6">Login</h1>
                <form
                    onSubmit={handleSubmit}
                >
                    {error && (<p>{error}</p>)}

                    <label className="block text-sm text-stone-400 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-stone-200 mb-4 focus:outline-none focus:border-amber-500"
                    />

                    <label className="block text-sm text-stone-400 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-stone-200 mb-4 focus:outline-none focus:border-amber-500"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-600 text-slate-900 py-2 rounded-md font-medium hover:bg-amber-500 transition-colors disabled:opacity-50"
                    >
                        Masuk
                    </button>

                    <p className="block text-sm py-4 text-stone-400 mb-1">
                        Belom punya akun? { ' ' }
                        <Link to="/register" className="font-bold hover:text-stone-200">Daftar disini</Link>
                    </p>

                </form>
            </div>
        </div>
    );

}

export default Login;
