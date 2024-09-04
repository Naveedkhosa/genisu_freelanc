import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import logo from "../../src/assets/bg.jpg";
import { ArrowRight } from "lucide-react";
import {base_url} from "@/services/apiClient";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [re_type_password, setRetypePassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const SignUp = async () => {
    try {
      if (password === re_type_password) {
        const response = await axios.post(
           `${base_url}/register`,
          {
            name,
            email,
            password,
            role: "Customer",
          }
        );
        console.log("Login successful:", response.data);
        // Store the token in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        // Redirect to the dashboard
        window.location.href = "/dashboard";
      }else{
        throw new Error("Password does not matched");
      }
    } catch (error) {
      console.error("There is an error :", error);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex flex-col items-center gap-4 w-[450px]">
        <div className="w-[250px] h-[250px] relative overflow-hidden rounded-full">
          <img src={logo} alt="logo" />
        </div>
        <h1 className="text-3xl font-bold">Sign up</h1>
        <div className="flex gap-4 flex-col w-[90%]">
          <Input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Input
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Enter your email"
          />

          <Input
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Enter your Password"
          />
          <Input
            type="password"
            placeholder="Repeat Password"
            onChange={(e) => {
              setRetypePassword(e.target.value);
            }}
          />
          <Button className="text-white bg-black" onClick={SignUp}>
            Sign up
          </Button>
          <Link to="/auth/login" className="flex items-center gap-2 text-sm">
            {" "}
            <span>Go to Login page</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
