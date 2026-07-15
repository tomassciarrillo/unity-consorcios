import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Receipt, CreditCard, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function ResidentExpenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payingId, setPayingId] = useState(null);

  const fetchExpenses = async () => {
    try {
      const response = await api.get(`/expenses/unit/${user.unitId}`);
      setExpenses(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al obtener el historial de expensas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.unitId) fetchExpenses();
  }, [user]);

  const handlePay = async (expenseId) => {
    setPayingId(expenseId);
    try {
      await api.put(`/expenses/pay/${expenseId}`);
      setExpenses(expenses.map(exp => exp.id === expenseId ? { ...exp, status: 'PAID' } : exp));
    } catch (err) {
      console.error(err);
      alert('No se pudo procesar el pago. Intente nuevamente.');
    } finally {
      setPayingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Mis Expensas</h2>
            <p className="text-sm text-slate-500">Historial de pagos y liquidaciones de tu unidad</p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" /> Cargando expensas...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 text-sm rounded-xl">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {!loading && expenses.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-sm">No tenés expensas registradas ni pendientes en este período.</p>
          </div>
        )}

        <div className="space-y-4">
          {expenses.map((exp) => (
            <div key={exp.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-slate-200 rounded-xl gap-4 shadow-sm">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Período correspondiente</span>
                <h3 className="text-lg font-bold text-slate-800">{exp.description}</h3>
                <p className="text-xl font-bold text-600 tracking-tight flex items-baseline gap-0.5">
                    <span className="text-sm font-medium text-400">$</span>
                    <span>{(exp.amount || exp.totalAmount)?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                </p>
              </div>

              <div>
                {exp.status === 'PAID' ? (
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-semibold border border-green-100">
                    <CheckCircle2 className="w-4 h-4" /> Pagado
                  </div>
                ) : (
                  <button
                    onClick={() => handlePay(exp.id)}
                    disabled={payingId !== null}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-100 disabled:opacity-50 cursor-pointer"
                  >
                    {payingId === exp.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" /> Pagar Expensa
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}