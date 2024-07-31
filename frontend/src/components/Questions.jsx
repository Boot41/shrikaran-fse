import { Lightbulb } from 'lucide-react';
import React, { useState } from 'react'; // Import useState if used

function Questions({ questions, activeqindex }) {
  // ... (rest of your code)

  return questions&&(
    <div className='p-5 border rounded-lg my-10'>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {questions && questions.map((question, index) => (
          <h1
            key={index} // Add a unique key for each question
            className={`p-2 rounded-full bg-secondary text-xs md:text-sm text-center cursor-pointer ${
              activeqindex === index ? 'bg-blue-400 text-white' : ''
            }`}
          >
            Question #{index + 1}
          </h1>
        ))}
      </div>
        <h2 className='my-5 text-md md:text-lg'>{questions[activeqindex]}</h2>
        <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
            <h2 className='flex gap-5 text-blue-800'>
                <Lightbulb/>
                <strong>Note : </strong>
            </h2>
            <h2 className='text-sm my-2'>
                Click on Record Answer when you want to answer the question. at the end of interview we will give you the feedback along with correct answer for each of question and your answer to compare it
            </h2>
        </div>
    </div>
  );
}

export default Questions;
