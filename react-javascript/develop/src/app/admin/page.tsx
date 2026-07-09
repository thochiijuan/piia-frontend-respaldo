import Link from "next/link";

import Image from "next/image";
import FilterPanel from "../components/FilterPanel";
import MapView from "../components/MapView";

export default function HomePage() {
  return (

    <main className="w-full h-screen flex overflow-hidden bg-[#f5f6fb]">

      {/* SIDEBAR */}
      <aside className="w-[220px] bg-[#2E6EA6] text-white flex flex-col">

        {/* LOGO */}
        <div className="flex flex-col items-center pt-6 pb-6 border-b border-white/10">

          <img
            src="/logo_omica.png"
            alt="Logo OMICAS"
            className="w-28 h-auto object-contain"
          />

        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 py-6">

          <button className="w-full bg-[#4F46E5] hover:bg-[#4338CA] transition rounded-[8px] px-4 py-3 flex items-center gap-3 text-sm">

          <Image
            src="https://s3.dorito-develop.com/corporate-brand-assets/public/iconos/Inicio.png"
            alt="Inicio"
            width={20}
            height={20}
          />

          <span>Inicio</span>

        </button>

        </nav>

      </aside>

      {/* CONTENIDO */}
      <section className="flex-1 flex flex-col h-screen bg-[#f5f6fb]">

        {/* HEADER */}
        <header className="bg-white border border-slate-200 rounded-[10px] mx-4 mt-4 px-6 py-5 flex items-start justify-between">

          {/* TITULO */}
          <div>

            <h1 className="text-[20px] font-semibold text-slate-800">
              Inicio y Geovisor epidemiológico
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Análisis de la distribución de casos de dengue e IRA en general.
            </p>

          </div>

          {/* BOTONES */}
          <div className="flex items-center gap-4">

            <Link
              href="/login"
              className="text-sm text-slate-600 hover:text-slate-900 transition"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="bg-[#2E6EA6] hover:bg-[#255985] transition text-white px-5 py-2 rounded-[8px] text-sm"
            >
              Sign up
            </Link>

          </div>

        </header>

        {/* MAIN */}
        <div className="flex flex-1 overflow-hidden px-4 pb-4 pt-4 gap-4">

          {/* FILTROS */}
          <FilterPanel isAuthenticated={true} />

          {/* MAPA */}
          <MapView />

        </div>

      </section>

    </main>

  );
}