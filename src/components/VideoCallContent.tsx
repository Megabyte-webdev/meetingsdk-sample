import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  useMeeting,
  useParticipants,
  useLocalParticipant,
} from "@afosecure/meetingsdk";

// Styling assets
import {
  BG_DEEP,
  BG_PANEL,
  BORDER,
  TEXT,
  TEXT_MUTED,
} from "../utils/styleUtil";
import EntryScreen from "../pages/EntryScreen";
import MeetingHeader from "./MeetingHeader";
import VideoGrid from "./VideoGrid";
import IncallChat from "./IncallChat";
import ParticipantPanel from "./ParticipantPanel";

const USER_ID = "37d6faf5-718f-4766-a9ab-aa1a4a05005a";
const SERVER = "https://rust-video-server-sfyf.onrender.com";

function VideoCallContent() {
  // Destructure toggle pipeline methods directly from the Core Meeting Context
  const {
    join,
    leave,
    usePubSub,
    presenterId,
    startScreenShare,
    stopScreenShare,
    toggleMic,
    toggleCam,
    onError,
    room,
  } = useMeeting();

  const participants = useParticipants();
  const { participant: localParticipant, videoRef: attachLocalVideo } =
    useLocalParticipant();

  const [roomId, setRoomId] = useState("");
  const [roomTitle, setRoomTitle] = useState("");
  const [name, setName] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [unread, setUnread] = useState(0);
  const [activeSidebar, setActiveSidebar] = useState<
    "none" | "chat" | "participants"
  >("none");

  const { messages: sdkMessages } = usePubSub("SECURE_CHAT");
  const messages = Array.from(sdkMessages?.values() ?? []);

  const seenMessageIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);
  const chatOpen = activeSidebar === "chat";
  const isLocalSharing = !!(
    presenterId &&
    localParticipant &&
    presenterId === localParticipant.id
  );

  // Read current active states from local track profiles
  const isMicEnabled = !!localParticipant?.media?.micEnabled;
  const isCamEnabled = !!localParticipant?.media?.camEnabled;

  useEffect(() => {
    return onError((err) => {
      if (err?.code?.toLowerCase()?.includes("WS")) return;

      console.log(err);
      alert(err?.message);
    });
  }, []);
  useEffect(() => {
    if (!connected) return;

    if (chatOpen) {
      messages.forEach((msg) => {
        if (msg.id) seenMessageIds.current.add(msg.id);
      });
      setUnread(0);
      return;
    }

    let incoming = 0;
    for (const msg of messages) {
      const id = msg.id ?? `${msg.sender_id}-${msg.timestamp ?? ""}`;
      if (seenMessageIds.current.has(id)) continue;
      seenMessageIds.current.add(id);

      const isMine =
        msg.sender_id === localParticipant?.id || msg.sender_id === USER_ID;
      if (!isMine) incoming++;
    }

    if (incoming > 0) {
      setUnread((prev) => prev + incoming);
    }
  }, [messages, chatOpen, connected, localParticipant?.id]);

  const handleToggleScreenShare = async () => {
    if (isLocalSharing) {
      stopScreenShare();
    } else {
      try {
        await startScreenShare();
      } catch (err) {
        console.error("Failed to acquire display stream:", err);
      }
    }
  };

  const handleGenerateRoom = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const res = await axios.post(`${SERVER}/rooms`, {
        title: roomTitle.trim() || "My Room",
        created_by: USER_ID,
      });
      const data = res.data;
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

  const handleJoin = async () => {
    if (!name.trim() || !roomId.trim()) {
      setError("Please enter your name and room ID");
      return;
    }
    setError("");
    setIsJoining(true);
    setRoomId(roomId.trim());
    try {
      await join({ roomId: roomId.trim(), name: name.trim() });
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

  const handleLeave = () => {
    leave();
    setConnected(false);
    setName("");
    setRoomId("");
    setRoomTitle("");
    setActiveSidebar("none");
    setUnread(0);
    seenMessageIds.current.clear();
    isFirstLoad.current = true;
  };

  const toggleChat = () => {
    setActiveSidebar((prev) => (prev === "chat" ? "none" : "chat"));
  };
  const togglePartcipant = () => {
    setActiveSidebar((prev) =>
      prev === "participants" ? "none" : "participants",
    );
  };

  if (!connected) {
    return (
      <EntryScreen
        name={name}
        setName={setName}
        roomId={roomId}
        setRoomId={setRoomId}
        roomTitle={roomTitle}
        setRoomTitle={setRoomTitle}
        error={error}
        isJoining={isJoining}
        isGenerating={isGenerating}
        onGenerateRoom={handleGenerateRoom}
        onJoin={handleJoin}
      />
    );
  }

  const totalParticipants = participants.length + 1;
  const hasActivePresenter = !!presenterId;

  return (
    <div
      className="w-full h-screen flex overflow-hidden flex-col md:flex-row"
      style={{
        background: BG_DEEP,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { scroll-behavior: smooth; }
        video { -webkit-touch-callout: none; }
      `}</style>

      {/* Main Container Layer (Header + Stream viewports) */}
      <div className="flex-1 flex flex-col min-w-0 w-full md:w-auto">
        <MeetingHeader
          roomTitle={roomTitle}
          roomId={roomId}
          totalParticipants={totalParticipants}
          chatOpen={chatOpen}
          unread={unread}
          toggleChat={toggleChat}
          togglePartcipant={togglePartcipant}
          handleLeave={handleLeave}
          isScreenSharing={isLocalSharing}
          onToggleScreenShare={handleToggleScreenShare}
          micEnabled={isMicEnabled}
          camEnabled={isCamEnabled}
          onToggleMic={toggleMic}
          onToggleCam={toggleCam}
        />

        <div
          className={`flex-1 w-full relative ${
            hasActivePresenter
              ? "overflow-y-auto md:overflow-hidden"
              : "overflow-hidden"
          }`}
        >
          <VideoGrid
            remoteParticipants={participants}
            localParticipant={localParticipant}
            attachLocalVideo={attachLocalVideo}
            roomId={roomId}
            presenterId={presenterId}
          />
        </div>
      </div>

      {/* DESKTOP SIDEBAR CHAT PANEL */}
      {activeSidebar !== "none" && (
        <div
          className="hidden md:flex w-80 h-full border-l shrink-0"
          style={{ borderColor: BORDER }}
        >
          {activeSidebar === "chat" && (
            <IncallChat
              chatOpen={activeSidebar === "chat"}
              setChatOpen={() => setActiveSidebar("none")}
            />
          )}
          {activeSidebar === "participants" && (
            <ParticipantPanel setPanelOpen={() => setActiveSidebar("none")} />
          )}
        </div>
      )}

      {/* MOBILE BREAKPOINT MODAL CONTAINER */}
      {activeSidebar !== "none" && (
        <div className="block md:hidden">
          <div
            className="fixed inset-0 z-9998 backdrop-blur-sm bg-black/40"
            onClick={() => setActiveSidebar("none")}
          />
          <div
            className="fixed bottom-0 left-0 right-0 h-[75vh] z-9999 flex flex-col rounded-t-2xl border-t overflow-hidden"
            style={{
              background: BG_PANEL,
              borderColor: BORDER,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-4 py-3 border-b flex justify-between items-center shrink-0"
              style={{ borderColor: BORDER }}
            >
              <h3 className="m-0 text-sm font-semibold" style={{ color: TEXT }}>
                {activeSidebar === "chat" ? "Chat" : "Participants"}
              </h3>
              <button
                onClick={() => setActiveSidebar("none")}
                className="bg-transparent border-none text-xl p-0 cursor-pointer outline-none"
                style={{ color: TEXT_MUTED }}
              >
                ✕
              </button>
            </div>
            <div className="flex-1 min-h-0 relative">
              {activeSidebar === "chat" ? (
                <IncallChat
                  chatOpen={chatOpen}
                  setChatOpen={setActiveSidebar}
                />
              ) : (
                <ParticipantPanel
                  setPanelOpen={() => setActiveSidebar("none")}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoCallContent;
