import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PromoSection } from "../../components";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const descriptions = {
    Internet: "Jelajahi internet selama 24 jam",
    Telepon: "Nelpon sepuasnya ke semua operator",
    SMS: "SMS tanpa batas ke semua operator",
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const userRes = await fetch(`http://localhost:3000/users/${userId}`);
        const userData = await userRes.json();
        setUser(userData);

        const promoRes = await fetch("http://localhost:3000/promos");
        const promoData = await promoRes.json();
        setPromos(promoData);
      } catch (err) {
        setError("Gagal mengambil data dari server.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
        <h1>{error}</h1>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-dark min-vh-100 text-white p-4">
      <header className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="fw-bold fst-italic text-danger">Net.id</h1>
          <button
            className="btn btn-link btn-logout text-white text-decoration-none bg-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <p className="text-light mb-0">No.Telp: {user.phone}</p>
          <p className="mb-0">
            Pulsa:
            <span className="text-warning">
              Rp{user.balance.toLocaleString("id-ID")}
            </span>
          </p>
        </div>

        <div className="mt-3">
          {user.packages && user.packages.length > 0 ? (
            user.packages.map((pkg) => (
              <div
                key={pkg.id}
                className="d-flex justify-content-between align-items-center"
              >
                <p className="mb-0">
                  Status paket:
                  <span className="text-info fw-bold ms-2">{pkg.status}</span>
                </p>
                <p className="mb-0">
                  Sisa Kuota {pkg.type}:
                  <span className="text-warning">{pkg.remainingQuota}</span>
                </p>
              </div>
            ))
          ) : (
            <p className="mb-0 text-info">Tidak ada paket aktif.</p>
          )}
        </div>
        <div className="mt-3">
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => navigate("/history")}
          >
            Riwayat Transaksi
          </button>
        </div>
      </header>

      <hr className="" />
      <PromoSection
        title="Promo Paket Internet"
        type="Internet"
        promos={promos}
        descriptions={descriptions}
      />
      <PromoSection
        title="Promo Paket Telepon"
        type="Telepon"
        promos={promos}
        descriptions={descriptions}
      />
      <PromoSection
        title="Promo Paket SMS"
        type="SMS"
        promos={promos}
        descriptions={descriptions}
      />
    </div>
  );
};

export default Dashboard;
