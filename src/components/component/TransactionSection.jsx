import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TransactionSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { promo } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("danger");
  const [showAtmForm, setShowAtmForm] = useState(false);
  const [rekeningNumber, setRekeningNumber] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (!promo) {
    return {
      promoExists: false,
      navigate,
    };
  }

  const hargaPaket = Number(promo.price.replace(/[^0-9]/g, ""));

  const getQuotaFromTitle = (title, type) => {
    const value = title.match(/(\d+\.?\d*)/);
    if (!value) return null;

    if (type === "Internet") {
      return `${value[0]}GB`;
    } else if (type === "Telepon") {
      return `${value[0]} menit`;
    } else if (type === "SMS") {
      return `${value[0]}`;
    }
    return value[0];
  };

  const extractQuotaValue = (quotaString) => {
    const value = parseFloat(quotaString.match(/(\d+\.?\d*)/));
    return isNaN(value) ? 0 : value;
  };

  const addQuota = (currentQuota, newQuota, type) => {
    const currentValue = extractQuotaValue(currentQuota);
    const newValue = extractQuotaValue(newQuota);
    const sum = currentValue + newValue;

    if (type === "Internet") {
      return `${sum}GB`;
    } else if (type === "Telepon") {
      return `${sum} menit`;
    } else if (type === "SMS") {
      return `${sum}`;
    }
    return sum;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!paymentMethod) {
      setMessage("Silakan pilih metode pembayaran!");
      setMessageType("danger");
      return;
    }

    if (paymentMethod === "Pulsa") {
      if (user.balance < hargaPaket) {
        setMessage("Maaf, pulsa Anda tidak cukup.");
        setMessageType("danger");
        return;
      }

      const newBalance = user.balance - hargaPaket;

      try {
        let updatedPackages = [...user.packages];
        const existingPackageIndex = updatedPackages.findIndex(
          (pkg) => pkg.type === promo.type
        );

        const newQuotaValue = getQuotaFromTitle(promo.title, promo.type);

        if (existingPackageIndex !== -1) {
          const existingPackage = updatedPackages[existingPackageIndex];
          const newRemainingQuota = addQuota(
            existingPackage.remainingQuota,
            newQuotaValue,
            promo.type
          );
          updatedPackages[existingPackageIndex] = {
            ...existingPackage,
            remainingQuota: newRemainingQuota,
          };
        } else {
          const newPackage = {
            id:
              updatedPackages.length > 0
                ? Math.max(...updatedPackages.map((p) => p.id)) + 1
                : 1,
            title: promo.title,
            type: promo.type,
            remainingQuota: newQuotaValue,
            status: "Aktif",
            expiryDate: new Date(
              new Date().getTime() +
                promo.duration.match(/\d+/)[0] * 24 * 60 * 60 * 1000
            ).toISOString(),
          };
          updatedPackages.push(newPackage);
        }

        await fetch(`http://localhost:3000/users/${user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            balance: newBalance,
            packages: updatedPackages,
          }),
        });

        const transaction = {
          userId: user.id,
          promoTitle: promo.title,
          price: promo.price,
          purchaseDate: new Date().toISOString(),
          duration: promo.duration,
          paymentMethod: "Pulsa",
        };
        await fetch(`http://localhost:3000/transactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transaction),
        });

        setMessage(
          `Pembayaran paket "${promo.title}" berhasil menggunakan Pulsa!`
        );
        setMessageType("success");
        setTimeout(() => navigate("/dashboard"), 3000);
      } catch (error) {
        setMessage("Terjadi kesalahan saat memproses pembayaran.");
        setMessageType("danger");
        console.error("Error processing payment:", error);
      }
    } else if (paymentMethod === "Rekening ATM") {
      setShowAtmForm(true);
    }
  };

  const handleAtmPayment = async () => {
    if (loading) return;

    if (!rekeningNumber.trim()) {
      setMessage("Nomor rekening harus diisi!");
      setMessageType("danger");
      return;
    }

    try {
      let updatedPackages = [...user.packages];
      const existingPackageIndex = updatedPackages.findIndex(
        (pkg) => pkg.type === promo.type
      );

      const newQuotaValue = getQuotaFromTitle(promo.title, promo.type);

      if (existingPackageIndex !== -1) {
        const existingPackage = updatedPackages[existingPackageIndex];
        const newRemainingQuota = addQuota(
          existingPackage.remainingQuota,
          newQuotaValue,
          promo.type
        );
        updatedPackages[existingPackageIndex] = {
          ...existingPackage,
          remainingQuota: newRemainingQuota,
        };
      } else {
        const newPackage = {
          id:
            updatedPackages.length > 0
              ? Math.max(...updatedPackages.map((p) => p.id)) + 1
              : 1,
          title: promo.title,
          type: promo.type,
          remainingQuota: newQuotaValue,
          status: "Aktif",
          expiryDate: new Date(
            new Date().getTime() +
              promo.duration.match(/\d+/)[0] * 24 * 60 * 60 * 1000
          ).toISOString(),
        };
        updatedPackages.push(newPackage);
      }

      await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packages: updatedPackages }),
      });

      const transaction = {
        userId: user.id,
        promoTitle: promo.title,
        price: promo.price,
        purchaseDate: new Date().toISOString(),
        duration: promo.duration,
        paymentMethod: "ATM",
      };
      await fetch(`http://localhost:3000/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      });

      setMessage(
        `Pembayaran paket "${promo.title}" berhasil menggunakan Rekening ATM!`
      );
      setMessageType("success");
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (error) {
      setMessage("Terjadi kesalahan saat memproses pembayaran.");
      setMessageType("danger");
      console.error("Error processing ATM payment:", error);
    }
  };

  return {
    promo,
    promoExists: true,
    paymentMethod,
    setPaymentMethod,
    message,
    messageType,
    showAtmForm,
    setShowAtmForm,
    rekeningNumber,
    setRekeningNumber,
    sisaPulsa: user ? user.balance : 0,
    hargaPaket,
    handlePayment,
    handleAtmPayment,
    navigate,
    loading,
  };
};

export default TransactionSection;
