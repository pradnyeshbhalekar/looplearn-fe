import { api } from "./axios";

export interface Plan {
    id: string;
    name: string;
    billing_cycle: string | null;
    domain: string;
    monthly_price: number;
    features: string[];
}

export interface SubscriptionResponse {
    subscription_id: string;
    message: string;
    ends_at: string | null;
    razorpay: {
        subscription_id: string;
        status: string;
        short_url: string;
    };
}

export interface UserSubscription {
    subscription_id: string;
    status: string;
    plan_id: string;
    plan_name: string;
    domain: string;
    ends_at: string | null;
    razorpay_id?: string;
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    diagram?: string;
    audio_url?: string;
    domain?: string;
    published_at?: string;
}

export const subscriptionApi = {
    fetchPlans: async (): Promise<Plan[]> => {
        const response = await api.get("/api/subscriptions/plans");
        return response.data;
    },

    createSubscription: async (payload: { planId: string, isTeam?: boolean, workspaceId?: string | null }): Promise<SubscriptionResponse> => {
        const response = await api.post("/api/subscriptions/subscribe", {
            plan_id: payload.planId,
            is_team: payload.isTeam,
            workspace_id: payload.workspaceId
        });
        return response.data;
    },

    getSubscriptionStatus: async (): Promise<{ status: string }> => {
        const response = await api.get("/api/subscriptions/me");
        return response.data;
    },

    confirmSubscription: async (): Promise<{ status: string; message?: string }> => {
        const response = await api.post("/api/subscriptions/confirm");
        return response.data;
    },

    listMySubscriptions: async (): Promise<UserSubscription[]> => {
        const response = await api.get("/api/subscriptions/me");
        if (response.data.subscriptions) {
            return response.data.subscriptions;
        } else if (response.data.subscription) {
            return [response.data.subscription];
        }
        return [];
    },

    getTodayArticleByDomain: async (domain: string): Promise<Article> => {
        const formattedDomain = domain.replace(/_/g, " ");
        const response = await api.get(`/api/subscriptions/me/today?domain=${encodeURIComponent(formattedDomain)}`);
        return response.data;
    },

    getArticleBySlug: async (slug: string): Promise<Article & { subscription?: UserSubscription }> => {
        const response = await api.get(`/api/subscriptions/me/article/${slug}`);
        return response.data;
    },
};
