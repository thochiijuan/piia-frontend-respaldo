import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const result = await pool.query(
      `
      SELECT
          u.*,
          li.code as role_code,
          li.name as role_name
      FROM users u
      INNER JOIN list_items li
          ON li.id = u.role_id
      WHERE u.email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Usuario no encontrado" },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    return NextResponse.json({
    success: true,
    user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role_code,
        role_name: user.role_name,
    },
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Error interno" },
      { status: 500 }
    );
  }
}