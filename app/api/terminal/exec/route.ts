import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { command } = await req.json();
  // For MVP, just echo the command
  let output = `You ran: ${command}`;
  // Later: run command in sandbox and return real output
  return NextResponse.json({ output });
}