const getCurrentTime = () => {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours}:${minutes}`;
};

function dataURLToBlob(dataURL) {
  const byteString = atob(dataURL.split(",")[1]); // Decode base64
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0]; // Extract MIME type

  const byteArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([byteArray], { type: mimeString });
}

export { getCurrentTime, dataURLToBlob };
