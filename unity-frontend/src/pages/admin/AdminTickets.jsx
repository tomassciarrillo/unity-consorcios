import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Wrench, AlertCircle, Clock, CheckCircle2, RefreshCw } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Abierto', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { value: 'IN_PROGRESS', label: 'En Progreso', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'RESOLVED', label: 'Resuelto', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
];

export default function AdminTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicketsByBuilding(user?.buildingId);
      setTickets(data);
    } catch (err) {
      setError('No se pudieron recuperar los reclamos del edificio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.buildingId) {
      fetchTickets();
    }
  }, [user?.buildingId]);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      setUpdatingId(ticketId);
      await ticketService.updateTicketStatus(ticketId, newStatus);
      
      setTickets(prevTickets =>
        prevTickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t)
      );
    } catch (err) {
      alert('No se pudo actualizar el estado del reclamo. Reintentá por favor.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Control de Reclamos</h2>
            <p className="text-slate-500 text-sm mt-1">
              Hacé el seguimiento de los incidentes reportados por los vecinos y gestioná su estado.
            </p>
          </div>
          <button 
            onClick={fetchTickets}
            className="p-2 text-slate-500 hover:text-purple-600 rounded-xl hover:bg-slate-50 transition-colors"
            title="Recargar reclamos"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Cargando reclamos del consorcio...</div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-white">
            <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Sin reclamos activos</p>
            <p className="text-slate-400 text-xs mt-1">El edificio no registra problemas reportados por el momento.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-4 px-6">Fecha / Asunto</th>
                    <th className="py-4 px-6">Residente</th>
                    <th className="py-4 px-6">Descripción</th>
                    <th className="py-4 px-6 text-center">Estado del Reclamo</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {tickets.map((ticket) => {
                    const fechaFormateada = ticket.createdAt 
                        ? new Date(ticket.createdAt).toLocaleDateString('es-AR') 
                        : 'Sin fecha';

                    return (
                        <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-slate-900 max-w-[200px]">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-normal mb-0.5">
                            <Clock className="w-3 h-3" /> {fechaFormateada}
                            </div>
                            <span className="block font-semibold text-slate-800 line-clamp-1" title={ticket.title}>
                            {ticket.title}
                            </span>
                        </td>                  
                        <td className="py-4 px-6">
                            <span className="block font-medium text-slate-800 text-xs">{ticket.userName || 'Desconocido'}</span>
                            <span className="block text-[11px] text-purple-600 font-semibold mt-0.5">
                            🏢 Unidad: {ticket.apartment || 'N/A'}
                            </span>
                        </td>
                        <td className="py-4 px-6 text-slate-600 max-w-xs">
                            <p className="line-clamp-2 text-xs leading-relaxed" title={ticket.description}>
                            {ticket.description}
                            </p>
                        </td>
                        <td className="py-4 px-6">
                            <div className="flex items-center justify-center">
                            {updatingId === ticket.id ? (
                                <span className="text-xs text-slate-400 animate-pulse">Actualizando...</span>
                            ) : (
                                <select
                                value={ticket.status}
                                onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer ${
                                    STATUS_OPTIONS.find(o => o.value === ticket.status)?.color || 'bg-slate-50'
                                }`}
                                >
                                {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value} className="bg-white text-slate-800 font-normal">
                                    {opt.label}
                                    </option>
                                ))}
                                </select>
                            )}
                            </div>
                        </td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}