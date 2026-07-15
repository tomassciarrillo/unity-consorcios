import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { announcementService } from '../../services/announcementService';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Megaphone, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function AdminAnnouncements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAnnouncementsByBuilding(user?.buildingId);
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAnnouncements(sorted);
    } catch (err) {
      setError('No se pudieron cargar los anuncios anteriores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.buildingId) {
      fetchAnnouncements();
    }
  }, [user?.buildingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      setSuccessMessage('');


      await announcementService.createAnnouncement({
        title,
        content,
        buildingId: Number(user?.buildingId)
      });

      setSuccessMessage('¡Anuncio publicado en la cartelera digital con éxito!');
      setTitle('');
      setContent('');
      
      fetchAnnouncements();

      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError('Ocurrió un error al intentar publicar el anuncio.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-5">
          <h2 className="text-2xl font-bold text-slate-800">Cartelera de Anuncios</h2>
          <p className="text-slate-500 text-sm mt-1">
            Emití comunicados oficiales que verán todos los residentes en su panel de inicio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-slate-50 border border-slate-200 p-5 rounded-2xl h-fit">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-600" /> Nuevo Comunicado
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Título de la publicación</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Corte programado de agua"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mensaje o Detalles</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Escribí acá toda la información detallada para los vecinos..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white resize-none"
                ></textarea>
              </div>

              {successMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors shadow-sm"
              >
                {submitLoading ? 'Publicando...' : 'Lanzar Anuncio'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Historial de Comunicados</h3>
            
            {loading ? (
              <div className="text-slate-500 text-sm">Cargando historial...</div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                No se emitieron comunicados en este edificio todavía.
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h4 className="font-bold text-slate-800 text-base">{ann.title}</h4>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString('es-AR') : 'Reciente'}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{ann.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}