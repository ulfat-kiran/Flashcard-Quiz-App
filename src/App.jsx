import { useEffect, useState } from "react";
import "./App.css";

const defaultCards = [
  { question: "What is HTML?", answer: "HTML stands for HyperText Markup Language." },
  { question: "What is CSS?", answer: "CSS stands for Cascading Style Sheets." },
  { question: "What is JavaScript?", answer: "JavaScript is a programming language used to make web pages interactive." },
  { question: "What is React?", answer: "React is a JavaScript library for building user interfaces." },
];

function App() {
  const [flashcards, setFlashcards] = useState(() => {
    const savedCards = localStorage.getItem("flashcards");
    return savedCards? JSON.parse(savedCards) : defaultCards;
  });

  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    }
  };

  const previousCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowAnswer(false);
    }
  };

  const addCard = () => {
    if (!question.trim() ||!answer.trim()) {
      alert("Please enter both question and answer.");
      return;
    }
    const newCard = { question: question.trim(), answer: answer.trim() };

    if (isEditing) {
      const updated = [...flashcards];
      updated[currentCard] = newCard;
      setFlashcards(updated);
      setIsEditing(false);
    } else {
      setFlashcards([...flashcards, newCard]);
      setCurrentCard(flashcards.length);
    }
    setQuestion(""); setAnswer(""); setShowForm(false); setShowAnswer(false);
  };

  const deleteCard = () => {
    if (flashcards.length === 1) {
      alert("You must keep at least one flashcard."); return;
    }
    const updatedCards = flashcards.filter((_, index) => index!== currentCard);
    setFlashcards(updatedCards);
    if (currentCard >= updatedCards.length) setCurrentCard(updatedCards.length - 1);
    setShowAnswer(false);
  };

  const resetCards = () => {
    if(confirm("Are you sure? ")){
      localStorage.removeItem("flashcards");
      setFlashcards(defaultCards);
      setCurrentCard(0);
      setShowAnswer(false);
    }
  };

  const handleEdit = () => {
    setQuestion(flashcards[currentCard].question);
    setAnswer(flashcards[currentCard].answer);
    setIsEditing(true);
    setShowForm(true);
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>Flashcard Quiz App</h1>
          <p>Learn faster with flashcards</p>
        </div>

        <div className="flashcard">
          <div className="card-top"><span>Card {currentCard + 1} of {flashcards.length}</span></div>
          <div className="card-content">
            <h2>{flashcards[currentCard].question}</h2>
            {!showAnswer? (
              <p className="hidden-answer">Answer is hidden</p>
            ) : (
              <div className="answer-box"><strong>Answer:</strong><p>{flashcards[currentCard].answer}</p></div>
            )}
          </div>

          <button className="show-answer-btn" onClick={() => setShowAnswer(!showAnswer)}>
            {showAnswer? "Hide Answer" : "Show Answer"}
          </button>

          <div className="navigation">
            <button onClick={previousCard} disabled={currentCard === 0}>Previous</button>
            <button onClick={nextCard} disabled={currentCard === flashcards.length - 1}>Next</button>
          </div>

          <div className="card-actions">
            <button className="edit-btn" onClick={handleEdit}>Edit</button>
            <button className="delete-btn" onClick={deleteCard}>Delete</button>
          </div>
        </div>

        <div className="main-actions">
          <button className="add-btn" onClick={() => { setShowForm(!showForm); setIsEditing(false); setQuestion(""); setAnswer(""); }}>
            {showForm? "Close Form" : "Add New Card"}
          </button>
          <button className="reset-btn" onClick={resetCards}>Reset Default Cards</button>
        </div>

        {showForm && (
          <div className="form-box">
            <h2>{isEditing? "Edit Flashcard" : "Add New Flashcard"}</h2>
            <label>Question</label>
            <input type="text" placeholder="Enter question" value={question} onChange={(e) => setQuestion(e.target.value)} />
            <label>Answer</label>
            <textarea placeholder="Enter answer" value={answer} onChange={(e) => setAnswer(e.target.value)} rows="3"></textarea>
            <div className="form-actions">
              <button className="save-btn" onClick={addCard}>{isEditing? "Update" : "Save"}</button>
              <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
        <p className="saved-message">Cards are saved in your browser automatically.</p>
      </div>
    </div>
  );
}
export default App;