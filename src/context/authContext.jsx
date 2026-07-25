import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect (() => {
        supabase.auth.getSession().then(({data: {session} }) => {
            setCurrentUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            setCurrentUser(session?.user ?? null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser}}>
            {!loading && children}
        </AuthContext.Provider>
    );

}

export function useAuth() {
    return useContext(AuthContext);
}
