import React, { useState, useEffect, useTransition } from "react";
import { useParams } from "react-router-dom";
import Questions from "./Questions";
import Recordanswersection from "./Recordanswersection";

function Startinterview() {
  const { id } = useParams();
  const [questions, setquestions] = useState([]);
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
            <Recordanswersection/>
        </div>
    </div>
  );
}

export default Startinterview;
