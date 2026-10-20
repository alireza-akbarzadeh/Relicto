"use client";

import * as React from "react";
import { Trophy, Plus, Edit2, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DashboardMatch, DashboardTournament } from "../types";
import { TournamentCreateDialog } from "./tournament-create-dialog";
import { MatchEditDialog } from "./match-edit-dialog";

export function DashboardTournaments({
  tournaments,
  matches,
}: {
  tournaments: DashboardTournament[];
  matches: DashboardMatch[];
}) {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editMatch, setEditMatch] = React.useState<DashboardMatch | null>(null);

  const formatUsd = (cents: number) => `$${(cents / 100).toLocaleString("en-US")}`;

  return (
    <div className="space-y-6">
      {/* Tournaments List Card */}
      <Card className="bg-surface-card border-border-subtle">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3">
          <div>
            <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
              <Trophy className="size-4 text-primary" />
              Tournament Rosters & Event Management
            </CardTitle>
            <CardDescription className="text-xs text-text-muted mt-0.5">
              Manage esports brackets, prize pool allocations, and qualification tiers
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5 font-semibold text-xs shadow-sm">
            <Plus className="size-3.5" />
            Create Tournament
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="pb-3 font-semibold">Tournament Title</th>
                  <th className="pb-3 font-semibold">Game</th>
                  <th className="pb-3 font-semibold">Format</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Prize Pool</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/40">
                {tournaments.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-container/40 transition-colors">
                    <td className="py-3 font-semibold text-text-primary">{t.name}</td>
                    <td className="py-3">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-container border border-border-subtle">
                        {t.gameId}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-text-secondary">{t.format ?? "Double Elimination"}</td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                          t.status === "live"
                            ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            : t.status === "completed"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-semibold text-amber-400">
                      {formatUsd(t.prizePoolCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Live Match Schedule & Scoring Card */}
      <Card className="bg-surface-card border-border-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
            <Play className="size-4 text-cyan-400" />
            Match Schedule, Live Broadcast & Scoring
          </CardTitle>
          <CardDescription className="text-xs text-text-muted mt-0.5">
            Update real-time match results, set winners, and advance tournament brackets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="pb-3 font-semibold">Matchup</th>
                  <th className="pb-3 font-semibold">Tournament & Round</th>
                  <th className="pb-3 font-semibold text-center">Score</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/40">
                {matches.map((m) => (
                  <tr key={m.id} className="hover:bg-surface-container/40 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2 font-semibold text-text-primary">
                        <span>{m.teamAName}</span>
                        <span className="text-text-muted text-[10px] font-mono">VS</span>
                        <span>{m.teamBName}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-col">
                        <span className="text-text-secondary truncate">{m.tournamentName}</span>
                        <span className="text-[10px] text-text-muted font-mono">{m.round ?? "Upper Bracket"}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center font-mono font-bold text-sm text-text-primary">
                      {m.scoreA} - {m.scoreB}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                          m.status === "live"
                            ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            : m.status === "completed"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-surface-container text-text-muted border border-border-subtle"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => setEditMatch(m)}
                        className="gap-1 font-mono text-xs"
                      >
                        <Edit2 className="size-3" />
                        Update Score
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <TournamentCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => window.location.reload()}
      />

      <MatchEditDialog
        open={Boolean(editMatch)}
        onOpenChange={(open) => !open && setEditMatch(null)}
        match={editMatch}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
