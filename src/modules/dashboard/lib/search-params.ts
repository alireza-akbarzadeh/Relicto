import { parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs";

export const DASHBOARD_TABS = [
  "overview",
  "orders",
  "income",
  "transactions",
  "listings",
  "catalog",
  "tournaments",
  "wiki",
  "community",
  "promotions",
  "disputes",
  "users",
  "monitoring",
  "settings",
  "audit",
  "wallet",
] as const;

export const dashboardTabParam = parseAsStringLiteral(DASHBOARD_TABS).withDefault("overview");

export const catalogSearchParams = {
  cq: parseAsString.withDefault(""),
  cgame: parseAsString.withDefault("all"),
  crarity: parseAsString.withDefault("all"),
  csort: parseAsString.withDefault("name_asc"),
  cpage: parseAsInteger.withDefault(1),
  cpageSize: parseAsInteger.withDefault(12),
};

export const tournamentsSearchParams = {
  tq: parseAsString.withDefault(""),
  tgame: parseAsString.withDefault("all"),
  tstatus: parseAsString.withDefault("all"),
  tsort: parseAsString.withDefault("newest"),
  tpage: parseAsInteger.withDefault(1),
  tpageSize: parseAsInteger.withDefault(10),
};

export const wikiSearchParams = {
  wq: parseAsString.withDefault(""),
  wcat: parseAsString.withDefault("all"),
  wkind: parseAsString.withDefault("all"),
  wpage: parseAsInteger.withDefault(1),
  wpageSize: parseAsInteger.withDefault(10),
};

export const communitySearchParams = {
  comq: parseAsString.withDefault(""),
  comguild: parseAsString.withDefault("all"),
  compage: parseAsInteger.withDefault(1),
  compageSize: parseAsInteger.withDefault(10),
};

export const promosSearchParams = {
  pq: parseAsString.withDefault(""),
  pstatus: parseAsString.withDefault("all"),
  ppage: parseAsInteger.withDefault(1),
  ppageSize: parseAsInteger.withDefault(10),
};

export const usersSearchParams = {
  uq: parseAsString.withDefault(""),
  urole: parseAsString.withDefault("all"),
  ustatus: parseAsString.withDefault("all"),
  ubalance: parseAsString.withDefault("all"),
  usort: parseAsString.withDefault("balance_desc"),
  upage: parseAsInteger.withDefault(1),
  upageSize: parseAsInteger.withDefault(10),
};

export const ordersSearchParams = {
  oq: parseAsString.withDefault(""),
  ostate: parseAsString.withDefault("all"),
  oflow: parseAsString.withDefault("all"),
  osort: parseAsString.withDefault("newest"),
  opage: parseAsInteger.withDefault(1),
  opageSize: parseAsInteger.withDefault(10),
};

export const transactionsSearchParams = {
  tq: parseAsString.withDefault(""),
  tkind: parseAsString.withDefault("all"),
  tdir: parseAsString.withDefault("all"),
  tstatus: parseAsString.withDefault("all"),
  tsort: parseAsString.withDefault("newest"),
  tpage: parseAsInteger.withDefault(1),
  tpageSize: parseAsInteger.withDefault(10),
};

export const listingsSearchParams = {
  lq: parseAsString.withDefault(""),
  lgame: parseAsString.withDefault("all"),
  lstatus: parseAsString.withDefault("all"),
  lsort: parseAsString.withDefault("newest"),
  lpage: parseAsInteger.withDefault(1),
  lpageSize: parseAsInteger.withDefault(10),
};

export const disputesSearchParams = {
  dq: parseAsString.withDefault(""),
  dstatus: parseAsString.withDefault("all"),
  dsort: parseAsString.withDefault("newest"),
  dpage: parseAsInteger.withDefault(1),
  dpageSize: parseAsInteger.withDefault(10),
};

export const auditSearchParams = {
  aq: parseAsString.withDefault(""),
  aaction: parseAsString.withDefault("all"),
  aseverity: parseAsString.withDefault("all"),
  asort: parseAsString.withDefault("newest"),
  apage: parseAsInteger.withDefault(1),
  apageSize: parseAsInteger.withDefault(10),
};
