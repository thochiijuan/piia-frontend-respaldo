import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {

    const result = await pool.query(
      "SELECT NOW() AS server_time"
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json({
      success: false,
      error,
    });

  }
}
