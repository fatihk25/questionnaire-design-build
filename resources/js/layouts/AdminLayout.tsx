import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';

export function AdminLayout() {
  const { logout } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header — dark, compact like reference */}
      <header className="sticky top-0 z-50 bg-[#1a2332] text-white">
        <div className="mx-auto flex h-11 max-w-[1100px] items-center justify-between px-5">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-2">
            <span className="text-base">🏠</span>
            <span className="font-display text-sm font-semibold italic">
              Admin Dashboard
            </span>
          </div>

          {/* Right: Language + Logout */}
          <div className="flex items-center gap-3">
            {/* Language pills */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setLocale('id')}
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                  locale === 'id'
                    ? 'bg-white/90 text-[#1a2332]'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                  locale === 'en'
                    ? 'bg-white/90 text-[#1a2332]'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                EN
              </button>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full bg-red-600/80 px-3 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-red-600"
            >
              <LogOut size={11} />
              <span>{t('button.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="mx-auto max-w-[1100px] px-5 py-6">
        <Outlet />
      </main>
    </div>
  );
}
