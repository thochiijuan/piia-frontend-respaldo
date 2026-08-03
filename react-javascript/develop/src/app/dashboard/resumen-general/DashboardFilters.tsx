export default function DashboardFilters() {

    return (

        <div className="flex gap-4 flex-wrap">

            <select className="border rounded-lg px-4 py-3 bg-white shadow-sm">

                <option>Año</option>

            </select>

            <select className="border rounded-lg px-4 py-3 bg-white shadow-sm">

                <option>Semana</option>

            </select>

            <select className="border rounded-lg px-4 py-3 bg-white shadow-sm">

                <option>Dirección Territorial</option>

            </select>

        </div>

    );

}