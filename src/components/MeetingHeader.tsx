import { FiUsers } from "react-icons/fi";
import {
  ACCENT,
  ACCENT_DIM,
  BG_CARD,
  BG_PANEL,
  BORDER,
  RED,
  TEXT,
  TEXT_MUTED,
} from "../utils/styleUtil";

interface MeetingHeaderProps {
  roomTitle: string;
  roomId: string;
  totalParticipants: number;
  chatOpen: boolean;
  unread: number;
  toggleChat: () => void;
  handleLeave: () => void;
  isScreenSharing: boolean;
  onToggleScreenShare: () => void;
  micEnabled: boolean;
  camEnabled: boolean;
  onToggleMic: (enabled: boolean) => void;
  onToggleCam: (enabled: boolean) => void;
}

export default function MeetingHeader({
  roomTitle,
  roomId,
  totalParticipants,
  chatOpen,
  unread,
  toggleChat,
  handleLeave,
  isScreenSharing,
  onToggleScreenShare,
  micEnabled,
  camEnabled,
  onToggleMic,
  onToggleCam,
}: MeetingHeaderProps) {
  return (
    <div
      className="w-full flex items-center h-12 md:h-14 px-3 md:px-5 gap-2 md:gap-3 shrink-0 flex-nowrap"
      style={{
        background: BG_PANEL,
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      {/* Icon Indicator */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: ACCENT_DIM }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="14" height="12" rx="3" fill={ACCENT} />
          <path d="M16 9.5l5-3v11l-5-3v-5z" fill={ACCENT} />
        </svg>
      </div>

      {/* Room Title & ID */}
      <div className="hidden md:block flex-1 min-w-0">
        <div
          className="text-sm font-semibold truncate leading-none"
          style={{ color: TEXT }}
        >
          {roomTitle || "Meeting"}
        </div>
        <div
          className="text-[11px] mt-0.5 truncate font-mono"
          style={{ color: TEXT_MUTED }}
        >
          {roomId}
        </div>
      </div>

      {/* Participant Counter */}
      <div
        className="flex items-center gap-1.5 p-2 md:px-3.5 md:py-1.5 rounded-full text-[11px] md:text-xs shrink-0 ml-auto md:ml-0"
        style={{
          background: BG_CARD,
          border: `1px solid ${BORDER}`,
          color: TEXT_MUTED,
        }}
      >
        <FiUsers size={12} className="sm:hidden opacity-80" />
        <span style={{ color: TEXT }}>{totalParticipants}</span>
        <span className="hidden sm:inline">
          participant{totalParticipants !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ─── MICROPHONE TOGGLE BUTTON ─── */}
      <button
        onClick={() => onToggleMic(!micEnabled)} // Passes the inverted next-state value
        className="p-2 md:px-3.5 md:py-1.5 rounded-lg cursor-pointer shrink-0 transition-colors border flex items-center justify-center"
        title={micEnabled ? "Mute Mic" : "Unmute Mic"}
        style={{
          background: micEnabled ? BG_CARD : "rgba(239, 68, 68, 0.12)",
          color: micEnabled ? TEXT_MUTED : "#f87171",
          borderColor: micEnabled ? BORDER : "rgba(239, 68, 68, 0.25)",
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {micEnabled ? (
            <>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </>
          ) : (
            <>
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
              <path d="M17 11a7 7 0 0 1-12 5" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </>
          )}
        </svg>
      </button>

      {/* ─── CAMERA TOGGLE BUTTON ─── */}
      <button
        onClick={() => onToggleCam(!camEnabled)} // Passes the inverted next-state value
        className="p-2 md:px-3.5 md:py-1.5 rounded-lg cursor-pointer shrink-0 transition-colors border flex items-center justify-center"
        title={camEnabled ? "Disable Camera" : "Enable Camera"}
        style={{
          background: camEnabled ? BG_CARD : "rgba(239, 68, 68, 0.12)",
          color: camEnabled ? TEXT_MUTED : "#f87171",
          borderColor: camEnabled ? BORDER : "rgba(239, 68, 68, 0.25)",
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {camEnabled ? (
            <>
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </>
          ) : (
            <>
              <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34" />
              <path d="M23 7l-7 5 7 5V7z" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </>
          )}
        </svg>
      </button>

      {/* SCREEN SHARE ACTION BUTTON */}
      <button
        onClick={onToggleScreenShare}
        className="p-2 md:px-3.5 md:py-1.5 rounded-lg text-xs md:text-13 font-medium cursor-pointer shrink-0 transition-colors flex items-center gap-1.5"
        style={{
          background: isScreenSharing ? "rgba(34, 197, 94, 0.12)" : BG_CARD,
          color: isScreenSharing ? "#4ade80" : TEXT_MUTED,
          border: `1px solid ${isScreenSharing ? "rgba(34, 197, 94, 0.25)" : BORDER}`,
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <span className="hidden sm:inline">
          {isScreenSharing ? "Sharing" : "Share"}
        </span>
      </button>

      {/* Chat Action Button */}
      <button
        onClick={toggleChat}
        className="relative px-3 py-1 md:px-3.5 md:py-1.5 rounded-lg text-xs md:text-13 font-medium cursor-pointer shrink-0 transition-colors"
        style={{
          background: chatOpen ? ACCENT_DIM : BG_CARD,
          color: chatOpen ? ACCENT : TEXT_MUTED,
          border: `1px solid ${chatOpen ? ACCENT_DIM : BORDER}`,
        }}
      >
        Chat
        {unread > 0 && !chatOpen && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse"
            style={{
              background: RED || "#ef4444",
              color: "#fff",
            }}
          >
            {unread}
          </span>
        )}
      </button>

      {/* End Session Button */}
      <button
        onClick={handleLeave}
        className="px-3 py-1 md:px-4 md:py-1.5 rounded-lg text-xs md:text-13 font-semibold cursor-pointer shrink-0 transition-colors"
        style={{
          background: "rgba(239,68,68,0.12)",
          color: "#f87171",
          border: "1px solid rgba(239,68,68,0.25)",
        }}
      >
        End
      </button>
    </div>
  );
}
