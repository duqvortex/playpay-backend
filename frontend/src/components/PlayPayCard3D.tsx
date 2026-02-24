import { useState } from "react";
import "./PlayPayCard3D.css";

const PlayPayCard3D: React.FC = () => {
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { offsetWidth: width, offsetHeight: height } = e.currentTarget;
    const { offsetX, offsetY } = e.nativeEvent;

    const rotateY = ((offsetX / width) - 0.5) * 30;
    const rotateX = ((offsetY / height) - 0.5) * -30;

    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const resetTransform = () => {
    setTransform("rotateX(0deg) rotateY(0deg)");
  };

  return (
    <div className="pp-card-wrapper">
      <div
        className="pp-card-3d"
        style={{ transform }}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTransform}
      >
        <div className="pp-card-glow" />

        <div className="pp-card-content">
          <div className="pp-card-top">
            <h2>PlayPay</h2>
            <span className="pp-chip" />
          </div>

          <div className="pp-card-number">
            1234  ****  ****  1314
          </div>

          <div className="pp-card-bottom">
            <div>
              <span>Card Holder</span>
              <p>Seu Nome</p>
            </div>

            <div>
              <span>Valid</span>
              <p>00/00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayPayCard3D;