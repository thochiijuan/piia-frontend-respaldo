/**
 * ============================================================================
 * SummaryCard
 * ----------------------------------------------------------------------------
 * Componente de presentación reutilizable utilizado para mostrar un indicador
 * del Dashboard.
 *
 * Responsabilidades:
 * - Mostrar el título del indicador.
 * - Mostrar el valor principal.
 * - Mostrar una breve descripción.
 * - Aplicar el color representativo del indicador.
 *
 * Este componente NO conoce el origen de los datos.
 * Únicamente renderiza la información recibida mediante propiedades (Props).
 *
 * Puede reutilizarse en cualquier otro módulo del sistema.
 * ============================================================================
 */

/**
 * Propiedades requeridas para construir una tarjeta de resumen.
 */
interface Props {

    /** Nombre del indicador */
    title: string;

    /** Valor principal mostrado en la tarjeta */
    value: string | number;

    /** Descripción complementaria */
    description: string;

    /** Color representativo del indicador */
    color: string;

}

/**
 * Renderiza una tarjeta de indicador.
 */
export default function SummaryCard({

    title,

    value,

    description,

    color,

}: Props) {

    return (

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 transition hover:shadow-md">

            <div className="flex justify-between items-center">

                <h3 className="text-lg font-semibold text-slate-800">

                    {title}

                </h3>

                {/* Indicador visual del color asociado al indicador */}
                <div
                    className="w-3 h-3 rounded-full"
                    style={{
                        background: color,
                    }}
                />

            </div>

            <h2
                className="text-5xl font-bold mt-5"
                style={{
                    color,
                }}
            >
                {value}
            </h2>

            <p className="text-sm text-slate-400 mt-5">

                {description}

            </p>

        </div>

    );

}