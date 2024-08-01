import { AwardIcon, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "./ui/button";

function feedback() {
  const [feedback, setfeedback] = useState([]);
  const [overallrating,setoverallrating] = useState(0);
  const navigate = useNavigate();

  const { id } = useParams();
  const getfeedback = async () => {
    let response = await fetch(
      "http://127.0.0.1:8000/api/" + id + "/getfeedback"
    );
    response = await response.json();
    console.log(response);
    setfeedback(response);
  };

  useEffect(() => {
    getfeedback();

    const calculateOverallRating = () => {
      if (feedback.length > 0) {
        const totalRating = feedback.reduce((sum, item) => sum + item.rating, 0);
        setoverallrating((totalRating / feedback.length).toFixed(1));
      }
    };
    calculateOverallRating();
  })

  return (
    <div className="p-5">
      <h2 className="text-3xl font-bold text-green-500">Congratulation!</h2>
      <h2 className="text-2xl font-bold">Here is your viva feedback</h2>

      {
        feedback?.length===0 ? <h1 className="font-bold text-xl text-gray-500 mt-5 mb-3">No feedback record found</h1> :
        <>
            <h2 className="text-primary text-lg my-3">You'r overall viva Rating is : {overallrating}</h2>

            <h2 className="text-sm text-gray-500">
              Find below viva question with correct answer,your answer and feedback
              for improvement
            </h2>
            {feedback &&
              feedback.map((item, index) => (
                <Collapsible key={index} className="mt-7">
                  <CollapsibleTrigger className="flex justify-between gap-7 w-full p-2 bg-secondary rounded-lg my-2 text-left">
                    {item.question}
                    <ChevronsUpDown/>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="flex flex-col gap-2"> 
                      <h1 className="text-red-500 border p-2 rounded-lg"><strong>Rating : {item.rating}</strong></h1>
                      <h1 className="bg-red-50 p-2 border rounded-lg text-sm"><strong>You'r answer : </strong>{item.useranswer}</h1>
                      <h1 className="bg-green-50 p-2 border rounded-lg text-sm"><strong>Correct answer : </strong>{item.answer}</h1>
                      <h1 className="bg-blue-50 p-2 border rounded-lg text-sm"><strong>Feedback : </strong>{item.feedback}</h1>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
              <Button onClick={()=>navigate("/")}>Go to Home</Button>
        </>
      }

    </div>
  );
}

export default feedback;
