import { TransactionSection } from "../../components";

const Transaction = () => {
  const {
    promo,
    promoExists,
    setPaymentMethod,
    message,
    messageType,
    showAtmForm,
    setShowAtmForm,
    rekeningNumber,
    setRekeningNumber,
    sisaPulsa,
    handlePayment,
    handleAtmPayment,
    navigate,
  } = TransactionSection();

  if (!promoExists) {
    return (
      <div className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <p>Data paket tidak ditemukan</p>
          <button
            className="btn btn-danger"
            onClick={() => navigate("/dashboard")}
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark text-white min-vh-100 p-4">
      <h2 className="fw-bold text-danger">Transaksi Pembelian</h2>

      {message && (
        <div className={`alert alert-${messageType} mt-3`} role="alert">
          {message}
        </div>
      )}

      <div className="card bg-secondary text-white mt-4">
        <div className="card-body">
          <h5 className="card-title">{promo.title}</h5>
          <p className="card-text mb-1">Durasi: {promo.duration}</p>
          <p className="card-text mb-1">Harga: {promo.price}</p>
          <p className="card-text">Tipe: {promo.type}</p>
        </div>
      </div>

      {!showAtmForm ? (
        <form onSubmit={handlePayment} className="mt-4">
          <h5 className="mb-3">Pilih Metode Pembayaran</h5>
          <div className="form-check my-2">
            <input
              type="radio"
              id="pulsa"
              name="payment"
              value="Pulsa"
              className="form-check-input"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label
              htmlFor="pulsa"
              className="form-check-label fw-bold"
              style={{ cursor: "pointer" }}
            >
              Pulsa
              <span className="text-warning ms-1">
                (Sisa Pulsa: Rp{sisaPulsa.toLocaleString("id-ID")})
              </span>
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              id="atm"
              name="payment"
              value="Rekening ATM"
              className="form-check-input"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label
              htmlFor="atm"
              className="form-check-label fw-bold mb-3"
              style={{ cursor: "pointer" }}
            >
              Rekening ATM
            </label>
          </div>

          <button type="submit" className="btn btn-danger mt-3">
            Bayar Sekarang
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-3 mt-3"
            onClick={() => navigate("/dashboard")}
          >
            Batal
          </button>
        </form>
      ) : (
        <div className="mt-4">
          <h5>Masukkan Nomor Rekening</h5>
          <input
            type="text"
            className="form-control my-3"
            style={{ width: "12%" }}
            placeholder="Nomor Rekening"
            value={rekeningNumber}
            onChange={(e) => setRekeningNumber(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleAtmPayment}>
            Bayar
          </button>
          <button
            className="btn btn-secondary ms-3"
            onClick={() => setShowAtmForm(false)}
          >
            Kembali
          </button>
        </div>
      )}
    </div>
  );
};

export default Transaction;
