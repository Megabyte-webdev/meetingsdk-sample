import { useRemoteVideo, type Participant } from "@afosecure/meetingsdk";
import { FiMic, FiMicOff, FiVideo, FiVideoOff } from "react-icons/fi";
import { BG_CARD, BORDER } from "../utils/styleUtil";
import AvatarPlaceholder from "./AvatarPlaceholder";

function RemoteVideoTile({ participant }: { participant: Participant }) {
  // Consume everything seamlessly via the hook using the participant's ID
  const { videoRef, isCamActive, isMicEnabled } = useRemoteVideo(
    participant.id,
  );

  const name = participant?.name || "Guest";
  return (
    <div
      className="relative w-full h-full min-h-20 rounded-xl overflow-hidden aspect-video border transition-all duration-300 group flex items-center justify-center shadow-lg"
      style={{ background: BG_CARD, borderColor: BORDER }}
    >
      {/* The hook dictates exactly when the video element safely mounts */}
      {isCamActive ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
          <AvatarPlaceholder name={name} />
        </div>
      )}

      {/* Control Overlay UI Layer */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="px-2.5 py-1 text-xs font-medium rounded-md text-white bg-black/50 backdrop-blur-md truncate max-w-[60%]">
          {name}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Video Indicators */}
          {isCamActive ? (
            <div className="p-1.5 rounded-md bg-green-500/10 backdrop-blur-md border border-green-500/20 flex items-center justify-center text-green-400 shadow-sm animate-pulse">
              <FiVideo size={14} />
            </div>
          ) : (
            <div className="p-1.5 rounded-md bg-red-500/20 backdrop-blur-md border border-red-500/30 flex items-center justify-center text-red-400 shadow-sm">
              <FiVideoOff size={14} />
            </div>
          )}

          {/* Audio Indicators */}
          {isMicEnabled ? (
            <div className="p-1.5 rounded-md bg-green-500/10 backdrop-blur-md border border-green-500/20 flex items-center justify-center text-green-400 shadow-sm animate-pulse">
              <FiMic size={14} />
            </div>
          ) : (
            <div className="p-1.5 rounded-md bg-red-500/20 backdrop-blur-md border border-red-500/30 flex items-center justify-center text-red-400 shadow-sm">
              <FiMicOff size={14} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RemoteVideoTile;
