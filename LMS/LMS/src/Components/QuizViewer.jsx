import React, { useEffect, useState } from "react";
import axios from "axios";

const QuizViewer = ({ lessonId, userId, courseId }) => {
  console.log("lessonId:", lessonId, "courseId:", courseId, "userId:", userId);

  const [quiz, setQuiz] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizAndQuestions = async () => {
      try {
        setLoading(true);

        // جلب بيانات الكويز (مثل العنوان، الدرجة القصوى)
        const quizRes = await axios.get(
          `http://localhost:5000/quizzes/${lessonId}`
        );
        const quizData = quizRes.data;
        setQuiz(quizData);

        // جلب الأسئلة والquizId باستخدام lessonId
        const questionsRes = await axios.get(
          `http://localhost:5000/questions/${lessonId}`
        );
        const { quizId: fetchedQuizId, questions } = questionsRes.data;
        setQuizId(fetchedQuizId);
        setQuestions(questions);

        // التحقق من محاولة سابقة
        const saved = localStorage.getItem(`quiz_${fetchedQuizId}_${userId}`);
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
      let correctPoints = 0;
      let totalPoints = 0;

      questions.forEach((q) => {
        const points = q.points || 1; // إذا لا يوجد نقاط محددة لكل سؤال نفترض 1
        totalPoints += points;
        if (selectedAnswers[q.id] === q.correct_answer) {
          correctPoints += points;
        }
      });

      // حساب الدرجة من 5
      const scoreOutOfFive =
        totalPoints > 0 ? (correctPoints / totalPoints) * 5 : 0;

      // حفظ النتيجة في الباكند
      await axios.post("http://localhost:5000/quizzes/quiz-grades", {
        lessonId,
        quizId,
        userId,
        answers: selectedAnswers,
        grade: scoreOutOfFive,
      });

      // حفظ محلي (اختياري)
      localStorage.setItem(
        `quiz_${quizId}_${userId}`,
        JSON.stringify({
          savedAnswers: selectedAnswers,
          savedScore: scoreOutOfFive,
        })
      );

      setScore(scoreOutOfFive);
      setSubmitted(true);
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
          Your Score: <strong>{score.toFixed(2)} / 5</strong>
          <br />
          <small className="text-muted">
            You have already attempted this quiz.
          </small>
        </div>
      )}
    </div>
  );
};

export default QuizViewer;
