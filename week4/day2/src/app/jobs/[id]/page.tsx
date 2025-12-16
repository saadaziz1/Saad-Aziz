/* eslint-disable @next/next/no-img-element */

import { notFound } from 'next/navigation';
import { JobConfig } from '@/types';
import data from '../../../data.json';

export async function generateStaticParams() {
  return (data as JobConfig[]).map((job) => ({
    id: job.id.toString(),
  }));
}

export default async function JobDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Use static data for build time, API available for runtime
  const jobs: JobConfig[] = data as JobConfig[];
  const job = jobs.find(j => j.id === parseInt(id));
  
  if (!job) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-app px-6 pb-32 mt-24">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg transition-colors">
        <div className="flex items-center gap-4 mb-6">
          <img src={job.logo.replace('./images/', '/images/')} alt={job.company} className="w-16 h-16 object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-cyan-950 dark:text-white">{job.position}</h1>
            <p className="text-cyan-800 font-medium">{job.company}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-bold text-cyan-950 dark:text-white mb-2">Job Details</h3>
            <p className="text-gray-900 dark:text-gray-300"><span className="font-medium">Level:</span> {job.level}</p>
            <p className="text-gray-900 dark:text-gray-300"><span className="font-medium">Role:</span> {job.role}</p>
            <p className="text-gray-900 dark:text-gray-300"><span className="font-medium">Contract:</span> {job.contract}</p>
            <p className="text-gray-900 dark:text-gray-300"><span className="font-medium">Location:</span> {job.location}</p>
            <p className="text-gray-900 dark:text-gray-300"><span className="font-medium">Posted:</span> {job.postedAt}</p>
          </div>
          
          <div>
            <h3 className="font-bold text-cyan-950 dark:text-white mb-2">Requirements</h3>
            <div className="mb-2">
              <span className="font-medium text-gray-900 dark:text-gray-300">Languages:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {job.languages.map(lang => (
                  <span key={lang} className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-300">Tools:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {job.tools.map(tool => (
                  <span key={tool} className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded text-sm">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {job.new && (
          <span className="inline-block bg-cyan-800 text-white px-3 py-1 rounded-full text-sm font-medium mr-2">
            NEW!
          </span>
        )}
        {job.featured && (
          <span className="inline-block bg-cyan-950 text-white px-3 py-1 rounded-full text-sm font-medium">
            FEATURED
          </span>
        )}
      </div>
    </main>
  );
}