"use client";

import React from "react";

interface AvatarIconProps {
  id: string;
  size?: number;
}

export function AvatarIcon({ id, size = 48 }: AvatarIconProps) {
  const getSvgPath = () => {
    switch (id) {
      case "avatar_default": // Robot
        return (
          <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Body/Head */}
            <rect x="5" y="8" width="14" height="12" rx="3" fill="rgba(255, 107, 0, 0.05)" />
            {/* Eyes */}
            <circle cx="9" cy="13" r="1.5" fill="currentColor" />
            <circle cx="15" cy="13" r="1.5" fill="currentColor" />
            {/* Mouth */}
            <path d="M9 17h6" />
            {/* Antenna */}
            <path d="M12 8V4M10 4h4" />
            {/* Ears */}
            <rect x="3" y="12" width="2" height="4" rx="1" fill="currentColor" />
            <rect x="19" y="12" width="2" height="4" rx="1" fill="currentColor" />
          </g>
        );
      case "avatar_1": // Cat
        return (
          <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Head and ears */}
            <path
              d="M12 21c4.97 0 9-4.03 9-9 0-1.6-.42-3.1-1.16-4.4L18 3.5l-3.5 3c-1.3-.4-2.78-.5-4.5-.5L6.5 3 4.66 7.6A8.93 8.93 0 0 0 3 12c0 4.97 4.03 9 9 9z"
              fill="rgba(6, 182, 212, 0.05)"
            />
            {/* Eyes */}
            <circle cx="9" cy="12" r="1.2" fill="currentColor" />
            <circle cx="15" cy="12" r="1.2" fill="currentColor" />
            {/* Nose & Whiskers */}
            <path d="M12 14.5l-1-1h2z" fill="currentColor" />
            <path d="M7 14h2.5M17 14h-2.5" />
          </g>
        );
      case "avatar_2": // Fox
        return (
          <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Outer geometric shape */}
            <path
              d="M12 22l-8-6.5L6.5 6l5.5-3.5 5.5 3.5 2.5 9.5z"
              fill="rgba(239, 68, 68, 0.05)"
            />
            {/* Nose divider and mouth */}
            <path d="M12 3v11l-3 4.5h6l-3-4.5" />
            {/* Eyes */}
            <path d="M6.5 11l2.5-1M17.5 11l-2.5-1" strokeWidth="2.5" />
          </g>
        );
      case "avatar_3": // Panda
        return (
          <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Ears */}
            <circle cx="6" cy="6" r="3" fill="currentColor" />
            <circle cx="18" cy="6" r="3" fill="currentColor" />
            {/* Face */}
            <circle cx="12" cy="13" r="8" fill="rgba(34, 197, 94, 0.05)" />
            {/* Eyes patches */}
            <ellipse cx="8.5" cy="12" rx="2" ry="1.5" fill="currentColor" transform="rotate(-15 8.5 12)" />
            <ellipse cx="15.5" cy="12" rx="2" ry="1.5" fill="currentColor" transform="rotate(15 15.5 12)" />
            {/* Eyes inside patches */}
            <circle cx="8.5" cy="12" r="0.8" fill="#FFF" />
            <circle cx="15.5" cy="12" r="0.8" fill="#FFF" />
            {/* Nose */}
            <ellipse cx="12" cy="15" rx="1.2" ry="0.8" fill="currentColor" />
          </g>
        );
      case "avatar_4": // Lion
        return (
          <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Mane */}
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
              strokeDasharray="3 3"
              fill="rgba(255, 140, 66, 0.05)"
            />
            {/* Face */}
            <circle cx="12" cy="12" r="6.5" fill="var(--bg-card)" />
            {/* Eyes */}
            <circle cx="9.5" cy="11.5" r="1" fill="currentColor" />
            <circle cx="14.5" cy="11.5" r="1" fill="currentColor" />
            {/* Nose & whiskers */}
            <path d="M12 13.5l-1-1h2z" fill="currentColor" />
            <path d="M12 13.5v1.5a1 1 0 0 0 1 1" />
            <path d="M12 13.5v1.5a1 1 0 0 1-1 1" />
          </g>
        );
      case "avatar_5": // Frog
        return (
          <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Head */}
            <path
              d="M3 13.5c0 3.8 4.03 6.5 9 6.5s9-2.7 9-6.5a6 6 0 0 0-4.2-5.7V7.5a2.5 2.5 0 0 0-5 0V7.8a2.5 2.5 0 0 0-5 0v.02c-2.43.9-3.8 3.1-3.8 5.68z"
              fill="rgba(34, 197, 94, 0.05)"
            />
            {/* Eyes */}
            <circle cx="7.5" cy="7.5" r="1" fill="currentColor" />
            <circle cx="16.5" cy="7.5" r="1" fill="currentColor" />
            {/* Smile */}
            <path d="M7.5 14c1.5 2 7.5 2 9 0" />
          </g>
        );
      default: // Fallback user outline
        return (
          <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </g>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        color: "var(--text-primary)",
        flexShrink: 0,
      }}
    >
      {getSvgPath()}
    </svg>
  );
}
