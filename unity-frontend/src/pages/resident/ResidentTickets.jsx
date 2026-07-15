import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Wrench, Plus, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const STATUS_BADGES = {
  OPEN: { label: 'Abierto', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  IN_PROGRESS: { label: 'En Progreso', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  RESOLVED: { label: 'Resuelto', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
};

export default function ResidentTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicketsByBuilding(user?.buildingId);
      const miNombre = user?.fullName;
      const misTicketsPropios = data.filter(ticket => ticket.userName === miNombre);
      
      setTickets(misTicketsPropios);
    } catch (err) {
      setError('No se pudieron cargar tus reclamos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.buildingId) {
      fetchTickets();
    }
  }, [user?.buildingId]);

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ 
    ...prev, 
    [name]: value
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    try {
      setSubmitLoading(true);
      await ticketService.createTicket({
        userId: Number(user?.userId),
        title: formData.title,
        description: formData.description
      });
      setFormData({ title: '', description: '' });
      setIsModalOpen(false);
      fetchTickets();
    } catch (err) {
      alert('Hubo un error al crear el reclamo. Reintentá por favor.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Reclamos y Averías</h2>
            <p className="text-slate-500 text-sm mt-1">
              Reportá problemas edilicios o hacé el seguimiento de las reparaciones del consorcio.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Nuevo Reclamo
          </button>
        </div>
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Cargando reclamos...</div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-55/30">
            <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">No hay reclamos registrados en este edificio</p>
            <p className="text-slate-400 text-xs mt-1">¡Qué buena noticia! Todo parece marchar sobre ruedas.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tickets.map((ticket) => {
              const badge = STATUS_BADGES[ticket.status] || { label: ticket.status, color: 'bg-slate-50 text-slate-600' };
              return (
                <div key={ticket.id} className="p-5 border border-slate-200 bg-white rounded-xl shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-bold text-slate-800 text-base line-clamp-1">{ticket.title}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badge.color} whitespace-nowrap`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">{ticket.description}</p>
                  </div>
                    <div className="text-[11px] text-slate-400 border-t border-slate-50 pt-3 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> 
                    Creado el: {ticket.createdAt 
                        ? new Date(ticket.createdAt).toLocaleDateString('es-AR') 
                        : 'Sin fecha'}
                    </div>
                </div>
              );
            })}
          </div>
        )}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-950">Crear Nuevo Reclamo</h3>
                <p className="text-xs text-slate-500 mt-0.5">Detallá el problema para que la administración lo revise.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Título del problema</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ej: Filtración en el techo del SUM"
                    className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Descripción detallada</label>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Sé lo más específico posible (ubicación, gravedad, etc)..."
                    className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors bg-slate-50/50 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsModalOpen(false); setFormData({ title: '', description: '' }); }}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors"
                  >
                    {submitLoading ? 'Enviando...' : 'Enviar Reclamo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}