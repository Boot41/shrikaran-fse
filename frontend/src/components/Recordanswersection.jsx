// import React, { useEffect, useState } from "react";
// import Webcam from "react-webcam";
// import { Button } from "./ui/button";
// import useSpeechToText from "react-hook-speech-to-text";
// import { Mic } from "lucide-react";
// import { toast } from "sonner";

// import { getGroqChatCompletion } from "../../groqapi";
// import { useUser } from "@clerk/clerk-react";

// function Recordanswersection({ questions, answers, activeqindex, id }) {
//   const [useranswer, setuseranswer] = useState("");
//   const[loading,setloading] = useState(false)
//   const { user } = useUser();
//   const {
//     error,
//     interimResult,
//     isRecording,
//     setResults,
//     results,
//     startSpeechToText,
//     stopSpeechToText,
//   } = useSpeechToText({
//     continuous: true,
//     useLegacyResults: false,
//   });

//   useEffect(() => {
//     results.map((result) =>
//       setuseranswer((prevans) => prevans + result?.transcript)
//     );
//   }, [results]);

//   const saveuseranswer = async () => {
//     if (isRecording) {
//       setloading(true)
//       stopSpeechToText();
//       if (useranswer.length <= 0) {
//         setloading(false)
//         toast("error while recording the answer pls try again");
//         return;
//       }
//       const feedbackprompt =
//         " question " +
//         questions[activeqindex] +
//         ", user answer " +
//         useranswer +
//         " based an the useranswer for the question give a rating and a feed back for the answer in just 3 to 5 lines in json format with rating field and the rating should be out of 5 and feed back field do give any other data just give the rating and feed back beasue i want to parse it into json format so i dot need any extra data so pls only give the json and agian i say i only need the json no extra data";

//       let result = await getGroqChatCompletion(feedbackprompt);
//       result = result.choices[0].message.content;
//       let jsonresponse = JSON.parse(result);
//       console.log(jsonresponse)

//       try {
//         const response = await fetch(
//           "http://127.0.0.1:8000/api/storefeedback/",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/x-www-form-urlencoded",
//             },
//             body: new URLSearchParams({
//               viva_id: id,
//               question: questions[activeqindex],
//               answer: answers[activeqindex],
//               useranswer,
//               feedback: jsonresponse?.feedback,
//               rating: jsonresponse?.rating,
//               useremail: user?.primaryEmailAddress.emailAddress,
//             }),
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }

//         let res = await response.json();
//         console.log(res);
//       } catch (error) {
//         console.error("Error submitting data:", error);
//         toast.error(
//           "An error occurred while saving feedback. Please try again later."
//         );
//       }
//       setuseranswer("");
//       setResults([]);
//       setloading(false)
//     } else {
//       startSpeechToText();
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <div className="flex flex-col justify-center items-center rounded-lg p-5 mt-20">
//         <img src="/webcam.jpg" width={275} height={275} className="absolute" />
//         <Webcam
//           mirrored={true}
//           style={{ height: 500, width: "100%", zIndex: 10 }}
//         />
//       </div>
//       <Button onClick={saveuseranswer} variant="secondary" className="my-10">
//         {isRecording ? (
//           <h1 className="text-red-600 flex gap-2">
//             <Mic />
//             Stop Recording...
//           </h1>
//         ) : (
//           "Record answer"
//         )}
//       </Button>
//     </div>
//   );
// }

// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import * as faceapi from "face-api.js";
// import { Button } from "./ui/button";
// import useSpeechToText from "react-hook-speech-to-text";
// import { Mic } from "lucide-react";
// import { toast } from "sonner";
// import { getGroqChatCompletion } from "../../groqapi";
// import { useUser } from "@clerk/clerk-react";

// function Recordanswersection({ questions, answers, activeqindex, id }) {
//   const [useranswer, setuseranswer] = useState("");
//   const [loading, setloading] = useState(false);
//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [statusMessage, setStatusMessage] = useState(""); // For displaying messages
//   const { user } = useUser();
//   const {
//     error,
//     interimResult,
//     isRecording,
//     setResults,
//     results,
//     startSpeechToText,
//     stopSpeechToText,
//   } = useSpeechToText({
//     continuous: true,
//     useLegacyResults: false,
//   });

//   useEffect(() => {
//     results.map((result) =>
//       setuseranswer((prevans) => prevans + result?.transcript)
//     );
//   }, [results]);

//   useEffect(() => {
//     const loadModels = async () => {
//       const MODEL_URL = "/models"; // Change to the path where you've placed your models
//       await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//       setIsModelLoaded(true);
//     };

