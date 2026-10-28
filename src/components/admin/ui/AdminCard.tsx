// ============================================================
// components/admin/ui/AdminCard.tsx
// Thẻ Container chuẩn hóa giao diện Admin CMS
// ============================================================

import React from "react";

interface AdminCardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  noPadding?: boolean;
}

export const AdminCard: React.FC<AdminCardProps> = ({
  title,
  description,
  headerAction,
  children,
  footer,
  className = "",
  bodyClassName = "",
  headerClassName = "",
  noPadding = false,
}) => {
  const hasHeader = Boolean(title || description || headerAction);

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all ${className}`}
    >
      {hasHeader && (
        <div
          className={`px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${headerClassName}`}
        >
          <div>
            {title && (
              <h3 className="text-base font-bold text-slate-800 tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
          {headerAction && (
            <div className="flex items-center gap-2 shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}

      <div className={noPadding ? bodyClassName : `p-5 ${bodyClassName}`}>
        {children}
      </div>

      {footer && (
        <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
};
