import { useState, useRef, useEffect } from 'react';
import { UsersPanel } from './users-panel';
import { SessionsPanel } from './sessions-panel';
import { DetailsPanel } from './details-panel';
import { PanelResizer } from './panel-resizer';

export function ThreePanelLayout() {
  const [usersPanelWidth, setUsersPanelWidth] = useState(25); // percentage
  const [sessionsPanelWidth, setSessionsPanelWidth] = useState(25); // percentage
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  
  const [usersPanelCollapsed, setUsersPanelCollapsed] = useState(false);
  const [sessionsPanelCollapsed, setSessionsPanelCollapsed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const detailsPanelWidth = 100 - usersPanelWidth - sessionsPanelWidth;

  const handleUserSelect = (email: string) => {
    setSelectedUserEmail(email);
    setSelectedSessionId(null);
    // Expand sessions panel if collapsed
    if (sessionsPanelCollapsed) {
      setSessionsPanelCollapsed(false);
    }
  };

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };

  const handleCloseSessionsPanel = () => {
    setSelectedUserEmail(null);
    setSelectedSessionId(null);
  };

  const handleCloseDetailsPanel = () => {
    setSelectedSessionId(null);
  };

  return (
    <div 
      ref={containerRef}
      className="flex h-[calc(100vh-4rem)] w-full overflow-hidden"
    >
      {/* Users Panel */}
      <div
        className={`flex flex-col border-r bg-background transition-all duration-300 ${
          usersPanelCollapsed ? 'w-12' : ''
        }`}
        style={!usersPanelCollapsed ? { width: `${usersPanelWidth}%` } : undefined}
      >
        <UsersPanel
          onUserSelect={handleUserSelect}
          selectedUserEmail={selectedUserEmail}
          collapsed={usersPanelCollapsed}
          onToggleCollapse={() => setUsersPanelCollapsed(!usersPanelCollapsed)}
        />
      </div>

      {/* Resizer 1 */}
      {!usersPanelCollapsed && (
        <PanelResizer
          onResize={(delta) => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.offsetWidth;
            const deltaPercent = (delta / containerWidth) * 100;
            setUsersPanelWidth(Math.max(15, Math.min(50, usersPanelWidth + deltaPercent)));
          }}
        />
      )}

      {/* Sessions Panel */}
      {selectedUserEmail && (
        <>
          <div
            className={`flex flex-col border-r bg-background transition-all duration-300 ${
              sessionsPanelCollapsed ? 'w-12' : ''
            }`}
            style={!sessionsPanelCollapsed ? { width: `${sessionsPanelWidth}%` } : undefined}
          >
            <SessionsPanel
              userEmail={selectedUserEmail}
              onSessionSelect={handleSessionSelect}
              selectedSessionId={selectedSessionId}
              onClose={handleCloseSessionsPanel}
              collapsed={sessionsPanelCollapsed}
              onToggleCollapse={() => setSessionsPanelCollapsed(!sessionsPanelCollapsed)}
            />
          </div>

          {/* Resizer 2 */}
          {!sessionsPanelCollapsed && (
            <PanelResizer
              onResize={(delta) => {
                if (!containerRef.current) return;
                const containerWidth = containerRef.current.offsetWidth;
                const deltaPercent = (delta / containerWidth) * 100;
                setSessionsPanelWidth(Math.max(15, Math.min(50, sessionsPanelWidth + deltaPercent)));
              }}
            />
          )}
        </>
      )}

      {/* Details Panel */}
      <div
        className="flex-1 flex flex-col bg-background overflow-hidden"
        style={{ width: `${detailsPanelWidth}%` }}
      >
        <DetailsPanel
          sessionId={selectedSessionId}
          onClose={handleCloseDetailsPanel}
        />
      </div>
    </div>
  );
}
