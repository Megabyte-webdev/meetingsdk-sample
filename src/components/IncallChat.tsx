import React, { useEffect, useRef, useState } from "react";
import {
  ACCENT,
  ACCENT_DIM,
  BG_CARD,
  BG_PANEL,
  BORDER,
  inputStyle,
  TEXT,
  TEXT_MUTED,
} from "../utils/styleUtil";
import { useMeeting } from "@afosecure/meetingsdk";

const IncallChat = ({
  setChatOpen,
  chatOpen,
}: {
  setChatOpen: React.Dispatch<
    React.SetStateAction<"chat" | "none" | "participants">
  >;
  chatOpen: boolean;
}) => {
  const { localParticipant, usePubSub } = useMeeting();
  const { publish, messages: sdkMessages } = usePubSub("SECURE_CHAT");
  const [draft, setDraft] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messages = Array.from(sdkMessages?.values() ?? []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatOpen) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    publish({ message: text });
    setDraft("");
  };

  return (
    <div
      className="w-full md:w-75 shrink-0 flex flex-col h-full"
      style={{ background: BG_PANEL }}
    >
      {/* Chat header */}
      <div
        className="hidden md:flex px-4 py-3 border-b justify-between items-center shrink-0"
        style={{ borderColor: BORDER }}
      >
        <h3 className="m-0 text-sm font-semibold" style={{ color: TEXT }}>
          Chat
        </h3>
        <button
          onClick={() => setChatOpen("none")}
          className="bg-transparent border-none text-xl p-0 cursor-pointer outline-none"
          style={{ color: TEXT_MUTED }}
        >
          ✕
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto py-3 px-3.5 flex flex-col gap-2.5">
        {messages.length === 0 && (
          <p
            className="text-xs text-center mt-10"
            style={{ color: TEXT_MUTED }}
          >
            No messages yet. Say hi!
          </p>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender_id === localParticipant?.id;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <span
                className="text-[10px] mb-0.5"
                style={{ color: TEXT_MUTED }}
              >
                {isMe ? "You" : msg.sender_name} ·{" "}
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <div
                className={`max-w-[85%] py-2 px-3 text-[13px] leading-relaxed wrap-break-word border ${
                  isMe
                    ? "rounded-t-xl rounded-bl-xl rounded-br-sm"
                    : "rounded-t-xl rounded-br-xl rounded-bl-sm"
                }`}
                style={{
                  background: isMe ? ACCENT_DIM : BG_CARD,
                  borderColor: isMe ? "rgba(79,140,255,0.3)" : BORDER,
                  color: TEXT,
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Chat input action bar */}
      <div
        className="py-3 px-3.5 border-t flex gap-2 shrink-0"
        style={{ borderColor: BORDER }}
      >
        <input
          type="text"
          placeholder="Message…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="flex-1 py-2 px-3 text-[13px] outline-none"
          style={{ ...inputStyle }}
        />
        <button
          onClick={sendMessage}
          className="py-2 px-3.5 rounded-[10px] text-[13px] font-semibold cursor-pointer shrink-0 text-white transition-opacity hover:opacity-90"
          style={{ background: ACCENT, fontFamily: "'DM Sans', sans-serif" }}
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default IncallChat;