//     loadModels();
//   }, []);

//   useEffect(() => {
//     const video = webcamRef.current?.video;

//     if (video) {
//       video.addEventListener('loadeddata', () => {
//         console.log('Video loaded and ready');
//         detectFaces();
//       });
//     }

//     return () => {
//       if (video) {
//         video.removeEventListener('loadeddata', detectFaces);
//       }
//     };
//   }, [webcamRef.current, isModelLoaded]);

//   const detectFaces = async () => {
//     if (isModelLoaded && webcamRef.current && webcamRef.current.video.readyState === 4) {
//       const video = webcamRef.current.video;
//       const canvas = canvasRef.current;

//       // Check if video dimensions are valid
//       if (video.videoWidth === 0 || video.videoHeight === 0) {
//         console.warn("Video dimensions are invalid.");
//         return;
//       }

//       // Ensure canvas size matches video size
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       const displaySize = {
//         width: video.videoWidth,
//         height: video.videoHeight,
//       };

//       faceapi.matchDimensions(canvas, displaySize);

//       const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
//       const resizedDetections = faceapi.resizeResults(detections, displaySize);

//       const context = canvas.getContext("2d");
//       context.clearRect(0, 0, canvas.width, canvas.height);
//       faceapi.draw.drawDetections(canvas, resizedDetections);

//       if (detections.length === 0) {
//         setStatusMessage("No Face Detected");
//         toast("No Face Detected");
//       } else if (detections.length > 1) {
//         setStatusMessage("Multiple Faces Detected");
//         toast("Multiple Faces Detected");
//       } else {
//         setStatusMessage(""); // Clear status message for single face
//       }
//     }
//   };

//   useEffect(() => {
//     const interval = setInterval(detectFaces, 1000); // Run detection every second
//     return () => clearInterval(interval);
//   }, [isModelLoaded]);

//   const saveuseranswer = async () => {
//     if (isRecording) {
//       setloading(true);
//       stopSpeechToText();
//       if (useranswer.length <= 0) {
//         setloading(false);
//         toast("Error while recording the answer, please try again");
//         return;
//       }
//       const feedbackprompt =
//         "question " +
//         questions[activeqindex] +
//         ", user answer " +
//         useranswer +
//         " based an the useranswer for the question give a rating and a feedback for the answer in just 3 to 5 lines in json format with rating field and the rating should be out of 5 and feedback field. Do not give any other data, just give the rating and feedback because I want to parse it into json format so I don't need any extra data. So please only give the json and again I say I only need the json, no extra data.";

//       let result = await getGroqChatCompletion(feedbackprompt);
//       result = result.choices[0].message.content;
//       let jsonresponse = JSON.parse(result);
//       console.log(jsonresponse);

//       try {
//         const response = await fetch(
//           "http://127.0.0.1:8000/api/storefeedback/",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/x-www-form-urlencoded",
//             },
//             body: new URLSearchParams({
//               viva_id: id,
//               question: questions[activeqindex],
//               answer: answers[activeqindex],
//               useranswer,
//               feedback: jsonresponse?.feedback,
//               rating: jsonresponse?.rating,
//               useremail: user?.primaryEmailAddress.emailAddress,
//             }),
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }

//         let res = await response.json();
//         console.log(res);
//       } catch (error) {
//         console.error("Error submitting data:", error);
//         toast.error(
//           "An error occurred while saving feedback. Please try again later."
//         );
//       }
//       setuseranswer("");
//       setResults([]);
//       setloading(false);
//     } else {
//       startSpeechToText();
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <div className="relative flex flex-col justify-center items-center rounded-lg p-5 mt-20">
//         <img src="/webcam.jpg" width={275} height={275} className="absolute" />
//         <Webcam
//           mirrored={true}
//           ref={webcamRef}
//           style={{ height: 500, width: "100%", zIndex: 10 }}
//         />
//         <canvas
//           ref={canvasRef}
//           style={{ position: 'absolute', top: 0, left: 0, height: 500, width: '100%', zIndex: 20, border: '2px solid red' }}
//         />
//         {statusMessage && (
//           <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', backgroundColor: 'red', color: 'white', textAlign: 'center', padding: '5px' }}>
//             {statusMessage}
//           </div>
//         )}
//       </div>
//       <Button onClick={saveuseranswer} variant="secondary" className="my-10">
//         {isRecording ? (
//           <h1 className="text-red-600 flex gap-2">
//             <Mic />
//             Stop Recording...
//           </h1>
//         ) : (
//           "Record answer"
//         )}
//       </Button>
//     </div>
//   );
// }

