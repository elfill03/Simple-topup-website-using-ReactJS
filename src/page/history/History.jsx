import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/transactions?userId=${userId}`
        );
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError("Gagal mengambil riwayat transaksi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="bg-dark min-vh-100 text-white p-4">
      <h2 className="fw-bold text-danger mb-4">Riwayat Pembelian</h2>

      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>No</th>
            <th>Paket</th>
            <th>Harga</th>
            <th>Tanggal</th>
            <th>Durasi</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.promoTitle}</td>
                <td>{item.price}</td>
                <td>{formatDate(item.purchaseDate)}</td>
                <td>{item.duration}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Tidak ada riwayat transaksi.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate("/dashboard")}
      >
        ← Kembali ke Dashboard
      </button>
    </div>
  );
};

export default History;
