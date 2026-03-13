import { api } from "./axios";

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  seat_limit: number;
  created_at: string;
  is_admin?: boolean;
  subscription?: {
    plan_name: string;
    domain: string;
    ends_at: string;
  } | null;
  todays_topic?: {
    title: string;
    slug: string;
  } | null;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: string;
  joined_at: string;
}

export const workspaceApi = {
  create: async (name: string, seat_limit: number = 5) => {
    const res = await api.post("/api/workspaces/", { name, seat_limit });
    return res.data;
  },

  getUserWorkspaces: async () => {
    const res = await api.get("/api/workspaces/");
    return res.data;
  },

  getWorkspaceDetails: async (workspace_id: string) => {
    const res = await api.get(`/api/workspaces/${workspace_id}`);
    return res.data;
  },

  addMember: async (workspace_id: string, email: string, role: string = "member") => {
    const res = await api.post(`/api/workspaces/${workspace_id}/members`, { email, role });
    return res.data;
  },

  removeMember: async (workspace_id: string, user_id: string) => {
    const res = await api.delete(`/api/workspaces/${workspace_id}/members/${user_id}`);
    return res.data;
  },

  deleteWorkspace: async (workspace_id: string) => {
    const res = await api.delete(`/api/workspaces/${workspace_id}`);
    return res.data;
  }
};
