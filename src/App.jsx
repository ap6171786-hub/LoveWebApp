import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Heart,
  Mail,
  Menu,
  X,
  Gift,
  ArrowRight,
  Camera,
  Check,
} from "lucide-react";
import AudioPlayer from "./components/AudioPlayer";
import Section from "./components/Section";
import { loveConfig } from "./data/loveConfig";
import "./App.css";

function getTogetherDuration() {
  const start = new Date(`${loveConfig.relationshipDate}T00:00:00`);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

function burst() {
  const colors = ["#ff4d79", "#f9a8d4", "#ef4444", "#fff1f2"];
  confetti({ particleCount: 140, spread: 85, origin: { y: 0.65 }, colors });
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors,
  });
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors,
  });
}

function FloatingDecor() {
  return (
    <div className="floating-decor" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          style={{
            "--i": i,
            "--left": `${(i * 29 + 7) % 96}%`,
            "--delay": `${(i % 6) * -0.8}s`,
          }}
        >
          {i % 3 === 0 ? "♥" : i % 3 === 1 ? "✦" : "🍓"}
        </span>
      ))}
    </div>
  );
}

function LoveQuestion() {
  const [stationary, setStationary] = useState(false);
  const [result, setResult] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => setStationary(true), 10000);
    return () => clearTimeout(timer);
  }, []);
  const moveNo = () => {
    if (stationary || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: Math.round(
        (Math.random() * 2 - 1) * Math.max(70, rect.width / 2 - 70),
      ),
      y: Math.round(
        (Math.random() * 2 - 1) * Math.min(105, rect.height / 2 - 35),
      ),
    });
  };
  const sayYes = () => {
    setConfirm(false);
    setResult("yes");
    burst();
  };
  return (
    <div className="love-card" ref={cardRef}>
      <span className="tiny-label">A tiny question from my heart</span>
      <h3>Akanksha, Do You Love Me? 🥺❤️</h3>
      {!result ? (
        !confirm ? (
          <div className="love-actions">
            <motion.button
              className="yes-button"
              whileTap={{ scale: 0.94 }}
              onClick={sayYes}
            >
              YES 💖
            </motion.button>
            <motion.button
              className="no-button"
              animate={{ x: position.x, y: position.y }}
              transition={{ type: "spring", stiffness: 170, damping: 15 }}
              onMouseEnter={moveNo}
              onPointerDown={(e) => {
                if (!stationary) {
                  e.preventDefault();
                  moveNo();
                }
              }}
              onClick={() => stationary && setConfirm(true)}
            >
              NO 🙈
            </motion.button>
          </div>
        ) : (
          <motion.div
            className="confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p>Are you really sure, Strawberry? 🥺💔</p>
            <strong>Think again, Baby! ❤️</strong>
            <div className="love-actions">
              <button className="yes-button" onClick={sayYes}>
                YES 💖
              </button>
              <button
                className="no-button"
                onClick={() => setResult("noAgain")}
              >
                NO AGAIN 🙈
              </button>
            </div>
          </motion.div>
        )
      ) : result === "yes" ? (
        <motion.div
          className="love-result"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p>
            I KNEW IT! 😍❤️
            <br />I LOVE YOU MORE THAN WORDS CAN EVER EXPRESS, MY STRAWBERRY!
          </p>
          <button
            className="primary-button"
            onClick={() =>
              document
                .querySelector("#story")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            One More Surprise 💝
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="love-result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>
            Hehe... My strawberry could never say no! 🍓😂
            <br />
            But you are allowed to change your mind.
          </p>
          <button
            className="primary-button"
            onClick={() => {
              setResult(null);
              setConfirm(false);
              sayYes();
            }}
          >
            Come Back to YES 💖
          </button>
        </motion.div>
      )}
    </div>
  );
}

