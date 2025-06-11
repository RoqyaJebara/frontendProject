import React, { useEffect, useState } from "react";
import axios from "axios";

const QuizViewer = ({ lessonId }) => {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchQuizAndQuestions = async () => {
      try {
        const quizRes = await axios.get(`http://localhost:5000/quizzes/${lessonId}`);
        const quizData = quizRes.data;
        setQuiz(quizData);

        const questionsRes = await axios.get(`http://localhost:5000/questions/${quizData.id}`);
        const parsedQuestions = questionsRes.data.map((q) => ({
          ...q,
          options: q.options, // تأكد أن هذا مصفوفة بالفعل
        }));
        setQuestions(parsedQuestions);

        // تحميل البيانات من localStorage
        const saved = localStorage.getItem(`quiz_${quizData.id}`);
        if (saved) {
          const { savedAnswers, savedScore } = JSON.parse(saved);
          setSelectedAnswers(savedAnswers);
          setScore(savedScore);
          setSubmitted(true);
        }

      } catch (error) {
        console.error("Error loading quiz or questions:", error);
      }
    };

    if (lessonId) fetchQuizAndQuestions();
  }, [lessonId]);

  const handleAnswerChange = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmit = () => {
    if (!questions.length) return;

    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_answer) correct++;
    });

    const finalScore = `${correct} / ${questions.length}`;
    setScore(finalScore);
    setSubmitted(true);

    // حفظ الإجابات والنتيجة في localStorage
    localStorage.setItem(
      `quiz_${quiz.id}`,
      JSON.stringify({
        savedAnswers: selectedAnswers,
        savedScore: finalScore,
      })
    );
  };

  if (!quiz || !questions.length) return <div>Loading quiz...</div>;

  return (
    <div className="quiz-viewer mt-3">
      <h5>Quiz - Max Score: {quiz.max_score}</h5>

      {questions.map((q) => (
        <div key={q.id} className="mb-3">
          <strong>{q.question}</strong>
          <div>
            {q.options.map((option, idx) => (
              <div key={idx} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question-${q.id}`}
                  value={option}
                  checked={selectedAnswers[q.id] === option}
                  onChange={() => handleAnswerChange(q.id, option)}
                  disabled={submitted}
                />
                <label className="form-check-label">{option}</label>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button className="btn btn-outline-primary" onClick={handleSubmit}>
          Submit Quiz
        </button>
      ) : (
        <div className="alert alert-success mt-3">
          Your Score: <strong>{score}</strong>
        </div>
      )}
    </div>
  );
};

export default QuizViewer;
