import { Route, Routes } from 'react-router';

import './App.css';
import DefaultPage from './pages/default';
import SettingsPage from './pages/settings';
import Book from './pages/book';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <>
        <Routes>
          <Route path="/" element={<DefaultPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/book/:id" element={<Book />} />
        </Routes>
      </>
    </QueryClientProvider>
  );
}

export default App;
