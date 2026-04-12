import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LaunchDetail from "./pages/LaunchDetail";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/launch/:id" element={<LaunchDetail />} />
    </Routes>
  );
}

export default App;
