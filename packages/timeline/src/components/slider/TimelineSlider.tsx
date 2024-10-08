import { useTimeline } from '@/index';
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

export interface TimelineSliderEvent {
  id: string;
  track: number;
  startTimeInMs: number;
  endTimeInMs: number;
  color: string;
}

export interface TimelineSliderProps {
  minTimeInMs: number;
  maxTimeInMs: number;
  currentPlaybackCursorPosition: number;
  playbackCursorPositionColor: string;
  playbackCursorPositionWidthInPx: number;
  allowPlaybackCursorToBeDragged: boolean;
  slidingWindowRangeThumbStartTimeInMs: number;
  slidingWindowRangeThumbEndTimeInMs: number;
  allowSlidingWindowRangeThumbResizeOnMouseWheel: boolean;
  mouseWheelSensibility: number;
  minSlidingWindowRangeThumbWidthInPx: number;
  slidingWindowRangeThumbBorderColor: string;
  slidingWindowRangeThumbBorderRadiusInPx: number;
  slidingWindowRangeThumbBackgroundColor: string;
  className: string;
  events?: TimelineSliderEvent[];
  eventOpacityWhenInsideSlidingWindowRangeThumb: number;
  eventOpacityWhenOutsideSlidingWindowRangeThumb: number;
  onSlidingWindowRangeThumbUpdate: (update: { 
    slidingWindowRangeThumbStartTimeInMs: number;
    slidingWindowRangeThumbEndTimeInMs: number;
  }) => void;
  onPlaybackCursorUpdate: (update: {
    playbackCursorPositionInMs: number;
  }) => void;
}

/**
 * A timeline slider component made using React and TypeScript.
 * The idea is to control a temporal timeline, so the unit is the milliseconds,
 * and coordinates are based on timestamps.
 * 
 * The component has a draggable range thumb, and a separate draggable "playback cursor".
 * 
 * We also show a nice little minimap made of a background canvas of events.
 */
