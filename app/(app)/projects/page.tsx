"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ProjectCreateModal } from "@/components/projects/ProjectCreateModal";
import type { ProjectCardData } from "@/components/projects/ProjectCard";

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("updated");
  const [modalOpen, setModalOpen] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch("/api/projects");

      if (!response.ok) throw new Error("Failed to load projects");

      const body = await response.json();
      setProjects(body.data ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(loadProjects);
  }, [loadProjects]);

  useEffect(() => {
    if (searchParams.get("new") !== "true") return;

    Promise.resolve().then(() => {
      setModalOpen(true);
      router.replace("/projects");
    });
  }, [searchParams, router]);

  const visibleProjects = useMemo(() => {
    let list = projects;

    if (status !== "all") {
      list = list.filter((project) => project.status === status);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      list = list.filter((project) =>
        project.name.toLowerCase().includes(query),
      );
    }

    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "progress") return b.progress - a.progress;
      return 0;
    });
  }, [projects, status, search, sort]);

  return (
    <div className="mx-auto max-w-[1400px]">
      <ProjectHeader
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
        onCreate={() => setModalOpen(true)}
      />

      {loading ? (
        <LoadingState message="Loading projects..." />
      ) : error ? (
        <ErrorState
          onRetry={loadProjects}
          message="Unable to load your projects."
        />
      ) : (
        <ProjectGrid projects={visibleProjects} />
      )}

      <ProjectCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          setModalOpen(false);
          loadProjects();
        }}
      />
    </div>
  );
}
