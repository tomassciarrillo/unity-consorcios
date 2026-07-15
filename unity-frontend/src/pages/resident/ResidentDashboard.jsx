import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Megaphone, Calendar, User, Loader2, AlertCircle } from 'lucide-react';

export default function ResidentDashboard() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const buildingId = user?.buildingId; 
        
        if (!buildingId) {
          setLoading(false);
          return;
        }
        const response = await api.get(`/announcements/building/${buildingId}`);
        setAnnouncements(response.data);
      } catch (err) {
        console.error('Error al traer anuncios:', err);
        setError('No se pudieron cargar las novedades del edificio.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAnnouncements();
    }
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Cartelera Informativa</h2>
            <p className="text-sm text-slate-500">Últimas novedades y comunicados de la administración</p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" /> Cargando novedades...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
          </div>
        )}

        {!loading && !error && announcements.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
            <p className="text-slate-500 text-sm font-medium">No hay anuncios publicados en este edificio todavía.</p>
            <p className="text-xs text-slate-400 mt-1">Los comunicados del administrador aparecerán en este espacio.</p>
          </div>
        )}


        <div className="grid gap-5 md:grid-cols-1">
        {announcements.map((item) => (
            <div 
            key={item.id} 
            className="relative bg-gradient-to-r from-blue-50/40 to-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
            {/* Barra de color lateral sutil para dar jerarquía */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />

            <div className="pl-2">
                <h3 className="text-lg font-bold text-slate-850 mb-2 flex items-center gap-2">
                <span className="text-xl">📢</span>
                {item.title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-4 whitespace-pre-line">
                {item.content || item.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg text-slate-500 border border-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-AR') : 'Reciente'}</span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-blue-50/60 px-2.5 py-1 rounded-lg text-blue-700 font-semibold">
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    <span>{item.author || 'Administración'}</span>
                </div>
                </div>
            </div>
            </div>
        ))}
        </div>
                

      </div>
    </DashboardLayout>
  );
}