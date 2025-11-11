import dictionary from "../lists/traslate_name_fore_coingecko";

export async function getTokenPriceInUSD(symbol: string): Promise<number> {
  try {
    const mappedSymbol = dictionary[symbol] ?? symbol.toLowerCase();

    const response = await fetch(`/api/token-price?symbol=${mappedSymbol}`);
    if (!response.ok) throw new Error("Failed to fetch price");
    const data = await response.json();
    return data.price as number;
  } catch (error) {
    console.error(error);
    throw error;
  }
}