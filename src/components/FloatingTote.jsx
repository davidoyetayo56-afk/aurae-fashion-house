import { useEffect, useState } from "react";

export default function FloatingTote({ count, onOpen, buttonRef, flight, notice, onDismissNotice }) {
  const [bumping, setBumping] = useState(false);

  useEffect(() => {
    if (!flight) return undefined;
    setBumping(true);
    const timer = window.setTimeout(() => setBumping(false), 760);
    return () => window.clearTimeout(timer);
  }, [flight?.id]);

  return <>
    <button
      ref={buttonRef}
      className={`floating-tote ${bumping ? "tote-bumping" : ""}`}
      type="button"
      onClick={onOpen}
      aria-label={`Open your AURAÈ tote with ${count} items`}
      title="Open your AURAÈ tote"
    >
      <svg className="floating-tote-art" viewBox="0 0 112 108" role="img" aria-label="AURAÈ black tote bag illustration">
        <defs>
          <linearGradient id="auraeToteBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#343330"/>
            <stop offset=".28" stopColor="#171716"/>
            <stop offset=".72" stopColor="#090909"/>
            <stop offset="1" stopColor="#272623"/>
          </linearGradient>
          <linearGradient id="auraeToteSide" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#080808"/>
            <stop offset="1" stopColor="#252421"/>
          </linearGradient>
          <linearGradient id="auraeToteHandle" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#111"/>
            <stop offset=".46" stopColor="#3a3834"/>
            <stop offset="1" stopColor="#0a0a0a"/>
          </linearGradient>
          <linearGradient id="auraeToteMark" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f7eddd"/>
            <stop offset="1" stopColor="#bca887"/>
          </linearGradient>
          <filter id="auraeToteShadow" x="-35%" y="-30%" width="170%" height="180%">
            <feGaussianBlur stdDeviation="4"/>
          </filter>
        </defs>
        <ellipse cx="56" cy="91" rx="39" ry="8" fill="#000" opacity=".48" filter="url(#auraeToteShadow)"/>
        <path d="M34 36 L35 24 C35 7 75 7 76 24 L77 36" fill="none" stroke="#050505" strokeWidth="9" strokeLinecap="round"/>
        <path d="M34 36 L35 24 C35 8 75 8 76 24 L77 36" fill="none" stroke="url(#auraeToteHandle)" strokeWidth="6" strokeLinecap="round"/>
        <path d="M26 30 L82 30 L91 82 Q92 86 87 87 L22 87 Q17 86 18 82Z" fill="url(#auraeToteSide)" stroke="#4a4741" strokeWidth=".8"/>
        <path d="M26 30 L82 30 L91 82 Q92 86 87 87 L22 87 Q17 86 18 82Z" fill="url(#auraeToteBody)"/>
        <path d="M26 30 L35 33 L28 84 L19 85Z" fill="#050505" opacity=".58"/>
        <path d="M82 30 L91 82 Q92 86 87 87 L80 86 L75 31Z" fill="#040404" opacity=".62"/>
        <path d="M27 31 L81 31 L88 81" fill="none" stroke="#777065" strokeOpacity=".43" strokeWidth=".7"/>
        <path d="M24 36 L85 36" stroke="#ffffff" strokeOpacity=".08" strokeWidth=".8"/>
        <path d="M34 31 L33 37 M75 31 L76 37" stroke="#bfb4a3" strokeOpacity=".38" strokeWidth="1"/>
        <text x="55" y="55" textAnchor="middle" fill="url(#auraeToteMark)" fontFamily="Georgia,serif" fontSize="9.5" letterSpacing="1.05">AURAÈ</text>
        <path d="M38 61 L72 61" stroke="#e5dac9" strokeOpacity=".4" strokeWidth=".55"/>
        <text x="55" y="68" textAnchor="middle" fill="#d7c9b5" fontFamily="Arial,sans-serif" fontSize="3.5" letterSpacing="1">DREAMS · FAITH · YOU</text>
        <path d="M24 77 L33 77" stroke="#f2e7d7" strokeOpacity=".28" strokeWidth=".8"/>
      </svg>
      <span className="floating-tote-copy"><small>AURAÈ</small><strong>YOUR TOTE</strong></span>
      <span className="floating-tote-count" aria-live="polite">{count > 99 ? "99+" : count}</span>
    </button>

    {flight && <div
      key={flight.id}
      className="tote-flight"
      aria-hidden="true"
      style={{
        left: flight.left,
        top: flight.top,
        width: flight.width,
        height: flight.height,
        "--tote-flight-x": `${flight.dx}px`,
        "--tote-flight-y": `${flight.dy}px`
      }}
    >
      <span className="tote-flight-mark">AURAÈ</span>
    </div>}

    {notice && <div className="tote-added-toast" role="status">
      <span className="tote-added-check" aria-hidden="true">✓</span>
      <div className="tote-added-message">
        <strong>ADDED TO YOUR TOTE</strong>
        <small>{notice.product.name}{notice.size && notice.size !== "One size" ? ` · Size ${notice.size}` : ""} · Qty {notice.qty}</small>
      </div>
      <button type="button" onClick={onOpen}>VIEW BAG ↗</button>
      <button className="tote-toast-dismiss" type="button" onClick={onDismissNotice} aria-label="Dismiss added to tote message">×</button>
    </div>}
  </>;
}
