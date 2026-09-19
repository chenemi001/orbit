"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, UserPlus, Users } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import {
  TeamMemberCard,
  type TeamMemberData,
} from "@/components/team/TeamMemberCard";
import { TeamInviteModal } from "@/components/team/TeamInviteModal";

export default function TeamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [members, setMembers] = useState<TeamMemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch("/api/team");
      if (!response.ok) throw new Error("Failed to load team");

      const body = await response.json();
      setMembers(body.data ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  useEffect(() => {
    if (searchParams.get("invite") !== "true") return;

    Promise.resolve().then(() => {
      setInviteOpen(true);
      router.replace("/team");
    });
  }, [searchParams, router]);

  const filtered = useMemo(() => {
    if (!search.trim()) return members;
    const query = search.trim().toLowerCase();
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query),
    );
  }, [members, search]);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Team"
        description="Everyone you're collaborating with across your projects."
        actions={
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus size={16} />
            Invite
          </Button>
        }
      />

      <div className="relative mb-6 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search members..."
          className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--foreground)]/20 focus:ring-2 focus:ring-[var(--foreground)]/5"
        />
      </div>

      {loading ? (
        <LoadingState message="Loading team..." />
      ) : error ? (
        <ErrorState onRetry={load} message="Unable to load your team." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={20} strokeWidth={1.8} />}
          title={members.length === 0 ? "No teammates yet" : "No matches"}
          description={
            members.length === 0
              ? "Create a project and invite people to start collaborating."
              : "Try a different search term."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      )}

      <TeamInviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvited={() => {
          setInviteOpen(false);
          load();
        }}
      />
    </div>
  );
}