function Timeline() {
  return (
    <div className="timeline">
      {loveConfig.timeline.map((item, i) => (
        <motion.article
          key={item.title}
          className={`timeline-item ${i % 2 ? "right" : "left"}`}
          initial={{ opacity: 0, x: i % 2 ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="timeline-dot">{item.icon}</div>
          <div className="timeline-card">
            <span>{item.date}</span>
            <h3>{item.title} ❤️</h3>
            <p>{item.text}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function Reasons() {
  const [expanded, setExpanded] = useState(false);
  const extra = [
    "The comfort of your presence.",
    "The warmth in every hug.",
    "How you make me feel understood.",
    "Your laughter, especially your real one.",
    "All the little promises we share.",
    "Every future dream we imagine together.",
  ];
  const reasons = expanded
    ? [...loveConfig.reasons, ...extra]
    : loveConfig.reasons;
  return (
    <>
      <div className="reasons-grid">
        {reasons.map((reason, i) => (
          <motion.article
            key={reason}
            className="reason-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
          >
            <Heart size={18} fill="currentColor" />
            <span>{reason}</span>
          </motion.article>
        ))}
      </div>
      <button className="outline-button" onClick={() => setExpanded((v) => !v)}>
        {expanded ? "Show Less ❤️" : "Show Me More Reasons ❤️"}
      </button>
    </>
  );
}

function LoveQuiz() {
  const [step, setStep] = useState(0),
    [answer, setAnswer] = useState(null);
  const complete = step >= loveConfig.questions.length;
  const choose = (option) => {
    setAnswer(option);
    setTimeout(() => {
      setStep((v) => v + 1);
      setAnswer(null);
    }, 380);
  };
  return (
    <div className="quiz-card">
      <div className="quiz-progress">
        {loveConfig.questions.map((_, i) => (
          <span key={i} className={i <= step ? "active" : ""} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        {!complete ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
          >
            <span className="quiz-count">
              Question {step + 1} of {loveConfig.questions.length}
            </span>
            <h3>{loveConfig.questions[step].question}</h3>
            <div className="quiz-options">
              {loveConfig.questions[step].options.map((option) => (
                <button
                  key={option}
                  className={answer === option ? "selected" : ""}
                  onClick={() => choose(option)}
                >
                  {answer === option && <Check size={16} />} {option}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="quiz-complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="quiz-heart">❤️</div>
            <h3>Congratulations, Strawberry!</h3>
            <p>You just made my day even more special! ❤️</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Letter() {
  const [open, setOpen] = useState(false),
    [visibleText, setVisibleText] = useState("");
  useEffect(() => {
    if (!open) return;
    let index = 0;
    const timer = setInterval(() => {
      index += 2;
      setVisibleText(loveConfig.letter.slice(0, index));
      if (index >= loveConfig.letter.length) clearInterval(timer);
    }, 18);
    return () => clearInterval(timer);
  }, [open]);
  return (
    <div className="letter-wrap">
      <motion.button
        className={`envelope ${open ? "open" : ""}`}
        onClick={() => setOpen(true)}
        aria-label="Open love letter"
      >
        <div className="envelope-flap">
          <Heart fill="currentColor" />
        </div>
        <div className="envelope-body">
          <Mail size={30} />
        </div>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="letter-paper"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
          >
            <div className="letter-heading">A Letter From My Heart</div>
            <p>
              {visibleText}
              <span className="type-cursor">|</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Gallery() {
  const [selected, setSelected] = useState(null);
  return (
    <>
      <div className="gallery-grid">
        {loveConfig.photos.map((photo, i) => (
          <motion.button
            key={i}
            className={`photo-card photo-${i + 1}`}
            onClick={() => setSelected(photo)}
            whileHover={{ y: -8 }}
          >
            {photo.src ? (
              <img
                src={photo.src}
                alt={photo.caption}
                style={{ objectPosition: photo.position }}
              />
            ) : (
              <div className="photo-placeholder">
                <Camera size={30} />
                <span>Photo {i + 1}</span>
              </div>
            )}
            <div className="photo-caption">{photo.caption}</div>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="lightbox-close"
              aria-label="Close photo"
              onClick={() => setSelected(null)}
            >
              <X />
            </button>
            {selected.src ? (
              <img src={selected.src} alt={selected.caption} />
            ) : (
              <div className="lightbox-placeholder">
                <Camera size={48} />
                <p>{selected.caption}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const [opened, setOpened] = useState(false),
    [opening, setOpening] = useState(false),
    [menuOpen, setMenuOpen] = useState(false),
    [hugged, setHugged] = useState(false);
  const duration = getTogetherDuration();
  const openSurprise = () => {
    setOpening(true);
    setTimeout(() => setOpened(true), 900);
  };
  const replay = () => {
    setOpened(false);
    setOpening(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      {!opened && (
        <main className={`welcome ${opening ? "opening" : ""}`}>
          <FloatingDecor />
          <motion.div
            className="welcome-envelope"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="welcome-seal">S</div>
            <div className="welcome-flap" />
          </motion.div>
          <motion.div
            className="welcome-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h1>Hey Strawberry! 🍓❤️</h1>
            <p>Someone has prepared a little surprise just for you...</p>
            <button
              className="primary-button"
              onClick={openSurprise}
              disabled={opening}
            >
              {opening ? "Opening your surprise..." : "Open Your Surprise 💌"}
            </button>
          </motion.div>
        </main>
      )}
      {opened && (
        <div className="experience">
          <AudioPlayer started={opened} />
          <nav className="nav">
            <button
              className="nav-brand"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              🍓 Forever Yours
            </button>
            <button
              className="nav-menu"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
            <div className={`nav-links ${menuOpen ? "open" : ""}`}>
              {["story", "letter", "gallery", "surprise"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    document
                      .querySelector(`#${item}`)
                      ?.scrollIntoView({ behavior: "smooth" });
                    setMenuOpen(false);
                  }}
                >
                  {item === "story"
                    ? "Our Story"
                    : item[0].toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </nav>
          <header className="hero" id="top">
            <FloatingDecor />
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="anniversary-pill">A celebration of us</span>
              <h1>
                Happy Anniversary,
                <br />
                <em>My Strawberry!</em> 🍓❤️
              </h1>
              <p className="hero-subtitle">{loveConfig.heroSubtitle}</p>
              <p className="hero-message">{loveConfig.heroMessage}</p>
              <div className="duration-grid">
                {[
                  ["Years", duration.years],
                  ["Months", duration.months],
                  ["Days", duration.days],
                ].map(([label, value]) => (
                  <motion.div
                    key={label}
                    className="duration-card"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </header>
          <Section id="question">
            <LoveQuestion />
          </Section>
          <Section id="story" className="story-section">
            <div className="section-heading">
              <span>Our journey</span>
              <h2>Every Beautiful Story Has a Beginning ❤️</h2>
            </div>
            <Timeline />
          </Section>
          <Section id="reasons" className="reasons-section">
            <div className="section-heading">
              <span>A few from forever</span>
              <h2>100 Little Reasons Why I Love You, Strawberry 🍓</h2>
            </div>
            <Reasons />
          </Section>
          <Section id="quiz" className="quiz-section">
            <div className="section-heading">
              <span>Just for fun</span>
              <h2>Our Love Quiz 🌳❤️</h2>
            </div>
            <LoveQuiz />
          </Section>
          <Section id="letter" className="letter-section">
            <Letter />
          </Section>
          <Section id="gallery" className="gallery-section">
            <div className="section-heading">
              <span>Frozen moments</span>
              <h2>Our Photo Memories 📸</h2>
            </div>
            <Gallery />
          </Section>
          <Section id="surprise" className="final-section">
            <div className="final-glow" />
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
            >
              <Gift size={38} />
              <span className="tiny-label">One last little surprise</span>
              <h2>One Last Thing, Strawberry... 🍓❤️</h2>
              <p className="final-line">
                If I could choose again, in every lifetime, in every universe, I
                would still choose <strong>YOU.</strong>
              </p>
              <h3>Happy Anniversary, My Love! ❤️</h3>
              <button
                className="hug-button"
                onClick={() => {
                  setHugged(true);
                  burst();
                }}
              >
                {hugged ? "Sending you a hug..." : "Hug Me! 🤗"}
              </button>
              <AnimatePresence>
                {hugged && (
                  <motion.p
                    className="hug-message"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Sending you the biggest virtual hug, Baby! 🤗❤️
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </Section>
          <footer>
            <p>Made with endless love for Strawberry 🍓</p>
            <button onClick={replay}>
              Replay the surprise <ArrowRight size={16} />
            </button>
          </footer>
        </div>
      )}
    </>
  );
}
