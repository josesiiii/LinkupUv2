// src/pages/ChatPage.jsx
// Fase 1: maqueta visual del chat con datos mock (sin Socket.io / HTTP).
import AppLayout from "../components/layout/AppLayout";
import ChatLayout from "../components/chat/ChatLayout";

export default function ChatPage() {
  return (
    <AppLayout hideMobileNav>
      <div className="chat-page-fullscreen" style={{ padding: "16px 24px", boxSizing: "border-box" }}>
        <ChatLayout />
      </div>

      <style>{`
        .chat-page-fullscreen { height: 100dvh; overflow: hidden; }
        @media (max-width: 767px) {
          .chat-page-fullscreen { height: 100dvh; padding: 0; }
        }
      `}</style>
    </AppLayout>
  );
}
