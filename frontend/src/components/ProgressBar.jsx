import React, { useEffect, useState } from "react";

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Set an interval to update the progress every 50 milliseconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100; // Ensures the progress doesn't exceed 100
        }
        return prev + 2; // Increase progress by 2% every 50ms (adjust for desired speed)
      });
    }, 100); // Update every 100 milliseconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 my-4">
      <div
        className="bg-teal h-2 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
