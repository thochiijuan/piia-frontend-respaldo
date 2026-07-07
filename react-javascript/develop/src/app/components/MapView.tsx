import GeoViewer from "./Geoviewer";

export default function MapView() {
  return (

    <div className="flex-1 relative rounded-[10px] overflow-hidden border border-slate-200">

      {/* MAPA */}
      <GeoViewer />

      {/* OVERLAY SUAVE - NO BLOQUEA EL MAPA */}
      <div className="absolute inset-0 bg-white/10 pointer-events-none" />

      {/* INFO ABAJO */}
      <div className="absolute bottom-4 left-4 right-4">

        <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-[10px] px-5 py-4 flex items-center justify-between">

          {/* IZQUIERDA */}
          <div>

            <p className="text-xs text-slate-500">
              Estado de Carga
            </p>

            <p className="text-sm text-slate-700">
              Sincronizado: Hace 2 minutos
            </p>

          </div>

          {/* DERECHA */}
          <div className="flex items-center gap-10 text-right">

            <div>

              <p className="text-xs text-slate-500">
                Alertas Activas
              </p>

              <p className="text-sm font-semibold text-slate-700">
                12
              </p>

            </div>

            <div>

              <p className="text-xs text-slate-500">
                Tendencia
              </p>

              <p className="text-sm font-semibold text-slate-700">
                +5.2%
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}