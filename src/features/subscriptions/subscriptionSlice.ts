import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { subscriptionApi } from "../../api/subscription";
import type { Plan, SubscriptionResponse } from "../../api/subscription";

interface SubscriptionState {
    plans: Plan[];
    loadingPlans: boolean;
    plansError: string | null;

    subscribing: boolean;
    subscribeError: string | null;
    currentSubscription: SubscriptionResponse | null;
}

const initialState: SubscriptionState = {
    plans: [],
    loadingPlans: false,
    plansError: null,

    subscribing: false,
    subscribeError: null,
    currentSubscription: null,
};

export const fetchPlans = createAsyncThunk(
    "subscription/fetchPlans",
    async (_, { rejectWithValue }) => {
        try {
            const data = await subscriptionApi.fetchPlans();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch plans");
        }
    }
);

export const createSubscription = createAsyncThunk(
    "subscription/createSubscription",
    async (planId: string, { rejectWithValue }) => {
        try {
            const data = await subscriptionApi.createSubscription(planId);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create subscription");
        }
    }
);

const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {
        clearSubscriptionState: (state) => {
            state.subscribeError = null;
            state.currentSubscription = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Plans
        builder.addCase(fetchPlans.pending, (state) => {
            state.loadingPlans = true;
            state.plansError = null;
        });
        builder.addCase(fetchPlans.fulfilled, (state, action: PayloadAction<Plan[]>) => {
            state.loadingPlans = false;
            state.plans = action.payload;
        });
        builder.addCase(fetchPlans.rejected, (state, action) => {
            state.loadingPlans = false;
            state.plansError = action.payload as string;
        });

        // Create Subscription
        builder.addCase(createSubscription.pending, (state) => {
            state.subscribing = true;
            state.subscribeError = null;
        });
        builder.addCase(createSubscription.fulfilled, (state, action: PayloadAction<SubscriptionResponse>) => {
            state.subscribing = false;
            state.currentSubscription = action.payload;
        });
        builder.addCase(createSubscription.rejected, (state, action) => {
            state.subscribing = false;
            state.subscribeError = action.payload as string;
        });
    },
});

export const { clearSubscriptionState } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
