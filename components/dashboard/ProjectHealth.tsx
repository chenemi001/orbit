import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import type { DashboardData } from "@/lib/services/dashboard.service";

interface ProjectHealthProps {
  projects: DashboardData["projects"];
  health: DashboardData["health"];
}

export function ProjectHealth({ projects, health }: ProjectHealthProps) {
  const total =
    health.onTrack + health.atRisk + health.delayed + health.completed;

  const onTrackDeg = total === 0 ? 0 : (health.onTrack / total) * 360;

  return (
    <div className="rounded-[20px] border border-[#dfe9e5] bg-white p-5 shadow-[0_8px_30px_rgba(19,50,44,0.035)]">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[19px] font-semibold text-[#101c19]">
            Project health
          </h2>

          <p className="mt-1 text-xs text-[#73847f]">
            Progress across active projects
          </p>
        </div>

        <Link
          href="/projects"
          className="flex items-center gap-1 text-xs font-medium text-[#101c19]"
        >
          All projects
          <ArrowRight size={14} />
        </Link>
      </div>

      {total === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No projects yet"
            description="Create your first project to see health here."
          />
        </div>
      ) : (
        <>
          <div className="mt-6 flex items-center gap-7">
            <div
              className="relative flex h-[122px] w-[122px] shrink-0 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#25a987 0deg ${onTrackDeg}deg, #dce4e1 ${onTrackDeg}deg 360deg)`,
              }}
            >
              <div className="flex h-[92px] w-[92px] flex-col items-center justify-center rounded-full bg-white">
                <span className="text-2xl font-semibold text-[#101c19]">
                  {Math.round((health.onTrack / total) * 100)}%
                </span>

                <span className="text-[11px] text-[#6d7f79]">On track</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <Legend color="bg-[#23a985]" label="On track" value={health.onTrack} />
              <Legend color="bg-[#f4ad39]" label="At risk" value={health.atRisk} />
              <Legend color="bg-[#ef4b5c]" label="Delayed" value={health.delayed} />
              <Legend color="bg-[#93a6ad]" label="Completed" value={health.completed} />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#101c19]">
                      {project.name}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-[#168f70]">
                    {project.progress}%
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-[#e7efec]">
                  <div
                    className="h-full rounded-full bg-[#2ba889]"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Legend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="w-16 text-[#687a75]">{label}</span>
      <span className="font-semibold text-[#101c19]">{value}</span>
    </div>
  );
}
