import React, { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cleanMessage, register } from "../redux/AuthSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const Register = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const message = useAppSelector((state) => state.auth.errorMessage);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  const registerHandler = async (e: FormEvent) => {
    e.preventDefault();

    await dispatch(register({ userName, email, password }));
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/menu");
      dispatch(cleanMessage());
      setEmail("");
      setPassword("");
      setUserName("");
    }
  }, [isLoggedIn, dispatch]);

  return (
    <section className="flex flex-col items-center justify-center h-[100vh]">
      <img src="/images/logo.jpg" alt="" className="w-[5rem] my-5" />

      <form
        onSubmit={registerHandler}
        className="flex flex-col justify-center px-4 py-4 rounded-md shadow-2xl"
      >
        <input
          name="userName"
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          className="p-1 py-1 border-b-2 border-black outline-none"
          placeholder="Username"
        />

        <input
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="p-1 py-1 my-5 border-b-2 border-black outline-none"
          placeholder="Email"
        />

        <input
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="p-1 py-1 border-b-2 border-black outline-none"
          placeholder="password"
        />

        <button
          type="submit"
          className="px-5 py-1 mt-4 text-white bg-black border hover:bg-white hover:border-black hover:text-black"
        >
          REGISTER
        </button>

        <Link to="/" className="pt-5 mt-2 text-center text-gray-400">
          Already have an account?
        </Link>
      </form>

      {message && <p className="mt-5 text-center text-red-500">{message}</p>}
    </section>
  );
};

export default Register;
