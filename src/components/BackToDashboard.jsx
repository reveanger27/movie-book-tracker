import { Link } from "react-router-dom";

function BackToDashboard() {
    return (
        <Link
            to="/"
            className="bg-amber-600 text-slate-900 px-5 py-2 rounded-md fony-medium hover:bg-amber-500 transition-colors"
        >
            Kembali ke Dashboard
        </Link>
    );
}

export default BackToDashboard;