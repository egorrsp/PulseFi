export async function getTokenPriceInUSD(symbol: string): Promise<number> {
  try {
    const response = await fetch(
      `https://price.jup.ag/v4/price?ids=${symbol}&vsToken=USDC`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch price for ${symbol}`);
    }

    const data = await response.json();
    return data.data[symbol].price as number;
  } catch (error) {
    console.error(error);
    throw error;
  }
}