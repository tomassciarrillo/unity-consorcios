import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reservationService } from '../../services/reservationService';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Calendar, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function ResidentReservations() {
  const { user } = useAuth();
  const [commonAreas, setCommonAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [errorAreas, setErrorAreas] = useState(null);


  const [selectedArea, setSelectedArea] = useState(null);
  const [reservationDate, setReservationDate] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoadingAreas(true);
        const data = await reservationService.getCommonAreasByBuilding(user?.buildingId);
        setCommonAreas(data);
      } catch (err) {
        setErrorAreas('No se pudieron cargar los amenities del edificio.');
      } finally {
        setLoadingAreas(false);
      }
    };

    if (user?.buildingId) {
      fetchAreas();
    }
  }, [user?.buildingId]);

  const handleOpenReserve = (area) => {
    setSelectedArea(area);
    setReservationDate('');
    setMessage({ type: '', text: '' });
  };

  const handleCreateReservation = async (e) => {
    e.preventDefault();
    if (!reservationDate) return;

    try {
      setSubmitLoading(true);
      setMessage({ type: '', text: '' });

      await reservationService.createReservation({
        userId: Number(user?.userId),
        commonAreaId: Number(selectedArea.id),
        reservationDate: reservationDate
      });

      setMessage({
        type: 'success',
        text: `¡Excelente! Tu reserva para ${selectedArea.name} el día ${reservationDate} fue confirmada.`
      });
      
      setTimeout(() => {
        setSelectedArea(null);
        setReservationDate('');
      }, 3000);

    } catch (err) {
      if (err.response && err.response.status === 409) {
        setMessage({
          type: 'error',
          text: 'Lo sentimos, este amenity ya se encuentra reservado por otro residente para la fecha seleccionada.'
        });
      } else {
        setMessage({
          type: 'error',
          text: 'Hubo un inconveniente al procesar la reserva. Por favor, reintentá más tarde.'
        });
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-5">
          <h2 className="text-2xl font-bold text-slate-800">Reservas de Amenities</h2>
          <p className="text-slate-500 text-sm mt-1">
            Reservá los espacios comunes del consorcio para tus eventos de día completo de manera ágil.
          </p>
        </div>

        {loadingAreas ? (
          <div className="text-center py-12 text-slate-500 text-sm">Cargando espacios comunes...</div>
        ) : errorAreas ? (
          <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {errorAreas}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {commonAreas.map((area) => (
              <div 
                key={area.id} 
                className={`p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                  selectedArea?.id === area.id ? 'ring-2 ring-purple-600 border-transparent' : ''
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-xl text-purple-600 mb-4">
                    {area.name?.toUpperCase() === 'SUM' ? '🏢' : '🔥'}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{area.name}</h3>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    Disponible para uso exclusivo de residentes bajo reserva previa de jornada completa.
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleOpenReserve(area)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-purple-600 hover:text-white text-slate-700 font-semibold text-xs px-4 py-3 rounded-xl transition-all border border-slate-200 hover:border-transparent"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Seleccionar para Reservar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedArea && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mt-4 max-w-xl animate-fadeIn">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-base mb-4">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span>Programar reserva para: <span className="text-purple-600">{selectedArea.name}</span></span>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Elegí la Fecha
                </label>
                <input
                  type="date"
                  required
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors bg-white shadow-sm"
                />
              </div>

              {message.text && (
                <div className={`p-4 rounded-xl text-xs font-medium border flex items-start gap-2.5 ${
                  message.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                    : 'bg-orange-50 text-orange-800 border-orange-100'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedArea(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitLoading || !reservationDate || message.type === 'success'}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-colors"
                >
                  {submitLoading ? 'Procesando...' : 'Confirmar Día'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}