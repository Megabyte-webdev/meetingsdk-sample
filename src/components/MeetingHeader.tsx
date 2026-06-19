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
import {
  FiUsers,
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiMonitor,
  FiMessageCircle,
} from "react-icons/fi";

interface MeetingHeaderProps {
  roomTitle: string;
  roomId: string;
  totalParticipants: number;
  chatOpen: boolean;
  unread: number;
  toggleChat: () => void;
  togglePartcipant: () => void;
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
  togglePartcipant,
}: MeetingHeaderProps) {
  console.log(roomTitle);

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
      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-semibold truncate leading-none"
          style={{ color: TEXT }}
          title={roomTitle || "Defcomm"}
        >
          {roomTitle || "Defcomm"}
        </div>
        <div
          className="text-[11px] mt-0.5 truncate font-mono"
          style={{ color: TEXT_MUTED }}
          title={roomId}
        >
          {roomId}
        </div>
      </div>

      {/* Participant Counter */}
      <div
        onClick={togglePartcipant}
        className="cursor-pointer flex items-center gap-1.5 p-2 md:px-3.5 md:py-1.5 rounded-full text-[11px] md:text-xs shrink-0 ml-auto md:ml-0"
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
        onClick={() => onToggleMic(!micEnabled)}
        className="p-2 md:px-3.5 md:py-1.5 rounded-lg cursor-pointer shrink-0 transition-colors border flex items-center justify-center"
        title={micEnabled ? "Mute Mic" : "Unmute Mic"}
        style={{
          background: micEnabled ? BG_CARD : "rgba(239, 68, 68, 0.12)",
          color: micEnabled ? TEXT_MUTED : "#f87171",
          borderColor: micEnabled ? BORDER : "rgba(239, 68, 68, 0.25)",
        }}
      >
        {micEnabled ? <FiMic size={15} /> : <FiMicOff size={15} />}
      </button>

      {/* ─── CAMERA TOGGLE BUTTON ─── */}
      <button
        onClick={() => onToggleCam(!camEnabled)}
        className="p-2 md:px-3.5 md:py-1.5 rounded-lg cursor-pointer shrink-0 transition-colors border flex items-center justify-center"
        title={camEnabled ? "Disable Camera" : "Enable Camera"}
        style={{
          background: camEnabled ? BG_CARD : "rgba(239, 68, 68, 0.12)",
          color: camEnabled ? TEXT_MUTED : "#f87171",
          borderColor: camEnabled ? BORDER : "rgba(239, 68, 68, 0.25)",
        }}
      >
        {camEnabled ? <FiVideo size={15} /> : <FiVideoOff size={15} />}
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
        <FiMonitor size={12} />
        <span className="hidden sm:inline">
          {isScreenSharing ? "Sharing" : "Share"}
        </span>
      </button>

      {/* Chat Action Button */}
      <button
        onClick={toggleChat}
        className="relative px-3 py-1 md:px-3.5 md:py-1.5 rounded-lg text-xs md:text-13 font-medium cursor-pointer shrink-0 transition-colors flex items-center gap-2"
        style={{
          background: chatOpen ? ACCENT_DIM : BG_CARD,
          color: chatOpen ? ACCENT : TEXT_MUTED,
          border: `1px solid ${chatOpen ? ACCENT_DIM : BORDER}`,
        }}
      >
        <FiMessageCircle size={14} />

        <span className="hidden sm:inline">Chat</span>

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
