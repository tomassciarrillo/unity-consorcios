import { useAuth } from '../../context/AuthContext';
import { Clock, LogOut } from 'lucide-react';

export default function WaitingRoom() {
  const { logout, user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center border border-slate-100">
        <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Hola, {user?.fullName}!</h2>
        <h3 className="text-lg font-semibold text-amber-600 mb-4">Cuenta en revisión</h3>
        <p className="text-slate-600 mb-6 text-sm leading-relaxed">
          Tus datos fueron enviados al administrador de tu edificio. En cuanto validen tu unidad, se habilitará tu acceso al sistema.
        </p>
        <button 
          onClick={logout}
          className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-xl transition-all text-sm"
        >
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}