import React from "react";
import Board from "./components/Board";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route element={<Login />} />
        <Route element={<Board />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
