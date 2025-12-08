import { useState } from "react";

const VoiceInput = ({ onVoiceCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const startListening = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();

    recognition.lang = "en-US";
    recognition.start();

    setIsListening(true);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      onVoiceCommand(spokenText);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <div className="voice-section">
      <button onClick={startListening} className="action_button">
        🎙️ {isListening ? "Listening..." : "Speak to Create Invoice"}
      </button>
      {transcript && <p className="spoken-text">You said: {transcript}</p>}
    </div>
  );
};

export default VoiceInput;
