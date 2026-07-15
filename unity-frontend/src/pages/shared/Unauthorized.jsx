export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 text-center p-4">
      <div>
        <h1 className="text-4xl font-bold text-red-600 mb-2">403 - Acceso Denegado</h1>
        <p className="text-slate-600">No tienes permisos para ver esta sección.</p>
      </div>
    </div>
  );
}