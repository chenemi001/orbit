import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ProjectCTA() {
  return (
    <div className="relative min-h-[210px] overflow-hidden rounded-[20px] bg-[#06100f] p-6 text-white">
      <div className="absolute -right-12 -bottom-20 h-56 w-56 rounded-full bg-[#1d6154]/40 blur-3xl" />

      <div className="relative z-10">
        <p className="text-xl font-semibold">Build. Plan. Achieve.</p>

        <p className="mt-2 max-w-[230px] text-xs leading-5 text-white/60">
          Turn your ideas into impact with a workspace designed for
          what&apos;s next.
        </p>

        <Link
          href="/projects?new=true"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#101b19]"
        >
          Create a project
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
