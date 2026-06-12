import { useRemoteMedia, type Participant } from "@afosecure/meetingsdk";
import { FiMic, FiMicOff, FiVideo, FiVideoOff } from "react-icons/fi";
import { BG_CARD, BORDER } from "../utils/styleUtil";
import AvatarPlaceholder from "./AvatarPlaceholder";

function RemoteVideoTile({ participant }: { participant: Participant }) {
  const { videoRef, audioRef, isCamActive, isMicEnabled } = useRemoteMedia(
    participant.id,
  );

  const name = participant?.name || "Guest";

  return (
    <div
      className="relative w-full h-full min-h-20 rounded-xl overflow-hidden aspect-video border transition-all duration-300 group flex items-center justify-center shadow-lg"
      style={{ background: BG_CARD, borderColor: BORDER }}
    >
      {/* VIDEO */}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-200 ${
          isCamActive ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* AVATAR OVERLAY ONLY */}
      {!isCamActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <AvatarPlaceholder name={participant.name || "You"} />
        </div>
      )}

      {/* AUDIO (hidden but REQUIRED for playback) */}
      <audio ref={audioRef} autoPlay playsInline />

      {/* UI Overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="px-2.5 py-1 text-xs font-medium rounded-md text-white bg-black/50 backdrop-blur-md truncate max-w-[60%]">
          {name}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Video status */}
          {isCamActive ? (
            <div className="p-1.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 animate-pulse">
              <FiVideo size={14} />
            </div>
          ) : (
            <div className="p-1.5 rounded-md bg-red-500/20 border border-red-500/30 text-red-400">
              <FiVideoOff size={14} />
            </div>
          )}

          {/* Mic status */}
          {isMicEnabled ? (
            <div className="p-1.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 animate-pulse">
              <FiMic size={14} />
            </div>
          ) : (
            <div className="p-1.5 rounded-md bg-red-500/20 border border-red-500/30 text-red-400">
              <FiMicOff size={14} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RemoteVideoTile;
