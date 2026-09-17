import { useState, useEffect } from "react";
import WealthRISELogo from "./components/WealthRISELogo";
import OnboardingScreen   from "./screens/OnboardingScreen";
import Screen21Goals      from "./screens/Screen21Goals";
import Screen22Login      from "./screens/Screen22Login";
import Screen23Purpose    from "./screens/Screen23Purpose";
import Screen24Pace       from "./screens/Screen24Pace";
import Screen25Reminder   from "./screens/Screen25Reminder";
import Screen26Habits     from "./screens/Screen26Habits";
import TodayScreen        from "./screens/TodayScreen";
import ExploreScreen      from "./screens/ExploreScreen";
import SearchScreen       from "./screens/SearchScreen";
import TopicDetailScreen  from "./screens/TopicDetailScreen";
import ArticleScreen      from "./screens/ArticleScreen";
import EvidenceScreen     from "./screens/EvidenceScreen";
import ExploreArticleListScreen from "./screens/ExploreArticleListScreen";
import ChallengeScreen    from "./screens/ChallengeScreen";
import CreateHabitScreen  from "./screens/CreateHabitScreen";
import HabitDetailScreen  from "./screens/HabitDetailScreen";
import GroupScreen        from "./screens/GroupScreen";
import GroupDetailScreen  from "./screens/GroupDetailScreen";
import ProfileScreen      from "./screens/ProfileScreen";
import AllGroupsScreen    from "./screens/AllGroupsScreen";
import PostDetailScreen, { type PostData } from "./screens/PostDetailScreen";
import AllChallengesScreen from "./screens/AllChallengesScreen";
import ChallengeDetailScreen from "./screens/ChallengeDetailScreen";
import SavedPostsScreen   from "./screens/SavedPostsScreen";
import ChallengeHistoryScreen from "./screens/ChallengeHistoryScreen";
import PrivacyScreen      from "./screens/PrivacyScreen";
import SettingsScreen     from "./screens/SettingsScreen";
import NotificationScreen from "./screens/NotificationScreen";
import { NOTIFICATIONS } from "./data/notifications";
import { useUserState } from "./state/UserStateContext";

export type Screen =
  | "onboarding" | "goals21" | "login22" | "purpose23" | "pace24" | "reminder25" | "habits26"
  | "today" | "notifications"
  | "explore" | "explore-search" | "explore-topic" | "explore-article" | "explore-evidence" | "explore-article-list"
  | "challenge" | "create-habit" | "habit-detail"
  | "group" | "group-detail" | "all-groups" | "post-detail"
  | "all-challenges" | "challenge-detail"
  | "profile" | "saved-posts" | "challenge-history" | "privacy" | "settings";

export type Tab = "today" | "explore" | "challenge" | "group" | "profile";

export interface Habit {
  id: string;
  icon: string;
  name: string;
  goalLabel: string;
  schedule: "daily" | "weekly";
  days: string[];
  reminder: string;
  startDate: string;
  status: "active" | "paused" | "archived";
}

/* ── localStorage helpers ── */
function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function lsSet(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
}

/* Today's date key: "YYYY-MM-DD" */
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

/* Load completion for today from localStorage */
function loadCompletion(habits: Habit[]): Record<string, boolean> {
  const key = `wr_completion_${todayKey()}`;
  const stored = lsGet<Record<string, boolean>>(key, {});
  const result: Record<string, boolean> = {};
  habits.filter(h => h.status === "active").forEach(h => {
    result[h.id] = stored[h.id] ?? false;
  });
  return result;
}

const TAB_SCREENS: Record<Tab, Screen> = {
  today:"today", explore:"explore", challenge:"challenge", group:"group", profile:"profile",
};

const ONBOARDING_SCREENS: Screen[] = [
  "onboarding","goals21","pace24","reminder25","habits26",
];

const HIDE_NAV_SCREENS: Screen[] = [
  ...ONBOARDING_SCREENS,
  "login22","purpose23",
  "explore-search","explore-topic","explore-article","explore-evidence","explore-article-list",
  "create-habit","habit-detail",
  "all-groups","post-detail","all-challenges","challenge-detail",
  "saved-posts","challenge-history","privacy","settings",
  "notifications",
];

export interface OnboardingData {
  goals: string[]; pace: string|null; reminder: string|null; habits: string[];
  purpose?: string|null;
}

/* Re-export for any remaining imports */
export const MOCK_NOTIFICATIONS = NOTIFICATIONS.map(n => ({
  id: n.id, icon: n.icon, text: n.body, time: n.time, read: n.read,
}));

