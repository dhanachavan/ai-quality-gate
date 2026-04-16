import React from "react";

export type StatusType = "success" | "warning" | "error" | "info" | "pending";

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: "sm" | "md" | "lg";
  pulsate?: boolean;
  onClick?: () => void;
}

const STATUS_CONFIG: Record<StatusType, { icon: string; color: string; bgColor: string }> = {
  success: { icon: "✅", color: "#16a34a", bgColor: "#f0fdf4" },
  warning: { icon: "⚠️", color: "#ca8a04", bgColor: "#fefce8" },
  error: { icon: "❌", color: "#dc2626", bgColor: "#fef2f2" },
  info: { icon: "ℹ️", color: "#2563eb", bgColor: "#eff6ff" },
  pending: { icon: "⏳", color: "#9333ea", bgColor: "#faf5ff" },
};

const SIZE_MAP: Record<"sm" | "md" | "lg", { fontSize: string; padding: string }> = {
  sm: { fontSize: "0.75rem", padding: "2px 6px" },
  md: { fontSize: "0.875rem", padding: "4px 10px" },
  lg: { fontSize: "1rem", padding: "6px 14px" },
};

function getStatusLabel(status: StatusType): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function StatusBadge({
  status,
  label,
  size = "md",
  pulsate = false,
  onClick,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const sizeStyle = SIZE_MAP[size];
  const displayLabel = label || getStatusLabel(status);

  if (!config) {
    return <span data-testid="status-badge-unknown">Unknown status</span>;
  }

  return (
    <span
      data-testid={`status-badge-${status}`}
      role={onClick ? "button" : "status"}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontSize: sizeStyle.fontSize,
        padding: sizeStyle.padding,
        borderRadius: "9999px",
        color: config.color,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.color}`,
        cursor: onClick ? "pointer" : "default",
        animation: pulsate ? "pulse 2s infinite" : "none",
        fontWeight: 500,
      }}
    >
      <span aria-hidden="true">{config.icon}</span>
      {displayLabel}
    </span>
  );
}
