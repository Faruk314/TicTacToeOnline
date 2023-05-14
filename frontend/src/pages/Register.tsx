import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <section className="flex flex-col items-center justify-center h-[100vh]">
      <img src="/images/logo.jpg" alt="" className="w-[5rem] my-5" />

      <form className="flex flex-col justify-center px-4 py-4 rounded-md shadow-2xl">
        <input className="p-1 border border-gray-400" placeholder="Username" />

        <input
          type="email"
          className="p-1 my-2 border border-gray-400"
          placeholder="Email"
        />

        <input
          type="password"
          className="p-1 py-1 border border-gray-400"
          placeholder="password"
        />

        <button className="px-5 py-1 mt-4 text-white bg-black border hover:bg-white hover:border-black hover:text-black">
          REGISTER
        </button>

        <Link to="/" className="pt-5 mt-2 text-center text-gray-400">
          Already have an account?
        </Link>
      </form>
    </section>
  );
};

export default Register;
