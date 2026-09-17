import { useState } from "react";
import { useUserState } from "../state/UserStateContext";

export interface PostData {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text: string;
  image?: string;
  likes: number;
  groupName: string;
  isMine?: boolean;
}

interface Props {
  post: PostData;
  onBack: () => void;
}

export default function PostDetailScreen({ post, onBack }: Props) {
  const { userState, likePost, unlikePost } = useUserState();
  const liked = userState.likedPostIds.includes(post.id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  return (
    <div style={{ minHeight:"100%", background:"#FFF8F4", fontFamily:"'Nunito', sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"16px 20px 12px", background:"#FFFFFF", borderBottom:"1px solid #F0EAE4" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5F6368" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{ flex:1 }}>
          <p style={{ margin:0, fontSize:"15px", fontWeight:800, color:"#2A2420" }}>{post.groupName}</p>
          <p style={{ margin:0, fontSize:"11px", color:"#9A9088" }}>Bài viết trong nhóm</p>
        </div>
        <button onClick={() => setMenuOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", padding:"6px 4px", fontSize:"20px", color:"#9A9088", lineHeight:1 }}>···</button>
      </div>

      <div style={{ padding:"16px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
          <div style={{ width:"42px", height:"42px", borderRadius:"50%", background:"#F0EAE4", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px" }}>{post.avatar}</div>
          <div>
            <p style={{ margin:0, fontSize:"14px", fontWeight:700, color:"#2A2420" }}>{post.author}</p>
            <p style={{ margin:0, fontSize:"11px", color:"#9A9088" }}>{post.time}</p>
          </div>
        </div>

        <p style={{ margin:"0 0 14px", fontSize:"15px", color:"#3A3630", lineHeight:1.7 }}>{post.text}</p>
        {post.image && (
          <div style={{ height:"180px", borderRadius:"16px", background:"linear-gradient(135deg,#EDF5EF,#D0E8D2)", marginBottom:"14px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"48px" }}>{post.image}</div>
        )}

        <div style={{ paddingBottom:"12px", borderBottom:"1px solid #F0EAE4" }}>
          <span style={{ fontSize:"12px", color:"#9A9088" }}>♡ {post.likes + (liked ? 1 : 0)} lượt thích</span>
        </div>

        <div style={{ paddingTop:"10px" }}>
          <button
            onClick={() => { liked ? unlikePost(post.id) : likePost(post.id); if (!liked) showToast("Đã thích bài viết"); }}
            style={{ display:"flex", alignItems:"center", gap:"7px", background:"none", border:"none", cursor:"pointer", padding:"6px 0" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={liked?"#D95C5C":"none"} stroke={liked?"#D95C5C":"#9A9088"} strokeWidth="2" strokeLinecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <span style={{ fontSize:"14px", fontWeight:700, color:liked?"#D95C5C":"#9A9088", fontFamily:"'Nunito', sans-serif" }}>
              {liked ? "Đã thích" : "Thích"}
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:50 }}/>
          <div className="responsive-sheet" style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"min(100%, 480px)", background:"#FFFFFF", borderRadius:"24px 24px 0 0", zIndex:51, paddingBottom:"32px", fontFamily:"'Nunito', sans-serif" }}>
            <div style={{ width:"40px", height:"4px", borderRadius:"2px", background:"#E0D8D0", margin:"16px auto 12px" }}/>
            {post.isMine ? (
              <>
                <MenuRow label="Chỉnh sửa bài viết" icon="✏️" onPress={() => { setMenuOpen(false); showToast("Mở trình chỉnh sửa"); }}/>
                <MenuRow label="Xóa bài viết" icon="🗑️" onPress={() => { setMenuOpen(false); showToast("Đã xóa bài viết"); }} danger/>
              </>
            ) : (
              <>
                <MenuRow label="Sao chép liên kết" icon="🔗" onPress={() => { setMenuOpen(false); showToast("Đã sao chép liên kết"); }}/>
                <MenuRow label="Báo cáo bài viết" icon="🚩" onPress={() => { setMenuOpen(false); showToast("Đã gửi báo cáo"); }} danger/>
              </>
            )}
            <button onClick={() => setMenuOpen(false)} style={{ margin:"8px 20px 0", width:"calc(100% - 40px)", height:"46px", borderRadius:"14px", background:"#F0EAE4", border:"none", cursor:"pointer", fontSize:"14px", fontWeight:700, color:"#6A6060", fontFamily:"'Nunito', sans-serif" }}>Hủy</button>
          </div>
        </>
      )}

      {toast && (
        <div style={{ position:"fixed", bottom:"20px", left:"50%", transform:"translateX(-50%)", background:"#2A2420", color:"#FFF", padding:"10px 20px", borderRadius:"14px", fontSize:"13px", fontWeight:700, zIndex:60, whiteSpace:"nowrap", fontFamily:"'Nunito', sans-serif" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

function MenuRow({ label, icon, onPress, danger }: { label:string; icon:string; onPress:()=>void; danger?:boolean }) {
  return (
    <button onClick={onPress} style={{ display:"flex", alignItems:"center", gap:"14px", width:"100%", textAlign:"left", padding:"14px 20px", background:"none", border:"none", cursor:"pointer", borderBottom:"1px solid #F0EAE4" }}>
      <span style={{ fontSize:"18px" }}>{icon}</span>
      <span style={{ fontSize:"14px", fontWeight:700, color:danger?"#D95C5C":"#2A2420", fontFamily:"'Nunito', sans-serif" }}>{label}</span>
    </button>
  );
}
