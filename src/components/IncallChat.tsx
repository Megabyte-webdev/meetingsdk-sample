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
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  console.log(messages, localParticipant);

  return (
    <div
      style={{
        width: 300,
        flexShrink: 0,
        background: BG_PANEL,
        borderLeft: `1px solid ${BORDER}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Chat header */}
      <div
        style={{
          height: 56,
          borderBottom: `1px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          flexShrink: 0,
        }}
      >
        <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: TEXT }}>
          In-call chat
        </span>
        <button
          onClick={() => setChatOpen(false)}
          style={{
            background: "none",
            border: "none",
            color: TEXT_MUTED,
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            padding: 4,
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {messages.length === 0 && (
          <p
            style={{
              color: TEXT_MUTED,
              fontSize: 12,
              textAlign: "center",
              marginTop: 40,
            }}
          >
            No messages yet. Say hi!
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems:
                msg.sender_id === localParticipant?.id
                  ? "flex-end"
                  : "flex-start",
            }}
          >
            <span style={{ fontSize: 10, color: TEXT_MUTED, marginBottom: 3 }}>
              {msg.sender_id === localParticipant?.id ? "You" : msg.sender_id} ·{" "}
              {new Date(msg.timestamp).toLocaleString()}
            </span>
            <div
              style={{
                maxWidth: "85%",
                padding: "8px 12px",
                borderRadius:
                  msg.sender_id === localParticipant?.id
                    ? "12px 12px 3px 12px"
                    : "12px 12px 12px 3px",
                background:
                  msg.sender_id === localParticipant?.id ? ACCENT_DIM : BG_CARD,
                border: `1px solid ${msg.sender_id === localParticipant?.id ? "rgba(79,140,255,0.3)" : BORDER}`,
                color: TEXT,
                fontSize: 13,
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat input */}
      <div
        style={{
          padding: "12px 14px",
          borderTop: `1px solid ${BORDER}`,
          display: "flex",
          gap: 8,
          flexShrink: 0,
        }}
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
          style={{
            ...inputStyle,
            flex: 1,
            padding: "9px 12px",
            fontSize: 13,
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "9px 14px",
            background: ACCENT,
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            flexShrink: 0,
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default IncallChat;
