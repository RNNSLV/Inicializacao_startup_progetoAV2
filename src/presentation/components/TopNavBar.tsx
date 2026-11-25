export interface TopNavLink {
  readonly id: string;
  readonly label: string;
}

export interface TopNavBarProps {
  readonly brandTitle: string;
  readonly links: readonly TopNavLink[];
  readonly activeLinkId: string;
  readonly onSelectLink: (linkId: string) => void;
  readonly primaryActionLabel: string;
  readonly onPrimaryAction: () => void;
}

export function TopNavBar({
  brandTitle,
  links,
  activeLinkId,
  onSelectLink,
  primaryActionLabel,
  onPrimaryAction,
}: TopNavBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6">
        <span className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
          {brandTitle}
        </span>

        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-6"
        >
          {links.map((link) => {
            const isActive = link.id === activeLinkId;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onSelectLink(link.id)}
                className={`min-h-[40px] text-sm font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
                  isActive
                    ? 'border-teal-700 text-teal-800'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={onPrimaryAction}
          className="min-h-[40px] rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          {primaryActionLabel}
        </button>
      </div>
    </header>
  );
}
