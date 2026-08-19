import { Request, Response } from 'express';
import yahooFinance from 'yahoo-finance2';

// ─── Default Indices Mapping ─────────────────────────────────────────
const INDICES_MAP = [
  { symbol: '^NSEI', name: 'NIFTY' },
  { symbol: '^BSESN', name: 'SENSEX' },
  { symbol: '^NSEBANK', name: 'BANKNIFTY' },
  { symbol: 'NIFTYSMLCAP50.NS', name: 'MIDCPNIFTY' },
  { symbol: 'FINNIFTY.NS', name: 'FINNIFTY' },
];

// ─── Get Live Market Indices ─────────────────────────────────────────
export async function getMarketIndices(req: Request, res: Response): Promise<void> {
  try {
    const symbols = INDICES_MAP.map((item) => item.symbol);
    const quotes = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const q = await yahooFinance.quote(symbol);
          return q;
        } catch {
          return null;
        }
      })
    );

    const formatted = INDICES_MAP.map((idx, index) => {
      const q = quotes[index];
      if (!q) {
        return {
          symbol: idx.name,
          value: 'N/A',
          change: '0.00',
          changePercent: '0.00%',
          isPositive: true,
        };
      }

      const price = q.regularMarketPrice ?? q.postMarketPrice ?? 0;
      const change = q.regularMarketChange ?? 0;
      const changePercent = q.regularMarketChangePercent ?? 0;
      const isPositive = change >= 0;

      return {
        symbol: idx.name,
        rawSymbol: idx.symbol,
        value: price.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
        change: `${isPositive ? '+' : ''}${change.toFixed(2)}`,
        changePercent: `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`,
        isPositive,
      };
    });

    res.json({
      status: 'success',
      data: formatted,
    });
  } catch (error: any) {
    console.error('Yahoo Finance Indices Error:', error?.message || error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch market indices' });
  }
}

// ─── Get Live Quotes for Specific Symbols ─────────────────────────────
export async function getStockQuotes(req: Request, res: Response): Promise<void> {
  try {
    const rawSymbols = (req.query.symbols as string) || 'JINDALDRILL.NS,MOLBIO.NS,CUPID.NS,NETWEB.NS,BOSCHLTD.NS,TORNTPHARM.NS,TCS.NS,INFY.NS,RELIANCE.NS,HDFCBANK.NS';
    const symbolList = rawSymbols.split(',').map((s) => s.trim()).filter(Boolean);

    const quotes = await Promise.all(
      symbolList.map(async (sym) => {
        try {
          const q = await yahooFinance.quote(sym);
          const price = q.regularMarketPrice ?? 0;
          const change = q.regularMarketChange ?? 0;
          const changePercent = q.regularMarketChangePercent ?? 0;
          const isPositive = change >= 0;

          // Format clean display name without .NS
          const displayName = (q.shortName || q.longName || sym).replace('.NS', '').replace(' LIMITED', '');

          return {
            id: sym,
            symbol: sym.replace('.NS', ''),
            rawSymbol: sym,
            name: displayName,
            price: `${q.currency === 'INR' ? '₹' : '$'}${price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            rawPrice: price,
            change: `${isPositive ? '+' : ''}${change.toFixed(2)}`,
            changePercent: `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`,
            isPositive,
            volume: (q.regularMarketVolume ?? 0).toLocaleString('en-IN'),
            high: q.regularMarketDayHigh ?? 0,
            low: q.regularMarketDayLow ?? 0,
            fiftyTwoWeekHigh: q.fiftyTwoWeekHigh ?? 0,
            fiftyTwoWeekLow: q.fiftyTwoWeekLow ?? 0,
            currency: q.currency || 'INR',
          };
        } catch {
          return null;
        }
      })
    );

    const validQuotes = quotes.filter(Boolean);

    res.json({
      status: 'success',
      count: validQuotes.length,
      data: validQuotes,
    });
  } catch (error: any) {
    console.error('Yahoo Finance Quotes Error:', error?.message || error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch stock quotes' });
  }
}

// ─── Get Historical OHLCV Data ───────────────────────────────────────
export async function getStockHistory(req: Request, res: Response): Promise<void> {
  try {
    const symbol = (req.params.symbol || 'RELIANCE.NS').toUpperCase();
    const period = (req.query.period as string) || '1mo'; // 1d, 5d, 1mo, 6mo, 1y

    const today = new Date();
    let startDate = new Date();
    if (period === '1d') startDate.setDate(today.getDate() - 1);
    else if (period === '5d') startDate.setDate(today.getDate() - 5);
    else if (period === '1mo') startDate.setMonth(today.getMonth() - 1);
    else if (period === '6mo') startDate.setMonth(today.getMonth() - 6);
    else if (period === '1y') startDate.setFullYear(today.getFullYear() - 1);
    else startDate.setMonth(today.getMonth() - 1);

    const results = await yahooFinance.historical(symbol, {
      period1: startDate,
      period2: today,
      interval: period === '1d' ? '15m' : period === '5d' ? '1h' : '1d',
    });

    const formattedHistory = results.map((item) => ({
      date: item.date.toISOString(),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    res.json({
      status: 'success',
      symbol,
      count: formattedHistory.length,
      data: formattedHistory,
    });
  } catch (error: any) {
    console.error('Yahoo Finance Historical Error:', error?.message || error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch stock historical data' });
  }
}
