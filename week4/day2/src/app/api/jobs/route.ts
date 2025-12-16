import { NextResponse } from 'next/server';
import data from '../../../data.json';

export async function GET() {
  // Option 1: Return local data (current)
  return NextResponse.json(data);
  
  // Option 2: Fetch from external API
  // try {
  //   const response = await fetch('https://api.example.com/jobs', {
  //     headers: {
  //       'Authorization': `Bearer ${process.env.API_TOKEN}`,
  //       'Content-Type': 'application/json'
  //     }
  //   });
  //   
  //   if (!response.ok) {
  //     return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  //   }
  //   
  //   const jobs = await response.json();
  //   
  //   // Transform data if needed
  //   const transformedJobs = jobs.map(job => ({
  //     ...job,
  //     logo: job.logo.replace('./images/', '/images/')
  //   }));
  //   
  //   return NextResponse.json(transformedJobs);
  // } catch (error) {
  //   return NextResponse.json({ error: 'Server error' }, { status: 500 });
  // }
}