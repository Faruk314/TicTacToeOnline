import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <section className="flex flex-col items-center justify-center h-[100vh]">
      <h1 className="text-2xl font-bold mb-5">REGISTER</h1>

      <form className="flex flex-col justify-center shadow-2xl px-2 pb-2 pt-5">
        <label className="font-bold">USERNAME</label>
        <input className="border border-gray-400 p-1" />

        <label className="mt-5 font-bold">EMAIL</label>
        <input type="email" className="border border-gray-400 p-1" />

        <label className="mt-5 font-bold">PASSWORD</label>
        <input type="password" className="border py-1 border-gray-400 p-1" />

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