export default function App() {
  const { userState, markAllNotificationsRead, resetUserState } = useUserState();

  const [screen,    setScreen]    = useState<Screen>("onboarding");
  const [activeTab, setActiveTab] = useState<Tab>("today");

  const [data, setData] = useState<OnboardingData>(() =>
    lsGet("wr_onboarding", { goals:[], pace:null, reminder:null, habits:[] })
  );
  useEffect(() => { lsSet("wr_onboarding", data); }, [data]);

  const [habits, setHabits] = useState<Habit[]>(() =>
    lsGet<Habit[]>("wr_habits", [])
  );
  useEffect(() => { lsSet("wr_habits", habits); }, [habits]);

  const [completed, setCompleted] = useState<Record<string, boolean>>(() =>
    loadCompletion(lsGet<Habit[]>("wr_habits", []))
  );
  useEffect(() => {
    lsSet(`wr_completion_${todayKey()}`, completed);
  }, [completed]);

  /* Unread count derived from global userState */
  const unreadCount = NOTIFICATIONS.filter(
    n => !n.read && !userState.readNotificationIds.includes(n.id)
  ).length;

  const markAllRead = () => {
    markAllNotificationsRead(NOTIFICATIONS.map(n => n.id));
  };

  const [selectedGroupId,      setSelectedGroupId]      = useState<string>("active-daily");
  const [selectedHabitId,      setSelectedHabitId]      = useState<string | null>(null);
  const [selectedArticleId,    setSelectedArticleId]    = useState<string>("sleep-tired");
  const [selectedTopicId,      setSelectedTopicId]      = useState<string>("sleep");
  const [selectedClaimId,      setSelectedClaimId]      = useState<string>("sleep-cycles");
  const [exploreListMode,      setExploreListMode]      = useState<"popular"|"for-you"|"topic">("popular");
  const [selectedPost,         setSelectedPost]         = useState<PostData | null>(null);
  const [selectedChallengeId,  setSelectedChallengeId]  = useState<string>("sleep-7");

  const [screenStack, setScreenStack] = useState<Screen[]>([]);

  const navigate = (s: Screen) => {
    setScreenStack(prev => [...prev, screen]);
    setScreen(s);
    const entry = Object.entries(TAB_SCREENS).find(([,v]) => v === s);
    if (entry) setActiveTab(entry[0] as Tab);
  };

  const goBack = () => {
    const prev = screenStack[screenStack.length - 1];
    if (prev) {
      setScreenStack(s => s.slice(0, -1));
      setScreen(prev);
      const entry = Object.entries(TAB_SCREENS).find(([,v]) => v === prev);
      if (entry) setActiveTab(entry[0] as Tab);
    }
  };

  const switchTab = (tab: Tab) => {
    setScreenStack([]);
    setActiveTab(tab);
    setScreen(TAB_SCREENS[tab]);
  };

  const navigateToArticle  = (id: string) => { setSelectedArticleId(id); navigate("explore-article"); };
  const navigateToTopic    = (id: string) => { setSelectedTopicId(id);   navigate("explore-topic");   };
  const navigateToEvidence = (claimId: string) => { setSelectedClaimId(claimId); navigate("explore-evidence"); };
  const navigateToList     = (mode: "popular"|"for-you"|"topic") => { setExploreListMode(mode); navigate("explore-article-list"); };
  const navigateToHabitDetail = (id: string) => { setSelectedHabitId(id); navigate("habit-detail"); };
  const navigateToPostDetail  = (post: PostData) => { setSelectedPost(post); navigate("post-detail"); };
  const navigateToChallengeDetail = (id: string) => { setSelectedChallengeId(id); navigate("challenge-detail"); };

  const toggleHabit = (id: string) => setCompleted(c => ({ ...c, [id]: !c[id] }));

  const finishOnboarding = (selectedHabitIds: string[], allSuggested: Habit[]) => {
    const chosen = allSuggested.filter(h => selectedHabitIds.includes(h.id));
    setHabits(chosen);
    const initCompleted: Record<string,boolean> = {};
    chosen.forEach(h => { initCompleted[h.id] = false; });
    setCompleted(initCompleted);
    setData(d => ({ ...d, habits: selectedHabitIds }));
    lsSet("wr_onboarding_completed", true);
    switchTab("today");
  };

  const addHabit = (h: Habit) => {
    setHabits(prev => [...prev, h]);
    setCompleted(c => ({ ...c, [h.id]: false }));
    navigate("challenge");
  };

  const updateHabit = (id: string, changes: Partial<Habit>) =>
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...changes } : h));

  const selectedHabit = habits.find(h => h.id === selectedHabitId) ?? habits[0];
  const showNav = !HIDE_NAV_SCREENS.includes(screen);
  const isOnboarding = ONBOARDING_SCREENS.includes(screen) || screen === "login22" || screen === "purpose23";

  const handleResetDemo = () => {
    /* Clear all wr_* keys then restore mock state */
    Object.keys(localStorage).forEach(k => { if (k.startsWith("wr_")) localStorage.removeItem(k); });
    resetUserState();
    setScreen("onboarding");
    setScreenStack([]);
    setHabits([]);
    setCompleted({});
    setData({ goals:[], pace:null, reminder:null, habits:[] });
  };

  return (
    <div className={`app-shell ${isOnboarding ? "app-onboarding" : "app-workspace"}`}>
      {!isOnboarding && <aside className="desktop-sidebar">
        <a className="app-brand" href="#" onClick={e => { e.preventDefault(); switchTab("today"); }}><WealthRISELogo size={44}/><strong>WealthRISE</strong></a>
        <p className="sidebar-caption">HÀNH TRÌNH CỦA BẠN</p>
        <BottomNav activeTab={activeTab} onSwitch={switchTab}/>
        <div className="sidebar-note"><span>🌱</span><strong>Mỗi ngày, tốt hơn một chút.</strong><p>Những thói quen nhỏ làm nên thay đổi lớn.</p></div>
        <button className="sidebar-settings" onClick={() => navigate("settings")}>⚙ Cài đặt</button>
      </aside>}
      <div className="app-main">
      <main key={screen} className={`app-content screen-${screen}`}>

        {screen === "onboarding" && (
          <OnboardingScreen onNext={() => navigate("goals21")}/>
        )}
        {screen === "goals21" && (
          <Screen21Goals
            selected={data.goals}
            onChange={(g) => setData(d => ({ ...d, goals: g }))}
            onBack={goBack}
            onSkip={() => navigate("pace24")}
            onNext={() => navigate("pace24")}
          />
        )}
        {screen === "pace24" && (
          <Screen24Pace
            selected={data.pace}
            onChange={(p) => setData(d => ({ ...d, pace: p }))}
            onBack={goBack}
            onSkip={() => navigate("reminder25")}
            onNext={() => navigate("reminder25")}
          />
        )}
        {screen === "reminder25" && (
          <Screen25Reminder
            selected={data.reminder}
            onChange={(r) => setData(d => ({ ...d, reminder: r }))}
            onBack={goBack}
            onSkip={() => navigate("habits26")}
            onNext={() => navigate("habits26")}
          />
        )}
        {screen === "habits26" && (
          <Screen26Habits
            goals={data.goals}
            pace={data.pace}
            reminder={data.reminder}
            onBack={goBack}
            onFinish={finishOnboarding}
          />
        )}

        {/* Legacy screens — kept but not in main flow */}
        {screen === "login22"   && <Screen22Login onContinue={() => switchTab("today")}/>}
        {screen === "purpose23" && <Screen23Purpose selected={data.purpose ?? null} onChange={(p) => setData(d => ({ ...d, purpose: p }))} onBack={goBack} onSkip={() => navigate("pace24")} onNext={() => navigate("pace24")}/>}

        {screen === "today" && (
          <TodayScreen
            habits={habits.filter(h => h.status === "active")}
            completed={completed}
            onToggle={toggleHabit}
            userGoals={data.goals}
            onNavigateToArticle={navigateToArticle}
            onNavigateToExplore={() => switchTab("explore")}
            onNavigateToNotifications={() => navigate("notifications")}
            unreadCount={unreadCount}
          />
        )}

        {screen === "notifications" && (
          <NotificationScreen
            onBack={goBack}
            onMarkAllRead={markAllRead}
          />
        )}

        {screen === "explore"          && <ExploreScreen userGoals={data.goals} onNavigateToArticle={navigateToArticle} onNavigateToTopic={navigateToTopic} onNavigateToList={navigateToList} onNavigateToSearch={()=>navigate("explore-search")}/>}
        {screen === "explore-search"   && <SearchScreen onBack={goBack} onNavigateToArticle={navigateToArticle}/>}
        {screen === "explore-topic"    && <TopicDetailScreen topicId={selectedTopicId} onBack={goBack} onNavigateToArticle={navigateToArticle}/>}
        {screen === "explore-article"  && <ArticleScreen articleId={selectedArticleId} onBack={goBack} onNavigateToEvidence={navigateToEvidence} onNavigateToArticle={navigateToArticle} onNavigateToChallenge={()=>switchTab("challenge")}/>}
        {screen === "explore-evidence" && <EvidenceScreen claimId={selectedClaimId} onBack={goBack}/>}
        {screen === "explore-article-list" && <ExploreArticleListScreen mode={exploreListMode} topicId={selectedTopicId} userGoals={data.goals} onBack={goBack} onNavigateToArticle={navigateToArticle}/>}

        {screen === "challenge" && (
          <ChallengeScreen
            habits={habits}
            onNavigateToCreateHabit={() => navigate("create-habit")}
            onNavigateToHabitDetail={navigateToHabitDetail}
            onUpdateHabit={updateHabit}
            onViewAllChallenges={() => navigate("all-challenges")}
            onChallengeDetail={navigateToChallengeDetail}
          />
        )}
        {screen === "create-habit"     && <CreateHabitScreen onSave={addHabit} onBack={goBack}/>}
        {screen === "habit-detail"     && <HabitDetailScreen habit={selectedHabit} onUpdate={(ch)=>updateHabit(selectedHabit.id,ch)} onBack={goBack}/>}
        {screen === "all-challenges"   && <AllChallengesScreen onBack={goBack} onChallengeDetail={navigateToChallengeDetail}/>}
        {screen === "challenge-detail" && <ChallengeDetailScreen challengeId={selectedChallengeId} onBack={goBack}/>}

        {screen === "group"        && <GroupScreen onNavigate={navigate} onGroupDetail={(id) => { setSelectedGroupId(id); navigate("group-detail"); }}/>}
        {screen === "group-detail" && <GroupDetailScreen groupId={selectedGroupId} onBack={goBack} onPostDetail={navigateToPostDetail} onChallengeDetail={navigateToChallengeDetail}/>}
        {screen === "all-groups"   && <AllGroupsScreen onBack={goBack} onGroupDetail={(id) => { setSelectedGroupId(id); navigate("group-detail"); }}/>}
        {screen === "post-detail"  && selectedPost && <PostDetailScreen post={selectedPost} onBack={goBack}/>}

        {screen === "profile"           && <ProfileScreen onNavigate={navigate}/>}
        {screen === "saved-posts"       && <SavedPostsScreen onBack={goBack}/>}
        {screen === "challenge-history" && <ChallengeHistoryScreen onBack={goBack}/>}
        {screen === "privacy"           && <PrivacyScreen onBack={goBack}/>}
        {screen === "settings"          && <SettingsScreen onBack={goBack} onResetDemo={handleResetDemo}/>}
      </main>
      {showNav && <div className="mobile-navigation"><BottomNav activeTab={activeTab} onSwitch={switchTab}/></div>}
      </div>
    </div>
  );
}

