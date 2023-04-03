import { useState, useEffect, useRef } from "react";
import words from "./Words";
import "./App.css";

const colors = ["green", "orange", "red"];

const App = () => {
  const [selected, setSelected] = useState("");
  const [typed, setTyped] = useState("");
  const [rounds, setRounds] = useState([]);
  const [roundsColor, setRoundsColor] = useState([]);
  const [remain, setRemain] = useState(words);

  const correctLetters = useRef([]);
  const shouldIncludeLetters = useRef([]);

  useEffect(() => {
    setSelected(words[Math.floor(Math.random() * words.length)].toLowerCase());
  }, []);

  const handleInput = (e) => {
    setTyped(e.target.value);
  };

  const handleSubmit = () => {
    setRounds((prev) => [...prev, typed]);
    const lettersColor = checkWord(typed, "User");
    setRoundsColor((prev) => [...prev, lettersColor]);
    setTyped("");

    const filteredRemain = remain.filter((el) => {
      const lWord = el.toLowerCase();
      for (let i = 0; i < shouldIncludeLetters.current.length; i++) {
        if (!lWord.includes(shouldIncludeLetters.current[i])) {
          return false;
        }
      }

      for (let i = 0; i < correctLetters.current.length; i++) {
        const element = correctLetters.current[i];
        if (lWord[element.position] !== element.letter) {
          return false;
        }
      }

      return true;
    });

    setRounds((prev) => [...prev, filteredRemain[0]]);
    setRoundsColor((prev) => [...prev, checkWord(filteredRemain[0], "Bot")]);
    setRemain(filteredRemain);
  };

  const checkWord = (word, type) => {
    const lettersColor = [];
    word.split("").map((letter, index) => {
      const lLetter = letter.toLowerCase();
      let color = 2;
      if (selected.includes(lLetter)) {
        if (selected.indexOf(lLetter) === index) {
          color = 0;
          correctLetters.current = [
            ...correctLetters.current,
            { letter: lLetter, position: index },
          ];
          const letterIndex = shouldIncludeLetters.current.indexOf(lLetter);
          if (letterIndex > -1) {
            shouldIncludeLetters.current.splice(letterIndex, 1);
          }
        } else {
          color = 1;
          if (!shouldIncludeLetters.current.includes(lLetter)) {
            shouldIncludeLetters.current = [
              ...shouldIncludeLetters.current,
              lLetter,
            ];
          }
        }
      }
      lettersColor.push(color);
    });

    if (word.toLowerCase() === selected) {
      alert(`${type} Won !!!`);
    }

    return lettersColor;
  };

  return (
    <div className="app">
      <div className="text">
        <input
          className="form__input"
          variant="outlined"
          value={typed}
          onChange={handleInput}
          maxLength={5}
        />
        <button
          className="button"
          disabled={typed.length !== 5}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <p className="win">TRY TO WIN</p>
      {rounds.reverse().map((el, i) => (
        <p key={i}>
          {i % 3 ? "User" : "Bot"}:{" "}
          <span style={{ fontSize: "30px" }}>
            {el.split("").map((letter, index) => (
              <span
                style={{
                  color: colors[roundsColor[roundsColor.length - i - 1][index]],
                }}
              >
                {letter.toUpperCase()}
              </span>
            ))}
          </span>
        </p>
      ))}
    </div>
  );
}

export default App;
