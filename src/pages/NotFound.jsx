import { Link } from "react-router-dom";
import BackToDashboard from "../components/BackToDashboard";
import EmptyState from "../components/EmptyState";


function NotFound() {
  return (
    <EmptyState
        title="404- Halaman tidak ditemukan"
        description="Sepertinya kamu nyasar ke rak yang salah."
    >
        <BackToDashboard /> 
    </EmptyState>
  );
}

export default NotFound;