"use client";

import { useEffect, useState } from "react";

export default function UsuariosPage() {
const [users, setUsers] = useState<any[]>([]);

useEffect(() => {

  const fetchUsers = async () => {

    try {

      const response = await fetch("/api/users");

      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      }

    } catch (error) {

      console.error(error);

    }

  };

  fetchUsers();

}, []);

  return (

    <div className="flex flex-col gap-4 h-full">

      {/* HEADER */}
      <div className="bg-white rounded-[10px] border border-slate-200 p-6">

        <div className="flex items-center justify-between mb-6">

          

            <button className="text-sm text-blue-500 mb-3">
              ← Volver al perfil
            </button>

        

          <button className="bg-[#3B82F6] hover:bg-[#2563EB] transition text-white px-5 py-3 rounded-[8px] text-sm font-medium">
            + Crear Nuevo Usuario
          </button>

        </div>

        {/* FILTROS */}
        <div className="grid grid-cols-[1fr_160px_160px_120px] gap-4">

          <input
            type="text"
            placeholder="Buscar por nombre, correo electrónico o cargo..."
            className="h-[46px] border border-slate-200 rounded-[8px] px-4 outline-none"
          />

          <select className="h-[46px] border border-slate-200 rounded-[8px] px-3 bg-white">

            <option>Todos</option>

          </select>

          <select className="h-[46px] border border-slate-200 rounded-[8px] px-3 bg-white">

            <option>Activo</option>

          </select>

          <button className="bg-[#E0EDFF] text-[#2563EB] rounded-[8px] font-medium">
            Filtrar
          </button>

        </div>

      </div>

      {/* TABLA */}
      <div className="flex-1 bg-white rounded-[10px] border border-slate-200 overflow-hidden">

        {/* HEADERS */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_140px] px-6 py-4 border-b border-slate-200 text-sm font-semibold text-slate-500">

          <div>Usuario</div>
          <div>Rol</div>
          <div>Permisos</div>
          <div>Última actividad</div>
          <div>Estado</div>
          <div>Acciones</div>

        </div>

        {/* FILAS */}
        <div className="divide-y divide-slate-100">

          {
            users.map((user) => (

              <div
                key={user.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_140px] items-center px-6 py-5"
              >

                {/* USUARIO */}
                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-[10px] bg-slate-100"></div>

                  <div>

                    <p className="font-medium text-slate-800">
                      {user.first_name} {user.last_name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {user.email}
                    </p>

                  </div>

                </div>

                {/* ROL */}
                <div className="text-slate-700">
                  {user.role_name}
                </div>

                {/* PERMISOS */}
                <div className="flex gap-2">

                  <span className="px-3 py-1 bg-slate-100 rounded-full text-xs">
                    Analytics
                  </span>

                  <span className="px-3 py-1 bg-slate-100 rounded-full text-xs">
                    Geo
                  </span>

                </div>

                {/* ACTIVIDAD */}
                <div className="text-slate-500 text-sm">
                  Hace 10 min
                </div>

                {/* ESTADO */}
                <div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.is_active ? "Activo" : "Inactivo"}
                  </span>

                </div>

                {/* ACCIONES */}
                <div>

                  <button className="px-4 py-2 bg-[#E0EDFF] text-[#2563EB] rounded-[8px] text-sm">
                    Acciones
                  </button>

                </div>

              </div>

            ))
          }

        </div>

      </div>

      {/* FOOTER TABLA */}
      <div className="flex items-center justify-between px-2">

        <p className="text-sm text-slate-500">
          Mostrando {users.length} usuario(s)
        </p>

        <div className="flex gap-3">

          <button className="px-4 py-2 bg-white border border-slate-200 rounded-[8px] text-sm">
            Previous
          </button>

          <button className="px-4 py-2 bg-[#E0EDFF] text-[#2563EB] rounded-[8px] text-sm">
            Next
          </button>

        </div>

      </div>

    </div>

  );

}