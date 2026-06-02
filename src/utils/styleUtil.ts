// ── Styles (shared tokens) ───────────────────────────────────────────────────
export const BG_DEEP = "#0a0b0f";
export const BG_PANEL = "#12141a";
export const BG_CARD = "#1a1d26";
export const BG_INPUT = "#1f2330";
export const BORDER = "rgba(255,255,255,0.07)";
export const ACCENT = "#4f8cff";
export const ACCENT_DIM = "#2a4a8a";
export const TEXT = "#e8eaf0";
export const TEXT_MUTED = "#6b7280";
export const RED = "#ef4444";

export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: BG_INPUT,
  border: `1px solid ${BORDER}`,
  borderRadius: 10,
  color: TEXT,
  fontSize: 14,
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
};

export const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: TEXT_MUTED,
};
