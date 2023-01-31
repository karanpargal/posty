import React from "react";
import InputScreen from "./components/InputScreen/InputScreen";
import Dashboard from "./components/Dashboard/Dashboard";
import EditTemplate from "./components/EditTemplate/EditTemplate";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<InputScreen />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/input" element={<EditTemplate />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
