import { useState, useRef } from "react";
import { TOPICS, ARTICLES, EXPERTS } from "../data/exploreData";

interface Props {
  userGoals: string[];
  onNavigateToArticle: (id: string) => void;
  onNavigateToTopic:   (id: string) => void;
  onNavigateToList:    (mode: "popular" | "for-you" | "topic") => void;
  onNavigateToSearch:  () => void;
}

type ExpTab = "explore" | "for-you" | "experts";

/* ── Segmented tabs ── */
function SegmentedTabs({ tab, setTab }: { tab: ExpTab; setTab: (t: ExpTab) => void }) {
  const tabs: { id: ExpTab; label: string }[] = [
    { id:"explore",  label:"Khám phá"     },
    { id:"for-you",  label:"Dành cho bạn" },
    { id:"experts",  label:"Chuyên gia"   },
  ];
  return (
    <div style={{ display:"flex", background:"rgba(242,140,100,0.08)", borderRadius:"14px", padding:"3px", margin:"0 20px 16px", gap:"2px" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)} style={{
          flex:1, height:"36px", borderRadius:"11px", border:"none", cursor:"pointer",
          background: tab === t.id ? "#FFFFFF" : "transparent",
          boxShadow: tab === t.id ? "0 1px 6px rgba(242,140,100,0.18)" : "none",
          fontFamily:"'Nunito', sans-serif", fontSize:"12px", fontWeight:700,
          color: tab === t.id ? "#F28C64" : "#9A8A7A",
          transition:"all 0.15s",
        }}>{t.label}</button>
      ))}
    </div>
  );
}

/* ── Compact article row (Level 3) ── */
function ArticleRow({ article, onPress }: { article: typeof ARTICLES[0]; onPress: () => void }) {
  const hasClaim = article.claims.length > 0;
  return (
    <button onClick={onPress} style={{
      display:"flex", alignItems:"center", gap:"12px", width:"100%", textAlign:"left",
      padding:"12px 14px", borderRadius:"16px", background:"#FFFFFF",
      border:"1px solid #F0EAE4", marginBottom:"8px", cursor:"pointer",
    }}>
      {/* Thumbnail */}
      <div style={{
        width:"72px", height:"72px", borderRadius:"14px", flexShrink:0,
        background: article.coverGradient,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:"28px", overflow:"hidden",
      }}>
        <span style={{ opacity:0.7 }}>{article.topicIcon}</span>
      </div>

      <div style={{ flex:1, minWidth:0 }}>
        <span style={{ fontSize:"10px", fontWeight:700, color:article.topicAccent, background:article.topicBg, padding:"2px 8px", borderRadius:"8px", display:"inline-block", marginBottom:"4px" }}>
          {article.topicLabel}
        </span>
        <p style={{ margin:"0 0 4px", fontSize:"13px", fontWeight:700, color:"#2A2420", lineHeight:1.4, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {article.title}
        </p>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <span style={{ fontSize:"11px", color:"#9A8A7A" }}>{article.readingMins} phút</span>
          {hasClaim && (
            <span style={{ fontSize:"10px", fontWeight:700, color:"#7B987E", background:"rgba(123,152,126,0.12)", padding:"2px 7px", borderRadius:"8px" }}>
              ✓ Có căn cứ
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ── Topic Carousel with pointer-drag support ── */
function TopicCarousel({ onNavigateToTopic }: { onNavigateToTopic: (id: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, scrollLeft: 0, dragging: false });
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = { startX: e.clientX, scrollLeft: el.scrollLeft, dragging: true };
    el.setPointerCapture(e.pointerId);
    setIsDragging(false);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el || !dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 5) setIsDragging(true);
    el.scrollLeft = dragState.current.scrollLeft - dx;
  };

  const onPointerUp = () => {
    dragState.current.dragging = false;
    setTimeout(() => setIsDragging(false), 50);
  };

  return (
    <div style={{ marginBottom:"22px" }}>
      <p style={{ margin:"0 0 10px", padding:"0 20px", fontSize:"12px", fontWeight:800, color:"#9A8A7A", textTransform:"uppercase", letterSpacing:"0.6px" }}>Khám phá theo chủ đề</p>
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          display:"flex", gap:"10px",
          overflowX:"auto", scrollbarWidth:"none",
          padding:"4px 20px 8px",
          scrollSnapType:"x mandatory",
          WebkitOverflowScrolling:"touch",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect:"none",
        }}
      >
        {TOPICS.map(t => (
          <button
            key={t.id}
            onClick={() => { if (!isDragging) onNavigateToTopic(t.id); }}
            style={{
              flexShrink:0, width:"120px",
              display:"flex", flexDirection:"column", alignItems:"center", gap:"8px",
              padding:"14px 10px 12px", borderRadius:"18px",
              background:t.bg, border:"none",
              cursor: isDragging ? "grabbing" : "pointer",
              scrollSnapAlign:"start",
              pointerEvents: isDragging ? "none" : "auto",
            }}
          >
            <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"rgba(255,255,255,0.6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px" }}>
              {t.icon}
            </div>
            <span style={{ fontSize:"11px", fontWeight:700, color:t.accent, fontFamily:"'Nunito', sans-serif", textAlign:"center", lineHeight:1.3 }}>{t.label}</span>
          </button>
        ))}
        {/* Spacer so last card doesn't hug the right edge */}
        <div style={{ flexShrink:0, width:"10px" }}/>
      </div>
    </div>
  );
}

