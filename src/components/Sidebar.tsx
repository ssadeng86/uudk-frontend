type MenuItem = { name: string; children?: MenuItem[]; path?: string };

export default function Sidebar({
  menu,
  onOpenTab,
}: {
  menu: MenuItem;
  onOpenTab: (path: string) => void;
}) {
  return (
    <aside className="bg-muted border-r p-4 overflow-y-auto">
      <div className="mb-4 font-semibold">{menu?.name}</div>

      {menu?.children?.map((lvl2) => (
        <div key={lvl2.name} className="mb-3">
          <div className="text-sm font-medium mb-2">{lvl2.name}</div>
          <div className="ml-3 space-y-1">
            {lvl2.children?.map((lvl3) => (
              <div
                key={lvl3.name}
                className="text-sm cursor-pointer hover:underline hover:text-foreground"
                onClick={() => lvl3.path && onOpenTab(lvl3.path)}
              >
                {lvl3.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
