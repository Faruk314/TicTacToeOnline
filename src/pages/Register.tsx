import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <section className="flex flex-col items-center justify-center h-[100vh]">
      <img src="/images/logo.jpg" alt="" className="w-[5rem] my-5" />

      <form className="flex flex-col justify-center shadow-2xl px-4 py-4 rounded-md">
        <input className="border border-gray-400 p-1" placeholder="Username" />

        <input
          type="email"
          className="border my-2 border-gray-400 p-1"
          placeholder="Email"
        />

        <input
          type="password"
          className="border py-1 border-gray-400 p-1"
          placeholder="password"
        />

        <button className="bg-black text-white px-5 py-1 mt-4 hover:bg-white border hover:border-black hover:text-black">
          REGISTER
        </button>

        <Link to="/" className="text-center mt-2 text-gray-400 pt-5">
          Already have an account?
        </Link>
      </form>
    </section>
  );
};

export default Register;