// export default Recordanswersection;

// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import * as faceapi from "face-api.js";
// import { Button } from "./ui/button";
// import useSpeechToText from "react-hook-speech-to-text";
// import { Mic } from "lucide-react";
// import { getGroqChatCompletion } from "../../groqapi";
// import { useUser } from "@clerk/clerk-react";
// import { useNavigate } from "react-router-dom";

// function Recordanswersection({ questions, answers, activeqindex, id }) {
//   const [useranswer, setuseranswer] = useState("");
//   const [loading, setloading] = useState(false);
//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [statusMessage, setStatusMessage] = useState("");
//   const [multipleFacesCount, setMultipleFacesCount] = useState(0);
//   const { user } = useUser();
//   const navigate = useNavigate();

//   const {
//     error,
//     interimResult,
//     isRecording,
//     setResults,
//     results,
//     startSpeechToText,
//     stopSpeechToText,
//   } = useSpeechToText({
//     continuous: true,
//     useLegacyResults: false,
//   });

//   useEffect(() => {
//     results.map((result) =>
//       setuseranswer((prevans) => prevans + result?.transcript)
//     );
//   }, [results]);

//   useEffect(() => {
//     const loadModels = async () => {
//       const MODEL_URL = "/models"; // Change to the path where you've placed your models
//       await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//       setIsModelLoaded(true);
//     };

//     loadModels();
//   }, []);

//   useEffect(() => {
//     const video = webcamRef.current?.video;

//     if (video) {
//       video.addEventListener('loadeddata', () => {
//         detectFaces();
//       });
//     }

//     return () => {
//       if (video) {
//         video.removeEventListener('loadeddata', detectFaces);
//       }
//     };
//   }, [webcamRef.current, isModelLoaded]);

//   const detectFaces = async () => {
//     if (isModelLoaded && webcamRef.current && webcamRef.current.video.readyState === 4) {
//       const video = webcamRef.current.video;
//       const canvas = canvasRef.current;

//       if (video.videoWidth === 0 || video.videoHeight === 0) {
//         console.warn("Video dimensions are invalid.");
//         return;
//       }

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       const displaySize = {
//         width: video.videoWidth,
//         height: video.videoHeight,
//       };

//       faceapi.matchDimensions(canvas, displaySize);

//       const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
//       const resizedDetections = faceapi.resizeResults(detections, displaySize);

//       const context = canvas.getContext("2d");
//       context.clearRect(0, 0, canvas.width, canvas.height);
//       faceapi.draw.drawDetections(canvas, resizedDetections);

//       if (detections.length === 0) {
//         setStatusMessage("No face detected.");
//       } else if (detections.length > 1) {
//         setStatusMessage("Multiple faces detected.");
//         setMultipleFacesCount(prevCount => {
//           const newCount = prevCount + 1;
//           if (newCount > 5) {
//             const blockEndTime = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds
//             localStorage.setItem('blockEndTime', blockEndTime);
//             navigate('/terminated');
//           }
//           return newCount;
//         });
//       } else {
//         setStatusMessage("");
//       }
//     }
//   };

//   useEffect(() => {
//     const interval = setInterval(detectFaces, 1000); // Run detection every second
//     return () => clearInterval(interval);
//   }, [isModelLoaded]);

//   const saveuseranswer = async () => {
//     if (isRecording) {
//       setloading(true);
//       stopSpeechToText();
//       if (useranswer.length <= 0) {
//         setloading(false);
//         alert("Error while recording the answer, please try again");
//         return;
//       }
//       const feedbackprompt =
//         "question " +
//         questions[activeqindex] +
//         ", user answer " +
//         useranswer +
//         " based an the useranswer for the question give a rating and a feedback for the answer in just 3 to 5 lines in json format with rating field and the rating should be out of 5 and feedback field. Do not give any other data, just give the rating and feedback because I want to parse it into json format so I don't need any extra data. So please only give the json and again I say I only need the json, no extra data.";

//       let result = await getGroqChatCompletion(feedbackprompt);
//       result = result.choices[0].message.content;
//       let jsonresponse = JSON.parse(result);
//       console.log(jsonresponse);

//       try {
//         const response = await fetch(
//           "http://127.0.0.1:8000/api/storefeedback/",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/x-www-form-urlencoded",
//             },
//             body: new URLSearchParams({
//               viva_id: id,
//               question: questions[activeqindex],
//               answer: answers[activeqindex],
//               useranswer,
//               feedback: jsonresponse?.feedback,
//               rating: jsonresponse?.rating,
//               useremail: user?.primaryEmailAddress.emailAddress,
//             }),
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }

