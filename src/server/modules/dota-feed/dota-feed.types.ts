export type OpenDotaHero = {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: "str" | "agi" | "int" | "all";
  attack_type: "Melee" | "Ranged";
  roles: string[];
  legs?: number;
};

export type HeroSyncResult = {
  total: number;
  upserted: number;
  linkedItems: number;
  source: "opendota" | "fallback";
};
