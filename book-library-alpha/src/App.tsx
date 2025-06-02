import { Route, Routes } from 'react-router';
import { ConfigProvider, theme } from 'antd';
import { useTheme } from './hooks/useTheme';

import DefaultPage from './pages/default';
import SettingsPage from './pages/settings';
import Book from './pages/book';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
          <Route path="/" element={<DefaultPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/book/:id" element={<Book />} />
        </Routes>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
