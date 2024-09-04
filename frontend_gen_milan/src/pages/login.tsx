import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import logo from "../../src/assets/bg.jpg";
import baseClient from "@/services/apiClient";
import { base_url } from "@/services/apiClient";


export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err_msg, setErrMsg] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      baseClient
        .get("user")
        .then(() => {
          navigate("/dashboard");
        })
        .catch(() => {

        });
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${base_url}/login`, {
        email,
        password,
      });
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.log("Error logging in:", error.response.data.error);
      setErrMsg(error.response.data.error);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex flex-col items-center gap-4 w-[450px]">
        <div className="w-[250px] h-[250px] relative overflow-hidden rounded-full">
          <img src={logo} alt="logo" />
        </div>
        .{err_msg && (
          <div className="bg-red-500 w-[90%] text-white p-2 rounded-md">
            {err_msg}
          </div>
        )}
        <h1 className="text-3xl font-bold">Login</h1>
        <div className="flex gap-4 flex-col w-[90%]">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="text-white bg-black" onClick={handleLogin}>
            Login
          </Button>
          {/* <Link to="/auth/signupp" className="flex items-center gap-2 text-sm">
            {" "}
            <span>If you haven't an account</span>
            <ArrowRight size={16} />
          </Link> */}
        </div>
      </div>
    </div>
  );
};