const TimelineSlider: React.FC<TimelineSliderProps> = ({
  minTimeInMs,
  maxTimeInMs,
  currentPlaybackCursorPosition,
  playbackCursorPositionColor,
  playbackCursorPositionWidthInPx,
  allowPlaybackCursorToBeDragged,
  slidingWindowRangeThumbStartTimeInMs,
  slidingWindowRangeThumbEndTimeInMs,
  allowSlidingWindowRangeThumbResizeOnMouseWheel,
  mouseWheelSensibility,
  minSlidingWindowRangeThumbWidthInPx,
  slidingWindowRangeThumbBorderColor,
  slidingWindowRangeThumbBorderRadiusInPx,
  slidingWindowRangeThumbBackgroundColor,
  className,
  events = [],
  eventOpacityWhenInsideSlidingWindowRangeThumb,
  eventOpacityWhenOutsideSlidingWindowRangeThumb,
  onSlidingWindowRangeThumbUpdate,
  onPlaybackCursorUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const [isDraggingCursor, setIsDraggingCursor] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [windowStart, setWindowStart] = useState(slidingWindowRangeThumbStartTimeInMs);
  const [windowEnd, setWindowEnd] = useState(slidingWindowRangeThumbEndTimeInMs);
  const [playbackCursor, setPlaybackCursor] = useState(currentPlaybackCursorPosition);
  const [showOverlay, setShowOverlay] = useState(false);
  const [lastTouchX, setLastTouchX] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const drawEvents = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();

    ctx.clearRect(0, 0, width * dpr, height * dpr);

    const totalTracks = Math.max(...events.map(e => e.track), 0) + 1;
    const trackHeight = height / totalTracks;

    events.forEach(event => {
      const startX = ((event.startTimeInMs - minTimeInMs) / (maxTimeInMs - minTimeInMs)) * width;
      const endX = ((event.endTimeInMs - minTimeInMs) / (maxTimeInMs - minTimeInMs)) * width;
      const y = event.track * trackHeight;

      ctx.fillStyle = event.color;
      ctx.globalAlpha = 
        (event.startTimeInMs >= windowStart && event.endTimeInMs <= windowEnd)
          ? eventOpacityWhenInsideSlidingWindowRangeThumb
          : eventOpacityWhenOutsideSlidingWindowRangeThumb;
      
      ctx.fillRect(startX, y, endX - startX, trackHeight);
    });
  }, [events, minTimeInMs, maxTimeInMs, windowStart, windowEnd, eventOpacityWhenInsideSlidingWindowRangeThumb, eventOpacityWhenOutsideSlidingWindowRangeThumb]);

  const memoizedEvents = useMemo(() => events, [events]);

  const setCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const { width, height } = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  useEffect(() => {
    setCanvasSize();
    drawEvents();
  }, [setCanvasSize, drawEvents, memoizedEvents, windowStart, windowEnd, playbackCursor]);

  const handleStart = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (!useTimeline.getState().tracks.length) return;

    const x = clientX - rect.left;
    const cursorX = ((playbackCursor - minTimeInMs) / (maxTimeInMs - minTimeInMs)) * rect.width;

    if (Math.abs(x - cursorX) <= playbackCursorPositionWidthInPx * 2 && allowPlaybackCursorToBeDragged) {
      setIsDraggingCursor(true);
    } else {
      setIsDraggingWindow(true);
      const clickedTime = minTimeInMs + (x / rect.width) * (maxTimeInMs - minTimeInMs);
      const windowWidth = windowEnd - windowStart;
      let newStart = clickedTime - windowWidth / 2;
      let newEnd = clickedTime + windowWidth / 2;

      if (newStart < minTimeInMs) {
        newStart = minTimeInMs;
        newEnd = newStart + windowWidth;
      } else if (newEnd > maxTimeInMs) {
        newEnd = maxTimeInMs;
        newStart = newEnd - windowWidth;
      }

      setWindowStart(newStart);
      setWindowEnd(newEnd);
      onSlidingWindowRangeThumbUpdate({ slidingWindowRangeThumbStartTimeInMs: newStart, slidingWindowRangeThumbEndTimeInMs: newEnd });
    }

    setDragStartX(clientX);
    setLastTouchX(clientX);
    setShowOverlay(true);
  }, [allowPlaybackCursorToBeDragged, maxTimeInMs, minTimeInMs, onSlidingWindowRangeThumbUpdate, playbackCursor, playbackCursorPositionWidthInPx, windowEnd, windowStart]);
  const handleMove = useCallback((clientX: number) => {
    if (!isDraggingWindow && !isDraggingCursor) return;
    if (!useTimeline.getState().tracks.length) return;

    const containerWidth = containerRef.current?.clientWidth || 1;
    const deltaX = clientX - (isTouchDevice ? lastTouchX : dragStartX);

    if (isDraggingWindow) {
      const windowWidth = windowEnd - windowStart;
      let newStart = windowStart + (deltaX / containerWidth) * (maxTimeInMs - minTimeInMs);
      let newEnd = newStart + windowWidth;

      if (newStart < minTimeInMs) {
        newStart = minTimeInMs;
        newEnd = newStart + windowWidth;
      } else if (newEnd > maxTimeInMs) {
        newEnd = maxTimeInMs;
        newStart = newEnd - windowWidth;
      }

      setWindowStart(newStart);
      setWindowEnd(newEnd);
      onSlidingWindowRangeThumbUpdate({ slidingWindowRangeThumbStartTimeInMs: newStart, slidingWindowRangeThumbEndTimeInMs: newEnd });
    } else if (isDraggingCursor) {
      let newCursor = playbackCursor + (deltaX / containerWidth) * (maxTimeInMs - minTimeInMs);
      newCursor = Math.max(minTimeInMs, Math.min(maxTimeInMs, newCursor));
      setPlaybackCursor(newCursor);
      onPlaybackCursorUpdate({ playbackCursorPositionInMs: newCursor });
    }

    if (isTouchDevice) {
      setLastTouchX(clientX);
    } else {
      setDragStartX(clientX);
    }
  }, [dragStartX, isDraggingCursor, isDraggingWindow, isTouchDevice, lastTouchX, maxTimeInMs, minTimeInMs, onPlaybackCursorUpdate, onSlidingWindowRangeThumbUpdate, playbackCursor, windowEnd, windowStart]);

  const handleEnd = useCallback(() => {
    setIsDraggingWindow(false);
    setIsDraggingCursor(false);
    setShowOverlay(false);
    setLastTouchX(0);
  }, []);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsTouchDevice(false);
    handleStart(e.clientX);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isTouchDevice) {
      handleMove(e.clientX);
    }
  }, [handleMove, isTouchDevice]);

  const handleMouseUp = useCallback(() => {
    if (!isTouchDevice) {
      handleEnd();
    }
  }, [handleEnd, isTouchDevice]);

// Touch event handlers
const handleTouchStart = (e: React.TouchEvent) => {
  setIsTouchDevice(true);
  handleStart(e.touches[0].clientX);
};

const handleTouchMove = useCallback((e: TouchEvent) => {
  if (isTouchDevice) {
    e.preventDefault(); // Prevent scrolling
    handleMove(e.touches[0].clientX);
  }
}, [handleMove, isTouchDevice]);

