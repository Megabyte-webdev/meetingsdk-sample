import type { Participant } from "@afosecure/meetingsdk";
import { useCallback, useRef } from "react";
import { BG_CARD, BORDER } from "../utils/styleUtil";
import AvatarPlaceholder from "./AvatarPlaceholder";

export default function LocalVideoTile({
  participant,
  attachLocalVideo,
}: {
  participant: Participant;
  attachLocalVideo: (el: HTMLVideoElement | null) => void;
}) {
  const lastStreamRef = useRef<MediaStream | null>(null);

  const videoRef = useCallback(
    (el: HTMLVideoElement | null) => {
      attachLocalVideo(el);

      if (!el) return;

      const stream = participant?.media?.stream;
      if (!stream) return;

      // prevent re-mount / flicker
      if (lastStreamRef.current === stream) return;
      lastStreamRef.current = stream;

      if (el.srcObject !== stream) {
        el.srcObject = stream;
      }

      el.muted = true; // local echo prevention
      el.playsInline = true;
      el.autoplay = true;

      el.play().catch(() => {});
    },
    [participant?.media?.stream, attachLocalVideo],
  );

  const camEnabled = !!participant?.media?.camEnabled;

  return (
    <div
      className="relative w-full h-full min-h-20 rounded-xl overflow-hidden aspect-video border transition-all duration-300 group flex items-center justify-center shadow-lg"
      style={{ background: BG_CARD, borderColor: BORDER }}
    >
      {camEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1]"
        />
      ) : (
        <AvatarPlaceholder name={participant.name || "You"} />
      )}

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="px-2.5 py-1 text-xs font-medium rounded-md text-white bg-black/50 backdrop-blur-md flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-md bg-emerald-400 animate-pulse" />
          {participant.name || "You"} (You)
        </div>
      </div>
    </div>
  );
}
