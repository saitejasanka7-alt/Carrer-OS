export type Readiness = "Strong" | "Developing" | "Gap";

export type Candidate = {
  name: string;
  role: string;
  skills: string[];
  resumeText: string;
};

export type Analysis = {
  matched: string[];
  developing: string[];
  gaps: string[];
  strengths: string[];
  risks: string[];
  resumeClaims: string[];
};

export type InterviewQuestion = {
  text: string;
  category: string;
  reason: string;
};

export type AnswerEvaluation = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  followUp: InterviewQuestion;
};

export const demoCandidate: Candidate = {
  name: "Arjun Sharma",
  role: "Frontend Developer",
  skills: ["React", "JavaScript", "TypeScript", "Firebase", "REST APIs"],
  resumeText:
    "Frontend Developer with experience building React applications, integrating REST APIs, and shipping Firebase-backed products. Built a collaborative task workspace used by student teams."
};

export const demoJobDescription = `We are looking for a Frontend Developer to build reliable, accessible web experiences. You will work with React and TypeScript, collaborate with product and design, consume APIs, and make thoughtful decisions about performance, testing, and frontend architecture.`;

export const resumeParser = {
  parse(text: string): Candidate {
    const lower = text.toLowerCase();
    const knownSkills = [
      "React",
      "JavaScript",
      "TypeScript",
      "Firebase",
      "REST APIs",
      "Testing",
      "Accessibility",
      "Performance"
    ];

    const skills = knownSkills.filter((skill) =>
      lower.includes(skill.toLowerCase())
    );

    return {
      name: "Your name",
      role: "Frontend Developer",
      skills: skills.length ? skills : ["React"],
      resumeText: text
    };
  }
};

export const ocrService = {
  async extractTextFromImage(): Promise<{
    text: string;
    simulated: boolean;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 1100));

    return {
      simulated: true,
      text: demoCandidate.resumeText
    };
  }
};

export const aiProvider = {
  analyze(candidate: Candidate, jobDescription: string): Analysis {
    const jd = jobDescription.toLowerCase();
    const candidateSkills = candidate.skills.map((skill) => skill.toLowerCase());

    const matched = candidate.skills.filter((skill) =>
      jd.includes(skill.toLowerCase())
    );

    const developing = ["Testing", "Accessibility", "Performance"].filter(
      (skill) =>
        jd.includes(skill.toLowerCase()) &&
        !candidateSkills.includes(skill.toLowerCase())
    );

    const gaps = ["Architecture trade-offs", "System scalability"].filter(
      (skill) => !candidateSkills.includes(skill.toLowerCase())
    );

    return {
      matched: matched.length ? matched : ["React"],
      developing: developing.length
        ? developing
        : ["Testing and frontend quality"],
      gaps,
      strengths: [
        "Clear hands-on React experience",
        "Practical API integration experience",
        "Has shipped a real product rather than only tutorials"
      ],
      risks: [
        "Architecture decisions may attract deeper follow-up questions",
        "Resume does not yet show measurable performance outcomes",
        "Testing approach is not visible in the current resume"
      ],
      resumeClaims: [
        "“Built a collaborative task workspace” — be ready to explain scale and architecture",
        "“Integrated REST APIs” — expect questions about loading, errors, and caching"
      ]
    };
  },

  firstQuestion(role: string): InterviewQuestion {
    return {
      text: `Tell me about the most technically challenging ${role.toLowerCase()} project on your resume.`,
      category: "Project depth",
      reason: "This connects directly to the candidate's stated experience."
    };
  },

  evaluateAnswer(answer: string): AnswerEvaluation {
    const normalized = answer.toLowerCase();
    const mentionsArchitecture =
      normalized.includes("architecture") ||
      normalized.includes("component") ||
      normalized.includes("structure");
    const mentionsTradeoff =
      normalized.includes("trade-off") ||
      normalized.includes("tradeoff") ||
      normalized.includes("decision") ||
      normalized.includes("because");
    const mentionsImpact =
      normalized.includes("user") ||
      normalized.includes("performance") ||
      normalized.includes("scale") ||
      normalized.includes("result");

    const weaknesses: string[] = [];
    if (!mentionsArchitecture) weaknesses.push("Architecture reasoning");
    if (!mentionsTradeoff) weaknesses.push("Trade-off explanation");
    if (!mentionsImpact) weaknesses.push("Concrete impact or outcome");

    const score = Math.max(48, 88 - weaknesses.length * 13);

    return {
      score,
      strengths: [
        "The answer was relevant to the question",
        answer.length > 130
          ? "You provided useful context"
          : "You kept the answer focused"
      ],
      weaknesses,
      followUp: {
        text: weaknesses.includes("Trade-off explanation")
          ? "Thanks, you explained what you built clearly. What trade-off did you consider when choosing that architecture?"
          : weaknesses.includes("Architecture reasoning")
            ? "I’d like to understand one of those decisions a little better. How did you structure the frontend and why?"
            : "That gives me a good overview. What would you change if the system had significantly more users?",
        category: weaknesses[0] || "Depth",
        reason: `Generated from detected weakness: ${weaknesses[0] || "need for deeper reasoning"}`
      }
    };
  }
};

export const speechRecognitionService = {
  listen(
    onResult: (text: string) => void,
    onError: (message: string) => void
  ): { stop: () => void } {
    const Recognition =
      typeof window !== "undefined"
        ? (
            window as typeof window & {
              webkitSpeechRecognition?: new () => SpeechRecognition;
              SpeechRecognition?: new () => SpeechRecognition;
            }
          ).webkitSpeechRecognition ||
          (
            window as typeof window & {
              SpeechRecognition?: new () => SpeechRecognition;
            }
          ).SpeechRecognition
        : undefined;

    if (!Recognition) {
      onError("Speech recognition is not supported in this browser.");
      return { stop: () => undefined };
    }

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");

      onResult(transcript);
    };

    recognition.onerror = () => {
      onError("We could not hear that. You can type your answer instead.");
    };

    recognition.start();

    return {
      stop: () => recognition.stop()
    };
  }
};

export const speechSynthesisService = {
  speak(text: string, gender: "male" | "female") {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.94;
    utterance.pitch = gender === "female" ? 1.08 : 0.92;
    utterance.volume = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((voice) =>
      gender === "female"
        ? /female|samantha|zira|google us english/i.test(voice.name)
        : /male|daniel|alex|google uk english male/i.test(voice.name)
    );

    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  },

  stop() {
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
  }
};

export const interviewEngine = {
  createPlan(weaknesses: string[]) {
    const first = weaknesses[0] || "structured storytelling";

    return [
      {
        day: "Day 1",
        title: `Strengthen ${first.toLowerCase()}`,
        detail:
          "Write one project explanation using Context, Decision, Trade-off, and Result."
      },
      {
        day: "Day 2",
        title: "Practice a deeper follow-up",
        detail:
          "Answer three why questions about your main project without looking at notes."
      },
      {
        day: "Day 3",
        title: "Add evidence",
        detail:
          "Attach one measurable user, performance, reliability, or delivery outcome to each resume project."
      },
      {
        day: "Day 4",
        title: "Run a timed interview",
        detail:
          "Practice a 20-minute interview and review whether each answer has a clear decision and result."
      }
    ];
  }
};

declare global {
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: (() => void) | null;
  }

  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}
