import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ToastProvider } from './context/ToastContext';
import { EventProvider } from './context/EventContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { EventDetailPage } from './pages/EventDetailPage';
import { SavedEventsPage } from './pages/SavedEventsPage';
import { MyRegistrationsPage } from './pages/MyRegistrationsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ToastProvider>
          <EventProvider>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
              
              {/* Header Navigation */}
              <Navbar />

              {/* Main App Content Viewport */}
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/events/:id" element={<EventDetailPage />} />
                  <Route path="/saved" element={<SavedEventsPage />} />
                  <Route path="/my-registrations" element={<MyRegistrationsPage />} />
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              {/* Universal Footer */}
              <Footer />

            </div>
          </EventProvider>
        </ToastProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
