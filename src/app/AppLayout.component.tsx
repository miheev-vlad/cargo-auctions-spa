import { Link, Outlet } from '@tanstack/react-router';
import { ToastViewport } from '../shared/ui/Toast.component';

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/auctions" search={{ page: 1, per_page: 20 }} className="app-header__logo">
          Грузовые аукционы
        </Link>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
      <ToastViewport />
    </div>
  );
}
