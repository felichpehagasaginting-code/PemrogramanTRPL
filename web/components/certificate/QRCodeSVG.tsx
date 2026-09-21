"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRCodeSVGProps {
  value: string;
  size?: number;
  color?: string;
  bgColor?: string;
  className?: string;
}

export function QRCodeSVG({
  value,
  size = 64,
  color = "#000000",
  bgColor = "#ffffff",
  className,
}: QRCodeSVGProps) {
  const [svgString, setSvgString] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    QRCode.toString(value, {
      type: "svg",
      margin: 1,
      color: {
        dark: color,
        light: bgColor,
      },
      width: size,
    })
      .then((svg) => {
        if (isMounted) {
          setSvgString(svg);
        }
      })
      .catch((err) => {
        console.warn("Failed to generate QR code SVG:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size, color, bgColor]);

  if (!svgString) {
    return (
      <div
        style={{
          width: size,
          height: size,
          background: bgColor,
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className={className}
      >
        <span style={{ fontSize: "10px", color: "#999" }}>QR...</span>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
}
