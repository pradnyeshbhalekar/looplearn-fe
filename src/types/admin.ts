export interface TokenPayload {
  user_id: string;
  email: string;
  role: "admin" | "viewer" | "editor";
  exp: number;
}
export interface Candidate {
  id: string;
  title: string;
  slug: string;
  article_md: string;
  diagram: string;
  created_at: string;
  topic_node_id: string;
}

export interface PipelineStatus {
  job_id: string;
  status: "pending" | "running" | "completed" | "failed";
  result: {
    topic_name?: string;
    child_topic_added?: { child_node_id: string; child_topic: string }[];
  } | null;
  error: string | null;
}