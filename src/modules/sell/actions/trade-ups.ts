"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { igniteInput, saveSlotsInput } from "@/server/modules/trade-ups/trade-ups.schema";
import { tradeUpService } from "@/server/modules/trade-ups/trade-ups.service";
import { sellMobile } from "../data/sell-mobile.mock";

/** The bot's name is chamber chrome; nothing models bots yet. */
const BOT = sellMobile.contract.bot;

/** Saves the chamber's slots and answers with the chamber as the server holds it. */
export async function saveContractSlots(input: z.input<typeof saveSlotsInput>) {
  const { slots } = saveSlotsInput.parse(input);
  return tradeUpService.save(await requireUserId(), slots, BOT);
}

/** Runs the contract. Inventory, vault totals and the studio all change, so every page refreshes. */
export async function igniteContract(input: z.input<typeof igniteInput>) {
  const { slots } = igniteInput.parse(input);
  const result = await tradeUpService.ignite(await requireUserId(), slots, BOT);
  if (result.status === "settled") revalidatePath("/", "layout");
  return result;
}
