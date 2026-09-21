"use client";

import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ChevronRight,
  CircleAlert,
  FileText,
  Laptop,
  Loader2,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  ScanLine,
  Sparkles,
  Target,
  Upload,
  UserRound,
  Video,
  VideoOff,
  Volume2,
  X
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import {
  aiProvider,
  demoCandidate,
  demoJobDescription,
  interviewEngine,
  ocrService,
  resumeParser,
  speechRecognitionService,
  speechSynthesisService,
  type Analysis,
  type Candidate,
  type InterviewQuestion
} from "@/lib/services";

type Screen =
  | "home"
  | "setup"
  | "resume"
  | "job"
  | "analysis"
  | "readiness"
  | "permissions"
  | "interview"
  | "report";

const steps = [
  "Resume",
  "Job match",
  "Analysis",
  "Interview",
  "Insights"
];

function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = ""
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
}) {
  const styles = {
    primary: "bg-ink text-white hover:bg-moss",
    secondary: "border border-line bg-white text-ink hover:border-moss",
    ghost: "text-moss hover:bg-sage",
    danger: "bg-coral text-white hover:brightness-95"
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition duration-300 disabled:cursor-not-allowed disabled:opacity-45 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Tag({
  children,
  tone = "green"
}: {
  children: React.ReactNode;
  tone?: "green" | "amber" | "red" | "gray";
}) {
  const tones = {
    green: "bg-[#e5f3c7] text-[#42603d]",
    amber: "bg-[#fff0ca] text-[#806117]",
    red: "bg-[#ffe0d7] text-[#984934]",
    gray: "bg-[#edf0eb] text-[#5d6961]"
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2 font-bold tracking-tight">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime text-sm text-ink">
        C
      </span>
      <span>CareerOS</span>
    </div>
  );
}

function Progress({
  current,
  onBack
}: {
  current: number;
  onBack?: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-cream/90 px-4 py-4 backdrop-blur-md md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              aria-label="Go back"
              onClick={onBack}
              className="rounded-lg p-2 text-moss hover:bg-sage"
            >
              <ArrowLeft size={19} />
            </button>
          )}
          <Logo />
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          {steps.map((step, index) => (
            <div className="flex items-center gap-2" key={step}>
              <span
                className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                  index <= current
                    ? "bg-ink text-white"
                    : "bg-white text-moss"
                }`}
              >
                {index < current ? <Check size={14} /> : index + 1}
              </span>
              <span
                className={`hidden text-xs font-semibold lg:block ${
                  index <= current ? "text-ink" : "text-moss/50"
                }`}
              >
                {step}
              </span>
              {index !== steps.length - 1 && (
                <span className="mx-1 h-px w-5 bg-line lg:w-10" />
              )}
            </div>
          ))}
        </div>
        <span className="text-xs font-bold text-moss sm:hidden">
          {current + 1} / {steps.length}
        </span>
      </div>
    </header>
  );
}

function Home({
  onStart,
  onDemo
}: {
  onStart: () => void;
  onDemo: () => void;
}) {
  return (
    <main className="min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Logo />
        <button
          onClick={onDemo}
          className="text-sm font-bold text-moss hover:text-ink"
        >
          Try demo <ArrowRight className="ml-1 inline" size={16} />
        </button>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 md:grid-cols-[1.05fr_.95fr] md:px-8 md:pb-28 md:pt-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-sage px-3 py-2 text-xs font-bold text-moss">
            <Sparkles size={14} /> AI interview readiness engine
          </div>
          <h1 className="max-w-xl font-display text-5xl font-extrabold leading-[.98] tracking-[-.06em] md:text-7xl">
            Prepare for the interview that matters.
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-moss">
            CareerOS connects your resume to a real job description, finds your
            preparation gaps, and asks the next question based on your last
            answer.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button onClick={onStart}>
              Build my interview plan <ArrowRight size={18} />
            </Button>
            <Button onClick={onDemo} variant="secondary">
              <Play size={16} /> Try Arjun&apos;s demo
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-moss">
            <span>● Camera-first</span>
            <span>● Adaptive questions</span>
            <span>● No hiring predictions</span>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[28px] bg-ink p-3 shadow-soft">
            <div className="interview-grid relative aspect-[.82] overflow-hidden rounded-[20px] bg-[#26352d] p-4 text-white">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px]">
                  AI INTERVIEWER
                </span>
                <span className="flex items-center gap-1 text-[10px] text-lime">
                  <span className="h-2 w-2 rounded-full bg-lime" /> Live
                </span>
              </div>
              <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-full bg-[#b8c6b6] text-3xl font-bold text-ink">
                  MS
                </div>
                <p className="font-bold">Maya · AI interviewer</p>
                <p className="mt-1 text-xs text-white/50">
                  Frontend interview · Question 2
                </p>
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-black/25 p-4 backdrop-blur-sm">
                <p className="text-sm leading-6">
                  “What trade-off did you consider when choosing that
                  architecture?”
                </p>
                <div className="mt-3 flex items-center gap-1">
                  {[20, 32, 15, 39, 25, 34, 17, 29].map((height, index) => (
                    <span
                      key={index}
                      className="wave h-6 w-1 rounded-full bg-lime"
                      style={{ height }}
                    />
                  ))}
                  <span className="ml-auto text-[10px] text-white/55">
                    listening
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-3 rounded-2xl border border-line bg-white p-4 shadow-soft sm:-left-8">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0ca]">
                <Target size={19} className="text-[#806117]" />
              </div>
              <div>
                <p className="text-xs font-bold text-moss">Detected weakness</p>
                <p className="mt-1 text-sm font-bold">Trade-off reasoning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white px-5 py-12 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {[
            ["01", "See your gaps", "Compare your resume with the role, not a generic checklist."],
            ["02", "Practice the weak spot", "The interviewer adapts to what your previous answer missed."],
            ["03", "Leave with a plan", "Get specific practice tasks and resume improvements."]
          ].map(([number, title, copy]) => (
            <div key={number} className="border-l-2 border-lime pl-5">
              <p className="text-xs font-black text-moss">{number}</p>
              <h2 className="mt-3 text-xl font-bold">{title}</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-moss">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Setup({
  onSelect
}: {
  onSelect: (situation: "interview" | "job") => void;
}) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-5 py-7 md:px-8">
        <Logo />
        <div className="mx-auto max-w-2xl py-16 md:py-24">
          <p className="text-sm font-bold text-moss">Let&apos;s make this useful</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight md:text-6xl">
            Which situation describes you?
          </h1>
          <p className="mt-5 text-lg leading-8 text-moss">
            We&apos;ll shape the preparation around where you are today.
          </p>
          <div className="mt-10 grid gap-4">
            <button
              onClick={() => onSelect("interview")}
              className="group flex items-start gap-5 rounded-2xl border border-line bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-moss hover:shadow-soft"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-sage text-moss">
                <CalendarIcon />
              </span>
              <span className="flex-1">
                <span className="block text-lg font-bold">
                  I have an interview coming up
                </span>
                <span className="mt-1 block text-sm leading-6 text-moss">
                  Prepare for a specific role, interview round, and date.
                </span>
              </span>
              <ChevronRight className="mt-2 text-moss transition group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => onSelect("job")}
              className="group flex items-start gap-5 rounded-2xl border border-line bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-moss hover:shadow-soft"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#fff0ca] text-[#806117]">
                <CompassIcon />
              </span>
              <span className="flex-1">
                <span className="block text-lg font-bold">
                  I&apos;m still job-hunting
                </span>
                <span className="mt-1 block text-sm leading-6 text-moss">
                  Discover broader skill gaps and build a practice direction.
                </span>
              </span>
              <ChevronRight className="mt-2 text-moss transition group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarIcon() {
  return <span className="text-xl">◫</span>;
}

function CompassIcon() {
  return <span className="text-xl">◎</span>;
}

function ResumeStep({
  candidate,
  setCandidate,
  onNext,
  onBack
}: {
  candidate: Candidate;
  setCandidate: (candidate: Candidate) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [scanner, setScanner] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const openCamera = async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      setStream(media);
      setScanner(true);
    } catch {
      setScanner(true);
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  const capture = async () => {
    setCaptured(true);
    setProcessing(true);
    const result = await ocrService.extractTextFromImage();
    setCandidate(resumeParser.parse(result.text));
    setProcessing(false);
    stream?.getTracks().forEach((track) => track.stop());
  };

  const upload = (file: File) => {
    setCandidate({
      ...candidate,
      resumeText: `${candidate.resumeText}\nUploaded file: ${file.name}`
    });
  };

  if (scanner) {
    return (
      <div className="fixed inset-0 z-40 bg-ink text-white">
        <div className="mx-auto flex h-full max-w-lg flex-col">
          <div className="flex items-center justify-between p-5">
            <button
              onClick={() => {
                stream?.getTracks().forEach((track) => track.stop());
                setScanner(false);
              }}
              className="rounded-lg p-2 hover:bg-white/10"
              aria-label="Close scanner"
            >
              <X />
            </button>
            <span className="text-sm font-bold">Scan resume</span>
            <span className="w-9" />
          </div>
          <div className="relative flex flex-1 items-center justify-center px-5">
            {stream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 h-full w-full object-cover opacity-60"
              />
            ) : (
              <div className="absolute inset-0 bg-[#293a31]" />
            )}
            <div className="relative z-10 aspect-[.72] w-full max-w-[330px] rounded-xl border-2 border-lime/90">
              <span className="absolute -left-1 -top-1 h-8 w-8 border-l-4 border-t-4 border-lime" />
              <span className="absolute -right-1 -top-1 h-8 w-8 border-r-4 border-t-4 border-lime" />
              <span className="absolute -bottom-1 -left-1 h-8 w-8 border-b-4 border-l-4 border-lime" />
              <span className="absolute -bottom-1 -right-1 h-8 w-8 border-b-4 border-r-4 border-lime" />
              <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-lime/80" />
            </div>
            <div className="absolute bottom-8 left-0 right-0 z-10 px-6 text-center">
              <p className="text-sm text-white/80">
                Place the whole page inside the frame
              </p>
              <button
                onClick={capture}
                disabled={processing}
                className="mx-auto mt-6 grid h-20 w-20 place-items-center rounded-full border-4 border-white bg-white/20"
                aria-label="Capture resume"
              >
                {processing ? <Loader2 className="animate-spin" /> : <Camera size={28} />}
              </button>
              {captured && (
                <p className="mt-4 text-xs text-lime">
                  {processing
                    ? "Extracting text locally for this prototype…"
                    : "Scan complete — review your resume details"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Progress current={0} onBack={onBack} />
      <main className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-bold text-moss">Step 1 · Your experience</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-6xl">
            Start with your resume.
          </h1>
          <p className="mt-5 text-lg leading-8 text-moss">
            On your phone, scan it in seconds. You can review everything before
            we use it.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <button
            onClick={openCamera}
            className="group min-h-[260px] rounded-2xl bg-ink p-6 text-left text-white shadow-soft transition hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-lime px-3 py-1 text-xs font-black text-ink">
                Recommended on mobile
              </span>
              <ScanLine className="text-lime" />
            </div>
            <Camera size={38} className="mt-16 text-lime" />
            <p className="mt-4 text-xl font-bold">Scan resume with camera</p>
            <p className="mt-2 text-sm text-white/60">
              Camera guide, capture, and text extraction
            </p>
          </button>

          <div className="min-h-[260px] rounded-2xl border border-line bg-white p-6">
            <Upload size={38} className="text-moss" />
            <p className="mt-16 text-xl font-bold">Upload file</p>
            <p className="mt-2 text-sm text-moss">
              PDF, DOCX, or plain text for desktop
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) upload(file);
              }}
            />
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => fileRef.current?.click()}
            >
              Choose file
            </Button>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-moss" />
            <div>
              <p className="font-bold">
                {candidate.name === "Your name"
                  ? "No resume added yet"
                  : `${candidate.name}'s resume`}
              </p>
              <p className="mt-1 text-sm text-moss">
                {candidate.skills.length
                  ? candidate.skills.join(" · ")
                  : "Add a resume to continue"}
              </p>
            </div>
            {candidate.name !== "Your name" && (
              <Tag tone="green">Ready to review</Tag>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={onNext}
            disabled={candidate.name === "Your name"}
          >
            Continue <ArrowRight size={18} />
          </Button>
        </div>
      </main>
    </>
  );
}

function JobStep({
  candidate,
  setJobDescription,
  jobDescription,
  onNext,
  onBack
}: {
  candidate: Candidate;
  setJobDescription: (value: string) => void;
  jobDescription: string;
  onNext: () => void;
  onBack: () => void;
}) {
  const [role, setRole] = useState(candidate.role);
  const [round, setRound] = useState("Technical interview");
  const [date, setDate] = useState("");

  return (
    <>
      <Progress current={1} onBack={onBack} />
      <main className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-16">
        <p className="text-sm font-bold text-moss">Step 2 · Target context</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-6xl">
          What are you preparing for?
        </h1>

        <div className="mt-10 grid gap-6 md:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-5 flex items-center gap-3">
              <Target className="text-moss" />
              <h2 className="font-bold">Interview details</h2>
            </div>
            <label className="mb-2 block text-xs font-bold text-moss">
              Target role
            </label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mb-5 w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-moss"
            />
            <label className="mb-2 block text-xs font-bold text-moss">
              Interview type
            </label>
            <select
              value={round}
              onChange={(e) => setRound(e.target.value)}
              className="mb-5 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-moss"
            >
              <option>Technical interview</option>
              <option>Recruiter screen</option>
              <option>Hiring manager round</option>
              <option>Behavioral interview</option>
            </select>
            <label className="mb-2 block text-xs font-bold text-moss">
              Interview date <span className="font-normal">(optional)</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-moss"
            />
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="text-moss" />
                <h2 className="font-bold">Paste the job description</h2>
              </div>
              <span className="text-xs font-bold text-moss">Required</span>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={13}
              className="w-full resize-none rounded-xl border border-line p-4 text-sm leading-6 outline-none focus:border-moss"
              placeholder="Paste the public job description here…"
            />
            <p className="mt-3 text-xs leading-5 text-moss">
              CareerOS uses this to tailor questions. It does not access
              confidential interview questions.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={onNext}
            disabled={!jobDescription.trim() || !role.trim()}
          >
            Analyze my fit <Sparkles size={17} />
          </Button>
        </div>
      </main>
    </>
  );
}

function AnalysisStep({
  analysis,
  onNext,
  onBack,
  candidate
}: {
  analysis: Analysis;
  candidate: Candidate;
  onNext: () => void;
  onBack: () => void;
}) {
  const items = [
    ["Matched", analysis.matched, "green", Check],
    ["Developing", analysis.developing, "amber", CircleAlert],
    ["Preparation gaps", analysis.gaps, "red", Target]
  ] as const;

  return (
    <>
      <Progress current={2} onBack={onBack} />
      <main className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold text-moss">AI analysis · Demo logic</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-6xl">
              Here&apos;s where to focus.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-moss">
              We compared {candidate.name}&apos;s experience against the target
              role. These are preparation indicators, not hiring predictions.
            </p>
          </div>
          <Tag tone="gray">No hiring probability</Tag>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map(([title, values, tone, Icon]) => (
            <div key={title} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold">{title}</h2>
                <Icon size={19} className="text-moss" />
              </div>
              <div className="mt-5 space-y-3">
                {values.map((value) => (
                  <div key={value} className="flex items-start gap-2 text-sm">
                    <Tag tone={tone as "green" | "amber" | "red"}>●</Tag>
                    <span className="pt-1">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-ink p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-lime">
              What you already show
            </p>
            <div className="mt-5 space-y-4">
              {analysis.strengths.map((item) => (
                <p key={item} className="flex gap-3 text-sm leading-6">
                  <Check className="mt-1 shrink-0 text-lime" size={16} />
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-[#fff0ca] p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#806117]">
              Interview risks
            </p>
            <div className="mt-5 space-y-4">
              {analysis.risks.map((item) => (
                <p key={item} className="flex gap-3 text-sm leading-6 text-[#604b18]">
                  <CircleAlert className="mt-1 shrink-0" size={16} />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={onNext}>
            See my readiness <ArrowRight size={18} />
          </Button>
        </div>
      </main>
    </>
  );
}

function Readiness({
  onNext,
  onBack,
  candidate
}: {
  onNext: () => void;
  onBack: () => void;
  candidate: Candidate;
}) {
  return (
    <>
      <Progress current={2} onBack={onBack} />
      <main className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-16">
        <div className="rounded-[28px] bg-ink p-6 text-white md:p-10">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <Tag tone="green">Preparation snapshot</Tag>
              <h1 className="mt-5 max-w-xl font-display text-4xl font-extrabold tracking-tight md:text-6xl">
                You&apos;re ready to practice the hard part.
              </h1>
              <p className="mt-5 max-w-xl leading-7 text-white/65">
                Your strongest signal is hands-on delivery. Your highest-impact
                opportunity is explaining why you made technical decisions.
              </p>
            </div>
            <div className="flex h-36 w-36 shrink-0 flex-col items-center justify-center rounded-full border-[10px] border-lime text-center">
              <span className="text-4xl font-black">68</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-lime">
                readiness
              </span>
            </div>
          </div>
          <div className="mt-10 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[68%] rounded-full bg-lime" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Strong", "React delivery", "green"],
            ["Developing", "Quality signals", "amber"],
            ["Gap", "Trade-off reasoning", "red"]
          ].map(([label, title, tone]) => (
            <div key={label} className="rounded-2xl border border-line bg-white p-5">
              <Tag tone={tone as "green" | "amber" | "red"}>{label}</Tag>
              <p className="mt-5 font-bold">{title}</p>
              <p className="mt-2 text-sm leading-6 text-moss">
                {label === "Gap"
                  ? "We will probe this during the adaptive interview."
                  : `Evidence found in ${candidate.name}'s resume.`}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={onNext}>
            Enter interview room <Video size={18} />
          </Button>
        </div>
      </main>
    </>
  );
}

function Permissions({
  cameraOn,
  micOn,
  setCameraOn,
  setMicOn,
  onNext,
  onBack
}: {
  cameraOn: boolean;
  micOn: boolean;
  setCameraOn: (value: boolean) => void;
  setMicOn: (value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const checkPermissions = async () => {
    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setCameraOn(true);
      setMicOn(true);
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      setCameraOn(false);
      setMicOn(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Progress current={3} onBack={onBack} />
      <main className="mx-auto max-w-2xl px-5 py-12 md:py-20">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-sage text-moss">
            <Video size={28} />
          </div>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            Check your setup
          </h1>
          <p className="mt-4 text-lg leading-7 text-moss">
            Video and microphone are required so this feels like a real
            interview, not a chatbot.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {[
            [Camera, "Camera", cameraOn, "Your video will be visible to you and the AI interviewer."],
            [Mic, "Microphone", micOn, "Your answer can be spoken naturally or typed as a fallback."]
          ].map(([Icon, title, active, detail]) => (
            <div
              key={title as string}
              className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5"
            >
              <div className={`grid h-12 w-12 place-items-center rounded-xl ${active ? "bg-[#e5f3c7] text-[#42603d]" : "bg-[#edf0eb] text-moss"}`}>
                {active ? <Check /> : <Icon />}
              </div>
              <div className="flex-1">
                <p className="font-bold">{title as string}</p>
                <p className="mt-1 text-sm leading-5 text-moss">{detail as string}</p>
              </div>
              <Tag tone={active ? "green" : "gray"}>
                {active ? "Ready" : "Required"}
              </Tag>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-3">
          <Button onClick={checkPermissions} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Camera size={18} />}
            Allow camera & microphone
          </Button>
          <Button
            onClick={onNext}
            disabled={!cameraOn || !micOn}
            variant="secondary"
          >
            Enter interview <ArrowRight size={18} />
          </Button>
        </div>
        {!cameraOn || !micOn ? (
          <p className="mt-4 flex justify-center gap-2 text-center text-xs text-moss">
            <CircleAlert size={14} /> Both permissions must be enabled before starting.
          </p>
        ) : null}
      </main>
    </>
  );
}

function Interview({
  question,
  setQuestion,
  onFinish,
  onBack,
  candidate
}: {
  question: InterviewQuestion;
  setQuestion: (question: InterviewQuestion) => void;
  onFinish: (answer: string) => void;
  onBack: () => void;
  candidate: Candidate;
}) {
  const [answer, setAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [camera, setCamera] = useState(true);
  const [mic, setMic] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setStream(media);
      } catch {
        // Permissions were already checked. The room remains usable in demo mode.
      }
    };
    init();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
      speechSynthesisService.stop();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  const askQuestion = useCallback(() => {
    setSpeaking(true);
    speechSynthesisService.speak(question.text, "female");
    window.setTimeout(() => setSpeaking(false), 3600);
  }, [question.text]);

  useEffect(() => {
    askQuestion();
  }, [askQuestion]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    recognitionRef.current = speechRecognitionService.listen(
      (text) => setAnswer(text),
      () => setIsListening(false)
    );
  };

  const submit = () => {
    if (!answer.trim()) return;
    recognitionRef.current?.stop();
    stream?.getTracks().forEach((track) => track.stop());
    onFinish(answer);
  };

  return (
    <div className="min-h-screen bg-[#101714] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 md:px-8">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold">
          <ArrowLeft size={17} /> Exit
        </button>
        <div className="flex items-center gap-2 text-sm font-bold">
          <span className="h-2 w-2 rounded-full bg-lime" />
          Live interview
        </div>
        <span className="text-xs text-white/50">Question 1 of 2</span>
      </header>

      <main className="interview-grid mx-auto max-w-6xl px-4 py-5 md:px-8 md:py-8">
        <div className="grid gap-4 md:grid-cols-[1.35fr_.65fr]">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#293a31]">
            <div className="absolute left-4 top-4 z-10 rounded-full bg-black/30 px-3 py-1 text-[10px] font-bold tracking-widest">
              AI INTERVIEWER
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-[#becbbd] text-4xl font-bold text-ink">
                  MS
                </div>
                <p className="mt-4 font-bold">Maya · AI interviewer</p>
                <p className="mt-1 text-xs text-white/50">Professional mode</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-white/60">
              <span className="h-2 w-2 rounded-full bg-lime" /> AI interviewer
            </div>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#394b41] md:aspect-auto">
            {stream && camera ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full scale-x-[-1] object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center">
                <UserRound size={44} className="text-white/30" />
              </div>
            )}
            <div className="absolute bottom-3 left-3 rounded-full bg-black/35 px-3 py-1 text-[10px] font-bold">
              YOU
            </div>
          </div>
        </div>

        <div className="mx-auto mt-5 max-w-3xl rounded-2xl bg-white p-5 text-ink md:mt-7 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-moss">
                {question.category}
              </p>
              <h1 className="mt-3 text-xl font-bold leading-8 md:text-2xl">
                {question.text}
              </h1>
            </div>
            <button
              onClick={askQuestion}
              aria-label="Replay question"
              className="rounded-xl bg-sage p-3 text-moss hover:bg-lime"
            >
              <Volume2 size={19} />
            </button>
          </div>

          <div className="mt-7 rounded-xl bg-cream p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleListening}
                aria-label={isListening ? "Stop listening" : "Start speaking"}
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${
                  isListening ? "bg-coral text-white" : "bg-ink text-white"
                }`}
              >
                {isListening ? <MicOff size={19} /> : <Mic size={19} />}
              </button>
              <div className="flex-1">
                <p className="text-sm font-bold">
                  {isListening ? "Listening…" : "Speak your answer"}
                </p>
                <div className="mt-2 flex h-5 items-center gap-1">
                  {[12, 20, 15, 25, 17, 29, 13, 21].map((height, index) => (
                    <span
                      key={index}
                      className={`wave w-1 rounded-full ${
                        isListening ? "bg-coral" : "bg-moss/30"
                      }`}
                      style={{ height }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Or type your answer here…"
              rows={3}
              className="mt-4 w-full resize-none border-t border-line bg-transparent pt-3 text-sm leading-6 outline-none"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => setMic(!mic)}
                className={`rounded-xl p-3 ${mic ? "bg-sage text-moss" : "bg-coral text-white"}`}
                aria-label="Toggle microphone"
              >
                {mic ? <Mic size={18} /> : <MicOff size={18} />}
              </button>
              <button
                onClick={() => setCamera(!camera)}
                className={`rounded-xl p-3 ${camera ? "bg-sage text-moss" : "bg-coral text-white"}`}
                aria-label="Toggle camera"
              >
                {camera ? <Video size={18} /> : <VideoOff size={18} />}
              </button>
            </div>
            <Button onClick={submit} disabled={!answer.trim()}>
              Submit answer <ArrowRight size={17} />
            </Button>
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-5 text-white/40">
          CareerOS is clearly identified as an AI interviewer. This prototype
          uses browser speech tools and deterministic demo analysis.
        </p>
      </main>
    </div>
  );
}

function Report({
  analysis,
  evaluation,
  candidate,
  onRestart
}: {
  analysis: Analysis;
  evaluation: ReturnType<typeof aiProvider.evaluateAnswer>;
  candidate: Candidate;
  onRestart: () => void;
}) {
  const plan = interviewEngine.createPlan(evaluation.weaknesses);

  return (
    <>
      <Progress current={4} />
      <main className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold text-moss">Interview complete</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-6xl">
              Your next step is clear.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-moss">
              The follow-up was generated from your answer — not from a fixed
              question sequence.
            </p>
          </div>
          <div className="rounded-2xl bg-ink px-6 py-4 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-lime">
              Answer signal
            </p>
            <p className="mt-1 text-3xl font-black">{evaluation.score}/100</p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e5f3c7] text-[#42603d]">
                <Check size={20} />
              </div>
              <h2 className="text-lg font-bold">What you did well</h2>
            </div>
            <div className="mt-6 space-y-4">
              {evaluation.strengths.map((item) => (
                <p key={item} className="flex gap-3 text-sm leading-6">
                  <Check className="mt-1 shrink-0 text-moss" size={16} />
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#f2d8cd] bg-[#fff5f0] p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#ffe0d7] text-[#984934]">
                <CircleAlert size={20} />
              </div>
              <h2 className="text-lg font-bold">Specific weaknesses</h2>
            </div>
            <div className="mt-6 space-y-4">
              {evaluation.weaknesses.map((item) => (
                <p key={item} className="flex gap-3 text-sm leading-6">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-coral" />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-ink p-6 text-white md:p-8">
          <p className="text-xs font-black uppercase tracking-widest text-lime">
            Adaptive moment
          </p>
          <p className="mt-4 max-w-3xl text-xl font-bold leading-8">
            “{evaluation.followUp.text}”
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Tag tone="green">Generated from your answer</Tag>
            <span className="text-xs text-white/55">
              Detected: {evaluation.followUp.reason}
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-2xl border border-line bg-white p-6">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-moss" />
              <h2 className="text-lg font-bold">Personalized 4-day plan</h2>
            </div>
            <div className="mt-6 space-y-5">
              {plan.map((item) => (
                <div key={item.day} className="flex gap-4">
                  <span className="w-14 shrink-0 text-xs font-black text-moss">
                    {item.day}
                  </span>
                  <div>
                    <p className="font-bold">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-moss">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-6">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-moss" />
              <h2 className="text-lg font-bold">Resume improvements</h2>
            </div>
            <div className="mt-6 space-y-4">
              {analysis.resumeClaims.map((claim, index) => (
                <div key={claim} className="rounded-xl bg-cream p-4">
                  <p className="text-sm leading-6">{claim}</p>
                  <p className="mt-2 text-xs font-bold text-moss">
                    Suggestion: add the decision and measurable result.
                  </p>
                </div>
              ))}
              <p className="text-xs leading-5 text-moss">
                Based on the claims most likely to attract follow-up questions
                for {candidate.role}.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row">
          <Button onClick={onRestart} variant="secondary">
            <RotateCcw size={17} /> Start over
          </Button>
          <Button
            onClick={() =>
              window.alert("Summary export is available in the full product.")
            }
          >
            Download summary <ArrowRight size={17} />
          </Button>
        </div>
      </main>
    </>
  );
}

export default function CareerOS() {
  const [screen, setScreen] = useState<Screen>("home");
  const [situation, setSituation] = useState<"interview" | "job">("interview");
  const [candidate, setCandidate] = useState<Candidate>(demoCandidate);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [question, setQuestion] = useState<InterviewQuestion>(
    aiProvider.firstQuestion(demoCandidate.role)
  );
  const [evaluation, setEvaluation] = useState<ReturnType<
    typeof aiProvider.evaluateAnswer
  > | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);

  const reset = () => {
    setScreen("home");
    setCandidate(demoCandidate);
    setJobDescription("");
    setAnalysis(null);
    setEvaluation(null);
    setCameraOn(false);
    setMicOn(false);
    setQuestion(aiProvider.firstQuestion(demoCandidate.role));
  };

  const demo = () => {
    setCandidate(demoCandidate);
    setJobDescription(demoJobDescription);
    setAnalysis(aiProvider.analyze(demoCandidate, demoJobDescription));
    setQuestion(aiProvider.firstQuestion(demoCandidate.role));
    setCameraOn(false);
    setMicOn(false);
    setScreen("analysis");
  };

  const finishAnswer = (answer: string) => {
    const result = aiProvider.evaluateAnswer(answer);
    setEvaluation(result);
    setQuestion(result.followUp);
    setScreen("report");
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
      >
        {screen === "home" && (
          <Home
            onStart={() => setScreen("setup")}
            onDemo={demo}
          />
        )}

        {screen === "setup" && (
          <Setup
            onSelect={(selected) => {
              setSituation(selected);
              setScreen("resume");
            }}
          />
        )}

        {screen === "resume" && (
          <ResumeStep
            candidate={candidate}
            setCandidate={setCandidate}
            onBack={() => setScreen("setup")}
            onNext={() => setScreen("job")}
          />
        )}

        {screen === "job" && (
          <JobStep
            candidate={candidate}
            setJobDescription={setJobDescription}
            jobDescription={jobDescription || demoJobDescription}
            onBack={() => setScreen("resume")}
            onNext={() => {
              const result = aiProvider.analyze(candidate, jobDescription);
              setAnalysis(result);
              setScreen("analysis");
            }}
          />
        )}

        {screen === "analysis" && analysis && (
          <AnalysisStep
            analysis={analysis}
            candidate={candidate}
            onBack={() => setScreen("job")}
            onNext={() => setScreen("readiness")}
          />
        )}

        {screen === "readiness" && (
          <Readiness
            candidate={candidate}
            onBack={() => setScreen("analysis")}
            onNext={() => setScreen("permissions")}
          />
        )}

        {screen === "permissions" && (
          <Permissions
            cameraOn={cameraOn}
            micOn={micOn}
            setCameraOn={setCameraOn}
            setMicOn={setMicOn}
            onBack={() => setScreen("readiness")}
            onNext={() => setScreen("interview")}
          />
        )}

        {screen === "interview" && (
          <Interview
            candidate={candidate}
            question={question}
            setQuestion={setQuestion}
            onBack={() => setScreen("permissions")}
            onFinish={finishAnswer}
          />
        )}

        {screen === "report" && evaluation && analysis && (
          <Report
            candidate={candidate}
            analysis={analysis}
            evaluation={evaluation}
            onRestart={reset}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
