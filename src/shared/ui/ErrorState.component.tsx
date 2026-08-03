interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Не удалось загрузить данные",
  description,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="state-panel state-panel--error" role="alert">
      <p className="state-panel__title">{title}</p>
      {description && <p className="state-panel__description">{description}</p>}
      {onRetry && (
        <button type="button" className="btn btn--secondary" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  );
}
