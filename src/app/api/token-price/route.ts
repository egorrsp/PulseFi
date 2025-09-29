import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch external price");
    }

    const data = await res.json();
    const price = data[symbol.toLowerCase()]?.usd ?? null;

    if (!price) {
      return NextResponse.json({ error: "Price not found" }, { status: 404 });
    }

    return NextResponse.json({ price });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}