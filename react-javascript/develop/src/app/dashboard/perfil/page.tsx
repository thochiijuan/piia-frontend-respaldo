"use client";

import { useEffect, useState } from "react";

export default function PerfilPage() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    console.log(storedUser)
  }, []);

  return (

    <div className="h-full overflow-y-auto">

      {/* CONTENEDOR */}
      <div className="bg-[#f5f6fb] rounded-[12px] px-6 pt-2 pb-6">

        {/* GRID */}
        <div className="grid grid-cols-12 gap-8">

          {/* CARD IZQUIERDA */}
          <div className="col-span-4">

            <div className="bg-white rounded-[12px] border border-slate-200 p-8">

              {/* AVATAR */}
              <div className="flex justify-center">

                <div className="w-[170px] h-[120px] rounded-full bg-[#D9DDE3]">
                  <img src={user?.photo} />
                </div>
              </div>

              {/* INFO */}
              <div className="text-center mt-6">

                <h2 className="text-[20px] font-semibold text-[#2E6EA6]">
                  {user?.name || "Usuario"}
                </h2>

                <p className="text-slate-500 text-[18px] mt-1">
                  {user?.role_name || "Sin rol"}
                </p>

              </div>

              {/* BOTON */}
              <button className="w-full mt-6 bg-[#2E6EA6] hover:bg-[#255985] transition text-white rounded-[8px] py-3 text-[16px] font-medium">

                Cambiar Foto

              </button>

            </div>

          </div>

          {/* DERECHA */}
          <div className="col-span-8 flex flex-col gap-6">

            {/* INFORMACION */}
            <div className="bg-white rounded-[12px] border border-slate-200 p-8">

              <h3 className="text-[18px] font-semibold text-slate-800 mb-6">
                Información Personal
              </h3>

              {/* GRID INPUTS */}
              <div className="grid grid-cols-2 gap-6">

                {/* NOMBRE */}
                <div>

                  <label className="block text-sm text-slate-500 mb-2">
                    Nombre
                  </label>

                  <input
                    type="text"
                    value={user?.firstName || ""}
                    readOnly
                    disabled
                    className="w-full border border-slate-200 bg-slate-100 text-slate-500 rounded-[8px] px-4 py-3 cursor-not-allowed"
                  />

                </div>

                {/* APELLIDOS */}
                <div>

                  <label className="block text-sm text-slate-500 mb-2">
                    Apellidos
                  </label>

                  <input
                    type="text"
                    value={user?.lastName || ""}
                    readOnly
                    disabled
                    className="w-full border border-slate-200 bg-slate-100 text-slate-500 rounded-[8px] px-4 py-3 cursor-not-allowed"
                  />

                </div>

              </div>

              {/* EMAIL */}
              <div className="mt-6">

                <label className="block text-sm text-slate-500 mb-2">
                  Correo Electrónico
                </label>

                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  disabled
                  className="w-full border border-slate-200 bg-slate-100 text-slate-500 rounded-[8px] px-4 py-3 cursor-not-allowed"
                />

              </div>

            </div>

            {/* SEGURIDAD */}
            <div className="bg-white rounded-[12px] border border-slate-200 p-8">

              <h3 className="text-[18px] font-semibold text-slate-800 mb-8">
                Seguridad y Acceso
              </h3>

              {/* PASSWORD */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-200">

                <div>

                  <h4 className="text-[16px] font-medium text-slate-800">
                    Contraseña
                  </h4>

                  <p className="text-sm text-slate-500 mt-1">
                    Gestiona la seguridad de tu cuenta
                  </p>

                </div>

                <button className="bg-[#2E6EA6] hover:bg-[#255985] transition text-white rounded-[8px] px-8 py-3 text-sm font-medium">

                  Cambiar contraseña

                </button>

              </div>

              {/* 2FA */}
              <div className="flex items-center justify-between pt-6">

                <div>

                  <h4 className="text-[16px] font-medium text-slate-800">
                    Autenticación en dos pasos
                  </h4>

                  <p className="text-sm text-slate-500 mt-1">
                    Añade una capa extra de seguridad
                  </p>

                </div>

                {/* SWITCH */}
                <button className="w-[62px] h-[34px] bg-[#2E6EA6] rounded-full relative transition">

                  <span className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow-md" />

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}