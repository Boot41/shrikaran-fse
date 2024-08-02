import React, { useState, useEffect, useTransition } from "react";
import { useParams } from "react-router-dom";
import Questions from "./Questions";
import Recordanswersection from "./Recordanswersection";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

function Startinterview() {
  const { id } = useParams();
  const [questions, setquestions] = useState([]);
  const [answers,setanswers] = useState([]);
  const [activeqindex,setactiveqindex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/getdata/${id}/`
        );
        let data = await response.json(); // Assuming the response is a string
        data = data.jsonvivaresponse
        console.log(data)
        // Parse the string into a JSON object
        try {
          data = JSON.parse(data);
          setquestions(data.map(item => item.question));
          setanswers(data.map(item => item.answer))
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* questions */}
            <Questions questions={questions} activeqindex={activeqindex}/>
            {/* video/audio recording */}
            <Recordanswersection questions={questions} answers={answers} activeqindex={activeqindex} id={id} />
        </div>
        <div className="flex justify-end gap-6">
          {activeqindex>0 && <Button
          onClick={()=>setactiveqindex(activeqindex-1)} className="bg-blue-400">Previous question</Button>}
          {activeqindex!=questions.length-1&&<Button
          onClick={()=>setactiveqindex(activeqindex+1)} className="bg-blue-400">next question</Button>}
          <Link to={"/interview/"+id+"/feedback"}>
            {activeqindex==questions.length-1&&<Button
            className="bg-blue-400">End Interview</Button>}
          </Link>
        </div>
    </div>
  );
}

export default Startinterview;
