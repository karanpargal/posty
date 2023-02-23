import React from "react";
import InputScreen from "./components/InputScreen/InputScreen";
import Dashboard from "./components/Dashboard/Dashboard";
import EditTemplate from "./components/EditTemplate/EditTemplate";
import EditorTemplate from "./components/EditorTemplate/EditorTemplate";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<InputScreen />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit" element={<EditTemplate />} />
          <Route path="/editor" element={<EditorTemplate />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
