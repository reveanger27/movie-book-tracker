import { Link } from "react-router-dom";

function StatusBadge({ status }) {
    const styles = {
        watching: 'bg-green-900 text-green-300 border-green-700',
        planning: 'bg-blue-900 text-blue-300 border-blue-700',
        notwatch: 'bg-slate-700 text-slate-300 border-slate-600',
    };

    const labels = {
        watching: 'Sedang menikmati',
        planning: 'Masuk list',
        notwatch: 'Belum dimulai',
    };

    return (
        <Link
            to={`/?status=${status}`}
            className={`text-xs font-mono px-3 py-1 rounded-full border ${styles[status]}`}
        >
            {labels[status]}
        </Link>
    );
}

export default StatusBadge;