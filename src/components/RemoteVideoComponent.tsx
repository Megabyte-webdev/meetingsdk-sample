import { useRemoteVideo } from "@afosecure/meetingsdk";

const BORDER = "rgba(255,255,255,0.07)";
const BG_CARD = "#1a1d26";
const TEXT = "#e8eaf0";

function RemoteVideoComponent({ participantId, name }: any) {
  const ref = useRemoteVideo(participantId);

  return (
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
        ref={ref}
        autoPlay
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* Name badge */}
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
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {name}
      </div>
    </div>
  );
}

export default RemoteVideoComponent;
