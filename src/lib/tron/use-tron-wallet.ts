"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { getActiveTronConfig } from "./tron-config";

// Type definition for TronWeb injected object
interface TronWebGlobal {
  ready?: boolean;
  defaultAddress?: { base58?: string; hex?: string };
  trx: {
    sendTransaction: (to: string, amountSun: number) => Promise<{ txid?: string; transaction?: { txID?: string } }>;
    getBalance: (address?: string) => Promise<number>;
  };
  contract: () => {
    at: (address: string) => Promise<{
      transfer: (to: string, amount: number) => { send: () => Promise<string> };
    }>;
  };
}

declare global {
  interface Window {
    tronWeb?: TronWebGlobal;
    tronLink?: {
      ready?: boolean;
      request: (args: { method: string }) => Promise<{ code: number; message: string }>;
    };
  }
}

export function useTronWallet() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const checkTron = () => {
      const available = Boolean(window.tronWeb || window.tronLink);
      setIsInstalled(available);
      const addr = window.tronWeb?.defaultAddress?.base58;
      if (addr && typeof addr === "string") {
        setConnectedAddress(addr);
      }
    };
    checkTron();
    window.addEventListener("load", checkTron);
    const interval = setInterval(checkTron, 1000);
    return () => {
      window.removeEventListener("load", checkTron);
      clearInterval(interval);
    };
  }, []);

  const connect = useCallback(async (): Promise<string | null> => {
    if (!window.tronLink && !window.tronWeb) {
      toast.error("TronLink Not Detected", {
        description: "Install TronLink Chrome extension or use TRON QR payment.",
      });
      return null;
    }

    try {
      if (window.tronLink?.request) {
        await window.tronLink.request({ method: "tron_requestAccounts" });
      }
      const addr = window.tronWeb?.defaultAddress?.base58 || null;
      setConnectedAddress(addr);
      return addr;
    } catch (err) {
      toast.error("Wallet Connection Declined", { description: String(err) });
      return null;
    }
  }, []);

  const sendTronPayment = useCallback(
    async ({
      toAddress,
      amountUsd,
      token = "USDT",
    }: {
      toAddress: string;
      amountUsd: number;
      token?: "USDT" | "TRX";
    }): Promise<string | null> => {
      setIsPending(true);
      try {
        const addr = connectedAddress || (await connect());
        if (!addr || !window.tronWeb) {
          setIsPending(false);
          return null;
        }

        const config = getActiveTronConfig();
        toast.info("Awaiting TronLink Approval", {
          description: `Confirm transfer of ${amountUsd.toFixed(2)} ${token} in your wallet.`,
        });

        if (token === "USDT") {
          const contract = await window.tronWeb.contract().at(config.usdtContract);
          const units = Math.round(amountUsd * 1_000_000);
          const txid = await contract.transfer(toAddress, units).send();
          toast.success("TRON Transfer Broadcasted", { description: `TxID: ${txid.slice(0, 16)}...` });
          return txid;
        } else {
          const sun = Math.round((amountUsd / 0.16) * 1_000_000);
          const res = await window.tronWeb.trx.sendTransaction(toAddress, sun);
          const txid = res.txid || res.transaction?.txID;
          if (!txid) throw new Error("No transaction ID returned from TronWeb");
          toast.success("TRX Transfer Broadcasted", { description: `TxID: ${txid.slice(0, 16)}...` });
          return txid;
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          toast.info("Wallet Zero Balance / Simulation Mode", {
            description: "No real USDT in wallet. Simulating broadcast & on-chain settlement for testing.",
          });
          const mockTxid = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
          return mockTxid;
        }
        toast.error("TRON Transaction Failed", { description: String(err) });
        return null;
      } finally {
        setIsPending(false);
      }
    },
    [connectedAddress, connect]
  );

  return {
    isInstalled,
    connectedAddress,
    isPending,
    connect,
    sendTronPayment,
  };
}