const NAV_TABS = [
  { tab:"today" as Tab, label:"Hôm nay" }, { tab:"explore" as Tab, label:"Khám phá" },
  { tab:"challenge" as Tab, label:"Thử thách" }, { tab:"group" as Tab, label:"Nhóm" },
  { tab:"profile" as Tab, label:"Cá nhân" },
] as const;

function BottomNav({ activeTab, onSwitch }: { activeTab:Tab; onSwitch:(t:Tab)=>void }) {
  return (
    <nav className="app-navigation" aria-label="Điều hướng chính" style={{ flexShrink:0, background:"#FFFFFF", borderTop:"1px solid #EEE8E0", boxShadow:"0 -2px 16px rgba(0,0,0,0.05)", display:"flex", alignItems:"center", justifyContent:"space-around", padding:"10px 0 24px" }}>
      {NAV_TABS.map(({ tab, label }) => {
        const active = activeTab === tab;
        const c = active ? "#F28C64" : "#6F777A";
        return (
          <button key={tab} aria-current={active ? "page" : undefined} onClick={()=>onSwitch(tab)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"3px", background:"none", border:"none", cursor:"pointer", minWidth:"60px", padding:"2px 0" }}>
            {tab==="today"     && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>}
            {tab==="explore"   && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>}
            {tab==="challenge" && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
            {tab==="group"     && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>}
            {tab==="profile"   && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            <span style={{ fontSize:"10px", fontWeight:active?700:500, color:c, fontFamily:"'Nunito', sans-serif" }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
