import React, { ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-violet-500 selection:text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-fuchsia-600/20 rounded-full blur-3xl opacity-30"></div>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};
