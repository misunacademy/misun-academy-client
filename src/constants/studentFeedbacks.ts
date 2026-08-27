export interface StudentFeedback {
  name: string;
  batch: string;
  studentId: string;
  testimonial: string;
  post_link?: string;
}

export async function getFeedbacks(): Promise<StudentFeedback[]> {
  const res = await fetch('/data/studentFeedbacks.json');
  if (!res.ok) return [];
  return res.json();
}
