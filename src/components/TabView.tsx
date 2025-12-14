import type { Tab } from "@/layouts/AppLayout";
import { X } from "lucide-react";

export default function TabView({
  tabs,
  activeTab,
  onSelect,
  onClose,
}: {
  tabs: Tab[];
  activeTab: string;
  onSelect: (path: string) => void;
  onClose: (path: string) => void;
}) {
  return (
    <div
      className="
      flex border-b overflow-x-auto 
      bg-gray-100 dark:bg-gray-700 
      border-gray-300 dark:border-gray-600
    "
    >
      {tabs.map((tab) => (
        <div
          key={tab.path}
          className={`
            flex items-center px-3 py-2 cursor-pointer border-r
            border-gray-300 dark:border-gray-600
            ${
              activeTab === tab.path
                ? "bg-white dark:bg-gray-800 font-semibold"
                : "hover:bg-gray-200 dark:hover:bg-gray-600"
            }
          `}
          onClick={() => onSelect(tab.path)}
        >
          <span className="truncate max-w-xs">{tab.label}</span>

          <X
            size={14}
            className="
              ml-2 text-gray-500 dark:text-gray-300
              hover:text-red-500 dark:hover:text-red-400
            "
            onClick={(e) => {
              e.stopPropagation();
              onClose(tab.path);
            }}
          />
        </div>
      ))}
    </div>
  );
}
