import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { Users, DollarSign, Wrench, Building } from 'lucide-react';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './layouts/DashboardLayout';
import ResidentExpenses from './pages/resident/ResidentExpenses';
import ResidentDashboard from './pages/resident/ResidentDashboard';
import ResidentTickets from './pages/resident/ResidentTickets';
import ResidentReservations from './pages/resident/ResidentReservations';
import AdminExpenses from './pages/admin/AdminExpenses';
import AdminUsersApproval from './pages/admin/AdminUsersApproval';
import AdminTickets from './pages/admin/AdminTickets';
import AdminReservations from './pages/admin/AdminReservations';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';


//temporales:
import WaitingRoom from './pages/shared/WaitingRoom';
import Unauthorized from './pages/shared/Unauthorized';

//const LoginDummy = () => <div className="p-8">🔑 Vista de Login (Paso 3)</div>;
//const RegisterDummy = () => <div className="p-8">📝 Vista de Registro (Paso 3)</div>;

//const ResidentTickets = () => <DashboardLayout><h2 className="text-2xl font-bold">🛠️ Sección Reclamos (Próximamente)</h2></DashboardLayout>;
//const ResidentReservations = () => <DashboardLayout><h2 className="text-2xl font-bold">📅 Sección Reservas SUM (Próximamente)</h2></DashboardLayout>;

/**
const ResidentDashboard = () => (
  <DashboardLayout>
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-slate-800">Cartelera Digital</h2>
      <p className="text-slate-600">Próximamente los anuncios del edificio conectados a tu API...</p>
    </div>
  </DashboardLayout>
);
*/

const AdminDashboard = () => {
  const { user } = useAuth();
  const nombreEdificio = user?.buildingName || "Consorcio Central";
  const direccionEdificio = user?.buildingAddress || "Av. del Libertador 1420";

  return (
    <DashboardLayout>
      <div className="space-y-6">
      
        <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Panel de Administración</h2>
            <p className="text-slate-500 text-sm mt-1">
              Bienvenido al centro de control. Desde aquí podés coordinar los residentes, finanzas y mantenimiento.
            </p>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:text-right min-w-[200px]">
            <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider flex items-center sm:justify-end gap-1">
              🏢 Edificio Activo
            </p>
            <p className="text-sm font-bold text-slate-800 mt-1">{nombreEdificio}</p>
            <p className="text-xs text-slate-450 mt-0.5">{direccionEdificio}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mt-2">
          
          <div className="p-4 border border-slate-200 bg-white rounded-xl shadow-sm flex flex-col justify-between hover:border-purple-100 transition-all">
            <div>
              <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                👤 Gestión de Residentes
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Revisá y aprobá las solicitudes de nuevos vecinos que ingresaron con el código de acceso para darles de alta en el sistema.
              </p>
            </div>
          </div>

          <div className="p-4 border border-slate-200 bg-white rounded-xl shadow-sm flex flex-col justify-between hover:border-purple-100 transition-all">
            <div>
              <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                💰 Control de Expensas
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Cargá los gastos comunes del mes, generá las liquidaciones de cada unidad y realizá el seguimiento de los pagos.
              </p>
            </div>
          </div>

          <div className="p-4 border border-slate-200 bg-white rounded-xl shadow-sm flex flex-col justify-between hover:border-purple-100 transition-all">
            <div>
              <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                🛠️ Reclamos del Edificio
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Centralizá las solicitudes de reparaciones y problemas edilicios reportados por los vecinos para coordinar con los técnicos.
              </p>
            </div>
          </div>

        </div>

        <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-700 leading-relaxed">
          <strong>📌 Nota de administración:</strong> Recordá verificar regularmente la sección de <em>Residentes Pendientes</em> para asegurar que los nuevos inquilinos o propietarios tengan acceso inmediato a la plataforma.
        </div>

      </div>
    </DashboardLayout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />


          <Route path="/waiting-room" element={<WaitingRoom />} />


          <Route element={<ProtectedRoute allowedRoles={['RESIDENT']} />}>
            <Route path="/resident/dashboard" element={<ResidentDashboard />} />
            <Route path="/resident/expenses" element={<ResidentExpenses />} />
            <Route path="/resident/tickets" element={<ResidentTickets />} />
            <Route path="/resident/reservations" element={<ResidentReservations />} />
          </Route>


          <Route element={<ProtectedRoute allowedRoles={['BUILDING_ADMIN', 'SUPER_ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/expenses" element={<AdminExpenses />} />
            <Route path="/admin/users-approval" element={<AdminUsersApproval />} />
            <Route path="/admin/tickets" element={<AdminTickets />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
