import {
  BG_DEEP,
  BG_CARD,
  BORDER,
  TEXT,
  TEXT_MUTED,
  ACCENT,
  ACCENT_DIM,
  RED,
} from "../utils/styleUtil";

interface EntryScreenProps {
  name: string;
  setName: (name: string) => void;
  roomId: string;
  setRoomId: (id: string) => void;
  roomTitle: string;
  setRoomTitle: (title: string) => void;
  error: string;
  isJoining: boolean;
  isGenerating: boolean;
  onGenerateRoom: () => void;
  onJoin: () => void;
}

export default function EntryScreen({
  name,
  setName,
  roomId,
  setRoomId,
  roomTitle,
  setRoomTitle,
  error,
  isJoining,
  isGenerating,
  onGenerateRoom,
  onJoin,
}: EntryScreenProps) {
  return (
    <div
      className="w-full h-full overflow-y-auto flex flex-col items-center justify-center p-4 md:p-8"
      style={{ background: BG_DEEP, fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center gap-2 mb-2">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-1"
            style={{ background: ACCENT_DIM }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="6" width="14" height="12" rx="3" fill={ACCENT} />
              <path d="M16 9.5l5-3v11l-5-3v-5z" fill={ACCENT} />
            </svg>
          </div>
          <h1
            className="text-xl md:text-2xl font-bold tracking-tight"
            style={{ color: TEXT }}
          >
            Defcomm Secure Meetings
          </h1>
          <p
            className="text-xs md:text-sm max-w-md"
            style={{ color: TEXT_MUTED }}
          >
            Encrypted WebRTC communication interface for decentralized real-time
            operations.
          </p>
        </div>

        {/* Global Error Prompt */}
        {error && (
          <div
            className="w-full p-3 rounded-xl border text-xs md:text-sm font-medium flex items-center gap-2.5 animate-headShake"
            style={{
              background: "rgba(239,68,68,0.08)",
              borderColor: "rgba(239,68,68,0.25)",
              color: RED || "#f87171",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Card Module 1: Provision System (Create Room) */}
          <div
            className="p-5 md:p-6 rounded-2xl border flex flex-col justify-between gap-6"
            style={{ background: BG_CARD, borderColor: BORDER }}
          >
            <div className="flex flex-col gap-4">
              <div>
                <h2
                  className="text-sm font-semibold uppercase tracking-wider mb-1"
                  style={{ color: ACCENT }}
                >
                  Provision Channel
                </h2>
                <p className="text-xs" style={{ color: TEXT_MUTED }}>
                  Initialize a new meeting endpoint instance on the
                  communications router.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: TEXT }}>
                  Room Call Sign / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Tactical Briefing Alpha"
                  value={roomTitle}
                  onChange={(e) => {
                    console.log("changing room title:", e.target.value);
                    setRoomTitle(e.target.value);
                  }}
                  className="w-full h-10 px-3 text-sm rounded-lg bg-black/20 border outline-none focus:border-opacity-100 transition-all placeholder:text-neutral-600 font-medium"
                  style={{ borderColor: BORDER, color: TEXT }}
                />
              </div>
            </div>

            <button
              onClick={onGenerateRoom}
              disabled={isGenerating}
              className="w-full h-10 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors flex items-center justify-center gap-2"
              style={{
                background: ACCENT_DIM,
                color: ACCENT,
                border: `1px solid ${ACCENT_DIM}`,
              }}
            >
              {isGenerating ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                "Generate Secure Token"
              )}
            </button>
          </div>

          {/* Card Module 2: Authentication (Join Room) */}
          <div
            className="p-5 md:p-6 rounded-2xl border flex flex-col justify-between gap-6"
            style={{ background: BG_CARD, borderColor: BORDER }}
          >
            <div className="flex flex-col gap-4">
              <div>
                <h2
                  className="text-sm font-semibold uppercase tracking-wider mb-1"
                  style={{ color: TEXT }}
                >
                  Connect to Node
                </h2>
                <p className="text-xs" style={{ color: TEXT_MUTED }}>
                  Authenticate credentials to attach local peripherals to an
                  active room room ID.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-medium"
                    style={{ color: TEXT }}
                  >
                    Operator Identity Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 text-sm rounded-lg bg-black/20 border outline-none transition-all placeholder:text-neutral-600 font-medium"
                    style={{ borderColor: BORDER, color: TEXT }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-medium"
                    style={{ color: TEXT }}
                  >
                    Target Room Identifier Token
                  </label>
                  <input
                    type="text"
                    placeholder="Paste or enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full h-10 px-3 text-sm rounded-lg bg-black/20 border outline-none transition-all placeholder:text-neutral-600 font-mono font-medium tracking-wide"
                    style={{ borderColor: BORDER, color: TEXT }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={onJoin}
              disabled={isJoining}
              className="w-full h-10 rounded-lg text-xs font-bold cursor-pointer shrink-0 transition-colors flex items-center justify-center gap-2"
              style={{
                background: ACCENT,
                color: BG_DEEP,
              }}
            >
              {isJoining ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                "Establish Connection"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
