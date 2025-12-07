import React from 'react';
import './LoadingBar.css';
import { useUser } from '../context/UserContext.jsx';

// A thin top loading bar with optional click-blocking overlay
// Props:
// - forceVisible: always show bar + overlay regardless of context flags
// - overlay: enable the click-blocking overlay (default true)
export default function LoadingBar({ forceVisible = false, overlay = true }) {
  const { isPageLoading, isDataLoading } = useUser();
  const active = forceVisible || isPageLoading || isDataLoading;

  if (!active) return null;

  return (
    <>
      <div className="loadingbar-root">
        <div className="loadingbar-track">
          <div className="loadingbar-indicator" />
        </div>
      </div>
      {overlay && (
        <div className="loadingbar-overlay" aria-hidden="true" />
      )}
    </>
  );
}
