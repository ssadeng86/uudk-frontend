import { useEffect, useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TabView from "@/components/TabView";
import api from "@/lib/api";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { loadTabsFromLocal, saveTabsToLocal } from "@/lib/tabs";
import { LayoutDashboard } from "lucide-react";

// 메뉴 데이터 (요청하신 구조 반영)
type MenuItem = {
  name: string;
  children?: MenuItem[];
  path?: string;
};

const MENU_DATA: MenuItem[] = [
  { name: "나만의 대쉬보드", path: "/" },
  {
    name: "기준정보 관리",
    children: [
      {
        name: "설비 기준정보",
        children: [{ name: "설비 기준정보 조회", path: "/info/equipment" }],
      },
      {
        name: "파라미터 기준정보",
        children: [
          { name: "MMD 파라미터 조회", path: "/info/mmd" },
          { name: "수집 파라미터 관리", path: "/info/collection" },
        ],
      },
      {
        name: "TPD 기준정보",
        children: [{ name: "TPD 업로드 경로 관리", path: "/info/tpd" }],
      },
      {
        name: "Chunk 기준정보",
        children: [{ name: "Chunk Rule 정의", path: "/info/chunk" }],
      },
    ],
  },
  {
    name: "FDC 구성",
    children: [
      {
        name: "FDC 관리도",
        children: [
          { name: "FDC 관리도 구성", path: "/fdc/manage" },
          { name: "Context Rule 관리", path: "/fdc/context-rule" },
          { name: "Filter Rule 관리", path: "/fdc/filter-rule" },
        ],
      },
      {
        name: "관리선",
        children: [{ name: "Control Limit 설정", path: "/fdc/control-limit" }],
      },
      {
        name: "이상감지 및 알람",
        children: [
          { name: "Alarm Rule 관리", path: "/fdc/alarm-rule" },
          { name: "Lot Hold 관리", path: "/fdc/lot-hold" },
        ],
      },
      {
        name: "FD Simulation",
        children: [{ name: "FD Simulation", path: "/fdc/sim" }],
      },
    ],
  },
  {
    name: "데이터 및 이력",
    children: [
      {
        name: "데이터 조회",
        children: [
          { name: "Raw Data 조회", path: "/data/raw" },
          { name: "통계량 조회", path: "/data/stats" },
        ],
      },
      {
        name: "이력 조회",
        children: [
          { name: "Context Event 조회", path: "/history/context-event" },
          { name: "Control Limit 이력 조회", path: "/history/control-limit" },
          { name: "알람 발생 이력 조회", path: "/history/alarm" },
        ],
      },
    ],
  },
  {
    name: "지표",
    children: [
      { name: "운영지표 조회", path: "/metrics/op" },
      { name: "시스템지표 조회", path: "/metrics/sys" },
    ],
  },
  {
    name: "시스템 관리",
    children: [
      { name: "DC 관리", path: "/sys/dc" },
      { name: "AP 관리", path: "/sys/ap" },
    ],
  },
];

export type Tab = {
  path: string;
  label: string;
};

export default function AppLayout() {
  //   useAuthCheck();

  const navigate = useNavigate();
  const location = useLocation();

  // activeMenu는 1Depth 메뉴 객체
  const [activeMenuIndex, setActiveMenuIndex] = useState<number>(0);
  const [tabs, setTabs] = useState<Tab[]>([]);

  // 앱 시작: 서버에서 탭 불러오기, 실패 시 local fallback
  useEffect(() => {
    (async () => {
      //   try {
      //     const res = await api.get("/user/tabs"); // server returns { tabs: [...] }
      //     if (
      //       res.status === 200 &&
      //       Array.isArray(res.data.tabs) &&
      //       res.data.tabs.length > 0
      //     ) {
      //       setTabs(res.data.tabs);
      //       if (location.pathname === "/")
      //         navigate(res.data.tabs[0], { replace: true });
      //       return;
      //     }
      //   } catch {
      //     /* ignore */
      //   }
      const local = loadTabsFromLocal();
      setTabs(local);
      if (location.pathname === "/" && local.length > 0)
        navigate(local[0].path, { replace: true });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 메뉴 클릭(헤더의 대메뉴 클릭)
  const handleMainMenuClick = (index: number) => {
    setActiveMenuIndex(index);
    // 기본적으로 1Depth의 첫 하위 path가 있으면 바로 열기(선택사항)
    const menu = MENU_DATA[index];
    // 만약 1Depth에 직접 path가 있으면 이동
    if (menu.path) {
      openTab(menu.path);
    }
  };

  const findMenuNameByPath = (
    menu: MenuItem[],
    path: string
  ): string | null => {
    for (const item of menu) {
      if (item.path === path) return item.name;
      if (item.children) {
        const found = findMenuNameByPath(item.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  const openTab = (path: string) => {
    const label = findMenuNameByPath(MENU_DATA, path) ?? path;

    setTabs((prev) => {
      if (prev.some((t) => t.path === path)) {
        navigate(path);
        return prev;
      }
      const next = [...prev, { path, label }];
      saveTabsToLocal(next);
      navigate(path);
      return next;
    });
  };

  const closeTab = (path: string) => {
    setTabs((prev) => {
      const idx = prev.findIndex((t) => t.path === path);
      const next = prev.filter((t) => t.path !== path);
      saveTabsToLocal(next);

      if (location.pathname === path) {
        const target = next[Math.max(0, idx - 1)]?.path ?? "/";
        navigate(target);
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* --- Sidebar --- */}
      <div className="flex flex-col w-60 border-r bg-white dark:bg-gray-800 dark:border-gray-700">
        {/* Sidebar 상단 회사 로고 (Header 높이와 동일하게 60px 기준) */}
        <div className="h-16 flex items-center justify-center border-b ">
          {/* <LayoutDashboard size={20} /> */}
          <h1 className="font-bold text-lg">한화 MCS FDC</h1>
        </div>

        {/* 사이드 메뉴 */}
        <div className="flex-1 overflow-auto">
          <Sidebar menu={MENU_DATA[activeMenuIndex]} onOpenTab={openTab} />
        </div>
      </div>

      {/* --- Main 영역 --- */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* 메인 상단 메뉴(Header) */}
        <div className="h-16 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
          <Header
            menu={MENU_DATA}
            activeIndex={activeMenuIndex}
            onMainMenuClick={handleMainMenuClick}
          />
        </div>

        {/* 탭뷰 영역 */}
        <div className="border-b bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
          <TabView
            tabs={tabs}
            activeTab={location.pathname}
            onSelect={(p) => navigate(p)}
            onClose={closeTab}
          />
        </div>

        {/* 본문 영역 */}
        <div className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-900">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
