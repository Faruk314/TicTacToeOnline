import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <section className="flex flex-col items-center justify-center h-[100vh]">
      <h1 className="text-4xl font-bold">WELCOME</h1>
      <p className="text-gray-400">Sign up and play!</p>

      <img src="/images/logo.jpg" alt="" className="w-[5rem] my-5" />

      <form className="flex flex-col justify-center px-4 py-4 rounded-md shadow-2xl">
        <input
          type="email"
          className="p-1 border border-gray-400"
          placeholder="email"
        />

        <input
          type="password"
          className="p-1 mt-2 border border-gray-400"
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
    </section>
  );
};

export default Login;
