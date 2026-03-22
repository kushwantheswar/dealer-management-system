import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [generatedCaptcha, setGeneratedCaptcha] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(result);
  };

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth === "true") {
      navigate("/dashboard");
    }
    generateCaptcha();
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password || !captcha) {
      setError("All fields are required.");
      return;
    }

    if (captcha.toUpperCase() !== generatedCaptcha) {
      setError("Invalid security code. Please try again.");
      generateCaptcha();
      setCaptcha("");
      return;
    }

    if (username === "admin" && password === "admin123") {
      setLoading(true);
      setTimeout(() => {
        localStorage.setItem("auth", "true");
        navigate("/dashboard");
        setLoading(false);
      }, 500);
    } else {
      setError("Invalid credentials");
      generateCaptcha();
    }
  };

  return (
    // Main Container: Flexbox row
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      
      {/* LEFT SIDE - Video (Full screen on left) */}
      <div className="hidden md:block w-1/2 h-screen relative bg-black">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/lgvideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* RIGHT SIDE - Background Gradient for Glass Effect */}
      <div className="w-full md:w-1/2 h-screen flex flex-col justify-center items-center p-8 relative bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100">
        
        {/* Login Card Container - COMPACT SIZE & GLASS LOOK */}
        <div className="w-full max-w-sm p-6 rounded-2xl 
                        bg-white/40 backdrop-blur-xl 
                        border border-white/30 
                        shadow-[0_0_30px_rgba(99,102,241,0.25)] 
                        relative">
          
          {/* Header */}
          <div className="text-center mb-5">
            <img
              src="/images/log.jpg"
              alt="Company Logo"
              className="mx-auto w-12 h-12 object-contain mb-2"
            />
            <h1 className="text-xl font-semibold text-gray-800">
              Dealer Management System
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Secure login to access dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-100/80 backdrop-blur border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg text-center">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter username"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-white/50 bg-white/60 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter password"
                  className="w-full pl-9 pr-9 py-2 text-sm rounded-lg border border-white/50 bg-white/60 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? (
                    <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                  ) : (
                    <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Security Code */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Security Code
              </label>
              <div className="flex gap-2">
                <div 
                  className="flex items-center justify-center bg-gray-200/60 border border-white/50 rounded-lg px-4 py-2 font-semibold text-gray-800 text-sm tracking-widest select-none cursor-pointer hover:bg-gray-300/60 transition"
                  onClick={generateCaptcha}
                  title="Click to refresh"
                >
                  {generatedCaptcha}
                </div>

                <input
                  type="text"
                  value={captcha}
                  onChange={(e) => {
                    setCaptcha(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-white/50 bg-white/60 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none uppercase placeholder-gray-400"
                  maxLength="4"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1 text-right cursor-pointer hover:text-indigo-700" onClick={generateCaptcha}>
                Refresh Code?
              </p>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.01] text-sm ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Footer at the bottom of the right side */}
        <div className="absolute bottom-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Dealer Management System
        </div>
      </div>
    </div>
  );
};

export default Login;