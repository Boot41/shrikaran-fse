import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "./ui/button";
import Webcam from "react-webcam"; // Ensure correct import
import { Link } from "react-router-dom";

function Interview() {
  const { id } = useParams();
  const [vivaData, setVivaData] = useState(null);
  const [enableWebcam, setEnableWebcam] = useState(false); // Renamed for clarity

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/getdata/${id}/`
        );
        const data = await response.json();
        console.log(data);
        setVivaData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className="my-10">
      <h1 className="font-bold text-3xl">Lets get started</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5 ">
          {vivaData && ( // Wrap content in conditional rendering
            <div className="flex flex-col p-5 rounded-lg border gap-5">
              <h1>Specialization : {vivaData.Specialization}</h1>
              <h1>Subject : {vivaData.SpecializationDescription}</h1>
              <h1>Difficulty : {vivaData.difficulty}</h1>
            </div>
          )}
          <div className="p-5 border rounded-lg border-yellow--300 bg-yellow-100">
            <h1 className="flex gap-2 items-center text-red-400">
              <Lightbulb /> Information
            </h1>
            <h1 className="mt-5">
              Enable webcam and microphone to start ur ai genrated mock viva,it
              has 5 questions which you can answer , and at last u will get a
              report based on the answer
            </h1>
          </div>
        </div>
        <div>
          {enableWebcam ? (
            <Webcam
              onUserMedia={() => setEnableWebcam(true)}
              onUserMediaError={() => setEnableWebcam(false)}
              style={{ height: 300, width: 300 }}
              mirrored={true}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full p-20 bg-secondary rounded-lg border my-10" />
              <Button variant="secondary" onClick={() => setEnableWebcam(true)}>
                Enable webcam and microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end item">
        <Link to={`/interview/${id}/start`}>
          <Button>Start interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
