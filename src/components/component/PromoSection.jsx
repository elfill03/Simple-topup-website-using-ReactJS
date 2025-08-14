import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const PromoSection = ({ title, type, promos, descriptions }) => {
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseDown = (e, ref) => {
    const slider = ref.current;
    if (slider) {
      slider.isDown = true;
      slider.startX = e.pageX - slider.offsetLeft;
      slider.scrollLeftStart = slider.scrollLeft;
    }
  };

  const handleMouseMove = (e, ref) => {
    const slider = ref.current;
    if (!slider || !slider.isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - slider.startX) * 1.5;
    slider.scrollLeft = slider.scrollLeftStart - walk;
  };

  const handleMouseUpLeave = (ref) => {
    if (ref.current) {
      ref.current.isDown = false;
    }
  };

  const getPromosByType = (promoType) =>
    promos
      .filter((promo) => promo.type === promoType)
      .map((promo) => (
        <div
          key={promo.id}
          style={{
            flex: "0 0 calc(100% / 3 - 1rem)",
          }}
        >
          <div className="card py-1 my-1 promo-card bg-secondary text-white">
            <div className="card-body">
              <h5 className="card-title">{promo.title}</h5>
              <p className="card-text text-light mb-0">
                {descriptions[promo.type]}
              </p>
              <p className="card-text text-light mt-0">
                Durasi: {promo.duration}
              </p>
              <p className="h5 text-light">{promo.price}</p>
              <button
                className="btn btn-danger w-100 rounded-5"
                onClick={() => navigate("/transaction", { state: { promo } })}
              >
                Beli
              </button>
            </div>
          </div>
        </div>
      ));

  return (
    <>
      <h2 className="h5 fw-semibold mb-3 mt-3">{title}</h2>
      <div
        ref={sliderRef}
        className="promo-container"
        onMouseDown={(e) => handleMouseDown(e, sliderRef)}
        onMouseMove={(e) => handleMouseMove(e, sliderRef)}
        onMouseUp={() => handleMouseUpLeave(sliderRef)}
        onMouseLeave={() => handleMouseUpLeave(sliderRef)}
      >
        {getPromosByType(type)}
      </div>
    </>
  );
};

export default PromoSection;
