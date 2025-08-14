
import { LoginSection } from "../../components";

const Login = () => {
  const {
    phone,
    setPhone,
    otp,
    setOtp,
    step,
    error,
    loading,
    handlePhoneSubmit,
    handleOtpSubmit,
  } = LoginSection();

  return (
    <div className="d-flex justify-content-center align-items-center bg-dark vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-4">Login</h3>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handlePhoneSubmit}>
            <div className="mb-3">
              <label className="form-label">Nomor Telepon</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Masukkan nomor telepon"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn btn-danger w-100" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-3">
              <label className="form-label">Kode OTP</label>
              <input
                type="text"
                className="form-control"
                placeholder="Masukkan kode OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn btn-danger w-100" disabled={loading}>
              {loading ? "Loading..." : "Verifikasi"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;