import { FolderKanban } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";

interface ProjectGridProps {
  projects: ProjectCardData[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<FolderKanban size={20} strokeWidth={1.8} />}
        title="No projects found"
        description="Create a project to start organizing your team's work."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
