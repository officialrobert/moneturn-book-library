import { Route, Routes } from 'react-router';
import { ConfigProvider, theme } from 'antd';
import { useTheme } from './hooks/useTheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import DefaultPage from '@/pages/default';
import SettingsPage from '@/pages/settings';
import Book from '@/pages/book';
import Providers from '@/providers';

const queryClient = new QueryClient();

function App() {
  const { isDarkMode } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Providers>
                <DefaultPage />
              </Providers>
            }
          />
          <Route
            path="/settings"
            element={
              <Providers>
                <SettingsPage />
              </Providers>
            }
          />
          <Route
            path="/book/:id"
            element={
              <Providers>
                <Book />
              </Providers>
            }
          />
        </Routes>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
