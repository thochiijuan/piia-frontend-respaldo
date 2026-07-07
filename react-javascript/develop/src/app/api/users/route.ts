import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {

    const result = await pool.query(`
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.is_active,
        u.last_login,
        li.code AS role_code,
        li.name AS role_name
      FROM users u
      INNER JOIN list_items li
        ON li.id = u.role_id
      ORDER BY u.id
    `);

    return NextResponse.json({
      success: true,
      users: result.rows
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Error obteniendo usuarios"
      },
      {
        status: 500
      }
    );

  }
}