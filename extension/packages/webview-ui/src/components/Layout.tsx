import React from 'react';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  headerActions?: React.ReactNode;
}

export function Layout({ title, children, sidebar, headerActions }: LayoutProps) {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1>{title}</h1>
        {headerActions && <div>{headerActions}</div>}
      </header>
      <div className="layout-content">
        <main className="layout-main">{children}</main>
        {sidebar && <aside className="layout-sidebar">{sidebar}</aside>}
      </div>
    </div>
  );
}
