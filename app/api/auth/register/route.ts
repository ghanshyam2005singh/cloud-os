import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../prisma/client";

export async function POST(req: Request) {
  const { username, password, email } = await req.json();

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) return NextResponse.json({ error: "Username taken" }, { status: 409 });

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { username, password: hashedPassword, email },
  });

  return NextResponse.json({ message: "User created" }, { status: 201 });
}