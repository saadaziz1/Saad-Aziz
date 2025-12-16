import { JobCardSkeleton } from "./job-card-skeleton";

export function JobListSkeleton() {
  return (
    <main className="mx-auto max-w-app px-6 pb-32">
      <div className="laptop:space-y-14 laptop:mt-24 mt-[70px] space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}