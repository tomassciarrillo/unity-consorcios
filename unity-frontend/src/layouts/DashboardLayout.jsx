import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Megaphone, 
  Receipt, 
  FileText, 
  Calendar, 
  Users, 
  PlusCircle, 
  LogOut, 
  User as UserIcon 
} from 'lucide-react';


export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const isAdmin = user?.role === 'BUILDING_ADMIN' || user?.role === 'SUPER_ADMIN';
  const homePath = isAdmin ? '/admin/dashboard' : '/resident/dashboard';

  const linkClass = (path) => `
    flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all
    ${isActive(path) 
      ? 'bg-blue-50 text-blue-600' 
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
  `;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <Link 
            to={homePath} 
            className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity"
          >
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">Unity</span>
          </Link>

          <div className="flex items-center gap-4">
            
            <Link 
              to={homePath} 
              className="flex items-center gap-2 text-right hidden sm:flex cursor-pointer hover:opacity-85 transition-opacity"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800 leading-none">{user?.fullName}</p>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {user?.role === 'RESIDENT' ? 'Residente' : 'Administrador'}
                </span>
              </div>
              <div className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                <UserIcon className="w-4 h-4" />
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <aside className="md:col-span-1">
          <nav className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1 sticky top-22">
            <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Menú Principal
            </h3>

            {user?.role === 'RESIDENT' && (
              <>
                <Link to="/resident/dashboard" className={linkClass('/resident/dashboard')}>
                  <Megaphone className="w-4 h-4" /> Cartelera Informativa
                </Link>
                <Link to="/resident/expenses" className={linkClass('/resident/expenses')}>
                  <Receipt className="w-4 h-4" /> Mis Expensas
                </Link>
                <Link to="/resident/tickets" className={linkClass('/resident/tickets')}>
                  <FileText className="w-4 h-4" /> Mis Reclamos
                </Link>
                <Link to="/resident/reservations" className={linkClass('/resident/reservations')}>
                  <Calendar className="w-4 h-4" /> Reservas SUM / Parrilla
                </Link>
              </>
            )}

            {(user?.role === 'BUILDING_ADMIN' || user?.role === 'SUPER_ADMIN') && (
              <>
                <Link to="/admin/users-approval" className={linkClass('/admin/users-approval')}>
                  <Users className="w-4 h-4" /> Residentes Pendientes
                </Link>
                <Link to="/admin/expenses" className={linkClass('/admin/expenses')}>
                  <PlusCircle className="w-4 h-4" /> Generar Expensas
                </Link>
                <Link to="/admin/tickets" className={linkClass('/admin/tickets')}>
                  <FileText className="w-4 h-4" /> Reclamos del Edificio
                </Link>
                <Link to="/admin/reservations" className={linkClass('/admin/reservations')}>
                    <Calendar className="w-4 h-4" /> Agenda de Reservas
                </Link>
                <Link to="/admin/announcements" className={linkClass('/admin/announcements')}>
                    <Megaphone className="w-4 h-4" /> Publicar Anuncio
                </Link>
              </>
            )}
          </nav>
        </aside>

        <main className="md:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[60vh]">
          {children}
        </main>

      </div>
    </div>
  );
}