import React from 'react';
import { Calendar, Github, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Campus<span className="text-indigo-400">Connect</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              The centralized campus event management portal. Discover hackathons, cultural fests, workshops, esports tournaments, and register seamlessly in one place.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-slate-800 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                Active Campus Hub
              </span>
              <span>•</span>
              <span>Local Storage MVP</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Upcoming Events</Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-white transition-colors">Saved Events</Link>
              </li>
              <li>
                <Link to="/my-registrations" className="hover:text-white transition-colors">My Registrations</Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition-colors">Admin Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-slate-400 hover:text-white transition-colors">Technical & Coding</li>
              <li className="text-slate-400 hover:text-white transition-colors">Cultural & Pro-Nights</li>
              <li className="text-slate-400 hover:text-white transition-colors">Sports Tournaments</li>
              <li className="text-slate-400 hover:text-white transition-colors">Academic Seminars</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CampusConnect. Built with React, Vite & Tailwind CSS.</p>
          <p className="flex items-center gap-1">
            Engineered for seamless campus engagement
          </p>
        </div>
      </div>
    </footer>
  );
}
