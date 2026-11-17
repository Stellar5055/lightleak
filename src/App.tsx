import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ToastProvider } from '@/components/toast';
import { HomePage } from '@/pages/home';
import { ScenePage } from '@/pages/scene';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <ToastProvider>
      <ScrollToTop />
      <div
        key={`${location.pathname}${location.search}`}
        className="animate-page-in"
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scene" element={<ScenePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ToastProvider>
  );
}