/* ── TAB 1: Khám phá ── */
function ExploreTab({ onNavigateToTopic, onNavigateToArticle, onNavigateToList, onNavigateToSearch }: Omit<Props,"userGoals">) {
  const featuredArticle = ARTICLES[0];
  const trendingArticles = ARTICLES.slice(1);

  return (
    <>
      {/* Search */}
      <div style={{ padding:"0 20px 16px" }}>
        <button onClick={onNavigateToSearch} style={{
          width:"100%", height:"48px", background:"#FFFFFF", borderRadius:"16px",
          border:"1.5px solid #EDE6DF",
          display:"flex", alignItems:"center", gap:"10px", padding:"0 16px",
          cursor:"pointer", textAlign:"left",
        }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9A8A7A" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span style={{ fontSize:"13px", color:"#B0A090", fontFamily:"'Nunito', sans-serif" }}>Tìm về giấc ngủ, vận động, dinh dưỡng…</span>
        </button>
      </div>

      {/* ── LEVEL 1: Featured / Hero article ── */}
      <div style={{ padding:"0 20px 20px" }}>
        <p style={{ margin:"0 0 10px", fontSize:"12px", fontWeight:800, color:"#9A8A7A", textTransform:"uppercase", letterSpacing:"0.6px" }}>Dành cho bạn hôm nay</p>
        <button
          onClick={() => onNavigateToArticle(featuredArticle.id)}
          style={{ width:"100%", borderRadius:"20px", overflow:"hidden", border:"none", cursor:"pointer", textAlign:"left", padding:0, display:"block" }}
        >
          {/* Visual area */}
          <div style={{
            height:"160px", background:featuredArticle.coverGradient,
            display:"flex", alignItems:"flex-end", padding:"16px 18px",
            position:"relative", overflow:"hidden",
          }}>
            {/* Abstract botanical decoration */}
            <svg style={{ position:"absolute", right:"-8px", top:"-8px", opacity:0.18 }} width="140" height="140" viewBox="0 0 140 140" fill="none">
              <circle cx="80" cy="40" r="56" fill="white"/>
              <circle cx="40" cy="100" r="38" fill="white"/>
              <ellipse cx="110" cy="110" rx="32" ry="26" fill="white"/>
            </svg>
            <span style={{ fontSize:"52px", position:"absolute", right:"20px", top:"50%", transform:"translateY(-50%)", opacity:0.5 }}>{featuredArticle.topicIcon}</span>
            <div>
              <span style={{ fontSize:"10px", fontWeight:700, color:"rgba(255,255,255,0.85)", background:"rgba(255,255,255,0.2)", padding:"3px 10px", borderRadius:"10px", display:"inline-block", marginBottom:"6px" }}>
                {featuredArticle.topicLabel}
              </span>
            </div>
          </div>
          {/* Info area */}
          <div style={{ padding:"14px 18px 16px", background:"#FFFFFF" }}>
            <h3 style={{ margin:"0 0 6px", fontSize:"17px", fontWeight:900, color:"#2A2420", lineHeight:1.35 }}>
              {featuredArticle.title}
            </h3>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <span style={{ fontSize:"12px", color:"#9A8A7A" }}>📖 {featuredArticle.readingMins} phút đọc</span>
              {featuredArticle.claims.length > 0 && (
                <span style={{ fontSize:"11px", fontWeight:700, color:"#7B987E", background:"rgba(123,152,126,0.12)", padding:"3px 9px", borderRadius:"8px" }}>✓ Có căn cứ</span>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* ── LEVEL 2: Topic horizontal carousel (drag support) ── */}
      <TopicCarousel onNavigateToTopic={onNavigateToTopic}/>

      {/* ── LEVEL 3: Được quan tâm ── */}
      <div style={{ padding:"0 20px 8px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
          <p style={{ margin:0, fontSize:"16px", fontWeight:800, color:"#2A2420" }}>Được quan tâm</p>
          <button onClick={() => onNavigateToList("popular")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:700, color:"#F28C64", fontFamily:"'Nunito', sans-serif", padding:"4px 0" }}>
            Xem tất cả &gt;
          </button>
        </div>
        <div className="card-grid">{trendingArticles.map(a => <ArticleRow key={a.id} article={a} onPress={() => onNavigateToArticle(a.id)}/>)}</div>
      </div>
    </>
  );
}

/* ── TAB 2: Dành cho bạn ── */
const GOAL_LABELS: Record<string, { icon:string; label:string; color:string; bg:string }> = {
  sleep:      { icon:"🌙", label:"Ngủ ngon hơn",        color:"#A896CC", bg:"#F2EDF8" },
  eat:        { icon:"🥗", label:"Ăn uống lành mạnh",   color:"#7B987E", bg:"#EDF5EF" },
  exercise:   { icon:"🏃", label:"Vận động đều đặn",    color:"#F28C64", bg:"#FFF2EC" },
  stress:     { icon:"🪷", label:"Giảm căng thẳng",     color:"#9B6CC8", bg:"#F4EEFA" },
  confidence: { icon:"❤️", label:"Tự tin hơn",           color:"#E84A6A", bg:"#FDE8EE" },
  balance:    { icon:"☀️", label:"Cân bằng cuộc sống",  color:"#E0900A", bg:"#FFF5E0" },
  growth:     { icon:"📖", label:"Phát triển bản thân", color:"#2A9A88", bg:"#E4F4F0" },
  community:  { icon:"👥", label:"Kết nối cộng đồng",   color:"#A896CC", bg:"#F2EDF8" },
  /* compat with old goal IDs */
  movement:   { icon:"🏃", label:"Vận động đều đặn",    color:"#F28C64", bg:"#FFF2EC" },
  nutrition:  { icon:"🥗", label:"Ăn uống lành mạnh",   color:"#7B987E", bg:"#EDF5EF" },
  mindset:    { icon:"🧘", label:"Tinh thần",            color:"#E08830", bg:"#FFF3E0" },
};

function ForYouTab({ userGoals, onNavigateToArticle, onNavigateToList }: { userGoals:string[]; onNavigateToArticle:(id:string)=>void; onNavigateToList:(mode:"for-you")=>void }) {
  const prioritized = ARTICLES.filter(a => a.goalIds.some(g => userGoals.includes(g)));
  const rest        = ARTICLES.filter(a => !a.goalIds.some(g => userGoals.includes(g)));

  if (userGoals.length === 0) {
    return (
      <div style={{ padding:"40px 24px", textAlign:"center" }}>
        <p style={{ fontSize:"36px", margin:0 }}>🎯</p>
        <p style={{ margin:"14px 0 6px", fontSize:"16px", fontWeight:800, color:"#2A2420" }}>Chưa có mục tiêu</p>
        <p style={{ margin:0, fontSize:"13px", color:"#9A8A7A", lineHeight:1.65 }}>Chọn mục tiêu để WealthRISE cá nhân hóa nội dung cho bạn.</p>
      </div>
    );
  }

  return (
    <div style={{ padding:"0 20px 16px" }}>
      {/* Context label */}
      <p style={{ margin:"0 0 10px", fontSize:"13px", fontWeight:700, color:"#5F6368" }}>Dựa trên mục tiêu của bạn</p>

      {/* Goal chips */}
      <div style={{ display:"flex", gap:"7px", flexWrap:"wrap", marginBottom:"20px" }}>
        {userGoals.map(g => {
          const meta = GOAL_LABELS[g];
          if (!meta) return null;
          return (
            <div key={g} style={{ display:"flex", alignItems:"center", gap:"5px", padding:"5px 12px", borderRadius:"20px", background:meta.bg, border:`1px solid ${meta.color}28` }}>
              <span style={{ fontSize:"13px" }}>{meta.icon}</span>
              <span style={{ fontSize:"12px", fontWeight:700, color:meta.color }}>{meta.label}</span>
            </div>
          );
        })}
      </div>

      {/* Ưu tiên cho bạn */}
      {prioritized.length > 0 && (
        <>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
            <p style={{ margin:0, fontSize:"15px", fontWeight:800, color:"#2A2420" }}>Ưu tiên cho bạn</p>
            <button onClick={() => onNavigateToList("for-you")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"12px", fontWeight:700, color:"#F28C64", fontFamily:"'Nunito', sans-serif" }}>Xem tất cả &gt;</button>
          </div>
          {prioritized.map(a => <ArticleRow key={a.id} article={a} onPress={() => onNavigateToArticle(a.id)}/>)}
        </>
      )}

      {/* Có thể bạn quan tâm */}
      {rest.length > 0 && (
        <>
          <p style={{ margin:"16px 0 10px", fontSize:"15px", fontWeight:800, color:"#2A2420" }}>Có thể bạn quan tâm</p>
          {rest.map(a => <ArticleRow key={a.id} article={a} onPress={() => onNavigateToArticle(a.id)}/>)}
        </>
      )}
    </div>
  );
}

/* ── TAB 3: Chuyên gia ── */
function ExpertsTab() {
  const [filter, setFilter] = useState<string>("all");
  const filters = [
    { id:"all",       label:"Tất cả"          },
    { id:"sleep",     label:"Giấc ngủ"        },
    { id:"nutrition", label:"Dinh dưỡng"      },
    { id:"movement",  label:"Vận động"        },
    { id:"mindset",   label:"Tinh thần"       },
    { id:"growth",    label:"Phát triển"      },
    { id:"balance",   label:"Cân bằng"        },
    { id:"focus",     label:"Tập trung"       },
    { id:"community", label:"Kết nối"         },
  ];
  const shown = filter === "all" ? EXPERTS : EXPERTS.filter(e => e.topicIds.includes(filter));

  return (
    <div style={{ padding:"0 20px 16px" }}>
      <p style={{ margin:"0 0 12px", fontSize:"13px", color:"#9A8A7A" }}>Khi bạn muốn được hỗ trợ thêm.</p>

      {/* Filter chips */}
      <div style={{ display:"flex", gap:"7px", overflowX:"auto", scrollbarWidth:"none", paddingBottom:"4px", marginBottom:"16px" }}>
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            flexShrink:0, padding:"6px 16px", borderRadius:"20px", border:"none", cursor:"pointer",
            background: filter===f.id ? "#F28C64" : "#FFFFFF",
            color: filter===f.id ? "#FFFFFF" : "#6A6060",
            fontSize:"12px", fontWeight:700,
            outline: filter===f.id ? "none" : "1px solid #E8E0D8",
            fontFamily:"'Nunito', sans-serif",
          }}>{f.label}</button>
        ))}
      </div>

      {/* Notice */}
      <div style={{ padding:"10px 14px", background:"rgba(255,248,240,0.8)", borderRadius:"12px", marginBottom:"16px", border:"1px solid #F0D8B8" }}>
        <p style={{ margin:0, fontSize:"11px", color:"#806020", lineHeight:1.5 }}>WealthRISE kiểm tra thông tin chuyên gia độc lập. Không thay thế tư vấn y tế chính thức.</p>
      </div>

      {shown.map(e => (
        <div key={e.id} style={{ padding:"16px", background:"#FFFFFF", borderRadius:"18px", border:"1px solid #F0EAE4", marginBottom:"10px" }}>
          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"10px" }}>
            <div style={{ width:"52px", height:"52px", borderRadius:"16px", background:e.bg, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"26px" }}>{e.avatar}</div>
            <div style={{ flex:1 }}>
              <p style={{ margin:0, fontSize:"15px", fontWeight:800, color:"#2A2420" }}>{e.name}</p>
              <p style={{ margin:"2px 0 0", fontSize:"12px", color:"#9A8A7A" }}>{e.field}</p>
            </div>
          </div>

          {/* Experience — 1 line */}
          <p style={{ margin:"0 0 10px", fontSize:"12px", color:"#5F6368", lineHeight:1.5 }}>{e.experience}</p>

          {/* 2 key badges */}
          <div style={{ display:"flex", gap:"6px", marginBottom:"12px" }}>
            {[
              { label:"Danh tính đã kiểm", color:"#7B987E", bg:"#EDF5EF" },
              { label:"Bằng cấp đã kiểm",  color:"#F28C64", bg:"#FFF2EC" },
            ].map(b => (
              <div key={b.label} style={{ display:"flex", alignItems:"center", gap:"4px", padding:"4px 10px", borderRadius:"8px", background:b.bg }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={b.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontSize:"10px", fontWeight:700, color:b.color }}>{b.label}</span>
              </div>
            ))}
          </div>

          {/* Topic badges */}
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
            {e.topicIds.slice(0,2).map(tid => {
              const topic = TOPICS.find(t => t.id === tid);
              if (!topic) return null;
              return (
                <span key={tid} style={{ fontSize:"10px", fontWeight:700, color:topic.accent, background:topic.bg, padding:"3px 9px", borderRadius:"8px" }}>
                  {topic.icon} {topic.label}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main ── */
export default function ExploreScreen({ userGoals, onNavigateToArticle, onNavigateToTopic, onNavigateToList, onNavigateToSearch }: Props) {
  const [tab, setTab] = useState<ExpTab>("explore");

  return (
    <div style={{ minHeight:"100%", background:"#FFF8F4", fontFamily:"'Nunito', sans-serif" }}>
      {/* Header */}
      <div style={{ padding:"16px 20px 10px" }}>
        <h1 style={{ margin:0, fontSize:"26px", fontWeight:900, color:"#2A2420" }}>Khám phá</h1>
        <p style={{ margin:"4px 0 0", fontSize:"13px", color:"#9A8A7A" }}>Kiến thức đáng tin cậy cho một cuộc sống tốt hơn.</p>
      </div>

      <SegmentedTabs tab={tab} setTab={setTab}/>

      {tab === "explore"  && <ExploreTab onNavigateToArticle={onNavigateToArticle} onNavigateToTopic={onNavigateToTopic} onNavigateToList={onNavigateToList} onNavigateToSearch={onNavigateToSearch}/>}
      {tab === "for-you"  && <ForYouTab userGoals={userGoals} onNavigateToArticle={onNavigateToArticle} onNavigateToList={onNavigateToList}/>}
      {tab === "experts"  && <ExpertsTab/>}
    </div>
  );
}
