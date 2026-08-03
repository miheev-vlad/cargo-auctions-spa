interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = "1em",
  className,
}: SkeletonProps) {
  return (
    <span
      className={`skeleton ${className ?? ""}`}
      style={{ width, height, display: "inline-block" }}
      aria-hidden="true"
    />
  );
}

export function AuctionCardSkeleton() {
  return (
    <div
      className="auction-card auction-card--skeleton"
      aria-label="Загрузка аукциона"
    >
      <Skeleton width="40%" height={18} />
      <Skeleton width="70%" height={24} />
      <Skeleton width="90%" height={16} />
      <Skeleton width="50%" height={16} />
      <Skeleton width="30%" height={32} />
    </div>
  );
}
