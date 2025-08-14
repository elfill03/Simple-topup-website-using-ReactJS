import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginSection = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phone) {
      setError("Nomor telepon wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:3000/users?phone=${phone}`
      );
      const users = await response.json();

      if (users.length > 0) {
        setStep(2);
      } else {
        setError("Nomor telepon tidak terdaftar.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menghubungi server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.trim() === "") {
      setError("OTP harus diisi!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:3000/users?phone=${phone}`
      );
      const users = await response.json();

      if (users.length > 0 && otp === "123456") {
        sessionStorage.setItem("userId", users[0].id);
        setError("");
        navigate("/dashboard");
      } else {
        setError("Kode OTP salah!");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat verifikasi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    phone,
    setPhone,
    otp,
    setOtp,
    step,
    error,
    loading,
    handlePhoneSubmit,
    handleOtpSubmit,
  };
};

export default LoginSection;
