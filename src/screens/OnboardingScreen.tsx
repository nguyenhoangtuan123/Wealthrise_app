import WealthRISELogo from "../components/WealthRISELogo";

interface Props {
  onNext: () => void;
  onLogin?: () => void;
}

export default function OnboardingScreen({ onNext }: Props) {
  return (
    <div className="welcome-screen" style={{
      height: "100%", background: "#FFF8F4",
      display: "flex", flexDirection: "column",
      overflow: "hidden", position: "relative",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Full-bleed atmospheric illustration */}
      <div className="welcome-art" style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0 }}>
        <svg
          viewBox="0 0 390 480"
          preserveAspectRatio="xMidYMax slice"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Atmospheric sky — warm dawn, no cartoon sun */}
            <linearGradient id="wr-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#FCEBD8"/>
              <stop offset="38%"  stopColor="#F9D4B0"/>
              <stop offset="68%"  stopColor="#F4B88A"/>
              <stop offset="100%" stopColor="#EFA070" stopOpacity="0.6"/>
            </linearGradient>
            {/* Soft horizon glow — replaces cartoon sun */}
            <radialGradient id="wr-glow" cx="50%" cy="58%" r="42%">
              <stop offset="0%"   stopColor="#FFE8C0" stopOpacity="0.85"/>
              <stop offset="55%"  stopColor="#F9C880" stopOpacity="0.35"/>
              <stop offset="100%" stopColor="#F4A860" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="wr-hill1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C8D8B8"/>
              <stop offset="100%" stopColor="#A8C098"/>
            </linearGradient>
            <linearGradient id="wr-hill2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8DAA8F"/>
              <stop offset="100%" stopColor="#6E8E70"/>
            </linearGradient>
            <linearGradient id="wr-hill3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5A7A5C"/>
              <stop offset="100%" stopColor="#3E5C40"/>
            </linearGradient>
            <linearGradient id="wr-path" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8D0A0" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#D4B880" stopOpacity="0.4"/>
            </linearGradient>
            <linearGradient id="wr-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C8D8E8" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#A8C0D8" stopOpacity="0.3"/>
            </linearGradient>
            {/* Soft clouds */}
            <filter id="soft-blur">
              <feGaussianBlur stdDeviation="3"/>
            </filter>
          </defs>

          {/* Sky */}
          <rect width="390" height="480" fill="url(#wr-sky)"/>

          {/* Horizon glow — soft atmospheric light, not a cartoon sun */}
          <ellipse cx="195" cy="270" rx="220" ry="130" fill="url(#wr-glow)"/>

          {/* Distant mist band at horizon */}
          <rect x="0" y="258" width="390" height="18" fill="#FFF8F0" opacity="0.18" rx="0"/>

          {/* Far hills — hazy, desaturated */}
          <path d="M0 290 Q40 258 90 268 Q140 278 190 255 Q240 235 290 260 Q340 282 390 268 L390 340 L0 340Z"
            fill="url(#wr-hill1)" opacity="0.55"/>

          {/* Calm water reflection at horizon */}
          <ellipse cx="195" cy="278" rx="180" ry="10" fill="url(#wr-water)"/>

          {/* Mid hills */}
          <path d="M0 318 Q55 285 115 300 Q175 314 230 290 Q285 268 345 298 L390 308 L390 480 L0 480Z"
            fill="url(#wr-hill2)"/>

          {/* Foreground hill */}
          <path d="M0 368 Q70 335 148 352 Q218 366 275 342 Q328 320 390 348 L390 480 L0 480Z"
            fill="url(#wr-hill3)"/>

          {/* Path leading toward light — subtle, not garish */}
          <path d="M145 480 Q168 420 180 385 Q188 365 195 350 Q202 365 210 385 Q222 420 245 480Z"
            fill="url(#wr-path)"/>

          {/* Silhouette of distant trees — simple, not cartoon */}
          <g opacity="0.28" fill="#2A3C2C">
            <rect x="52" y="293" width="3" height="24" rx="1.5"/>
            <path d="M46 295 Q53.5 276 61 295Z"/>
            <rect x="318" y="290" width="3" height="22" rx="1.5"/>
            <path d="M312 292 Q319.5 273 327 292Z"/>
            <rect x="336" y="296" width="2.5" height="18" rx="1.2"/>
            <path d="M331 298 Q337.5 282 344 298Z"/>
          </g>
          {/* Right cluster */}
          <g opacity="0.70">
            <rect x="332" y="258" width="4" height="44" rx="2" fill="#2A3E2A"/>
            <path d="M318 258 L334 212 L350 258Z" fill="#2A4028" opacity="0.9"/>
            <rect x="310" y="270" width="3" height="32" rx="1.5" fill="#2A3E2A"/>
            <path d="M300 270 L311.5 238 L323 270Z" fill="#324832" opacity="0.8"/>
          </g>

          {/* Figure silhouette — calm, standing, facing horizon */}
          {/* Kept as a warm silhouette, not bright skin tones — more elegant */}
          <g opacity="0.88">
            {/* legs */}
            <rect x="191" y="282" width="5" height="20" rx="2.5" fill="#3A2E28"/>
            <rect x="198" y="282" width="5" height="20" rx="2.5" fill="#3A2E28"/>
            {/* torso */}
            <rect x="188" y="258" width="18" height="26" rx="6" fill="#5A4030"/>
            {/* head */}
            <circle cx="197" cy="251" r="10" fill="#5A4030"/>
            {/* arms — relaxed at sides, slight outward */}
            <path d="M188 264 Q178 268 175 278" stroke="#5A4030" strokeWidth="5" strokeLinecap="round"/>
            <path d="M206 264 Q216 268 219 278" stroke="#5A4030" strokeWidth="5" strokeLinecap="round"/>
          </g>

          {/* Warm light from horizon on ground */}
          <ellipse cx="195" cy="308" rx="80" ry="12" fill="rgba(255,200,140,0.18)"/>

          {/* Foreground tall trees — elegant silhouettes */}
          <g fill="#2E4430" opacity="0.82">
            <rect x="28" y="340" width="5" height="55" rx="2.5"/>
            <path d="M20 355 Q30.5 318 41 355Z"/>
            <path d="M23 370 Q30.5 338 38 370Z"/>
            <rect x="348" y="344" width="5" height="50" rx="2.5"/>
            <path d="M340 359 Q350.5 322 361 359Z"/>
            <path d="M343 374 Q350.5 342 358 374Z"/>
          </g>

          {/* Small birds — tiny strokes, very subtle */}
          <g stroke="#B87840" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5">
            <path d="M88 195 Q92 191 96 195"/>
            <path d="M104 183 Q108 179 112 183"/>
            <path d="M272 188 Q276 184 280 188"/>
          </g>

          {/* Warm fog veil at base — blends scene into content panel */}
          <linearGradient id="wr-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF8F4" stopOpacity="0"/>
            <stop offset="100%" stopColor="#FFF8F4" stopOpacity="1"/>
          </linearGradient>
          <rect x="0" y="390" width="390" height="90" fill="url(#wr-fade)"/>
        </svg>

        {/* Logo overlaid on scene */}
        <div style={{
          position: "absolute", top: "32px", left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <WealthRISELogo size={52}/>
          <h1 style={{
            margin: "8px 0 0", fontSize: "22px", fontWeight: 700,
            color: "#3A2818", letterSpacing: "-0.3px", lineHeight: 1,
            fontFamily: "'Inter', sans-serif",
          }}>
            WealthRISE
          </h1>
          <p style={{
            margin: "4px 0 0", fontSize: "12px", fontWeight: 400, color: "#7A5A40",
            fontFamily: "'Inter', sans-serif", letterSpacing: "0.2px",
          }}>
            Sống tốt hơn, bắt đầu từ hôm nay.
          </p>
        </div>
      </div>

      {/* Content panel */}
      <div className="welcome-copy" style={{
        width: "100%", flexShrink: 0,
        background: "#FFF8F4",
        padding: "0 24px 40px",
      }}>
        <h2 style={{
          margin: "0 0 8px", fontSize: "21px", fontWeight: 700, color: "#1A1612",
          lineHeight: 1.35, letterSpacing: "-0.3px",
          fontFamily: "'Inter', sans-serif",
        }}>
          Một phiên bản khoẻ mạnh hơn<br />đang chờ bạn.
        </h2>
        <p style={{
          margin: "0 0 24px", fontSize: "14px", color: "#5F6368",
          lineHeight: 1.65, fontFamily: "'Inter', sans-serif",
        }}>
          Xây dựng thói quen nhỏ, sống có chủ đích,<br />tiến bộ mỗi ngày — cùng cộng đồng WealthRISE.
        </p>

        <button
          onClick={onNext}
          style={{
            width: "100%", height: "52px", borderRadius: "14px", border: "none", cursor: "pointer",
            background: "#F28C64", color: "#FFFFFF",
            fontSize: "15px", fontWeight: 600, fontFamily: "'Inter', sans-serif",
            boxShadow: "0 6px 24px rgba(242,140,100,0.32)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            letterSpacing: "0.1px",
          }}
        >
          Bắt đầu thôi
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>

        <p style={{
          margin: "14px 0 0", textAlign: "center", fontSize: "12px",
          color: "#9A8A7A", fontFamily: "'Inter', sans-serif",
        }}>
          Miễn phí · Không quảng cáo · Bảo mật dữ liệu
        </p>
      </div>
    </div>
  );
}
