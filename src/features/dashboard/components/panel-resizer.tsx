import { useRef, useEffect } from 'react';

interface PanelResizerProps {
  onResize: (delta: number) => void;
}

export function PanelResizer({ onResize }: PanelResizerProps) {
  const resizerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const delta = e.clientX - startXRef.current;
      startXRef.current = e.clientX;
      onResize(delta);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onResize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div
      ref={resizerRef}
      onMouseDown={handleMouseDown}
      className="w-1 bg-border hover:bg-primary cursor-col-resize transition-colors flex-shrink-0"
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-0.5 h-8 bg-muted-foreground/20 rounded-full" />
      </div>
    </div>
  );
}
