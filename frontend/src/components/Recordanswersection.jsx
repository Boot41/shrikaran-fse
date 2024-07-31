import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "./ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";

function Recordanswersection() {
  const [useranswer,setuseranswer] = useState("");
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(()=>{
    results.map((result)=>setuseranswer(prevans=>prevans+result?.transcript))
  },[results])

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col justify-center items-center rounded-lg p-5 mt-20">
        <img src="/webcam.jpg" width={275} height={275} className="absolute" />
        <Webcam
          mirrored={true}
          style={{ height: 500, width: "100%", zIndex: 10 }}
        />
      </div>
      <Button onClick={isRecording? stopSpeechToText : startSpeechToText} variant="secondary" className="my-10">
        {isRecording ? <h1><Mic/> Recording...</h1> : "Record answer"}
      </Button>
    </div>
  );
}

export default Recordanswersection;
