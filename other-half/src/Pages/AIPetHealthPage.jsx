import { createElement, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Clock3,
  HeartPulse,
  LoaderCircle,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { apiRequest } from "../lib/api.js";
import { LoadingButton, LoadingLink } from "../Components/LoadingControl.jsx";

const promptSuggestions = [
  "My 8-year-old Labrador has stiff joints and struggles with stairs.",
  "My dog has bad breath and yellow plaque on the teeth.",
  "My puppy has loose stool and low appetite since yesterday.",
  "My dog keeps scratching and the coat looks dull.",
];

const guidanceCards = [
  {
    title: "Problem analysis",
    text: "Understand what may be going on in clear, caring language.",
    icon: HeartPulse,
  },
  {
    title: "Daily routine",
    text: "Get a simple morning, afternoon, and evening care plan.",
    icon: Clock3,
  },
  {
    title: "Food + care habits",
    text: "See practical diet and lifestyle steps you can actually follow.",
    icon: ShieldCheck,
  },
  {
    title: "Relevant products",
    text: "View PetPlus recommendations with a short reason for each one.",
    icon: Sparkles,
  },
];

const statusToneClasses = {
  success: "border-[#CDE8A4] bg-[#F5F9E8] text-[#234C17]",
  error: "border-[#F0C9C4] bg-[#FFF3F1] text-[#8A2F23]",
};

const ResponseSection = ({ title, icon, children }) => (
  <section className="rounded-[28px] border border-[#E6DFCF] bg-[#FFFCF6] p-5 shadow-[0_18px_45px_rgba(32,28,19,0.05)] lg:p-6">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EBF466] text-[#0F4A12]">
        {createElement(icon, { size: 18 })}
      </div>
      <h2 className="font-[Poppins] text-[20px] font-semibold text-[#1A1A1A]">{title}</h2>
    </div>
    <div className="mt-4 font-[Poppins] text-[15px] leading-[1.8] text-[#4C473D]">{children}</div>
  </section>
);

const AIPetHealthPage = () => {
  const location = useLocation();
  const descriptionRef = useRef(null);
  const [description, setDescription] = useState("");
  const [response, setResponse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const trimmedDescription = description.trim();
  const shouldFocusDescription =
    location.hash === "#describe-your-dog" || Boolean(location.state?.focusDescription);

  useEffect(() => {
    if (!shouldFocusDescription) {
      return undefined;
    }

    const focusDescriptionField = () => {
      const textarea = descriptionRef.current;

      if (!textarea) {
        return;
      }

      textarea.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      textarea.focus({ preventScroll: true });

      const caretPosition = textarea.value.length;
      textarea.setSelectionRange(caretPosition, caretPosition);
    };

    const animationFrameId = window.requestAnimationFrame(focusDescriptionField);
    const timeoutId = window.setTimeout(focusDescriptionField, 220);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(timeoutId);
    };
  }, [shouldFocusDescription]);

  const handleSuggestionClick = (value) => {
    setDescription(value);
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (trimmedDescription.length < 18) {
      setStatus({
        type: "error",
        message: "Please share a little more detail so the assistant can help properly.",
      });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const result = await apiRequest("/ai/dog-health-assistant", {
        method: "POST",
        body: {
          description: trimmedDescription,
        },
      });

      setResponse(result);
      setStatus({
        type: "success",
        message: "Your dog's care guidance is ready below.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "The AI assistant could not respond right now.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#FBF8EF] text-[#1A1A1A]">
      <section className="px-6 pb-10 pt-8 lg:px-[120px] lg:pb-14 lg:pt-10">
        <div className="mx-auto max-w-[1920px]">
          <div className="overflow-hidden rounded-[34px] border border-[#E6DFCF] bg-[#FAF9F5] shadow-[0_28px_90px_rgba(31,27,18,0.08)]">
            <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
              <div
                className="relative overflow-hidden px-6 py-8 lg:px-12 lg:py-12"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(235,244,102,0.42) 0%, rgba(250,249,245,0.98) 40%, rgba(215,235,220,0.78) 100%)",
                }}
              >
                <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-[radial-gradient(circle_at_center,rgba(15,74,18,0.12),transparent_72%)] lg:block" />

                <div className="relative z-10 max-w-[680px]">
                  <span className="inline-flex rounded-full border border-[#D7D2C5] bg-white/80 px-4 py-2 font-[Poppins] text-[12px] font-semibold uppercase tracking-[0.22em] text-[#0F4A12]">
                    AI Pet Health Assistant
                  </span>

                  <h1 className="mt-5 font-[Luckiest_Guy] text-[38px] leading-[1.18] text-[#1A1A1A] lg:text-[74px] lg:leading-[1.08]">
                    Caring AI Guidance for Your Dog&apos;s Daily Health Routine.
                  </h1>

                  <p className="mt-5 max-w-[590px] font-[Poppins] text-[16px] leading-[1.75] text-[#474238] lg:text-[18px]">
                    Describe your dog&apos;s problem, behavior, or health concern and get a
                    warm, easy-to-follow care plan with daily routine ideas, food guidance,
                    and relevant PetPlus product suggestions.
                  </p>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    {guidanceCards.map(({ title, text, icon }) => (
                      <article
                        key={title}
                        className="rounded-[24px] border border-[#E6DFCF] bg-white/80 p-4 backdrop-blur-sm"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F4A12] text-[#EBF466]">
                          {createElement(icon, { size: 18 })}
                        </div>
                        <h2 className="mt-4 font-[Poppins] text-[18px] font-semibold text-[#1A1A1A]">
                          {title}
                        </h2>
                        <p className="mt-2 font-[Poppins] text-[14px] leading-[1.7] text-[#5E594D]">
                          {text}
                        </p>
                      </article>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <LoadingLink
                      to="/collection"
                      className="inline-flex items-center gap-2 rounded-full bg-[#0F4A12] px-6 py-3 font-[Poppins] text-[15px] font-semibold text-[#EBF466] transition hover:bg-[#1A1A1A]"
                      loadingText="Opening..."
                    >
                      Shop daily support
                      <ArrowRight size={16} />
                    </LoadingLink>
                    <LoadingLink
                      to="/science"
                      className="inline-flex items-center gap-2 rounded-full border border-[#0F4A12] bg-transparent px-6 py-3 font-[Poppins] text-[15px] font-semibold text-[#0F4A12] transition hover:bg-white"
                      loadingText="Opening..."
                    >
                      Learn the science
                    </LoadingLink>
                  </div>
                </div>
              </div>

              <div className="bg-white px-6 py-8 lg:px-10 lg:py-12">
                <div className="mx-auto max-w-[560px]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#F4F1E5] text-[#0F4A12]">
                      <PawPrint size={20} />
                    </div>
                    <div>
                      <p className="font-[Poppins] text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0F4A12]">
                        Start Here
                      </p>
                      <p className="font-[Poppins] text-[14px] text-[#655F52]">
                        Tell us what your dog is dealing with right now.
                      </p>
                    </div>
                  </div>

                  <form className="mt-6" onSubmit={handleSubmit}>
                    <label className="block">
                      <span className="mb-3 block font-[Poppins] text-[14px] font-semibold text-[#1A1A1A]">
                        Describe your dog&apos;s problem...
                      </span>
                      <textarea
                        id="describe-your-dog"
                        ref={descriptionRef}
                        autoFocus={shouldFocusDescription}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        maxLength={2200}
                        placeholder="Example: My 6-year-old Beagle has bad breath, low energy, and seems uncomfortable while chewing."
                        className="min-h-[220px] w-full rounded-[24px] border border-[#D9D4C8] bg-[#FFFCF6] px-5 py-4 font-[Poppins] text-[15px] leading-[1.7] text-[#1A1A1A] outline-none transition focus:border-[#0F4A12] focus:ring-2 focus:ring-[#EBF466]"
                      />
                    </label>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="font-[Poppins] text-[13px] text-[#6A6458]">
                        Mention breed, age, symptoms, appetite, energy, and how long it has
                        been happening.
                      </p>
                      <span className="font-[Poppins] text-[12px] font-medium text-[#6A6458]">
                        {description.length}/2200
                      </span>
                    </div>

                    {status.message ? (
                      <div
                        className={`mt-4 rounded-[20px] border px-4 py-3 font-[Poppins] text-[14px] ${
                          statusToneClasses[status.type] || statusToneClasses.error
                        }`}
                      >
                        {status.message}
                      </div>
                    ) : null}

                    <LoadingButton
                      type="submit"
                      disabled={submitting}
                      loading={submitting}
                      loadingText="Generating your dog's care plan..."
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F4A12] px-6 py-4 font-[Poppins] text-[15px] font-semibold text-[#EBF466] transition hover:bg-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <>
                        Talk to AI About Your Dog
                        <ArrowRight size={16} />
                      </>
                    </LoadingButton>
                  </form>

                  <div className="mt-7">
                    <p className="font-[Poppins] text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0F4A12]">
                      Try a prompt
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {promptSuggestions.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleSuggestionClick(prompt)}
                          className="rounded-full border border-[#D9D4C8] bg-[#FAF9F5] px-4 py-2 text-left font-[Poppins] text-[13px] leading-[1.5] text-[#4F4A40] transition hover:border-[#0F4A12] hover:bg-white"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-7 rounded-[24px] border border-[#EEE7D6] bg-[#FBF8EF] px-5 py-4">
                    <p className="font-[Poppins] text-[13px] font-semibold uppercase tracking-[0.16em] text-[#7D6D2D]">
                      Important note
                    </p>
                    <p className="mt-2 font-[Poppins] text-[14px] leading-[1.7] text-[#5F5A4D]">
                      This tool gives supportive routine guidance, but it is not a
                      substitute for emergency or in-person veterinary care.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 lg:px-[120px] lg:pb-20">
        <div className="mx-auto grid max-w-[1920px] gap-6 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
          <aside className="space-y-6 lg:sticky lg:top-8">
            <div className="rounded-[30px] border border-[#E6DFCF] bg-white p-6 shadow-[0_24px_70px_rgba(31,27,18,0.05)]">
              <p className="font-[Poppins] text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0F4A12]">
                What You&apos;ll Get
              </p>
              <div className="mt-5 space-y-4">
                {guidanceCards.map(({ title, text, icon }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#EBF466] text-[#0F4A12]">
                      {createElement(icon, { size: 17 })}
                    </div>
                    <div>
                      <h3 className="font-[Poppins] text-[16px] font-semibold text-[#1A1A1A]">
                        {title}
                      </h3>
                      <p className="mt-1 font-[Poppins] text-[14px] leading-[1.7] text-[#625D51]">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-[#DDE5C8] bg-[#F5F9E8] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F4A12] text-[#EBF466]">
                  <Stethoscope size={18} />
                </div>
                <h2 className="font-[Poppins] text-[18px] font-semibold text-[#1A1A1A]">
                  Best results come from detail
                </h2>
              </div>
              <p className="mt-4 font-[Poppins] text-[14px] leading-[1.8] text-[#525042]">
                The more clearly you describe the problem, the better the routine and care
                guidance becomes. A few useful details are breed, age, symptoms, energy,
                appetite, poop changes, chewing issues, itching, and how long it has been
                going on.
              </p>
            </div>
          </aside>

          <div className="rounded-[32px] border border-[#E6DFCF] bg-white p-6 shadow-[0_28px_80px_rgba(31,27,18,0.06)] lg:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-[Poppins] text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0F4A12]">
                  AI Response
                </p>
                <h2 className="mt-2 font-[Poppins] text-[28px] font-semibold text-[#1A1A1A]">
                  Personalized support for your dog
                </h2>
              </div>
            </div>

            {!response && !submitting ? (
              <div className="mt-8 rounded-[28px] border border-dashed border-[#D9D4C8] bg-[#FFFCF6] px-6 py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF466] text-[#0F4A12]">
                  <PawPrint size={24} />
                </div>
                <h3 className="mt-5 font-[Poppins] text-[22px] font-semibold text-[#1A1A1A]">
                  Your dog&apos;s care guidance will appear here.
                </h3>
                <p className="mx-auto mt-3 max-w-[620px] font-[Poppins] text-[15px] leading-[1.8] text-[#615C50]">
                  Submit your dog&apos;s issue above and you&apos;ll get a clear problem
                  understanding, a simple daily routine, diet and care tips, plus product
                  recommendations that match the concern.
                </p>
              </div>
            ) : null}

            {submitting ? (
              <div className="mt-8 rounded-[28px] border border-[#DDE5C8] bg-[#F8FAEF] px-6 py-10 text-center">
                <LoaderCircle size={26} className="mx-auto animate-spin text-[#0F4A12]" />
                <h3 className="mt-4 font-[Poppins] text-[22px] font-semibold text-[#1A1A1A]">
                  Building your dog&apos;s support plan...
                </h3>
                <p className="mx-auto mt-3 max-w-[580px] font-[Poppins] text-[15px] leading-[1.8] text-[#5D584C]">
                  The assistant is analyzing the issue, shaping a daily routine, and
                  preparing recommendations in the same caring PetPlus style.
                </p>
              </div>
            ) : null}

            {response ? (
              <div className="mt-8 space-y-5" aria-live="polite">
                {response.safetyNote ? (
                  <div className="rounded-[26px] border border-[#F0C9C4] bg-[#FFF4F2] p-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#F7D9D4] text-[#8A2F23]">
                        <AlertTriangle size={18} />
                      </div>
                      <div>
                        <h3 className="font-[Poppins] text-[18px] font-semibold text-[#6D221A]">
                          Vet attention may be needed
                        </h3>
                        <p className="mt-2 font-[Poppins] text-[14px] leading-[1.8] text-[#7A3429]">
                          {response.safetyNote}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <ResponseSection
                  title={"\uD83D\uDC36 Problem Understanding"}
                  icon={HeartPulse}
                >
                  <p>{response.problemUnderstanding}</p>
                </ResponseSection>

                <ResponseSection title={"\uD83D\uDCC5 Daily Routine"} icon={Clock3}>
                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-[22px] border border-[#E6DFCF] bg-white p-4">
                      <p className="font-[Poppins] text-[12px] font-semibold uppercase tracking-[0.18em] text-[#0F4A12]">
                        Morning
                      </p>
                      <p className="mt-3">{response.dailyRoutine?.morning}</p>
                    </div>
                    <div className="rounded-[22px] border border-[#E6DFCF] bg-white p-4">
                      <p className="font-[Poppins] text-[12px] font-semibold uppercase tracking-[0.18em] text-[#0F4A12]">
                        Afternoon
                      </p>
                      <p className="mt-3">{response.dailyRoutine?.afternoon}</p>
                    </div>
                    <div className="rounded-[22px] border border-[#E6DFCF] bg-white p-4">
                      <p className="font-[Poppins] text-[12px] font-semibold uppercase tracking-[0.18em] text-[#0F4A12]">
                        Evening
                      </p>
                      <p className="mt-3">{response.dailyRoutine?.evening}</p>
                    </div>
                  </div>
                </ResponseSection>

                <ResponseSection title={"\uD83E\uDD57 Diet & Care Tips"} icon={ShieldCheck}>
                  <div className="space-y-3">
                    {(response.dietAndCareTips || []).map((tip) => (
                      <div key={tip} className="flex items-start gap-3">
                        <div className="mt-2 h-2.5 w-2.5 rounded-full bg-[#0F4A12]" />
                        <p>{tip}</p>
                      </div>
                    ))}
                  </div>
                </ResponseSection>

                <ResponseSection
                  title={"\uD83D\uDECD Recommended Products"}
                  icon={Sparkles}
                >
                  <div className="grid gap-4 lg:grid-cols-3">
                    {(response.recommendedProducts || []).map((product) => (
                      <article
                        key={product.productId}
                        className="rounded-[24px] border border-[#DCE7BE] bg-[#F9FBEF] p-5"
                      >
                        <p className="font-[Poppins] text-[12px] font-semibold uppercase tracking-[0.18em] text-[#0F4A12]">
                          PetPlus Pick
                        </p>
                        <h3 className="mt-3 font-[Poppins] text-[18px] font-semibold text-[#1A1A1A]">
                          {product.name}
                        </h3>
                        <p className="mt-3 font-[Poppins] text-[14px] leading-[1.8] text-[#545042]">
                          {product.reason}
                        </p>
                        <LoadingLink
                          to={product.route}
                          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0F4A12] px-4 py-2.5 font-[Poppins] text-[13px] font-semibold text-[#EBF466] transition hover:bg-[#1A1A1A]"
                          loadingText="Opening..."
                        >
                          View product
                          <ArrowRight size={15} />
                        </LoadingLink>
                      </article>
                    ))}
                  </div>
                </ResponseSection>

                <ResponseSection title={"\u2764\uFE0F Final Note"} icon={Stethoscope}>
                  <p>{response.finalNote}</p>
                </ResponseSection>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AIPetHealthPage;
