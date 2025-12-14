import { LayoutDashboard } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

type MenuItem = { name: string; children?: any[]; path?: string };

export default function Header({
  menu,
  activeIndex,
  onMainMenuClick,
}: {
  menu: MenuItem[];
  activeIndex: number;
  onMainMenuClick: (index: number) => void;
}) {
  return (
    <header className="w-full h-full flex items-center justify-between px-4 text-shadow-primary shadow">
      <div className="flex items-center gap-3">
        <nav className="ml-6 flex gap-2">
          {menu.map((m, idx) => (
            <button
              key={m.name}
              onClick={() => onMainMenuClick(idx)}
              className={`px-3 py-1 rounded ${
                idx === activeIndex ? "bg-primary/80" : "hover:bg-primary/40"
              }`}
            >
              {m.name}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {/* 우측 유저 영역(로그아웃 등) 넣기 */}
        <ModeToggle />
      </div>
    </header>
  );
}
