import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET() {

  const hash = await bcrypt.hash(
    "Admin123*",
    10
  );

  return NextResponse.json({
    hash
  });

}