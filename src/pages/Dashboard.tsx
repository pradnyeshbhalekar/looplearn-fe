import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { subscriptionApi, type UserSubscription } from "../api/subscription";
import { workspaceApi, type Workspace } from "../api/workspace";
import { useAppSelector, useAppDispatch } from "../app/hook";
import { fetchMe } from "../features/auth/authThunks";
import { Loader2, ArrowRight, Calendar, Plus, Users, X, Mail, Shield, Trash2, Crown, Zap } from "lucide-react";
import SubscriptionSkeleton from "../components/skeletons/SubscriptionSkeleton";
import WorkspaceSkeleton from "../components/skeletons/WorkspaceSkeleton";

const formatDomainName = (domain: string) => {
  return domain
    .split(/_|\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [subs, setSubs] = useState<UserSubscription[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingDomain, setProcessingDomain] = useState<string | null>(null);

  // Workspace Modal Forms State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [isInvitingMember, setIsInvitingMember] = useState(false);
  const [workspaceDetails, setWorkspaceDetails] = useState<{
    is_admin?: boolean;
    subscription?: any;
    todays_topic?: any;
  }>({});
  
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const openWorkspaceManager = async (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setLoadingMembers(true);
    setMembers([]);
    try {
      const res = await workspaceApi.getWorkspaceDetails(workspace.id);
      setMembers(res.members || []);
      setWorkspaceDetails({
        is_admin: res.is_admin,
        subscription: res.subscription,
        todays_topic: res.todays_topic
      });
    } catch (err: any) {
      alert("Failed to load members: " + (err.response?.data?.error || err.message));
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    try {
      setIsCreatingWorkspace(true);
      await workspaceApi.create(newWorkspaceName.trim());
      const workspaceData = await workspaceApi.getUserWorkspaces();
      setWorkspaces(workspaceData.workspaces || []);
      setIsCreateModalOpen(false);
      setNewWorkspaceName("");
    } catch (err: any) {
      alert("Failed to create workspace: " + (err.response?.data?.error || err.message));
    } finally {
      setIsCreatingWorkspace(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !selectedWorkspace) return;
    try {
      setIsInvitingMember(true);
      await workspaceApi.addMember(selectedWorkspace.id, inviteEmail.trim());
      setInviteEmail("");
      // Refresh members
      const res = await workspaceApi.getWorkspaceDetails(selectedWorkspace.id);
      setMembers(res.members || []);
    } catch (err: any) {
      alert("Failed to invite: " + (err.response?.data?.error || err.message));
    } finally {
      setIsInvitingMember(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedWorkspace) return;
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await workspaceApi.removeMember(selectedWorkspace.id, userId);
      // Refresh members
      const res = await workspaceApi.getWorkspaceDetails(selectedWorkspace.id);
      setMembers(res.members || []);
    } catch (err: any) {
      alert("Failed to remove member: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token && !currentUser) {
          await dispatch(fetchMe()).unwrap();
        }

        const [subData, workspaceData] = await Promise.all([
          subscriptionApi.listMySubscriptions(),
          workspaceApi.getUserWorkspaces()
        ]);

        const activeSubs = subData.filter((s) => s.status === "active");
        setSubs(activeSubs);
        setWorkspaces(workspaceData.workspaces || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
        setLoadingWorkspaces(false);
      }
    };
    loadData();
  }, []);

  const openTodayForDomain = async (domain: string) => {
    try {
      setProcessingDomain(domain);
      const article = await subscriptionApi.getTodayArticleByDomain(domain);
      navigate(`/subscriptions/article/${article.slug}`, { state: { article } });
    } catch {
      setError("Could not load today's article for selected subscription");
    } finally {
      setProcessingDomain(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-black dark:text-white flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-grow pt-24 pb-24 px-6 max-w-6xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Your Subscriptions</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-10">
          Select a subscribed plan below to read today’s briefing.
        </p>

        {loading ? (
          <SubscriptionSkeleton />
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Global Daily Briefing Card */}
            <div
              onClick={() => navigate("/todays")}
              className="group relative bg-[#0a0a0a] border border-blue-500/30 rounded-3xl p-8 shadow-2xl flex flex-col cursor-pointer transition-all hover:scale-[1.01] hover:border-blue-500/60 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-indigo-600/10 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-500/20 backdrop-blur-md">
                    Standard Access
                  </span>
                  <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <Zap size={18} className="text-blue-400" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter mb-2">Today's Briefing</h3>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-blue-400/60">
                  <Calendar size={12} />
                  DAILY SIGNAL
                </div>
                <div className="mt-12 flex items-center justify-between font-bold text-white group-hover:translate-x-1 transition-transform">
                  <span className="text-sm uppercase tracking-widest font-black">Open Briefing</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>            {/* Subscriptions */}
            {subs.length === 0 ? (
              <div className="bg-white dark:bg-[#080808] border border-gray-100 dark:border-white/5 rounded-3xl p-10 flex flex-col justify-center items-center text-center shadow-xl">
                <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                  <Crown size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">No active premium plan subscriptions yet.</p>
                <button onClick={() => navigate("/pricing")} className="px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-lg active:scale-95">
                  View Curated Plans
                </button>
              </div>
            ) : subs.map((s) => (
              <div
                key={s.subscription_id}
                onClick={() => {
                  if (processingDomain !== s.domain) openTodayForDomain(s.domain);
                }}
                className={`group relative bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col transition-all overflow-hidden ${processingDomain === s.domain ? "opacity-75 pointer-events-none cursor-wait" : "cursor-pointer hover:border-blue-500/40 hover:translate-y-[-4px]"
                  }`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] group-hover:bg-blue-500/10 transition-colors" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-100 dark:border-blue-500/20">
                      {formatDomainName(s.domain)}
                    </span>
                    {processingDomain === s.domain && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                  </div>
                  
                  <h3 className="text-2xl font-black text-black dark:text-white mb-3 tracking-tight">{s.plan_name}</h3>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                      <Calendar size={12} className="opacity-50" />
                      <span>Renews {s.ends_at ? new Date(s.ends_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Continuous"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-green-600 dark:text-green-500/80">
                      <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                      {s.status}
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-blue-600 dark:text-blue-400">
                    <span className="text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                      Access Today's Signal <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WORKSPACE SECTION */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black tracking-tight">Your Teams</h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Plus size={16} /> Create Workspace
            </button>
          </div>
          
          {loadingWorkspaces ? (
            <WorkspaceSkeleton />
          ) : workspaces.length === 0 ? (
            <div className="bg-white dark:bg-[#080808] border border-gray-100 dark:border-white/5 rounded-3xl p-16 text-center shadow-xl">
              <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Users size={32} className="text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-black mb-2 tracking-tight">No active teams yet</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-sm font-medium">Create a workspace to share your high-signal technical briefings with your colleagues.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {workspaces.map((w) => (
                <div key={w.id} className="group bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col transition-all hover:border-purple-500/30">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <span className="inline-block px-3 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-purple-100 dark:border-purple-500/20">
                        Workspace
                      </span>
                      <h3 className="text-2xl font-black mt-4 tracking-tight text-black dark:text-white">{w.name}</h3>
                      <div className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        <Users size={12} className="opacity-50" />
                        <span>{w.seat_limit} Limited Seats</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-100 dark:border-purple-500/20">
                      <Shield size={20} className="text-purple-500" />
                    </div>
                  </div>

                  <div className="mt-auto flex gap-3">
                    <button
                      onClick={() => openWorkspaceManager(w)}
                      className="flex-1 flex items-center justify-center bg-gray-50 hover:bg-gray-100 dark:bg-[#151515] dark:hover:bg-[#1a1a1a] text-black dark:text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all border border-gray-100 dark:border-white/5"
                    >
                      <Users size={14} className="mr-2" /> Manage Team
                    </button>
                    {w.owner_id === currentUser?.id && (
                      <button
                        onClick={() => navigate(`/pricing?team=true&workspace_id=${w.id}`)}
                        className="w-14 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                        title="Link Team License"
                      >
                        <Crown size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* --- MODALS --- */}

        {/* Create Workspace Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">Create a Team</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:scale-110 transition"><X size={16} /></button>
              </div>
              <form onSubmit={handleCreateWorkspace}>
                <div className="mb-6">
                  <label className="block text-sm font-bold tracking-widest text-gray-400 uppercase mb-2">Team Name</label>
                  <input
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="e.g. Engineering Team"
                    className="w-full bg-gray-50 dark:bg-[#0c0c0c] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-black dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCreatingWorkspace}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCreatingWorkspace ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  {isCreatingWorkspace ? "Creating..." : "Create Team"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Manage Workspace Modal */}
        {selectedWorkspace && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-2xl font-black">{selectedWorkspace.name}</h3>
                <button
                  onClick={() => {
                    setSelectedWorkspace(null);
                    setWorkspaceDetails({});
                  }}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:scale-110 transition"
                >
                  <X size={16} />
                </button>
              </div>

              {workspaceDetails.is_admin && (
                <>
                  <div className="mb-6 shrink-0 p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                      <Crown size={14} /> Team Briefing & License
                    </h4>
                    {workspaceDetails.subscription ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold">{workspaceDetails.subscription.plan_name}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                              {formatDomainName(workspaceDetails.subscription.domain)} • LICENSED
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expires</p>
                            <p className="text-xs font-bold">{new Date(workspaceDetails.subscription.ends_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        {workspaceDetails.todays_topic && (
                          <button
                            onClick={() => {
                              navigate(`/subscriptions/article/${workspaceDetails.todays_topic.slug}`, {
                                state: { article: workspaceDetails.todays_topic }
                              });
                            }}
                            className="w-full flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all group"
                          >
                            <div className="text-left">
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Team's Daily Drop</p>
                              <p className="text-xs font-bold line-clamp-1">{workspaceDetails.todays_topic.title}</p>
                            </div>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 font-medium">No active team license.</p>
                        <button
                          onClick={() => navigate(`/pricing?team=true&workspace_id=${selectedWorkspace.id}`)}
                          className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline"
                        >
                          Upgrade Now
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mb-6 shrink-0">
                    <form onSubmit={handleInviteMember} className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="Invitee email address..."
                          className="w-full bg-gray-50 dark:bg-[#0c0c0c] border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-black dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isInvitingMember}
                        className="bg-black dark:bg-white text-white dark:text-black font-bold px-6 py-3 rounded-xl text-sm transition-transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                      >
                        {isInvitingMember ? <Loader2 size={16} className="animate-spin" /> : "Invite"}
                      </button>
                    </form>
                  </div>
                </>
              )}

              <div className="flex-1 overflow-y-auto min-h-[200px] border-t border-gray-100 dark:border-gray-800 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Team Members</h4>
                {loadingMembers ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                ) : members.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No members found.</p>
                ) : (
                  <div className="space-y-3">
                    {members.map((m: any) => (
                      <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#151515] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            {m.role === 'admin' ? <Shield size={14} /> : <Users size={14} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-black dark:text-white line-clamp-1">{m.email}</p>
                            <p className="text-xs text-gray-500 capitalize">{m.role}</p>
                          </div>
                        </div>
                        {workspaceDetails.is_admin && m.role !== 'admin' && (
                          <button
                            onClick={() => handleRemoveMember(m.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Remove Member"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
