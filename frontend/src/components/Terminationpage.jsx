// TerminationPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TerminationPage() {
  const [remainingTime, setRemainingTime] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const blockEndTime = localStorage.getItem('blockEndTime');
    if (!blockEndTime) {
      navigate('/'); // Redirect to home if no block end time is found
    }

    const updateRemainingTime = () => {
      const now = Date.now();
      const end = parseInt(blockEndTime, 10);
      const timeLeft = Math.max(end - now, 0);
      setRemainingTime(timeLeft);

      if (timeLeft === 0) {
        localStorage.removeItem('blockEndTime');
        navigate('/'); // Redirect to home page when block time is over
      }
    };

    updateRemainingTime(); // Initial update
    const timer = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <h1 className="text-2xl font-bold text-red-600">You have been terminated</h1>
      <p className="mt-4 text-lg text-gray-700">
        You can't visit this page for {Math.ceil(remainingTime / 1000 / 60)} minutes.
      </p>
    </div>
  );
}

export default TerminationPage;