const handleTouchEnd = useCallback(() => {
  if (isTouchDevice) {
    handleEnd();
  }
}, [handleEnd, isTouchDevice]);


useEffect(() => {
  if (showOverlay) {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  } else {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }

  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };
}, [showOverlay, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Update state when props change
  useEffect(() => {
    setWindowStart(slidingWindowRangeThumbStartTimeInMs);
    setWindowEnd(slidingWindowRangeThumbEndTimeInMs);
  }, [slidingWindowRangeThumbStartTimeInMs, slidingWindowRangeThumbEndTimeInMs]);

  useEffect(() => {
    setPlaybackCursor(currentPlaybackCursorPosition);
  }, [currentPlaybackCursorPosition]);

  const handleWheel = (e: React.WheelEvent) => {
    if (!allowSlidingWindowRangeThumbResizeOnMouseWheel) return;
    if (!useTimeline.getState().tracks.length) { return }

    const delta = e.deltaY * mouseWheelSensibility;
    const windowWidth = windowEnd - windowStart;
    const newWidth = Math.max(1000, Math.min(maxTimeInMs - minTimeInMs, windowWidth + delta));

    let newStart = windowStart - (newWidth - windowWidth) / 2;
    let newEnd = windowEnd + (newWidth - windowWidth) / 2;

    if (newStart < minTimeInMs) {
      newStart = minTimeInMs;
      newEnd = newStart + newWidth;
    } else if (newEnd > maxTimeInMs) {
      newEnd = maxTimeInMs;
      newStart = newEnd - newWidth;
    }

    setWindowStart(newStart);
    setWindowEnd(newEnd);
    onSlidingWindowRangeThumbUpdate({ slidingWindowRangeThumbStartTimeInMs: newStart, slidingWindowRangeThumbEndTimeInMs: newEnd });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (!useTimeline.getState().tracks.length) { return }

    const x = e.clientX - rect.left;
    const clickedTime = minTimeInMs + (x / rect.width) * (maxTimeInMs - minTimeInMs);
    
    // Move the range thumb
    const windowWidth = windowEnd - windowStart;
    let newStart = clickedTime - windowWidth / 2;
    let newEnd = clickedTime + windowWidth / 2;
  
    if (newStart < minTimeInMs) {
      newStart = minTimeInMs;
      newEnd = newStart + windowWidth;
    } else if (newEnd > maxTimeInMs) {
      newEnd = maxTimeInMs;
      newStart = newEnd - windowWidth;
    }

    setWindowStart(newStart);
    setWindowEnd(newEnd);
    onSlidingWindowRangeThumbUpdate({ slidingWindowRangeThumbStartTimeInMs: newStart, slidingWindowRangeThumbEndTimeInMs: newEnd });
  
    // Move the playback cursor
    const newCursor = Math.max(minTimeInMs, Math.min(maxTimeInMs, clickedTime));
    setPlaybackCursor(newCursor);
    onPlaybackCursorUpdate({ playbackCursorPositionInMs: newCursor });
  };
  
  return (
    <div
    ref={containerRef}
    className={`relative pointer-events-auto ${className}`}
    onMouseDown={handleMouseDown}
    onTouchStart={handleTouchStart}
    onWheel={handleWheel}
    onDoubleClick={handleDoubleClick}
    style={{ cursor: 'default', touchAction: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      <div
        className="absolute top-0 h-full"
        style={{
          left: `${((windowStart - minTimeInMs) / (maxTimeInMs - minTimeInMs)) * 100}%`,
          width: `${((windowEnd - windowStart) / (maxTimeInMs - minTimeInMs)) * 100}%`,
          backgroundColor: slidingWindowRangeThumbBackgroundColor,
          border: `1px solid ${slidingWindowRangeThumbBorderColor}`,
          borderRadius: `${slidingWindowRangeThumbBorderRadiusInPx}px`,
          cursor: 'grab',
        }}
      />
      <div
        className="absolute top-0 h-full"
        style={{
          left: `${((playbackCursor - minTimeInMs) / (maxTimeInMs - minTimeInMs)) * 100}%`,
          width: `${playbackCursorPositionWidthInPx * 4}px`,
          marginLeft: `-${playbackCursorPositionWidthInPx * 2}px`,
          cursor: allowPlaybackCursorToBeDragged ? 'grab' : 'default',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            height: '100%',
            width: `${playbackCursorPositionWidthInPx}px`,
            marginLeft: `-${playbackCursorPositionWidthInPx / 2}px`,
            backgroundColor: playbackCursorPositionColor,
          }}
        />
      </div>
    </div>
  );
};


export default TimelineSlider;