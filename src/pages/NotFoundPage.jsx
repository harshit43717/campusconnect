import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home, Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-sm">
        <h1 className="text-3xl font-black text-slate-900">404 - Page Not Found</h1>
        <p className="text-sm text-slate-500">
          The campus path you followed does not exist or might have moved.
        </p>
      </div>

      <Link to="/">
        <Button variant="primary" icon={Home}>
          Back to Campus Events
        </Button>
      </Link>
    </div>
  );
}
