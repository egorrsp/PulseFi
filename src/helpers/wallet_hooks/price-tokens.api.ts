export async function getTokenPriceInUSD(symbol: string): Promise<number> {
  try {
    const response = await fetch(`/api/token-price?symbol=${symbol}`);
    if (!response.ok) throw new Error("Failed to fetch price");

    const data = await response.json();
    return data.price as number;
  } catch (error) {
    console.error(error);
    throw error;
  }
}