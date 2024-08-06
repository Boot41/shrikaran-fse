import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { Button } from "./ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { AwardIcon, Mic } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Recordanswersection({ questions, answers, activeqindex, id }) {
  const [useranswer, setuseranswer] = useState("");
  const [loading, setloading] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [multipleFacesCount, setMultipleFacesCount] = useState(0);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [hasAlerted, setHasAlerted] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const {
    error,
    interimResult,
    isRecording,
    setResults,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) =>
      setuseranswer((prevans) => prevans + result?.transcript)
    );
  }, [results]);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      setIsModelLoaded(true);
    };

    loadModels();
  }, []);

  useEffect(() => {
    const video = webcamRef.current?.video;

    if (video) {
      video.addEventListener("loadeddata", () => {
        detectFaces();
      });
    }

    return () => {
      if (video) {
        video.removeEventListener("loadeddata", detectFaces);
      }
    };
  }, [webcamRef.current, isModelLoaded]);

  const detectFaces = async () => {
    if (
      isModelLoaded &&
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.warn("Video dimensions are invalid.");
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      faceapi.matchDimensions(canvas, displaySize);

      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
      );
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);

      if (detections.length === 0) {
        setStatusMessage("No face detected.");
      } else if (detections.length > 1) {
        setStatusMessage("Multiple faces detected.");
        setMultipleFacesCount((prevCount) => {
          const newCount = prevCount + 1;
          if (newCount > 5) {
            const blockEndTime = Date.now() + 60 * 1000; // 1 minute in milliseconds
            localStorage.setItem("blockEndTime", blockEndTime);
            navigate("/terminated");
          }
          return newCount;
        });
      } else {
        setStatusMessage("");
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(detectFaces, 1000);
    return () => clearInterval(interval);
  }, [isModelLoaded]);

  useEffect(() => {
    const blockEndTime = localStorage.getItem("blockEndTime");
    if (blockEndTime && Date.now() < blockEndTime) {
      navigate("/terminated");
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (!hasAlerted) {
          alert("Do not switch the tab; it will be counted as malpractice.");
          setHasAlerted(true);
        }

        setTabSwitchCount((prevCount) => {
          const newCount = prevCount + 1;
          if (newCount > 2) {
            sendemail();
            const blockEndTime = Date.now() + 60 * 1000; // 1 minute in milliseconds
            localStorage.setItem("blockEndTime", blockEndTime);
            navigate("/terminated");
          }
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate, hasAlerted]);

  const saveuseranswer = async () => {
    if (isRecording) {
      setloading(true);
      stopSpeechToText();
      if (useranswer.length <= 0) {
        setloading(false);
        toast("Error while recording the answer, please try again");
        return;
      }
      const feedbackprompt =
        "question " +
        questions[activeqindex] +
        ", user answer " +
        useranswer +
        " based on the user answer for the question give a rating and a feedback for the answer in just 3 to 5 lines in json format with rating field and the rating should be out of 5 and feedback field. Do not give any other data, just give the rating and feedback because I want to parse it into json format so I don't need any extra data. So please only give the json, no extra data.";

      try {
        // Fetch feedback
        const result = await fetch("http://127.0.0.1:8000/api/genratefeedback/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            prompt: feedbackprompt,
          }),
        });

        // Check if response is okay
        if (!result.ok) {
          throw new Error("Network response was not ok");
        }

        // Parse the feedback
        const feedres = await result.json();
        const jsonresponse = feedres.feedback;
        const feedbackresponse = JSON.parse(jsonresponse);

        // Validate jsonresponse
        if (jsonresponse) {
          console.log("Valid feedback received:",feedbackresponse.feedback,feedbackresponse.rating);
          console.log(typeof(feedbackresponse.rating))
          try {
            // Store feedback
            const response = await fetch(
              "http://127.0.0.1:8000/api/storefeedback/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                  viva_id: id,
                  question: questions[activeqindex],
                  answer: answers[activeqindex],
                  useranswer,
                  feedback: feedbackresponse?.feedback,
                  rating: feedbackresponse?.rating,
                  useremail: user?.primaryEmailAddress.emailAddress,
                }),
              }
            );

            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            let res = await response.json();
            console.log("Feedback stored successfully:", res);
          } catch (error) {
            console.error("Error storing feedback:", error);
            alert("An error occurred while saving feedback. Please try again later.");
          }
        } else {
          console.warn("Invalid feedback received:", jsonresponse);
          alert("The feedback received is invalid. Please try again.");
        }
      } catch (error) {
        console.error("Error generating feedback:", error);
        alert("An error occurred while generating feedback. Please try again later.");
      }

      setuseranswer("");
      setResults([]);
      setloading(false);
    } else {
      startSpeechToText();
    }
  };

  const sendemail = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/send-email/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          to: "shrikaranks@gmail.com",
          subject: "student termination email",
          message:
            "The student has been terminated because we found multiple tab switches, which we consider malpractice.",
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await response.json();
      alert("Email sent to the teacher. You are now in trouble.");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the email. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex flex-col justify-center items-center rounded-lg p-5 mt-20">
        <Webcam
          mirrored={true}
          ref={webcamRef}
          style={{ height: 500, width: "100%", zIndex: 10 }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 500,
            width: "100%",
            zIndex: 20,
          }}
        />
      </div>
      {statusMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "red",
            color: "white",
            textAlign: "center",
            padding: "10px",
            zIndex: 30,
          }}
        >
          {statusMessage}
        </div>
      )}
      <Button onClick={saveuseranswer} variant="secondary" className="my-10">
        {isRecording ? (
          <h1 className="text-red-600 flex gap-2">
            <Mic />
            Stop Recording...
          </h1>
        ) : (
          "Record answer"
        )}
      </Button>
    </div>
  );
}

export default Recordanswersection;


