import React, { useContext, useEffect } from "react";
import PageWrapper from "../components/Layouts/PageWrapper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud, FiTrash2, FiCamera } from "react-icons/fi";
import Loader from "../components/Loader";
import ProgressBar from "../components/ProgressBar";
import { useRef } from "react";
import { jsPDF } from "jspdf";
import { FiDownload, FiDatabase } from "react-icons/fi";
import axios from "axios";
import { DataContext } from "../context/apiContext";
import { dataURLToBlob } from "../utils";

const API_BASE_INS_URL = import.meta.env.VITE_API_ETU_URI_BASE;

const FaceRecognitionScreen = () => {
  const { setImageSend } = useContext(DataContext);
  const [option, setOption] = useState("upload"); // Default is upload
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const [isCamera, setIsCamera] = useState(false); // Initial state is "Camera"
  const [isCaptured, setIsCaptured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [AnalyseStart, setAnalyseStart] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState("");
  const [file, setFile] = useState();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const [selectedFile, setSelectedFile] = useState([]);
  const { data, updateData } = useContext(DataContext);

  const toggleSwitch = () => {
    setIsCaptured(false);
    setSelectedFile([]);
    setIsCamera(!isCamera); // Toggles between "Camera" and "Upload fichier"
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile({
        name: e.target.files[0].name,
        url: URL.createObjectURL(e.target.files[0]),
      });
      setFile(event.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setFile(event.target.files[0]);
      setSelectedFile({
        name: e.dataTransfer.files[0].name,
        url: URL.createObjectURL(e.dataTransfer.files[0]),
      });
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current frame from the video onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data from the canvas
    const imageData = canvas.toDataURL("image/png");
    setSelectedFile({
      name: "capture.png",
      url: imageData,
    });

    let imageBlob = dataURLToBlob(imageData);

    setFile(new File([imageBlob], "image.png", { type: "image/png" }));

    setIsCaptured(true);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    setAnalyseStart(true);
    console.log(file);
    const formData = new FormData();
    formData.append("image", file);
    setImageSend(selectedFile);
    try {
      const response = await axios.post(
        API_BASE_INS_URL + "/api/upload_image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      console.log("Response:", response.data);

      updateData(response.data);
      setAnalyseStart(false);
      navigate("/similarity");
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error?.response?.data?.error || "Une erreur est survenue ");
    }
  };

  useEffect(() => {
    let video = videoRef.current;

    if (video) {
      const getVideo = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          video.srcObject = stream;
          await video.play();
        } catch (err) {
          console.error("Error accessing webcam: ", err);
        } finally {
          setIsLoading(false);
        }
      };
      getVideo();
    }
  }, [isCamera, isCaptured]);

  const handleCancel = () => {
    setAnalyseStart(false);
    setIsCaptured(false);
    setSelectedFile([]);
    setError("");
  };

  const handleTakePicture = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      // Simulate post-upload actions
      alert("Picture uploaded successfully!");
    }, 30000); // Simulate a 30 second upload process
  };

  return (
    <PageWrapper>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col gap-y-1 mx-auto mt-4">
              {/* <span
                className={`text-md text-center font-medium transition-opacity duration-500 ease-in-out transform ${
                  isCamera ? "text-white" : "text-teal"
                }`}
                key={isCamera ? "camera" : "upload"}
              >
                {isCamera ? "Camera" : "Fichier"}
              </span> */}
              <button
                onClick={toggleSwitch}
                className={`relative w-28 h-10 mt-1 mb-1  rounded-full transition-colors duration-500 ease-in-out outline-none ring-4 ring-teal scale-105 transform hover:scale-105 ${
                  isCamera ? "bg-gray-400" : "bg-teal"
                }`}
              >
                {!isCamera ? (
                  <FiCamera className="w-6 h-10 ml-1 text-white" />
                ) : (
                  <FiUploadCloud className="w-6 h-10 ml-20 text-white" />
                )}
                <span
                  className={`absolute left-1 top-1 w-9 h-8 rounded-full border-2  bg-white shadow-md transition-transform duration-500 ease-in-out transform ${
                    isCamera ? "translate-x-0" : "translate-x-16"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Face Detection Overlay */}
          {isCamera ? (
            <div className="mt-8 max-w-sm w-full">
              <div className="relative mt-8 mx-auto w-[376px] h-80  rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex justify-center items-center">
                  {/* Facial landmark dots */}
                  <div className="absolute flex flex-col items-center justify-center space-y-2 animate-pulse">
                    <div className="flex space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="flex space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  {isCaptured ? (
                    <img
                      src={selectedFile.url}
                      alt="selectedFile"
                      className="w-[300px] h-[300px] object-cover mx-auto"
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      width="370"
                      height="240"
                      style={{
                        width: "100%",
                        maxWidth: "500px",
                        border: "2px solid black",
                        borderRadius: "5%",
                      }}
                    />
                  )}

                  {/* Corner brackets */}
                  <div className="absolute w-full h-full border border-transparent pointer-events-none">
                    <div className="absolute top-10 left-10 w-12 h-12 border-t-4 border-l-4 border-white"></div>
                    <div className="absolute top-10 right-10 w-12 h-12 border-t-4 border-r-4 border-white"></div>
                    <div className="absolute bottom-10 left-10 w-12 h-12 border-b-4 border-l-4 border-white"></div>
                    <div className="absolute bottom-10 right-10 w-12 h-12 border-b-4 border-r-4 border-white"></div>
                  </div>
                  <canvas
                    ref={canvasRef}
                    style={{
                      display: "none",
                    }}
                  />
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center p-4 ">
                  {isCaptured ? (
                    <button
                      onClick={handleCancel}
                      className="w-12 h-12 bg-teal rounded-full flex items-center justify-center"
                    >
                      <FiTrash2 className="w-6 h-6 text-red-700" />
                    </button>
                  ) : (
                    <button
                      onClick={handleCapture}
                      className="w-12 h-12 bg-teal rounded-full flex items-center justify-center"
                    >
                      <FiCamera className="w-6 h-6 text-white" />
                    </button>
                  )}
                </div>
              </div>
              {isCaptured && AnalyseStart === false && (
                <button
                  onClick={handleUpload}
                  className="mx-auto my-8 px-6 block text-sm py-2 bg-teal text-white rounded-lg hover:bg-white hover:text-teal focus:outline-none focus:ring-2  ring-offset-2 transition duration-300 ease-in-out"
                >
                  Analyser l'image
                </button>
              )}

              {AnalyseStart && (
                <div className="flex justify-center items-center">
                  <ProgressBar />
                </div>
              )}
              {error && <p className="text-center text-red-400">{error}</p>}
            </div>
          ) : (
            <div className="mt-8 max-w-sm w-full">
              {!selectedFile.name ? (
                <div
                  className="drop-zone bg-gray-100 border-4 border-dashed border-gray-300 rounded-lg p-8 text-center relative overflow-hidden transition-all duration-300 ease"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    className="file-input absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg"
                  />
                  <div className="pointer-events-none">
                    <FiUploadCloud
                      className="mx-auto mb-4 text-gray-400"
                      size={64}
                    />
                    <p className="text-gray-600 mb-2">
                      Glissez et déposez votre image/photo ici
                    </p>
                    <p className="text-sm text-gray-500">ou</p>
                    <button className="mt-4 px-6 py-1 bg-navy text-white rounded-full hover:bg-teal focus:outline-none ring-2 ring-teal ring-offset-2 transition duration-300 ease-in-out">
                      Chargez l'image
                    </button>
                  </div>
                </div>
              ) : (
                <img
                  src={selectedFile.url}
                  alt="selectedFile"
                  className="w-[300px] h-[300px] object-cover mx-auto"
                />
              )}
              {selectedFile.name && (
                <div className="mt-6 text-center">
                  <p className="text-gray-700">Image sélectionnée:</p>
                  <p className="font-normal text-md text-black italic">
                    {selectedFile.name}
                  </p>
                  <button onClick={() => setSelectedFile([])}>
                    <FiTrash2 className="text-red-300 text-xl" />
                  </button>
                </div>
              )}

              {selectedFile.name && AnalyseStart === false && (
                <button
                  onClick={handleUpload}
                  className="my-8 block px-6 mx-auto text-sm py-2 bg-teal text-white rounded-lg hover:bg-white hover:text-teal focus:outline-none ring-2  ring-offset-2 transition duration-300 ease-in-out"
                >
                  Analyser l'image
                </button>
              )}
              {AnalyseStart && !error && (
                <div className="flex justify-center items-center">
                  <ProgressBar />
                </div>
              )}
              {error && <p className="text-center text-red-400">{error}</p>}
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default FaceRecognitionScreen;
