import { useState, useEffect } from "react";

function useSupabaseQuery(queryFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true; // guard biar gak setState kalau komponen udah unmount duluan

    const run = async () => {
      setLoading(true);
      setError('');

      const { data, error } = await queryFn();

      if (!isActive) return; // komponen udah "pergi", jangan update state lagi

      if (error) {
        setError(error.message);
      } else {
        setData(data);
      }
      setLoading(false);
    };

    run();

    return () => {
      isActive = false; // cleanup: dijalanin pas komponen unmount / deps berubah
    };
  }, deps);

  return { data, loading, error, setData };
}

export default useSupabaseQuery;