import "./App.css";
import AppLayout from "@/layouts/AppLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import FdcManage from "@/pages/FdcManage";
import EquipmentInfo from "@/pages/EquipmentInfo";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/login" element={<Home />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/fdc/manage" element={<FdcManage />} />
          <Route path="/info/equipment" element={<EquipmentInfo />} />
          <Route path="/*" element={<Home />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
