import { useState } from "react";
import { motion } from "framer-motion";
import Logo from "../images/logoit.png";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function SignInSide() {
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      username: data.get("username"),
      password: data.get("password"),
    };

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok && result.status === "ok") {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.role);
        localStorage.setItem("id", result.id);
        localStorage.setItem("name", result.name);
        if (result.role === "admin") {
          window.location = "/admin/dashboard";
        } else if (result.role === "teacher") {
          window.location = "/teacher/calendar";
        } else {
          window.location = "/activity/calendar";
        }
      } else {
        setErrorMessage(
          "Login failed. Please check your username and password."
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (response.ok) {
        setResetMessage("Password reset link sent to your email address.");
        setResetEmail("");
      } else {
        setResetMessage(
          "Failed to send password reset link. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during password reset request:", error);
      setResetMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <section className="min-h-screen flex items-stretch text-white ">
        <div
          className="lg:flex w-1/2 hidden bg-gray-500 bg-no-repeat bg-cover relative items-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80)",
          }}
        >
          <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
          <div className="w-full px-24 z-10">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl font-bold text-left tracking-wide "
            >
              INFORMATION TECHNOLOGY
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-3xl my-4"
            >
              ยินดีต้อนรับเข้าสู่ระบบกิจกรรมของสาขาเทคโนโลยีสารสนเทศ
            </motion.p>
          </div>
        </div>
        <motion.form
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={
            showForgotPassword ? handleForgotPasswordSubmit : handleSubmit
          }
          className="w-full lg:w-1/2 bg-gray-900 flex flex-col items-center justify-center relative"
        >
          <div className="grid grid-cols-1 w-11/12 sm:w-3/4 lg:w-2/3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col items-center"
            >
              <img src={Logo} alt="" className="w-60 -mb-14" />
              <h2 className="text-3xl font-extrabold text-white">
                {showForgotPassword ? "RESET PASSWORD" : "LOGIN"}
              </h2>
            </motion.div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {showForgotPassword ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="mt-4"
                >
                  <label
                    htmlFor="reset-email"
                    className="text-sm font-bold text-white"
                  >
                    Enter your email
                  </label>
                  <input
                    type="email"
                    id="reset-email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </motion.div>
                {resetMessage && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="text-white mt-2"
                  >
                    {resetMessage}
                  </motion.p>
                )}
                <motion.button
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-sm font-semibold text-purple-600 hover:text-white mt-2"
                >
                  Back to Login
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  type="submit"
                  className="w-full p-3 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring focus:border-purple-300 mt-4"
                >
                  Send Reset Link
                </motion.button>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="mt-4"
                >
                  <label
                    htmlFor="username"
                    className="text-sm font-bold text-white"
                  >
                    Username
                  </label>
                  <input
                    type="username"
                    id="username"
                    name="username"
                    className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="mt-4 relative"
                >
                  <label
                    htmlFor="password"
                    className="text-sm font-bold text-white"
                  >
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 mt-3 text-gray-700 text-xs hover:text-white focus:outline-none"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 2 }}
                  className="flex items-center justify-between mt-4"
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm font-semibold text-purple-600 hover:text-white"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 2.5 }}
                  className="mt-6"
                >
                  <button className="w-full p-3 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring focus:border-purple-300">
                    Sign In
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </motion.form>
      </section>
    </>
  );
}
