export type CareerSubmission = {
  name: string;
  taskOne: string;
  taskTwo: string;
  rating: number;
  satisfactionNote: string;
};

// Supabase anon keys are designed to be used in browser clients.
const SUPABASE_URL = "https://dvervavjkgyychbjxglz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZXJ2YXZqa2d5eWNoYmp4Z2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNTIyMjksImV4cCI6MjEwMDkyODIyOX0.NeRC1dJmMbeS6SyAWe6zHO2ty7VEoDdyzPFd6SV05_k";

export async function saveCareerSubmission(submission: CareerSubmission): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/career_submissions`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: submission.name,
      task_one: submission.taskOne,
      task_two: submission.taskTwo,
      rating: submission.rating,
      satisfaction_note: submission.satisfactionNote || null,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(error?.message ?? `Supabase request failed (${response.status})`);
  }
}
