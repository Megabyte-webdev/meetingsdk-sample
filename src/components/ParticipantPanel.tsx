import React from "react";
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiUser } from "react-icons/fi";
import { useLocalParticipant, useParticipants } from "@afosecure/meetingsdk";
import { BG_PANEL, BORDER, TEXT, TEXT_MUTED } from "../utils/styleUtil";

interface ParticipantPanelProps {
  setPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ParticipantPanel({
  setPanelOpen,
}: ParticipantPanelProps) {
  const remoteParticipants = useParticipants();
  const { participant: localParticipant } = useLocalParticipant();

  // Combine local and remote participants for unified listing
  const allParticipants = [
    ...(localParticipant ? [{ ...localParticipant, isLocal: true }] : []),
    ...remoteParticipants,
  ];

  return (
    <div
      className="w-full md:w-80 shrink-0 flex flex-col h-full"
      style={{ background: BG_PANEL }}
    >
      {/* Panel Header */}
      <div
        className="hidden md:flex px-4 py-3 border-b justify-between items-center shrink-0"
        style={{ borderColor: BORDER }}
      >
        <h3
          className="m-0 text-sm font-semibold flex items-center gap-2"
          style={{ color: TEXT }}
        >
          <span>Participants</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full bg-black/20 font-mono"
            style={{ color: TEXT_MUTED }}
          >
            {allParticipants.length}
          </span>
        </h3>
        <button
          onClick={() => setPanelOpen(false)}
          className="bg-transparent border-none text-xl p-0 cursor-pointer outline-none transition-opacity hover:opacity-80"
          style={{ color: TEXT_MUTED }}
        >
          ✕
        </button>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-1">
        {allParticipants.map((participant, index) => {
          // Adjust these property accessors depending on your exact @afosecure/meetingsdk type definitions
          const name = participant.name || "Unknown Participant";
          const isMicOn = participant?.media?.micEnabled ?? false;
          const isCamOn = participant?.media?.camEnabled ?? false;
          const isLocal = (participant as any)?.isLocal ?? false;

          return (
            <div
              key={participant.id || `participant-${index}`}
              className="flex items-center justify-between p-2.5 rounded-lg transition-colors hover:bg-white/5"
            >
              {/* Left Side: Avatar Indicator & Name Label */}
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 border text-xs font-medium"
                  style={{
                    borderColor: BORDER,
                    background: isLocal
                      ? "rgba(79,140,255,0.15)"
                      : "rgba(255,255,255,0.05)",
                    color: isLocal ? "#4f8cff" : TEXT,
                  }}
                >
                  <FiUser size={13} />
                </div>
                <span
                  className="text-[13px] font-medium truncate"
                  style={{ color: TEXT }}
                >
                  {name}{" "}
                  {isLocal && (
                    <span
                      style={{ color: TEXT_MUTED }}
                      className="text-[11px] font-normal ml-1"
                    >
                      (You)
                    </span>
                  )}
                </span>
              </div>

              {/* Right Side: Media Streaming Device Tracks Status Layout */}
              <div className="flex items-center gap-3.5 shrink-0 pl-1">
                {/* Audio Track Indicator */}
                <div className="transition-colors duration-150">
                  {isMicOn ? (
                    <FiMic
                      size={14}
                      className="text-emerald-500"
                      title="Microphone is active"
                    />
                  ) : (
                    <FiMicOff
                      size={14}
                      className="text-rose-500/80"
                      title="Microphone muted"
                    />
                  )}
                </div>

                {/* Video Track Indicator */}
                <div className="transition-colors duration-150">
                  {isCamOn ? (
                    <FiVideo
                      size={14}
                      className="text-emerald-500"
                      title="Camera is streaming"
                    />
                  ) : (
                    <FiVideoOff
                      size={14}
                      className="text-rose-500/80"
                      title="Camera disabled"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
