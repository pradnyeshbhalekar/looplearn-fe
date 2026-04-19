import { api } from "./axios";

export interface Workspace {
    id: string;
    name: string;
    owner_id: string;
}

export interface Plan {
    id: string;
    name: string;
    description: string;
    monthly_price: number;
    billing_cycle: string;
    features: string[];
    domain: string;
}

export interface Subscription {
    id: string;
    user_id: string;
    plan_id: string;
    workspace_id?: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    razorpay_id?: string;
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    diagram?: string;
    domain?: string;
    audio_url?: string;
    published_at?: string;
    content_json?: string;
    child_topics?: any[];
}

export interface UserSubscription {
    subscription_id: number;
    status: string;
    ends_at: string | null;
    plan_id: number;
    plan_name: string;
    domain: string;
    razorpay_subscription_id: string | null;
}

export const subscriptionApi = {
    fetchPlans: async () => {
        const response = await api.get<Plan[]>("/api/subscriptions/plans");
        return response.data;
    },
    listMySubscriptions: async () => {
        const response = await api.get<{ subscriptions: UserSubscription[] }>("/api/subscriptions/me/list");
        return response.data.subscriptions;
    },
    confirmSubscription: async (sid?: string | null) => {
        const body = sid ? { sid } : {};
        const response = await api.post<{ status: string; message?: string }>("/api/subscriptions/confirm", body);
        return response.data;
    },
    createSubscription: async (payload: { planId: string, isTeam?: boolean, workspaceId?: string | null }) => {
        const response = await api.post<Subscription>("/api/subscriptions/subscribe", {
            plan_id: payload.planId,
            is_team: payload.isTeam,
            workspace_id: payload.workspaceId
        });
        return response.data;
    },
    getMe: async () => {
        const response = await api.get<{
            subscription: Subscription | null;
            plan: Plan | null;
        }>("/api/subscriptions/me");
        return response.data;
    },
    cancel: async () => {
        const response = await api.post("/api/subscriptions/cancel");
        return response.data;
    },
    getTodayArticle: async () => {
        const response = await api.get<Article>("/api/articles/today");
        return response.data;
    },
    getTodayArticleByDomain: async (domain: string) => {
        const params = { domain };
        const response = await api.get<Article>("/api/subscriptions/me/today", { params });
        return response.data;
    },
    getArticleBySlug: async (slug: string) => {
        const response = await api.get<Article>(`/api/articles/${slug}`);
        return response.data;
    }
};
