import { Toaster } from 'react-hot-toast';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <>
      {/* Animated Background */}
      <div className="particles-bg" />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(17, 17, 27, 0.95)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            fontSize: '14px'
          },
          success: {
            iconTheme: {
              primary: '#667eea',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff'
            }
          }
        }}
      />

      {/* Main App */}
      <ChatPage />
    </>
  );
}

export default App;
