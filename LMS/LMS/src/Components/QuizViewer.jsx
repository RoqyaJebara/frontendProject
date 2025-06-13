import React, { useEffect, useState } from "react";
import axios from "axios";

const QuizViewer = ({ lessonId, userId, onQuizSubmitted }) => {
  const [quiz, setQuiz] = useState(null);
  const [quizId, setQuizId] = useState(null);  // حفظ quizId صراحة
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizAndQuestions = async () => {
      try {
        setLoading(true);
        const quizRes = await axios.get(`http://localhost:5000/quizzes/${lessonId}`);
        const quizData = quizRes.data;
        setQuiz(quizData);
        setQuizId(quizData.id);  // هنا

        const questionsRes = await axios.get(`http://localhost:5000/questions/${quizData.id}`);
        setQuestions(questionsRes.data);

        // تحقق من محاولة سابقة باستخدام quizId
        const saved = localStorage.getItem(`quiz_${quizData.id}_${userId}`);
        if (saved) {
          const { savedAnswers, savedScore } = JSON.parse(saved);
          setSelectedAnswers(savedAnswers);
          setScore(savedScore);
          setSubmitted(true);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading quiz or questions:", error);
        setLoading(false);
      }
    };

    if (lessonId) fetchQuizAndQuestions();
  }, [lessonId, userId]);

  const handleAnswerChange = (questionId, selectedOption) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmit = async () => {
    if (submitted) return;

    try {
      // حساب النتيجة
      let calculatedScore = 0;
      questions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correct_answer) {
          calculatedScore += q.points || 1;
        }
      });

      // إرسال البيانات مع quizId
      await axios.post("http://localhost:5000/quizzes/quiz-grades", {
        lessonId,
        quizId,
        userId,
        answers: selectedAnswers,
        grade: calculatedScore,
      });

      // حفظ في localStorage باستخدام quizId
      localStorage.setItem(
        `quiz_${quizId}_${userId}`,
        JSON.stringify({ savedAnswers: selectedAnswers, savedScore: calculatedScore })
      );

      setScore(calculatedScore);
      setSubmitted(true);

      if (onQuizSubmitted) onQuizSubmitted();
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("حدث خطأ أثناء إرسال الإجابات، حاول مرة أخرى.");
    }
  };

  if (loading) return <div>Loading quiz...</div>;
  if (!quiz || !questions.length) return <div>No quiz available.</div>;

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
        <button
          className="btn btn-outline-primary"
          onClick={handleSubmit}
          disabled={Object.keys(selectedAnswers).length !== questions.length}
        >
          Submit Quiz
        </button>
      ) : (
        <div className="alert alert-success mt-3">
          Your Score: <strong>{score}</strong>
          <br />
          <small className="text-muted">You have already attempted this quiz.</small>
        </div>
      )}
    </div>
  );
};

export default QuizViewer;
