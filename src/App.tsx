import "./App.css";
import { MeetingProvider } from "@afosecure/meetingsdk";
import VideoCallContent from "./components/VideoCallContent";

function App() {
  return (
    <MeetingProvider
      config={{
        roomId: "",
        name: "",
        audioMuted: false,
        videoMuted: false,
      }}
    >
      <VideoCallContent />
    </MeetingProvider>
  );
}

export default App;
