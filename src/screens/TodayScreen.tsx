import { useState, useEffect } from "react";
import { ARTICLES } from "../data/exploreData";
import type { Habit } from "../App";

interface Props {
  habits: Habit[];
  completed: Record<string, boolean>;
  onToggle: (id: string) => void;
  userGoals: string[];
  onNavigateToArticle: (id: string) => void;
  onNavigateToExplore: () => void;
  onNavigateToNotifications: () => void;
  unreadCount: number;
}

/* ── Real weekly calendar helpers ── */
const DAY_LABELS = ["T2","T3","T4","T5","T6","T7","CN"];

function getThisWeek(): Date[] {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun,1=Mon,...,6=Sat
  // Monday of this week
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function todayKey() {
  return toDateKey(new Date());
}

function loadFireDays(): Set<string> {
  try {
    const raw = localStorage.getItem("wr_fire_days");
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
}
function saveFireDays(days: Set<string>) {
  try { localStorage.setItem("wr_fire_days", JSON.stringify([...days])); } catch { /* noop */ }
}

/* Habits scheduled for today */
function habitsForToday(habits: Habit[]): Habit[] {
  const dow = new Date().getDay(); // 0=Sun
  const dayMap: Record<number,string> = { 1:"T2",2:"T3",3:"T4",4:"T5",5:"T6",6:"T7",0:"CN" };
  const todayLabel = dayMap[dow];
  return habits.filter(h => {
    if (h.schedule === "daily") return true;
    if (h.schedule === "weekly") return h.days.includes(todayLabel);
    return false;
  });
}

export default function TodayScreen({
  habits, completed, onToggle, userGoals,
  onNavigateToArticle, onNavigateToExplore,
  onNavigateToNotifications, unreadCount,
}: Props) {

  const week = getThisWeek();
  const todayStr = todayKey();
  const todayHabits = habitsForToday(habits);
  const doneCount = todayHabits.filter(h => completed[h.id]).length;
  const totalToday = todayHabits.length;
  const isFireDay = totalToday > 0 && doneCount === totalToday;

  /* Persist fire days */
  const [fireDays, setFireDays] = useState<Set<string>>(() => loadFireDays());

  useEffect(() => {
    setFireDays(prev => {
      const next = new Set(prev);
      if (isFireDay) {
        next.add(todayStr);
      } else {
        // Only remove today — past fire days stay
        next.delete(todayStr);
      }
      saveFireDays(next);
      return next;
    });
  }, [isFireDay, todayStr]);

  /* Celebration state */
  const [justFired, setJustFired] = useState(false);
  const prevDone = useState(doneCount)[0];
  useEffect(() => {
    if (isFireDay && doneCount !== prevDone) {
      setJustFired(true);
      const t = setTimeout(() => setJustFired(false), 3000);
      return () => clearTimeout(t);
    }
  }, [isFireDay, doneCount, prevDone]);

  /* Articles for you */
  const GOAL_TOPIC: Record<string,string> = { sleep:"sleep", exercise:"movement", eat:"nutrition", stress:"mindset", growth:"growth", balance:"balance" };
  const topicIds = userGoals.map(g => GOAL_TOPIC[g]).filter(Boolean);
  const forYouArticles = ARTICLES.filter(a => topicIds.includes(a.topicId)).slice(0, 2);
  const displayArticles = forYouArticles.length >= 1 ? forYouArticles : ARTICLES.slice(0, 2);

  return (
    <div className="today-layout" style={{ minHeight:"100%", background:"#FFF8F4", fontFamily:"'Nunito', sans-serif", paddingBottom:"16px" }}>

      {/* ── HEADER ── */}
      <div className="today-heading" style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:"16px 20px 14px" }}>
        <div>
          <p style={{ margin:0, fontSize:"13px", fontWeight:500, color:"#9A8A7A" }}>Chào buổi sáng,</p>
          <h1 style={{ margin:"2px 0 4px", fontSize:"26px", fontWeight:900, color:"#2A2420", lineHeight:1.2 }}>Hôm nay 👋</h1>
          <p style={{ margin:0, fontSize:"13px", color:"#9A8A7A" }}>Mỗi bước nhỏ đều đáng giá.</p>
        </div>
        {/* Notification bell with badge */}
        <button
          onClick={onNavigateToNotifications}
          style={{ background:"none", border:"none", cursor:"pointer", padding:"4px", marginTop:"4px", position:"relative" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2A2420" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          {unreadCount > 0 && (
            <div style={{
              position:"absolute", top:"1px", right:"1px",
              width:"10px", height:"10px", borderRadius:"50%",
              background:"#D95C5C", border:"2px solid #FFF8F4",
            }}/>
          )}
        </button>
      </div>

      {/* ── WEEKLY FIRE CALENDAR ── */}
      <div className="today-calendar" style={{ margin:"0 20px 16px", padding:"16px 18px 18px", background:"#FFFFFF", borderRadius:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
          <h2 style={{ margin:0, fontSize:"15px", fontWeight:800, color:"#2A2420" }}>Lịch giữ lửa 🔥</h2>
          <span style={{ fontSize:"12px", color:"#9A8A7A" }}>Tuần này</span>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"4px" }}>
          {week.map((day, i) => {
            const key = toDateKey(day);
            const isToday = key === todayStr;
            const isPast = day < new Date(new Date().setHours(0,0,0,0));
            const isFire = fireDays.has(key);
            const dayNum = day.getDate();

            return (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
                <span style={{ fontSize:"10px", fontWeight:600, color: isToday ? "#F28C64" : "#9A8A7A" }}>
                  {DAY_LABELS[i]}
                </span>
                <div style={{
                  width:"36px", height:"36px", borderRadius:"50%",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background: isToday
                    ? (isFire ? "rgba(242,140,100,0.15)" : "rgba(242,140,100,0.10)")
                    : isFire ? "rgba(242,140,100,0.08)" : "transparent",
                  border: isToday
                    ? `2px solid ${isFire ? "#F28C64" : "#F28C64"}`
                    : "2px solid transparent",
                  opacity: !isPast && !isToday ? 0.35 : 1,
                }}>
                  {isFire
                    ? <span style={{ fontSize:"18px" }}>🔥</span>
                    : (
                      <span style={{
                        fontSize:"13px",
                        fontWeight: isToday ? 800 : isPast ? 500 : 400,
                        color: isToday ? "#F28C64" : isPast ? "#9A8A7A" : "#C8C0B8",
                      }}>
                        {dayNum}
                      </span>
                    )
                  }
                </div>
              </div>
            );
          })}
        </div>

        {/* Fire day celebration */}
        {isFireDay && (
          <div style={{
            marginTop:"12px", padding:"9px 14px", borderRadius:"12px",
            background:"rgba(242,140,100,0.10)", border:"1px solid rgba(242,140,100,0.25)",
            textAlign:"center",
            animation: justFired ? "none" : undefined,
          }}>
            <p style={{ margin:0, fontSize:"13px", fontWeight:700, color:"#C86820" }}>
              🔥 Bạn đã giữ lửa hôm nay! Tuyệt vời!
            </p>
          </div>
        )}
      </div>

      {/* ── HABITS HÔM NAY ── */}
      <div className="today-habits" style={{ padding:"0 20px 16px" }}>
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:"12px" }}>
          <h2 style={{ margin:0, fontSize:"16px", fontWeight:800, color:"#2A2420" }}>Hôm nay</h2>
          {totalToday > 0 && (
            <span style={{ fontSize:"12px", fontWeight:600, color: isFireDay ? "#F28C64" : "#9A8A7A" }}>
              {isFireDay ? "🔥 " : ""}{doneCount}/{totalToday} đã hoàn thành
            </span>
          )}
        </div>

        {todayHabits.length === 0 ? (
          <div style={{ padding:"24px", textAlign:"center", background:"#FFFFFF", borderRadius:"16px", border:"1.5px dashed #E0D8D0" }}>
            <p style={{ margin:0, fontSize:"24px" }}>🌱</p>
            <p style={{ margin:"8px 0 0", fontSize:"14px", fontWeight:700, color:"#2A2420" }}>Chưa có thói quen hôm nay</p>
            <p style={{ margin:"4px 0 0", fontSize:"12px", color:"#9A8A7A" }}>Hãy thêm thói quen để bắt đầu hành trình.</p>
          </div>
        ) : (
          todayHabits.map(h => {
            const done = !!completed[h.id];
            return (
              <button
                key={h.id}
                onClick={() => onToggle(h.id)}
                style={{
                  display:"flex", alignItems:"center", gap:"12px", width:"100%", textAlign:"left",
                  padding:"13px 14px", borderRadius:"14px", marginBottom:"8px",
                  background: done ? "rgba(123,152,126,0.08)" : "#FFFFFF",
                  border:`1.5px solid ${done ? "rgba(123,152,126,0.30)" : "#F0EAE4"}`,
                  cursor:"pointer", transition:"all 0.15s",
                }}
              >
                {/* Check circle */}
                <div style={{
                  width:"28px", height:"28px", borderRadius:"50%", flexShrink:0,
                  background: done ? "#7B987E" : "transparent",
                  border:`2px solid ${done ? "#7B987E" : "#C8C0B8"}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all 0.15s",
                }}>
                  {done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <span style={{ fontSize:"18px", lineHeight:1 }}>{h.icon}</span>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0, fontSize:"14px", fontWeight:700, color: done ? "#7B987E" : "#2A2420", opacity: done ? 0.75 : 1, textDecoration: done ? "line-through" : "none" }}>{h.name}</p>
                  {h.reminder && <p style={{ margin:"1px 0 0", fontSize:"11px", color:"#B0A8A0" }}>⏰ {h.reminder}</p>}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* ── BÀI VIẾT MỚI ── */}
      <div className="today-articles" style={{ padding:"0 20px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
          <h2 style={{ margin:0, fontSize:"16px", fontWeight:800, color:"#2A2420" }}>Bài viết dành cho bạn</h2>
        </div>

        {displayArticles.map(a => (
          <button
            key={a.id}
            onClick={() => onNavigateToArticle(a.id)}
            style={{
              display:"flex", alignItems:"center", gap:"12px", width:"100%", textAlign:"left",
              padding:"13px 14px", borderRadius:"14px", background:"#FFFFFF",
              boxShadow:"0 1px 5px rgba(0,0,0,0.06)", marginBottom:"9px", border:"none", cursor:"pointer",
            }}
          >
            <div style={{ width:"46px", height:"46px", borderRadius:"12px", background:a.topicBg, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px" }}>{a.topicIcon}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ margin:"0 0 3px", fontSize:"13px", fontWeight:700, color:"#2A2420", lineHeight:1.4 }}>{a.title}</p>
              <p style={{ margin:0, fontSize:"11px", color:"#9A9088" }}>
                <span style={{ color:a.topicAccent, fontWeight:700 }}>{a.topicLabel}</span> · {a.readingMins} phút đọc
              </p>
            </div>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C0B8B0" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        ))}

        <button
          onClick={onNavigateToExplore}
          style={{
            display:"flex", alignItems:"center", justifyContent:"center", gap:"5px",
            width:"100%", height:"44px", background:"none", border:"1.5px solid #E0D8D0",
            borderRadius:"14px", cursor:"pointer",
            fontFamily:"'Nunito', sans-serif", fontSize:"13px", fontWeight:700, color:"#F28C64",
          }}
        >
          Xem thêm trong Khám phá
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F28C64" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  );
}
