import { JobCardClient } from "@/components/job-card-client";
import { StoreInitializer } from "@/components/store-initializer";
import { JobConfig } from "@/types";
import data from "../data.json";

export default async function Home() {
  // Use static data for build time, API available for runtime
  const jobs: JobConfig[] = data as JobConfig[];

  return (
    <main className="mx-auto max-w-app px-6 pb-32">
      <div className="laptop:space-y-14 laptop:mt-24 mt-[70px] space-y-6">
        <StoreInitializer jobs={jobs} />
        <JobCardClient />
      </div>
    </main>
  );
}
