import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';

export function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* Render Login as default page */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;