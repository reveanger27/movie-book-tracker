import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemDetail from './components/ItemDetail';
import ItemForm from './components/ItemForm';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/item/new" element={<ItemForm />} />
        <Route path="/item/:itemId/edit" element={<ItemForm />} />
        <Route path="/item/:itemId" element={<ItemDetail />} />
      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

export default App