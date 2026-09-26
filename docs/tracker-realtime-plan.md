# Tracker — real chart and a live order book

Plan for making `/tracker` show real market data that updates on its own.
Companion to `backend-progress.md`.

## What the tracker shows today

| Panel | Today | Problem |
| --- | --- | --- |
| Chart | Hand-drawn SVG line over the seed's generated `relicto` series | Not a price history; no axes, no tooltip |
| Bid / Ask / 24H High / Volatility tiles | Hardcoded strings (`$3,140.00`, `$3,150.00`, …) | Never change |
| Order book | Seeded `order_book_levels` table | Fake levels and venues |
| Spread / depth footer | Hardcoded (`$10.00 (0.32%)`, `$34,891`) | Never change |
| Focus asset | Pinned to `butterfly-doppler` | Can't look at anything else |

## Where real data already exists

- **Asks** — every `active` listing of an item. Grouped by price, that is the
  sell side of a real order book.
- **Bids** — every live `pending` offer (Phase 7). Grouped by price, the buy side.
- **Price history** — the daily Skinport snapshot (`venue = 'skinport'`) and
  Relicto's settled sales (`pp-sale-*`), recorded since Phase 8.

So the order book needs no new data, only a live view of rows we already write.

## Transport: why not a WebSocket server

Relicto deploys to Vercel. Vercel Functions answer requests; they can't hold a
WebSocket server open. The order book only needs **server → browser** pushes,
which is exactly what **Server-Sent Events** (SSE) do, over plain HTTP:

| Option | Works on Vercel | Cost / effort | Verdict |
| --- | --- | --- | --- |
| **SSE from a Route Handler** | Yes (streaming responses) | None; built in | **Ship now** |
| Managed WebSocket (Ably, Pusher, Supabase Realtime) | Yes | New vendor + keys | Later, if we need browser → server messages |
| Own WebSocket server (Fly/Railway) | Separate service | Ops burden | Not needed |

`EventSource` reconnects on its own, so a function hitting its time limit just
reconnects. The client hook hides the transport behind `subscribe()`, so
swapping in a managed WebSocket later touches one file.

## How changes reach the stream

Postgres `LISTEN` / `NOTIFY`, fired by triggers — so every write path (checkout,
list, delist, offers, escrow cancel/deliver, the price feed) notifies without
each remembering to:

```
listings / offers / price_points ──trigger──▶ pg_notify('market', item_id)
                                                  │
              one LISTEN connection per server instance (direct, unpooled URL)
                                                  │
        /api/tracker/stream?item=<slug>  ◀── fan-out by item id (in memory)
                                                  │
                         text/event-stream: { book, last } snapshots
```

- `LISTEN` needs a session connection, so the listener uses
  `DATABASE_URL_UNPOOLED` (Neon's pooler runs in transaction mode).
- Bursts are debounced (250 ms) so a checkout touching many rows sends one
  snapshot.
- A 20 s heartbeat comment keeps proxies from closing idle streams.
- If `LISTEN` can't connect, the stream falls back to polling every 5 s.

## Steps

1. **Migration `0021_market_notify`** — `relicto_notify_market()` and triggers on
   `listings`, `offers` (resolving the item through the listing) and `price_points`.
2. **Real book** — `tracker.book.ts`: asks grouped from active listings, bids from
   live offers, best bid/ask, spread, depth. Replaces `order_book_levels` for the
   desktop and mobile books alike.
3. **Real chart + stats** — reuse the item page's series (Skinport daily + sales),
   drawn with the shadcn `ChartContainer`/Recharts; tiles computed: best bid, best
   ask, 30-day high, volatility (std-dev of daily returns).
4. **Focus asset** — `?asset=<slug>`; clicking a ticker/board item focuses it.
5. **Listener hub** — `src/server/realtime/market-listener.ts`: one `pg` client per
   instance, `subscribe(itemId, fn)`, auto-reconnect.
6. **Stream route** — `GET /api/tracker/stream?item=<slug>`: signed-in only,
   first snapshot immediately, then on notify; heartbeat; closes on abort.
7. **Client** — `useLiveBook(slug, initial)` (EventSource), a "LIVE · updated Ns
   ago" badge, flash on changed levels. Split `tracker-view.tsx` into
   `price-terminal.tsx`, `tracker-chart.tsx`, `order-book.tsx`.
8. **Verify** — script: place a bid / list a copy / buy it and watch the stream
   deliver each snapshot; browser check of both panels.

## Not in this pass

- Candles: the history is one observation a day, so there is no intraday OHLC.
- Cross-venue depth (Steam, Buff): no data source yet.
- Spreads table and board stay as they are.
