import React, { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cleanMessage, login } from "../redux/AuthSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const message = useAppSelector((state) => state.auth.errorMessage);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const loginHandler = async (e: FormEvent) => {
    e.preventDefault();

    await dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/menu");
      dispatch(cleanMessage());
      setEmail("");
      setPassword("");
    }
  }, [isLoggedIn, dispatch]);

  return (
    <section className="flex flex-col items-center justify-center h-[100vh]">
      <h1 className="text-4xl font-bold">WELCOME</h1>
      <p className="text-gray-400">Sign up and play!</p>

      <img src="/images/logo.jpg" alt="" className="w-[5rem] my-5" />

      <form
        onSubmit={loginHandler}
        className="flex flex-col justify-center px-4 py-4 rounded-md shadow-2xl"
      >
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-1 mt-4 border-b-2 border-black outline-none"
          placeholder="email"
        />

        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-1 mt-4 border-b-2 border-black outline-none"
          placeholder="password"
        />

        <button className="px-5 py-1 mt-4 text-white bg-black border hover:bg-white hover:border-black hover:text-black">
          LOGIN
        </button>

        <button className="px-5 py-1 mt-10 text-black bg-white border border-black hover:bg-black hover:text-white">
          ENTER AS GUEST
        </button>

        <Link to="/register">
          <button className="w-full px-5 py-1 mt-1 text-black bg-white border border-black hover:bg-black hover:text-white">
            CREATE ACCOUNT
          </button>
        </Link>
      </form>

      {message && <p className="mt-5 text-center text-red-500">{message}</p>}
    </section>
  );
};

export default Login;
