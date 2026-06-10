import { useState } from "react";
import "./App.css";
import { MeetingProvider, VideoSDKCore } from "@afosecure/meetingsdk";
import VideoCallContent from "./components/VideoCallContent";

function App() {
  const [core] = useState(
    () =>
      new VideoSDKCore({
        onTrack: (_, peerId) => {
          console.log("📹 Received stream from:", peerId);
        },
        onUserJoined: (participant) => {
          console.log("👤 User joined:", participant.name);
        },
        onUserLeft: (userId) => {
          console.log("👤 User left:", userId);
        },
      }),
  );

  return (
    <MeetingProvider core={core}>
      <VideoCallContent />
    </MeetingProvider>
  );
}
export default App;
