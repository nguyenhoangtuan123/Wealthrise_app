import { useState } from "react";

interface Props {
  onClose: () => void;
  onToast?: (msg: string) => void;
}

type View = "main" | "groups" | "friends";

const MY_GROUPS = [
  { id:"g1", name:"Sống năng động mỗi ngày", emoji:"✨", color:"#EDF5EF", accent:"#7B987E" },
  { id:"g2", name:"Ngủ tốt hơn cùng nhau",   emoji:"🌙", color:"#F2EDF8", accent:"#A896CC" },
];

const FRIENDS = [
  { id:"f1", name:"Lan Phương", avatar:"🌸", sub:"Bạn bè · Hoạt động hôm nay" },
  { id:"f2", name:"Thanh Tuấn", avatar:"🧑", sub:"Bạn bè · 2 giờ trước" },
  { id:"f3", name:"Hoa",        avatar:"🌺", sub:"Bạn bè · Hôm qua" },
  { id:"f4", name:"Nam",        avatar:"🧑‍💻", sub:"Bạn bè · 3 ngày trước" },
];

export default function ShareSheet({ onClose, onToast }: Props) {
  const [view, setView]               = useState<View>("main");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [friendQuery, setFriendQuery] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<Set<string>>(new Set());

  const toast = (msg: string) => { onToast?.(msg); onClose(); };

  const copyLink = () => toast("Đã sao chép liên kết");
  const nativeShare = () => toast("Mở ứng dụng bên ngoài...");

  const filteredFriends = FRIENDS.filter(f =>
    f.name.toLowerCase().includes(friendQuery.toLowerCase())
  );

  const toggleFriend = (id: string) => {
    setSelectedFriends(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  /* ── Main view ── */
  if (view === "main") return (
    <>
      <Overlay onClose={onClose}/>
      <Sheet>
        <Handle/>
        <SheetTitle>Chia sẻ bài viết</SheetTitle>

        <OptionRow icon="👥" label="Chia sẻ vào nhóm"       sub="Đăng vào nhóm của bạn"      onPress={() => setView("groups")}/>
        <OptionRow icon="💬" label="Gửi cho bạn bè"          sub="Gửi tin nhắn riêng"          onPress={() => setView("friends")}/>
        <OptionRow icon="🔗" label="Sao chép liên kết"       sub="Sao chép URL bài viết"       onPress={copyLink}/>
        <OptionRow icon="📤" label="Chia sẻ qua ứng dụng khác" sub="Zalo, Facebook, ..."        onPress={nativeShare} last/>

        <CancelBtn onPress={onClose}/>
      </Sheet>
    </>
  );

  /* ── Share to group ── */
  if (view === "groups") return (
    <>
      <Overlay onClose={onClose}/>
      <Sheet tall>
        <Handle/>
        <SheetTitle>Chọn nhóm để chia sẻ</SheetTitle>

        {MY_GROUPS.map(g => (
          <button key={g.id} onClick={() => setSelectedGroup(g.id)} style={{
            display:"flex", alignItems:"center", gap:"12px", width:"100%", textAlign:"left",
            padding:"12px 20px", background:"none", border:"none", cursor:"pointer",
            borderBottom:"1px solid #F0EAE4",
          }}>
            <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:g.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", flexShrink:0 }}>{g.emoji}</div>
            <span style={{ flex:1, fontSize:"14px", fontWeight:700, color:"#2A2420", fontFamily:"'Nunito', sans-serif" }}>{g.name}</span>
            <div style={{ width:"22px", height:"22px", borderRadius:"50%", border:`2px solid ${selectedGroup===g.id?g.accent:"#D0C8C0"}`, background:selectedGroup===g.id?g.accent:"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {selectedGroup === g.id && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
          </button>
        ))}

        {/* Post preview */}
        {selectedGroup && (
          <div style={{ margin:"14px 20px", padding:"12px 14px", background:"#F8F5F0", borderRadius:"14px" }}>
            <p style={{ margin:"0 0 4px", fontSize:"12px", color:"#9A9088" }}>Xem trước bài viết</p>
            <p style={{ margin:0, fontSize:"13px", color:"#3A3630", lineHeight:1.5 }}>Hôm nay mình đã đi bộ 20 phút buổi sáng. Cảm giác tuyệt vời hơn nhiều so với tuần trước 💪</p>
          </div>
        )}

        <div style={{ padding:"12px 20px 0", display:"flex", gap:"8px" }}>
          <button onClick={() => setView("main")} style={{ flex:1, height:"44px", borderRadius:"14px", background:"#F0EAE4", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:700, color:"#6A6060", fontFamily:"'Nunito', sans-serif" }}>Quay lại</button>
          <button onClick={() => selectedGroup && toast("Đã chia sẻ vào nhóm")} style={{ flex:2, height:"44px", borderRadius:"14px", background: selectedGroup?"#D95C5C":"#E0D8D0", border:"none", cursor: selectedGroup?"pointer":"default", fontSize:"13px", fontWeight:700, color:"#FFFFFF", fontFamily:"'Nunito', sans-serif" }}>Chia sẻ</button>
        </div>
      </Sheet>
    </>
  );

  /* ── Send to friend ── */
  return (
    <>
      <Overlay onClose={onClose}/>
      <Sheet tall>
        <Handle/>
        <SheetTitle>Gửi cho bạn bè</SheetTitle>

        {/* Search */}
        <div style={{ margin:"0 20px 12px", display:"flex", alignItems:"center", gap:"8px", background:"#F8F5F0", borderRadius:"12px", padding:"0 12px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A9088" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={friendQuery} onChange={e=>setFriendQuery(e.target.value)} placeholder="Tìm kiếm..." style={{ flex:1, height:"38px", border:"none", background:"transparent", fontSize:"13px", color:"#2A2420", fontFamily:"'Nunito', sans-serif", outline:"none" }}/>
        </div>

        {filteredFriends.map(f => (
          <button key={f.id} onClick={() => toggleFriend(f.id)} style={{ display:"flex", alignItems:"center", gap:"12px", width:"100%", textAlign:"left", padding:"12px 20px", background:"none", border:"none", cursor:"pointer", borderBottom:"1px solid #F0EAE4" }}>
            <div style={{ width:"40px", height:"40px", borderRadius:"50%", background:"#F0EAE4", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", flexShrink:0 }}>{f.avatar}</div>
            <div style={{ flex:1 }}>
              <p style={{ margin:0, fontSize:"14px", fontWeight:700, color:"#2A2420", fontFamily:"'Nunito', sans-serif" }}>{f.name}</p>
              <p style={{ margin:0, fontSize:"11px", color:"#9A9088", fontFamily:"'Nunito', sans-serif" }}>{f.sub}</p>
            </div>
            <div style={{ width:"22px", height:"22px", borderRadius:"50%", border:`2px solid ${selectedFriends.has(f.id)?"#D95C5C":"#D0C8C0"}`, background:selectedFriends.has(f.id)?"#D95C5C":"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {selectedFriends.has(f.id) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
          </button>
        ))}

        <div style={{ padding:"12px 20px 0", display:"flex", gap:"8px" }}>
          <button onClick={() => setView("main")} style={{ flex:1, height:"44px", borderRadius:"14px", background:"#F0EAE4", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:700, color:"#6A6060", fontFamily:"'Nunito', sans-serif" }}>Quay lại</button>
          <button onClick={() => selectedFriends.size > 0 && toast("Đã gửi bài viết")} style={{ flex:2, height:"44px", borderRadius:"14px", background:selectedFriends.size>0?"#D95C5C":"#E0D8D0", border:"none", cursor:selectedFriends.size>0?"pointer":"default", fontSize:"13px", fontWeight:700, color:"#FFFFFF", fontFamily:"'Nunito', sans-serif" }}>
            Gửi{selectedFriends.size > 0 ? ` (${selectedFriends.size})` : ""}
          </button>
        </div>
      </Sheet>
    </>
  );
}

/* ── Shared sub-components ── */

function Overlay({ onClose }: { onClose: () => void }) {
  return <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.40)", zIndex:50 }}/>;
}

function Sheet({ children, tall }: { children: React.ReactNode; tall?: boolean }) {
  return (
    <div className="responsive-sheet" style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"min(100%, 480px)", background:"#FFFFFF", borderRadius:"24px 24px 0 0", zIndex:51, paddingBottom:"32px", fontFamily:"'Nunito', sans-serif", maxHeight: tall ? "70%" : "auto", overflowY: tall ? "auto" : "visible" }}>
      {children}
    </div>
  );
}

function Handle() {
  return <div style={{ width:"40px", height:"4px", borderRadius:"2px", background:"#E0D8D0", margin:"16px auto 0" }}/>;
}

function SheetTitle({ children }: { children: React.ReactNode }) {
  return <p style={{ margin:"12px 0 8px 20px", fontSize:"16px", fontWeight:800, color:"#2A2420" }}>{children}</p>;
}

function OptionRow({ icon, label, sub, onPress, last }: { icon:string; label:string; sub:string; onPress:()=>void; last?:boolean }) {
  return (
    <button onClick={onPress} style={{ display:"flex", alignItems:"center", gap:"14px", width:"100%", textAlign:"left", padding:"14px 20px", background:"none", border:"none", cursor:"pointer", borderBottom:last?"none":"1px solid #F0EAE4" }}>
      <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"#F8F5F0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>{icon}</div>
      <div>
        <p style={{ margin:0, fontSize:"14px", fontWeight:700, color:"#2A2420" }}>{label}</p>
        <p style={{ margin:0, fontSize:"12px", color:"#9A9088" }}>{sub}</p>
      </div>
    </button>
  );
}

function CancelBtn({ onPress }: { onPress: () => void }) {
  return (
    <button onClick={onPress} style={{ margin:"12px 20px 0", width:"calc(100% - 40px)", height:"48px", borderRadius:"14px", background:"#F0EAE4", border:"none", cursor:"pointer", fontSize:"14px", fontWeight:700, color:"#6A6060", fontFamily:"'Nunito', sans-serif" }}>
      Hủy
    </button>
  );
}
