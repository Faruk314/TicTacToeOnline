import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameRoom from "./pages/GameRoom";
import Login from "./pages/Login";
import MainMenu from "./pages/MainMenu";
import Register from "./pages/Register";
import axios from "axios";
import { useAppDispatch } from "./redux/hooks";
import { getLoginStatus } from "./redux/AuthSlice";

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/room/:id" element={<GameRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
