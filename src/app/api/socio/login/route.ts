import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const code = String(formData.get("code") || "").trim();
  const expectedCode = (process.env.SOCIO_ACCESS_CODE || "").trim();

  if (!expectedCode) {
    return NextResponse.redirect(new URL("/socio?error=1", request.url));
  }

  if (code !== expectedCode) {
    return NextResponse.redirect(new URL("/socio?error=1", request.url));
  }

  const response = NextResponse.redirect(new URL("/socio", request.url));
  response.cookies.set("socio_access", "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
