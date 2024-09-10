import React from "react";
import ScannerAnimation from "../assets/animations/scan.json";
import Lottie from "lottie-react";

export default function Loader() {
  const scannerAnimation = React.useRef(null);

  return (
    <div className="min-h-[calc(100vh-20px)] md:min-h-[calc(100vh-112px)] flex justify-center items-center">
      <Lottie
        animationData={ScannerAnimation}
        onComplete={() => {
          ScannerAnimation.current?.setDirection(1);
          ScannerAnimation.current?.play();
        }}
        loop={true}
        autoplay={true}
        lottieRef={scannerAnimation}
        className="w-32 h-32 mx-auto my-2"
      />{" "}
    </div>
  );
}
