import { useShallow } from 'zustand/shallow';
import { useAppStore } from '../store';
import { useEffect, useMemo } from 'react';
import { SupportedThemes } from '../types';
import { useSearchParams } from 'react-router';

const useTheme = () => {
  const { theme, setTheme } = useAppStore(
    useShallow((state) => ({
      theme: state.theme,
      setTheme: state.setTheme,
    })),
  );

  const [searchParams] = useSearchParams();

  const forceTheme = useMemo(
    () => searchParams.get('theme') || '',
    [searchParams],
  );

  const isDarkMode = useMemo(
    () =>
      (forceTheme !== 'light' && theme === SupportedThemes.Dark) ||
      forceTheme === 'dark',
    [theme, forceTheme],
  );

  /**
   * Handle system theme changes
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyDarkMode =
      (forceTheme !== 'light' && mediaQuery.matches) || forceTheme === 'dark';

    const applyDarkModeStyle = (applyDarkMode: boolean) => {
      if (applyDarkMode) {
        // update root foreground color
        document.documentElement.style.setProperty('--foreground', '#ededed');
        // update root background color
        document.documentElement.style.setProperty('--background', '#0a0a0a');
      } else {
        // update root foreground color
        document.documentElement.style.setProperty('--foreground', '#171717');
        // update root background color
        document.documentElement.style.setProperty('--background', '#ffffff');
      }
    };

    setTheme(applyDarkMode ? SupportedThemes.Dark : SupportedThemes.Light);
    applyDarkModeStyle(applyDarkMode);

    const handler = (e: MediaQueryListEvent) => {
      const applyDarkMode =
        forceTheme === 'dark' || (e.matches && forceTheme !== 'light');

      if (forceTheme === 'light') {
        setTheme(SupportedThemes.Light);
      } else if (forceTheme === 'dark') {
        setTheme(SupportedThemes.Dark);
      } else {
        setTheme(e.matches ? SupportedThemes.Dark : SupportedThemes.Light);
      }

      applyDarkModeStyle(applyDarkMode);
    };

    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [setTheme, forceTheme]);

  return { theme, isDarkMode, setTheme };
};

export { useTheme };
