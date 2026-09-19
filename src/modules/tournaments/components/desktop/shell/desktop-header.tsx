import type { DesktopShell } from "../../../shell.types";
import { BrandMark } from "./brand-mark";
import { DesktopNav } from "./desktop-nav";
import { HeaderSearch, NotificationButton, UserChip } from "./header-actions";
import { HeaderGamePills } from "./header-game-pills";

export function DesktopHeader({ shell }: { shell: DesktopShell }) {
  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-surface-deep/90 shadow-[0_1px_8px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <div className="flex h-20 w-full items-center justify-between gap-space-lg px-margin-desktop">
        <div className="flex shrink-0 items-center gap-space-lg">
          <BrandMark brand={shell.brand} />
          <HeaderGamePills pills={shell.gamePills} />
        </div>
        <DesktopNav links={shell.nav} activeId={shell.activeNav} />
        <div className="flex items-center gap-space-md">
          <HeaderSearch placeholder={shell.searchPlaceholder} />
          <NotificationButton unread />
          <UserChip user={shell.user} />
        </div>
      </div>
    </header>
  );
}
