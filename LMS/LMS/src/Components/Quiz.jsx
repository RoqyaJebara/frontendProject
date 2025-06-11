import React, { useState } from "react";

export const  Quiz=()=> {
  const questions = [
    {
      question: "Which language is primarily used for frontend development?",
      options: ["Python", "JavaScript", "SQL", "Java"],
      answer: "JavaScript",
    },
    {
      question: "Which of these is a backend framework?",
      options: ["React", "Angular", "Node.js", "Vue"],
      answer: "Node.js",
    },
    {
      question: "What does CSS stand for?",
      options: [
        "Cascading Style Sheets",
        "Computer Style Sheets",
        "Creative Style System",
        "Colorful Style Sheets",
      ],
      answer: "Cascading Style Sheets",
    },
    {
      question: "Which database is commonly used in backend?",
      options: ["MongoDB", "Photoshop", "Figma", "Bootstrap"],
      answer: "MongoDB",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (option) => {
    if (option === questions[current].answer) {
      setScore(score + 1);
    }
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
    } else {
      setShowResult(true);
    }
  };

  return (
    <section className="mb-4">
      <h4>📝 Quiz: Frontend & Backend Basics</h4>
      {!showResult ? (
        <>
          <p>{questions[current].question}</p>
          <div>
            {questions[current].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="btn btn-outline-primary btn-sm m-1"
              >
                {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div>
          <p>
            Quiz completed! Your score: {score} / {questions.length}
          </p>
          
        </div>
      )}
    </section>
  );
}
