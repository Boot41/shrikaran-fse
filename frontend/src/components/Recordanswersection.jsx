import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "./ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { toast } from "sonner";

import { getGroqChatCompletion } from "../../groqapi";
import { useUser } from "@clerk/clerk-react";

function Recordanswersection({ questions, answers, activeqindex, id }) {
  const [useranswer, setuseranswer] = useState("");
  const {user} = useUser();
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

  useEffect(() => {
    results.map((result) =>
      setuseranswer((prevans) => prevans + result?.transcript)
    );
  }, [results]);

  const saveuseranswer = async () => {
    if (isRecording) {
      stopSpeechToText();
      if (useranswer <= 0) {
        toast("error while recording the answer pls try again");
        return;
      }
      const feedbackprompt =
        " question " +
        questions[activeqindex] +
        ", user answer " +
        useranswer +
        " based an the useranswer for the question give a rating and a feed back for the answer in just 3 to 5 lines in json format with rating field and feed back field do give any other data just give the rating and feed back beasue i want to parse it into json format so i dot need any extra data so pls only give the json";

      let result = await getGroqChatCompletion(feedbackprompt);
      result = result.choices[0].message.content;
      let jsonresponse = JSON.parse(result);
      console.log(result);

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/storefeedback/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              viva_id : id,
              question: questions[activeqindex],
              answer : answers[activeqindex],
              useranswer,
              feeback : jsonresponse?.feeback,
              rating : jsonresponse?.rating,
              useremail: user?.primaryEmailAddress.emailAddress,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        let res = await response.json();
        console.log(res.answer)
      } 
      catch (error) {
        console.error("Error submitting data:", error);
        // Handle error, e.g., show error message to the user
      }
    } else {
      startSpeechToText();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col justify-center items-center rounded-lg p-5 mt-20">
        <img src="/webcam.jpg" width={275} height={275} className="absolute" />
        <Webcam
          mirrored={true}
          style={{ height: 500, width: "100%", zIndex: 10 }}
        />
      </div>
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
      <Button onClick={() => console.log(useranswer)}>show answer</Button>
    </div>
  );
}

export default Recordanswersection;
