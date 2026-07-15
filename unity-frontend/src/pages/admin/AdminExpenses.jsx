import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { FilePlus2, DollarSign, Calendar, Landmark, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminExpenses() {
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const buildingId = user?.buildingId || 1; 

    try {
      await api.post(`/expenses/building/${buildingId}/generate`, {
        description,
        totalAmount: parseFloat(totalAmount)
      });

      setSuccess(true);
      setDescription('');
      setTotalAmount('');
    } catch (err) {
      console.error('Error al generar expensas:', err);
      setError('Hubo un problema al generar las expensas. Verifique las rutas o los permisos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Generar Expensas Mensuales</h2>
            <p className="text-sm text-slate-500">Cargá el gasto total del edificio para distribuirlo entre todas las unidades</p>
          </div>
        </div>

        {success && (
          <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> ¡Expensas liquidadas, divididas y publicadas con éxito!
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" /> Período / Descripción del Gasto
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Expensas Junio 2026 - Mantenimiento Gral."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all text-sm bg-slate-50/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-slate-400" /> Monto Total del Consorcio ($)
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="Ej: 450000"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all text-sm bg-slate-50/50"
            />
            <p className="text-xs text-slate-400 italic">Este valor global será fragmentado automáticamente según el coeficiente de cada unidad en tu backend.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-purple-100 disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Procesando cálculos en backend...
              </>
            ) : (
              <>
                <FilePlus2 className="w-5 h-5" /> Liquidar y Publicar Expensas
              </>
            )}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}