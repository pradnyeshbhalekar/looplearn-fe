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

export const subscriptionApi = {
    fetchPlans: async (): Promise<Plan[]> => {
        const response = await api.get("/api/subscriptions/plans");
        return response.data;
    },

    createSubscription: async (planId: string): Promise<SubscriptionResponse> => {
        const response = await api.post("/api/subscriptions/subscribe", { plan_id: planId });
        return response.data;
    },

    getSubscriptionStatus: async (): Promise<{ status: string }> => {
        const response = await api.get("/api/subscriptions/me");
        return response.data;
    },
};
