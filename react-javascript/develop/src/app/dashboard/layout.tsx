import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#f5f6fb] overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENIDO */}
      <div className="flex flex-col flex-1 px-4 pb-4 pt-2 gap-2">

        {/* HEADER */}
        <Header />

        {/* MAIN */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>

        {/* FOOTER */}
        <Footer />

      </div>
    </div>
  );
}