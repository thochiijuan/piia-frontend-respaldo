export default function Footer() {
  return (
    <footer className="h-[42px] bg-[#f5f8fd] border border-slate-200 rounded-[8px] flex items-center justify-between px-6 text-xs text-slate-500 shrink-0 mx-4 mb-4">

      <div>
        © 2026 Portal de Gestión PIIA. Todos los derechos reservados.
      </div>

      <div className="flex items-center gap-8">

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-300"></span>

          <span>
            Servidor Central:
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-300"></span>

          <span>
            v4.2.0-
          </span>
        </div>

      </div>
    </footer>
  );
}