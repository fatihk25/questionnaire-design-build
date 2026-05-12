import { useState } from 'react';
import { Moon, Sun, Shield } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AdminLoginModal } from '@/components/AdminLoginModal';

export function PublicHeader() {
  const { locale, setLocale, t } = useI18n();
  const { isDark, toggleDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-secondary text-white shadow-sm">
      <div className="mx-auto flex h-11 max-w-[1100px] items-center justify-between px-5">
        {/* Left: App Title with icon */}
        <div className="flex items-center gap-2">
          <span className="text-base">🏠</span>
          <span className="font-display text-sm font-semibold italic">
            {t('app.title')}
          </span>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleDark}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label={isDark ? t('header.lightMode') : t('header.darkMode')}
          >
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
          </button>

          {/* Language Switcher — pill badges */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setLocale('id')}
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                locale === 'id'
                  ? 'bg-white/90 text-secondary'
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
                  ? 'bg-white/90 text-secondary'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              EN
            </button>
          </div>

          {/* Admin Button — green pill */}
          <button
            type="button"
            onClick={() => {
              if (isAuthenticated) {
                navigate('/admin/dashboard');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            className="flex items-center gap-1 rounded-full bg-[#2e7d32]/80 px-3 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-[#2e7d32]"
          >
            <Shield size={11} />
            <span>{t('header.admin')}</span>
          </button>
        </div>
      </div>

      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
}
