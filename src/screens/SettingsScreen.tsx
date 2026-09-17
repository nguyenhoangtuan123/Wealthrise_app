import { useState } from "react";

interface Props { onBack: () => void; onResetDemo?: () => void; }

function lsGet<T>(key: string, fallback: T): T {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) as T : fallback; } catch { return fallback; }
}
function lsSet(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* noop */ }
}

const NOTIF_KEYS = [
  { key:"reminders", label:"Nhắc nhở thói quen",   desc:"Nhắc bạn thực hiện thói quen đúng giờ" },
  { key:"challenge",  label:"Cập nhật thử thách",   desc:"Tin tức về thử thách bạn tham gia" },
  { key:"community", label:"Hoạt động cộng đồng",   desc:"Bài viết và tương tác trong nhóm" },
];

type SubScreen = null | "help" | "about";

export default function SettingsScreen({ onBack, onResetDemo }: Props) {
  const [notifs, setNotifs] = useState<Record<string,boolean>>(() =>
    lsGet("wr_settings_notifs", { reminders:true, challenge:true, community:false })
  );
  const [sub, setSub] = useState<SubScreen>(null);
  const [helpItem, setHelpItem] = useState<string|null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const toggleNotif = (k: string) => {
    const next = { ...notifs, [k]: !notifs[k] };
    setNotifs(next);
    lsSet("wr_settings_notifs", next);
  };

  /* Sub-screen: Help */
  if (sub === "help") {
    if (helpItem) {
      return (
        <div style={{ minHeight:"100%", background:"#FFF8F4", fontFamily:"'Nunito', sans-serif" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"16px 20px 14px", borderBottom:"1px solid #F0EAE4" }}>
            <button onClick={() => setHelpItem(null)} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5F6368" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </button>
            <h1 style={{ margin:0, fontSize:"18px", fontWeight:900, color:"#2A2420" }}>{helpItem}</h1>
          </div>
          <div style={{ padding:"24px 20px", textAlign:"center" }}>
            <p style={{ fontSize:"36px", margin:0 }}>
              {helpItem === "Câu hỏi thường gặp" ? "❓" : helpItem === "Báo lỗi" ? "🐛" : "💌"}
            </p>
            <p style={{ margin:"16px 0 8px", fontSize:"16px", fontWeight:700, color:"#2A2420" }}>{helpItem}</p>
            <p style={{ margin:0, fontSize:"13px", color:"#9A8A7A", lineHeight:1.7 }}>
              {helpItem === "Câu hỏi thường gặp"
                ? "Tính năng này đang được cập nhật. Vui lòng quay lại sau."
                : helpItem === "Báo lỗi"
                ? "Phiên bản MVP hiện tại chưa hỗ trợ gửi báo cáo lỗi tự động. Bạn có thể liên hệ team WealthRISE qua email."
                : "Chúng tôi rất muốn nghe ý kiến của bạn! Tính năng gửi góp ý sẽ có trong bản tiếp theo."
              }
            </p>
          </div>
        </div>
      );
    }
    return (
      <div style={{ minHeight:"100%", background:"#FFF8F4", fontFamily:"'Nunito', sans-serif" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"16px 20px 14px", borderBottom:"1px solid #F0EAE4" }}>
          <button onClick={() => setSub(null)} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5F6368" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <h1 style={{ margin:0, fontSize:"18px", fontWeight:900, color:"#2A2420" }}>Trợ giúp & hỗ trợ</h1>
        </div>
        <div style={{ padding:"16px 20px" }}>
          {["Câu hỏi thường gặp","Báo lỗi","Góp ý cho WealthRISE"].map((item, i, arr) => (
            <button key={item} onClick={() => setHelpItem(item)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", textAlign:"left", padding:"16px 16px", background:"#FFFFFF", border:"none", cursor:"pointer", borderBottom:i < arr.length-1?"1px solid #F0EAE4":"none", borderRadius:i===0?"14px 14px 0 0":i===arr.length-1?"0 0 14px 14px":"0" }}>
              <span style={{ fontSize:"15px", fontWeight:600, color:"#2A2420", fontFamily:"'Nunito', sans-serif" }}>{item}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C0B8B0" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* Sub-screen: About */
  if (sub === "about") {
    return (
      <div style={{ minHeight:"100%", background:"#FFF8F4", fontFamily:"'Nunito', sans-serif" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"16px 20px 14px", borderBottom:"1px solid #F0EAE4" }}>
          <button onClick={() => setSub(null)} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5F6368" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <h1 style={{ margin:0, fontSize:"18px", fontWeight:900, color:"#2A2420" }}>Về WealthRISE</h1>
        </div>
        <div style={{ padding:"32px 20px", textAlign:"center" }}>
          <div style={{ width:"80px", height:"80px", borderRadius:"24px", background:"rgba(242,140,100,0.12)", margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"40px" }}>🌅</div>
          <h2 style={{ margin:"0 0 4px", fontSize:"22px", fontWeight:900, color:"#F28C64" }}>WealthRISE</h2>
          <p style={{ margin:"0 0 20px", fontSize:"13px", color:"#9A8A7A" }}>Phiên bản 1.0.0</p>
          <p style={{ margin:"0 0 6px", fontSize:"15px", fontWeight:700, color:"#5F6368", fontStyle:"italic" }}>"Mỗi ngày là một khởi đầu mới."</p>
        </div>
        <div style={{ margin:"0 20px" }}>
          {[
            { icon:"🌱", text:"WealthRISE giúp bạn xây dựng thói quen lành mạnh theo từng bước nhỏ, bền vững." },
            { icon:"📚", text:"Nội dung được rà soát bởi chuyên gia và có căn cứ khoa học rõ ràng." },
            { icon:"⚕️", text:"WealthRISE không thay thế tư vấn, chẩn đoán hoặc điều trị y khoa chuyên môn." },
          ].map((item, i) => (
            <div key={i} style={{ display:"flex", gap:"12px", padding:"14px 0", borderBottom:i<2?"1px solid #F0EAE4":"none" }}>
              <span style={{ fontSize:"20px", flexShrink:0 }}>{item.icon}</span>
              <p style={{ margin:0, fontSize:"13px", color:"#5F6368", lineHeight:1.65 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* Main settings */
  return (
    <div style={{ minHeight:"100%", background:"#FFF8F4", fontFamily:"'Nunito', sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"16px 20px 16px", borderBottom:"1px solid #F0EAE4" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5F6368" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <h1 style={{ margin:0, fontSize:"20px", fontWeight:800, color:"#2A2420" }}>Cài đặt</h1>
      </div>

      {/* THÔNG BÁO */}
      <SectionTitle title="Thông báo"/>
      <div style={{ margin:"0 20px 16px", background:"#FFFFFF", borderRadius:"18px", overflow:"hidden", border:"1px solid #F0EAE4" }}>
        {NOTIF_KEYS.map((s, i) => (
          <div key={s.key} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"14px 16px", borderBottom:i<NOTIF_KEYS.length-1?"1px solid #F0EAE4":"none" }}>
            <div style={{ flex:1 }}>
              <p style={{ margin:0, fontSize:"14px", fontWeight:700, color:"#2A2420" }}>{s.label}</p>
              {s.key === "reminders" && !notifs[s.key] && (
                <p style={{ margin:"2px 0 0", fontSize:"11px", color:"#C86820" }}>Reminder đã bị tắt</p>
              )}
              {notifs[s.key] && (
                <p style={{ margin:"2px 0 0", fontSize:"11px", color:"#9A8A7A" }}>{s.desc}</p>
              )}
            </div>
            <Toggle on={notifs[s.key]} onToggle={() => toggleNotif(s.key)}/>
          </div>
        ))}
      </div>

      {/* NGÔN NGỮ — chỉ tiếng Việt */}
      <SectionTitle title="Ngôn ngữ"/>
      <div style={{ margin:"0 20px 16px", background:"#FFFFFF", borderRadius:"18px", overflow:"hidden", border:"1px solid #F0EAE4" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px" }}>
          <span style={{ fontSize:"14px", fontWeight:600, color:"#2A2420" }}>Ngôn ngữ hiển thị</span>
          <span style={{ fontSize:"13px", fontWeight:700, color:"#7B987E", background:"rgba(123,152,126,0.12)", padding:"4px 12px", borderRadius:"10px" }}>Tiếng Việt</span>
        </div>
      </div>

      {/* DEMO RESET */}
      <SectionTitle title="Demo"/>
      <div style={{ margin:"0 20px 16px", background:"#FFFFFF", borderRadius:"18px", overflow:"hidden", border:"1px solid #F0EAE4" }}>
        <button
          onClick={() => setShowResetConfirm(true)}
          style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", textAlign:"left", padding:"14px 16px", background:"none", border:"none", cursor:"pointer", fontFamily:"'Nunito', sans-serif" }}
        >
          <div>
            <span style={{ fontSize:"14px", fontWeight:600, color:"#D95C5C", display:"block" }}>Đặt lại trải nghiệm demo</span>
            <span style={{ fontSize:"11px", color:"#9A8A7A" }}>Xóa dữ liệu và quay lại màn Welcome</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D95C5C" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* RESET CONFIRM DIALOG */}
      {showResetConfirm && (
        <>
          <div onClick={() => setShowResetConfirm(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:50 }}/>
          <div className="responsive-sheet" style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"min(100%, 480px)", background:"#FFFFFF", borderRadius:"24px 24px 0 0", zIndex:51, padding:"24px 20px 40px", fontFamily:"'Nunito', sans-serif" }}>
            <div style={{ width:"40px", height:"4px", borderRadius:"2px", background:"#E0D8D0", margin:"0 auto 20px" }}/>
            <p style={{ fontSize:"18px", fontWeight:900, color:"#2A2420", margin:"0 0 8px" }}>Đặt lại demo?</p>
            <p style={{ fontSize:"13px", color:"#5F6368", lineHeight:1.6, margin:"0 0 24px" }}>
              Tất cả dữ liệu bao gồm mục tiêu, thói quen, tiến độ sẽ bị xóa. Ứng dụng sẽ quay lại màn hình chào đón ban đầu.
            </p>
            <button
              onClick={() => {
                const keys = ["wr_onboarding","wr_habits","wr_onboarding_completed","wr_read_notifs","wr_settings_notifs","wr_fire_days"];
                // Also clear per-day completion keys
                Object.keys(localStorage).forEach(k => { if (k.startsWith("wr_")) localStorage.removeItem(k); });
                keys.forEach(k => localStorage.removeItem(k));
                setShowResetConfirm(false);
                onResetDemo?.();
              }}
              style={{ width:"100%", height:"50px", borderRadius:"16px", background:"#D95C5C", border:"none", cursor:"pointer", fontSize:"15px", fontWeight:800, color:"#FFFFFF", marginBottom:"10px", fontFamily:"'Nunito', sans-serif" }}
            >
              Đặt lại ngay
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              style={{ width:"100%", height:"50px", borderRadius:"16px", background:"#F0EAE4", border:"none", cursor:"pointer", fontSize:"15px", fontWeight:700, color:"#6A5A50", fontFamily:"'Nunito', sans-serif" }}
            >
              Hủy
            </button>
          </div>
        </>
      )}

      {/* TRỢ GIÚP */}
      <SectionTitle title="Hỗ trợ"/>
      <div style={{ margin:"0 20px 16px", background:"#FFFFFF", borderRadius:"18px", overflow:"hidden", border:"1px solid #F0EAE4" }}>
        <button onClick={() => setSub("help")} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", textAlign:"left", padding:"14px 16px", background:"none", border:"none", cursor:"pointer", borderBottom:"1px solid #F0EAE4", fontFamily:"'Nunito', sans-serif" }}>
          <span style={{ fontSize:"14px", fontWeight:600, color:"#2A2420" }}>Trợ giúp & hỗ trợ</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C0B8B0" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button onClick={() => setSub("about")} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", textAlign:"left", padding:"14px 16px", background:"none", border:"none", cursor:"pointer", fontFamily:"'Nunito', sans-serif" }}>
          <span style={{ fontSize:"14px", fontWeight:600, color:"#2A2420" }}>Về WealthRISE</span>
          <span style={{ fontSize:"12px", color:"#9A8A7A" }}>v1.0.0</span>
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <p style={{ margin:"0 20px 6px", fontSize:"12px", fontWeight:700, color:"#9A8A7A", textTransform:"uppercase", letterSpacing:"0.5px" }}>{title}</p>;
}

function Toggle({ on, onToggle }: { on:boolean; onToggle:()=>void }) {
  return (
    <button onClick={onToggle} style={{ width:"48px", height:"28px", borderRadius:"14px", border:"none", cursor:"pointer", background:on?"#F28C64":"#D0C8C0", position:"relative", flexShrink:0, transition:"background 0.2s" }}>
      <div style={{ position:"absolute", top:"3px", left:on?"23px":"3px", width:"22px", height:"22px", borderRadius:"50%", background:"#FFFFFF", transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
    </button>
  );
}
