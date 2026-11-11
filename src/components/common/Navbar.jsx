import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Bookmark, Ticket, ShieldCheck, User, Menu, X, Sparkles } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { useUser } from '../../context/UserContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { bookmarks, getUserRegistrations } = useEvents();
  const { user, role, switchRole, isAdmin } = useUser();

  const userRegistrations = getUserRegistrations();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Explore Events', path: '/', icon: Calendar },
    {
      name: 'Saved',
      path: '/saved',
      icon: Bookmark,
      badge: bookmarks.length > 0 ? bookmarks.length : null
    },
    {
      name: 'My Tickets',
      path: '/my-registrations',
      icon: Ticket,
      badge: userRegistrations.length > 0 ? userRegistrations.length : null
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 bg-clip-text text-transparent">
                  Campus<span className="text-indigo-600">Connect</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider -mt-1">
                  Events Hub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold bg-indigo-600 text-white rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Header Area: Admin Portal Link + Role Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Admin Dashboard shortcut */}
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${
                location.pathname.startsWith('/admin')
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Admin Portal</span>
            </Link>

            {/* Mode Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => switchRole('student')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  role === 'student'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  role === 'admin'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-semibold ${
                    active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-indigo-600" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-indigo-600 text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50 border-t border-slate-100 mt-2"
            >
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* Role switcher for mobile */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-700 font-medium">Viewing role:</span>
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => switchRole('student')}
                className={`px-3 py-1 rounded-md font-semibold ${
                  role === 'student' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-700'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-3 py-1 rounded-md font-semibold ${
                  role === 'admin' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
