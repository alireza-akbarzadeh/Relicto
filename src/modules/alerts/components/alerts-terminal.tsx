export function ExecutionTerminal() {
  return (
    <section className="rounded-xl bg-surface-card p-space-md shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm text-text-primary">
          Autonomous Execution Terminal
        </h2>
        <span className="font-label-badge text-[10px] text-status-live">
          STREAMING
        </span>
      </div>
      <div className="mt-3 rounded bg-surface-container-lowest p-3 font-data-mono-md text-[11px] leading-relaxed text-text-secondary">
        <p>
          <b className="text-tertiary">[14:02:18]</b> WEBSOCKET_P2P: New listing
          detected: ★ Butterfly Knife | Doppler P4 at $3,075.00 USD.
        </p>
        <p>
          <b className="text-tertiary">[14:02:19]</b> AUTO_BOT_04: Initiated
          escrow lock via Steam API session token.
        </p>
        <p>
          <b className="text-tertiary">[14:02:21]</b> EXECUTION_SUCCESS: Order
          complete. Net Captured Yield: +$145.00 USD.
        </p>
        <p>
          <b className="text-tertiary">[14:03:04]</b> MEMPOOL_POLL: CS2 protobuf
          buffer synchronized.
        </p>
      </div>
    </section>
  );
}

export function Performance() {
  return (
    <section className="rounded-xl bg-surface-card p-space-md shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm text-text-primary">
          Algorithmic Performance
        </h2>
        <span className="font-data-mono-md text-primary">+14.2% ROI</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          ["30D Captured Profit", "$4,892.40"],
          ["Escrow Handshake", "240ms"],
          ["Execution Success", "96.8%"],
          ["Max Monitored Vault", "$64,800"],
        ].map(([label, value]) => (
          <div key={label} className="rounded bg-surface-container-lowest p-3">
            <span className="block font-label-badge text-[10px] text-text-muted uppercase">
              {label}
            </span>
            <b className="font-data-mono-lg text-data-mono-lg text-tertiary">
              {value}
            </b>
          </div>
        ))}
      </div>
      <div className="mt-3 font-label-badge text-[10px] text-text-muted uppercase">
        Notification paths:{" "}
        <span className="text-status-upcoming">Discord</span> · Telegram · Web
        Push · Twilio SMS
      </div>
    </section>
  );
}
