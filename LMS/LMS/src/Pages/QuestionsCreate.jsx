import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CreateQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  // قائمة الأسئلة (كل عنصر سؤال يحتوي question, options, correct_answer)
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correct_answer: "" },
  ]);

  // تغيير نص السؤال في سؤال معين
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  // تغيير خيار معين في سؤال معين
  const handleOptionChange = (qIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  // تغيير الإجابة الصحيحة في سؤال معين
  const handleCorrectAnswerChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correct_answer = value;
    setQuestions(updatedQuestions);
  };

  // إضافة سؤال جديد فارغ
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correct_answer: "" },
    ]);
  };

  // حذف سؤال معين
  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // حفظ كل الأسئلة دفعة واحدة
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // إرسال كل سؤال منفصل أو كل الأسئلة دفعة حسب API
      // هنا نفترض إرسال كل سؤال على حدة (يمكن تعديل حسب API)
      for (const q of questions) {
        await axios.post("http://localhost:5000/questions/", {
          quizId: Number(quizId),
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
        });
      }
      alert("All questions created successfully!");
      navigate(-2);
    } catch (error) {
      console.error("Error creating questions:", error);
      alert("Failed to create questions. Please check your data or server.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Questions for Quiz #{quizId}</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        {questions.map((q, index) => (
          <div key={index} className="mb-5 border rounded p-3">
            <h5>Question {index + 1}</h5>
            <div className="mb-3">
              <label className="form-label">Question Text</label>
              <textarea
                className="form-control"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Options</label>
              {q.options.map((option, i) => (
                <input
                  key={i}
                  type="text"
                  className="form-control mb-2"
                  placeholder={`Option ${i + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(index, i, e.target.value)
                  }
                  required
                />
              ))}
            </div>

            <div className="mb-3">
              <label className="form-label">Correct Answer</label>
              <select
                className="form-select"
                value={q.correct_answer}
                onChange={(e) =>
                  handleCorrectAnswerChange(index, e.target.value)
                }
                required
              >
                <option value="">-- Select Correct Answer --</option>
                {q.options.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt || `Option ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>

            {questions.length > 1 && (
              <button
                type="button"
                className="btn btn-danger mb-3"
                onClick={() => removeQuestion(index)}
              >
                Remove Question
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={addQuestion}
        >
          + Add Another Question
        </button>

        <br />

        <button type="submit" className="btn btn-success">
          Save All Questions
        </button>
      </form>
    </div>
  );
};

export default CreateQuestions;
