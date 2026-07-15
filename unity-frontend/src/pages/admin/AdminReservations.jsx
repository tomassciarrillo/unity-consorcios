import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reservationService } from '../../services/reservationService';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Calendar, AlertCircle, RefreshCw, User, Home } from 'lucide-react';

export default function AdminReservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reservationService.getReservationsByBuilding(user?.buildingId);
      
      const sortedData = data.sort((a, b) => new Date(a.reservationDate) - new Date(b.reservationDate));
      setReservations(sortedData);
    } catch (err) {
      setError('No se pudo cargar la agenda de reservas del edificio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.buildingId) {
      fetchReservations();
    }
  }, [user?.buildingId]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Agenda de Reservas</h2>
            <p className="text-slate-500 text-sm mt-1">
              Visualizá el uso de los amenities y espacios comunes del consorcio programados por los vecinos.
            </p>
          </div>
          <button 
            onClick={fetchReservations}
            className="p-2 text-slate-500 hover:text-purple-600 rounded-xl hover:bg-slate-50 transition-colors"
            title="Recargar agenda"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Cargando cronograma...</div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-white">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">No hay reservas registradas</p>
            <p className="text-slate-400 text-xs mt-1">Los residentes aún no han reservado amenities para las próximas fechas.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reservations.map((res) => {
              const fechaFormateada = res.reservationDate 
                ? new Date(res.reservationDate + 'T00:00:00').toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })
                : 'Sin fecha';
              const isSUM = res.commonAreaName?.toUpperCase().includes('SUM');
              const isPileta = res.commonAreaName?.toUpperCase().includes('PILETA') || res.commonAreaName?.toUpperCase().includes('PISCINA');
              const emoji = isSUM ? '🏢' : isPileta ? '🏊‍♂️' : '🔥';

              return (
                <div key={res.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-lg mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{fechaFormateada}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
                      <span>{emoji}</span> {res.commonAreaName || 'Amenity'}
                    </h3>

                    <div className="space-y-2 border-t border-slate-50 pt-3">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-700">{res.userName || 'Residente'}</span>
                      </div>
                      {res.apartment && (
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Home className="w-3.5 h-3.5 text-slate-400" />
                          <span>Unidad: <span className="font-semibold text-purple-600">{res.apartment}</span></span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 mt-4 pt-2 border-t border-slate-50 text-right">
                    ID Reserva: #{res.id}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}