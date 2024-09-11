import React, { useEffect, useRef } from "react";
import PageWrapper from "../components/Layouts/PageWrapper";
import Lottie from "lottie-react";
import ScannerAnimation from "../assets/animations/scan.json";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { FiSearch } from "react-icons/fi";

export default function HomePage() {
  const scannerAnimation = useRef(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <PageWrapper>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="container mx-auto w-full md:w-3/4 mt-14">
            <h1 className="text-lg md:text-2xl font-bold text-teal text-center px-12 mb-4">
              Reconnaissance Faciale avec IA - Comparez et Identifiez des
              Visages en Temps Réel
            </h1>

            <p className="text-gray-700 text-center text-sm px-20 mb-8">
              Utilisez notre IA avancée pour reconnaître et comparer des visages
              via votre webcam ou en téléchargeant des images. Connectez vos
              images à une base de données sécurisée et obtenez des
              correspondances instantanées.
            </p>
          </div>

          <div className="relative  h-[15rem] w-[15rem] bg-backgroundImageB bg-center bg-cover">
            <Lottie
              animationData={ScannerAnimation}
              onComplete={() => {
                ScannerAnimation.current?.setDirection(1);
                ScannerAnimation.current?.play();
              }}
              loop={true}
              autoplay={true}
              lottieRef={scannerAnimation}
              className="absolute -top-6 -left-1 w-64 h-64 mx-auto my-2 mt-6"
            />
          </div>

          <Link
            to={"/operations"}
            className="text-white flex gap-x-4 items-center justify-center text-md  bg-teal my-8 w-[300px]  mx-auto  text-center font-bold py-2 px-3 rounded-lg hover:bg-teal-600 transition duration-300"
          >
            Identifiez l'individu <FiSearch />
          </Link>
        </>
      )}
    </PageWrapper>
  );
}
