import { useEffect, useRef } from "react";
import type { Participant } from "@afosecure/meetingsdk";
import RemoteVideoTile from "./RemoteVideoTile";
import LocalVideoTile from "./LocalVideoTile";

interface GridParticipant extends Participant {
  isLocal?: boolean;
}

interface VideoGridProps {
  remoteParticipants: Participant[];
  localParticipant: Participant | null;
  attachLocalVideo: (el: HTMLVideoElement | null) => void;
  roomId: string;
  presenterId: string | null;
}

export default function VideoGrid({
  remoteParticipants,
  localParticipant,
  attachLocalVideo,
  presenterId,
}: VideoGridProps) {
  const stageVideoRef = useRef<HTMLVideoElement>(null);

  const isLocalPresenting = !!(
    localParticipant && presenterId === localParticipant.id
  );
  const activePresenter = isLocalPresenting
    ? localParticipant
    : remoteParticipants.find((p) => p.id === presenterId);

  const hasActivePresenter = !!presenterId && !!activePresenter;

  const sharedStream = activePresenter?.media?.screenStream;
  const sharedTrack = (activePresenter?.media as any)?.screenTrack;

  useEffect(() => {
    const videoEl = stageVideoRef.current;
    if (!videoEl || !hasActivePresenter) return;

    const currentStream = videoEl.srcObject as MediaStream | null;
    const currentTrack = currentStream?.getVideoTracks()[0];

    if (sharedTrack && sharedTrack.kind === "video") {
      if (!currentTrack || currentTrack.id !== sharedTrack.id) {
        const newStream = new MediaStream([sharedTrack]);

        const audioTrack = sharedStream?.getAudioTracks()[0];
        if (audioTrack) {
          newStream.addTrack(audioTrack);
        }

        videoEl.srcObject = newStream;
      }
    } else {
      videoEl.srcObject = null;
    }

    videoEl.play().catch((err) => {
      console.warn("Screen share stage autoplay fallback invoked:", err);
    });
  }, [sharedTrack, sharedStream, hasActivePresenter]);

  const allParticipants: GridParticipant[] = [
    ...(localParticipant ? [{ ...localParticipant, isLocal: true }] : []),
    ...remoteParticipants,
  ];

  const totalFeeds = allParticipants.length;
  const isAlone = totalFeeds <= 1;

  const getStandardGridClass = () => {
    if (isAlone) return "grid-cols-1 w-full h-full max-w-none";
    if (totalFeeds === 2)
      return "grid-cols-1 sm:grid-cols-2 max-w-5xl mx-auto w-full h-auto md:h-full";
    if (totalFeeds <= 4)
      return "grid-cols-1 sm:grid-cols-2 w-full h-auto md:h-full";
    if (totalFeeds <= 6)
      return "grid-cols-2 md:grid-cols-3 w-full h-auto md:h-full";
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full h-auto md:h-full";
  };

  return (
    <div className="w-full h-full p-3 md:p-4 flex flex-col lg:flex-row gap-4 overflow-hidden bg-neutral-950 select-none">
      {/* ─── SCREEN SHARE DISPLAY STAGE ─── */}
      {hasActivePresenter && (
        <div className="flex-[3_3_0%] relative bg-black rounded-xl overflow-hidden border border-white/5 flex items-center justify-center min-h-[45%] lg:min-h-0 w-full shadow-2xl">
          <video
            ref={stageVideoRef}
            autoPlay
            playsInline
            muted={isLocalPresenting}
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-3 left-3 px-2.5 py-1 text-[11px] bg-black/80 backdrop-blur-md rounded font-mono text-neutral-300 tracking-wide border border-white/10 uppercase shadow-md z-10">
            {isLocalPresenting
              ? "Your Screen"
              : `Presentation: ${activePresenter?.name}`}
          </div>
        </div>
      )}

      {/* ─── WEBCAM TILES SECTION ─── */}
      <div
        className={`transition-all duration-300 ${
          hasActivePresenter
            ? "w-full h-40 shrink-0 overflow-x-auto overflow-y-hidden lg:h-full lg:w-72 lg:overflow-y-auto lg:overflow-x-hidden border-t border-white/5 pt-2 lg:border-t-0 lg:pt-0"
            : "w-full h-full overflow-y-auto flex items-center justify-center"
        }`}
      >
        {hasActivePresenter ? (
          <div className="flex flex-row lg:flex-col gap-3 h-full w-full items-center lg:items-start lg:h-auto">
            {allParticipants.map((participant, index) => {
              const elementKey = participant.isLocal
                ? "local-feed"
                : participant.id || `remote-${index}`;
              return (
                <div
                  key={elementKey}
                  className="w-48 sm:w-56 lg:w-full shrink-0 aspect-video"
                >
                  {participant.isLocal ? (
                    <LocalVideoTile
                      participant={participant}
                      attachLocalVideo={attachLocalVideo}
                    />
                  ) : (
                    <RemoteVideoTile participant={participant} />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className={`grid gap-3 md:gap-4 items-center justify-center ${getStandardGridClass()} ${
              isAlone
                ? "auto-rows-fr"
                : "auto-rows-[180px] sm:auto-rows-[220px] md:auto-rows-fr"
            }`}
          >
            {allParticipants.map((participant, index) => {
              if (participant.isLocal) {
                return (
                  <LocalVideoTile
                    key="local-feed"
                    participant={participant}
                    attachLocalVideo={attachLocalVideo}
                  />
                );
              }
              return (
                <RemoteVideoTile
                  key={participant.id || `remote-${index}`}
                  participant={participant}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
