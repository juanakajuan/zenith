import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BottomTabBar } from "./components/BottomTabBar";
import { ExercisesPage } from "./pages/ExercisesPage";
import { WorkoutPage } from "./pages/WorkoutPage";
import { HistoryPage } from "./pages/HistoryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/exercises" replace />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
      <BottomTabBar />
    </BrowserRouter>
  );
}
