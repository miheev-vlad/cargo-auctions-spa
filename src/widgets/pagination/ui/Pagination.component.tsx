import { Button } from '../../../shared/ui/Button.component';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Пагинация">
      <Button variant="ghost" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Назад
      </Button>
      <span className="pagination__status">
        Стр. {page} из {totalPages} · {total} всего
      </span>
      <Button variant="ghost" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Далее
      </Button>
    </nav>
  );
}