//         let res = await response.json();
//         console.log(res);
//       } catch (error) {
//         console.error("Error submitting data:", error);
//         alert("An error occurred while saving feedback. Please try again later.");
//       }
//       setuseranswer("");
//       setResults([]);
//       setloading(false);
//     } else {
//       startSpeechToText();
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <div className="relative flex flex-col justify-center items-center rounded-lg p-5 mt-20">
//         <Webcam
//           mirrored={true}
//           ref={webcamRef}
//           style={{ height: 500, width: "100%", zIndex: 10 }}
//         />
//         <canvas
//           ref={canvasRef}
//           style={{ position: 'absolute', top: 0, left: 0, height: 500, width: '100%', zIndex: 20 }}
//         />
//       </div>
//       {statusMessage && (
//         <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: 'red', color: 'white', textAlign: 'center', padding: '10px', zIndex: 30 }}>
//           {statusMessage}
//         </div>
//       )}
//       <Button onClick={saveuseranswer} variant="secondary" className="my-10">
//         {isRecording ? (
//           <h1 className="text-red-600 flex gap-2">
//             <Mic />
//             Stop Recording...
//           </h1>
//         ) : (
//           "Record answer"
//         )}
//       </Button>
//     </div>
//   );
// }

// export default Recordanswersection;

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { Button } from "./ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { getGroqChatCompletion } from "../../groqapi";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function Recordanswersection({ questions, answers, activeqindex, id }) {
  const [useranswer, setuseranswer] = useState("");
  const [loading, setloading] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [multipleFacesCount, setMultipleFacesCount] = useState(0);
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
      const MODEL_URL = "/models"; // Change to the path where you've placed your models
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      setIsModelLoaded(true);
    };

    loadModels();
  }, []);

  useEffect(() => {
    const video = webcamRef.current?.video;

    if (video) {
      video.addEventListener('loadeddata', () => {
        detectFaces();
      });
    }

    return () => {
      if (video) {
        video.removeEventListener('loadeddata', detectFaces);
      }
    };
  }, [webcamRef.current, isModelLoaded]);

  const detectFaces = async () => {
    if (isModelLoaded && webcamRef.current && webcamRef.current.video.readyState === 4) {
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

      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);

      if (detections.length === 0) {
        setStatusMessage("No face detected.");
      } else if (detections.length > 1) {
        setStatusMessage("Multiple faces detected.");
        setMultipleFacesCount(prevCount => {
          const newCount = prevCount + 1;
          if (newCount > 5) {
            const blockEndTime = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds
            localStorage.setItem('blockEndTime', blockEndTime);
            navigate('/terminated');
          }
          return newCount;
        });
      } else {
        setStatusMessage("");
      }
    }
  };

  useEffect(() => {
    const blockEndTime = localStorage.getItem('blockEndTime');
    if (blockEndTime && Date.now() < blockEndTime) {
      navigate('/terminated');
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(detectFaces, 1000); // Run detection every second
    return () => clearInterval(interval);
  }, [isModelLoaded]);

  const saveuseranswer = async () => {
    if (isRecording) {
      setloading(true);
      stopSpeechToText();
      if (useranswer.length <= 0) {
        setloading(false);
        alert("Error while recording the answer, please try again");
        return;
      }
      const feedbackprompt =
        "question " +
        questions[activeqindex] +
        ", user answer " +
        useranswer +
        " based an the useranswer for the question give a rating and a feedback for the answer in just 3 to 5 lines in json format with rating field and the rating should be out of 5 and feedback field. Do not give any other data, just give the rating and feedback because I want to parse it into json format so I don't need any extra data. So please only give the json and again I say I only need the json, no extra data.";

      let result = await getGroqChatCompletion(feedbackprompt);
      result = result.choices[0].message.content;
      let jsonresponse = JSON.parse(result);
      console.log(jsonresponse);

      try {
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
              feedback: jsonresponse?.feedback,
              rating: jsonresponse?.rating,
              useremail: user?.primaryEmailAddress.emailAddress,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        let res = await response.json();
        console.log(res);
      } catch (error) {
        console.error("Error submitting data:", error);
        alert("An error occurred while saving feedback. Please try again later.");
      }
      setuseranswer("");
      setResults([]);
      setloading(false);
    } else {
      startSpeechToText();
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
          style={{ position: 'absolute', top: 0, left: 0, height: 500, width: '100%', zIndex: 20 }}
        />
      </div>
      {statusMessage && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: 'red', color: 'white', textAlign: 'center', padding: '10px', zIndex: 30 }}>
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





