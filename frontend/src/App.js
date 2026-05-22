import "@/App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Overview = lazy(() => import("./pages/admin/Overview"));
const GalleryAdmin = lazy(() => import("./pages/admin/GalleryAdmin"));
const ReviewsAdmin = lazy(() => import("./pages/admin/ReviewsAdmin"));
const MessagesAdmin = lazy(() => import("./pages/admin/MessagesAdmin"));

function AdminSuspense({ children }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F9F7F3]"><div className="w-6 h-6 border-2 border-[#A44A3F] border-t-transparent rounded-full animate-spin" /></div>}>
      {children}
    </Suspense>
  );
}

export default function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminSuspense>
                    <AdminLayout />
                  </AdminSuspense>
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminSuspense><Overview /></AdminSuspense>} />
              <Route path="galerie" element={<AdminSuspense><GalleryAdmin /></AdminSuspense>} />
              <Route path="recenzii" element={<AdminSuspense><ReviewsAdmin /></AdminSuspense>} />
              <Route path="mesaje" element={<AdminSuspense><MessagesAdmin /></AdminSuspense>} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </div>
  );
}
