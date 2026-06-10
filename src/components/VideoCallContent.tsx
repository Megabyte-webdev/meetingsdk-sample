import { useMeeting, useParticipants } from "@afosecure/meetingsdk";
import { useRef, useState } from "react";
import RemoteVideoComponent from "./RemoteVideoComponent";
import axios from "axios";
import {
  ACCENT,
  ACCENT_DIM,
  BG_CARD,
  BG_DEEP,
  BG_PANEL,
  BORDER,
  inputStyle,
  labelStyle,
  RED,
  TEXT,
  TEXT_MUTED,
} from "../utils/styleUtil";
import IncallChat from "./IncallChat";

// ── Constants
const USER_ID = "37d6faf5-718f-4766-a9ab-aa1a4a05005a";
const SERVER = "https://rust-video-server-sfyf.onrender.com";

// ── Component
function VideoCallContent() {
  const { join, leave, startLocalStream, localParticipant } = useMeeting();
  const participants = useParticipants();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStream = localParticipant?.media?.stream;

  const [roomId, setRoomId] = useState("");
  const [roomTitle, setRoomTitle] = useState("");
  const [name, setName] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);

  const [unread, setUnread] = useState(0);
  const handleGenerateRoom = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const res = await axios.post(`${SERVER}/rooms`, {
        title: roomTitle.trim() || "My Room",
        created_by: USER_ID,
      });

      const data = res.data;
      // Server returns { id: "DGRubGgL", title: "My Room" }
      const generatedId = data.id ?? data.room_id ?? data.roomId;
      if (!generatedId)
        throw new Error("Server response missing room ID field");

      setRoomId(generatedId);
      if (data.title && !roomTitle) setRoomTitle(data.title);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Could not generate room: ${err.message}`
          : "Could not reach the meeting server. Try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const attachLocalVideo = (video: HTMLVideoElement | null) => {
    if (!video || !localStream) return;

    video.srcObject = localStream;
    video.playsInline = true;

    video.play().catch(console.error);
  };

  // ── Join meeting
  const handleJoin = async () => {
    if (!name.trim() || !roomId.trim()) {
      setError("Please enter your name and room ID");
      return;
    }
    if (!localVideoRef.current) {
      setError("Video element not found");
      return;
    }
    setError("");
    setIsJoining(true);
    try {
      await startLocalStream(localVideoRef.current, name.trim());
      await join(roomId, name.trim());
      setConnected(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to join. Please check your settings.",
      );
    } finally {
      setIsJoining(false);
    }
  };

  // ── Leave meeting
  const handleLeave = () => {
    setConnected(false);
    setName("");
    setRoomId("");
    setRoomTitle("");
    setChatOpen(false);
    leave();
  };

  const toggleChat = () => {
    setChatOpen((o) => {
      if (!o) setUnread(0);
      return !o;
    });
  };

  // JOIN SCREEN
  if (!connected) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: BG_DEEP,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Google Font import via style tag */}
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>

        {/* Always-mounted hidden video so ref is ready */}
        {localVideoRef && (
          <video ref={localVideoRef} autoPlay style={{ display: "none" }} />
        )}

        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: BG_PANEL,
            border: `1px solid ${BORDER}`,
            borderRadius: 20,
            padding: "40px 36px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Logo / Title */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 52,
                height: 52,
                borderRadius: 14,
                background: ACCENT_DIM,
                marginBottom: 14,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="6" width="14" height="12" rx="3" fill={ACCENT} />
                <path d="M16 9.5l5-3v11l-5-3v-5z" fill={ACCENT} />
              </svg>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 600,
                color: TEXT,
                letterSpacing: "-0.3px",
              }}
            >
              Join a meeting
            </h1>
            <p style={{ margin: "6px 0 0", color: TEXT_MUTED, fontSize: 13 }}>
              Enter your details to get started
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#fca5a5",
                padding: "10px 14px",
                borderRadius: 10,
                marginBottom: 20,
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          {/* Name field */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Your name</label>
            <input
              type="text"
              placeholder="e.g. Amara Okafor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isJoining}
              style={inputStyle}
            />
          </div>

          {/* Room title field */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              Room title{" "}
              <span
                style={{
                  color: TEXT_MUTED,
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                (optional)
              </span>
            </label>
            <input
              type="text"
              placeholder='e.g. "Weekly standup"'
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              disabled={isJoining || isGenerating}
              style={inputStyle}
            />
          </div>

          {/* Room ID + Generate */}
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Room ID</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="Paste an ID or generate"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                disabled={isJoining || isGenerating}
                style={{
                  ...inputStyle,
                  flex: 1,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                }}
              />
              <button
                onClick={handleGenerateRoom}
                disabled={isJoining || isGenerating}
                style={{
                  padding: "0 16px",
                  background: isGenerating ? BG_CARD : BG_CARD,
                  color: isGenerating ? TEXT_MUTED : ACCENT,
                  border: `1px solid ${isGenerating ? BORDER : ACCENT_DIM}`,
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: isGenerating ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.15s",
                }}
              >
                {isGenerating ? "···" : "Generate"}
              </button>
            </div>

            {roomId && (
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 12px",
                  background: BG_CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                <span
                  style={{
                    flex: 1,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12,
                    color: ACCENT,
                  }}
                >
                  {roomId}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(roomId)}
                  style={{
                    background: "none",
                    border: "none",
                    color: TEXT_MUTED,
                    cursor: "pointer",
                    fontSize: 11,
                    padding: 0,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  title="Copy room ID"
                >
                  Copy
                </button>
              </div>
            )}
          </div>

          {/* Join button */}
          <button
            onClick={handleJoin}
            disabled={isJoining}
            style={{
              width: "100%",
              padding: "13px",
              background: isJoining ? ACCENT_DIM : ACCENT,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: isJoining ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "-0.1px",
              transition: "background 0.15s",
            }}
          >
            {isJoining ? "Joining…" : "Join meeting →"}
          </button>
        </div>
      </div>
    );
  }

  const totalParticipants = participants.length + 1;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: BG_DEEP,
        fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* ── Main area ──────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            height: 56,
            background: BG_PANEL,
            borderBottom: `1px solid ${BORDER}`,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: ACCENT_DIM,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="6" width="14" height="12" rx="3" fill={ACCENT} />
              <path d="M16 9.5l5-3v11l-5-3v-5z" fill={ACCENT} />
            </svg>
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: TEXT,
                lineHeight: 1,
              }}
            >
              {roomTitle || "Meeting"}
            </div>
            <div
              style={{
                fontSize: 11,
                color: TEXT_MUTED,
                fontFamily: "'DM Mono', monospace",
                marginTop: 2,
              }}
            >
              {roomId}
            </div>
          </div>

          {/* Participant count */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 20,
              fontSize: 12,
              color: TEXT_MUTED,
            }}
          >
            <span style={{ color: TEXT }}>{totalParticipants}</span> participant
            {totalParticipants !== 1 ? "s" : ""}
          </div>

          {/* Chat toggle */}
          <button
            onClick={toggleChat}
            style={{
              position: "relative",
              padding: "6px 14px",
              background: chatOpen ? ACCENT_DIM : BG_CARD,
              color: chatOpen ? ACCENT : TEXT_MUTED,
              border: `1px solid ${chatOpen ? ACCENT_DIM : BORDER}`,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Chat
            {unread > 0 && !chatOpen && (
              <span
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: RED,
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {unread}
              </span>
            )}
          </button>

          {/* End call */}
          <button
            onClick={handleLeave}
            style={{
              padding: "6px 16px",
              background: "rgba(239,68,68,0.15)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            End
          </button>
        </div>

        {/* Video grid */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns:
              participants.length === 0
                ? "1fr"
                : "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 10,
            padding: 12,
            overflowY: "auto",
            alignContent: "start",
          }}
        >
          {/* Local video */}
          <div
            style={{
              position: "relative",
              borderRadius: 14,
              overflow: "hidden",
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              aspectRatio: "16/9",
            }}
          >
            <video
              ref={attachLocalVideo}
              autoPlay
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: 10,
                background: "rgba(0,0,0,0.65)",
                backdropFilter: "blur(4px)",
                padding: "4px 10px",
                borderRadius: 6,
                color: TEXT,
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {localParticipant?.name} (you)
            </div>
          </div>

          {/* Remote videos */}
          {participants.map((p) => (
            <RemoteVideoComponent
              key={p.id}
              participantId={p.id}
              name={p.name}
            />
          ))}
        </div>

        {/* Waiting state overlay */}
        {participants.length === 0 && (
          <div
            style={{
              position: "absolute",
              bottom: 90,
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <p style={{ color: TEXT_MUTED, fontSize: 13 }}>
              Share room ID to invite others:&nbsp;
              <span
                style={{ color: ACCENT, fontFamily: "'DM Mono', monospace" }}
              >
                {roomId}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* ── Chat panel ────────────── */}
      {chatOpen && <IncallChat chatOpen={chatOpen} setChatOpen={setChatOpen} />}
    </div>
  );
}

export default VideoCallContent;
