import type {ReactNode} from 'react';

export interface MobileNavTab {
  readonly id: string;
  readonly label: string;
  readonly icon: ReactNode;
}

export interface MobileBottomNavProps {
  readonly tabs: readonly MobileNavTab[];
  readonly activeTabId: string;
  readonly onSelectTab: (tabId: string) => void;
}

export function MobileBottomNav({
  tabs,
  activeTabId,
  onSelectTab,
}: MobileBottomNavProps) {
  return (
    <nav
      aria-label="Navegação inferior"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md md:hidden"
    >
      <div
        className="mx-auto grid h-16 max-w-md items-center"
        style={{gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`}}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 px-1 transition-colors focus-visible:outline-2 focus-visible:outline-teal-700 ${
                isActive ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span aria-hidden="true">{tab.icon}</span>
              <span className="text-[11px] font-medium tracking-tight whitespace-nowrap truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
