import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api'; // 👈 Volvemos a usar tu api.js original
import { Users, UserCheck, Loader2, AlertCircle, CheckCircle2, Home, Mail } from 'lucide-react';

export default function AdminUsersApproval() {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); 
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // 1. Intentamos leer buildingId del usuario del contexto, y si no, directo del localStorage
    // según cómo guarde tu Auth de React los datos del login de Vir.
    const bId = user?.buildingId || localStorage.getItem('buildingId') || 1;

    // 2. Disparamos la petición usando tu axios configurado
    api.get(`/users/pending/building/${bId}`)
      .then(response => {
        setPendingUsers(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error en la petición de pendientes:", err);
        setError('No se pudo conectar con el servidor.');
        setLoading(false);
      });
  }, []); // 👈 CAMBIADO: Array vacío para que se ejecute SÍ O SÍ inmediatamente al montar el componente

  const handleApprove = (userId) => {
    setActionLoading(userId);
    setError('');
    setSuccessMessage('');

    // 🗺️ PUT /api/users/approve/{userId}
    api.put(`/users/approve/${userId}`)
      .then(() => {
        setSuccessMessage('Vecino aprobado con éxito. Su estado ahora es ACTIVE.');
        // Filtramos de la lista al usuario aprobado para que desaparezca visualmente
        setPendingUsers(prev => prev.filter(u => (u.userId !== userId && u.id !== userId)));
      })
      .catch(err => {
        console.error("Error al aprobar:", err);
        setError('Ocurrió un error al intentar aprobar al residente.');
      })
      .finally(() => {
        setActionLoading(null);
      });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Encabezado */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Aprobación de Vecinos</h2>
            <p className="text-sm text-slate-500">Autorizá el ingreso de los nuevos residentes a tu edificio</p>
          </div>
        </div>

        {/* Alertas */}
        {successMessage && (
          <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> {successMessage}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
          </div>
        )}

        {/* Estados de Carga / Vacío */}
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" /> Consultando solicitudes pendientes...
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 text-slate-500">
            <p className="font-medium text-sm">No hay solicitudes de registro pendientes.</p>
            <p className="text-xs text-slate-400 mt-1">¡El consorcio está completamente al día!</p>
          </div>
        ) : (
          /* Render de la lista oficial */
          <div className="grid gap-4">
            {pendingUsers.map((u) => {
              const currentId = u.userId || u.id;
              return (
                <div key={currentId} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-purple-100 transition-all">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{u.fullName || 'Nuevo Residente'}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><Mail className="w-4 h-4 text-slate-400" /> {u.email}</span>
                      <span className="flex items-center gap-1"><Home className="w-4 h-4 text-slate-400" /> Piso: {u.floor} - Depto: {u.apartmentNumber}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleApprove(currentId)}
                    disabled={actionLoading !== null}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl cursor-pointer disabled:opacity-50 transition-all shadow-sm flex items-center gap-2"
                  >
                    {actionLoading === currentId && <Loader2 className="w-4 h-4 animate-spin" />}
                    {actionLoading === currentId ? 'Aprobando...' : 'Aprobar Vecino'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}