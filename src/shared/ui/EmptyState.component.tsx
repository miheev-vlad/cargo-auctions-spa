import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="state-panel state-panel--empty" role="status">
      <p className="state-panel__title">{title}</p>
      {description && <p className="state-panel__description">{description}</p>}
      {action}
    </div>
  );
}
