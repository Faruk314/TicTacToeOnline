import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <section className="flex flex-col items-center justify-center h-[100vh]">
      <h1 className="text-4xl font-bold">WELCOME</h1>
      <p className="text-gray-400">Sign up and play!</p>

      <img src="/images/logo.jpg" alt="" className="w-[5rem] my-5" />

      <form className="flex flex-col justify-center shadow-2xl px-4 py-4 rounded-md">
        <input
          type="email"
          className="border border-gray-400 p-1"
          placeholder="email"
        />

        <input
          type="password"
          className="border p-1 border-gray-400 mt-2"
          placeholder="password"
        />

        <button className="bg-black text-white px-5 py-1 mt-4 hover:bg-white border hover:border-black hover:text-black">
          LOGIN
        </button>

        <button className="text-black px-5 py-1 mt-10 bg-white border border-black hover:bg-black hover:text-white">
          ENTER AS GUEST
        </button>

        <Link to="/register">
          <button className="text-black px-5 py-1 mt-1 bg-white border border-black hover:bg-black hover:text-white w-full">
            CREATE ACCOUNT
          </button>
        </Link>
      </form>
    </section>
  );
};

export default Login;
