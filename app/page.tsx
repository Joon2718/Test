"use client";

import { FormEvent, useMemo, useState } from "react";
import { saveCareerSubmission } from "./supabase";

const steps = ["시작", "과제 1", "피드백", "과제 2", "만족도"];

function ArrowIcon() {
  return <span aria-hidden="true">→</span>;
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [taskOne, setTaskOne] = useState("");
  const [taskTwo, setTaskTwo] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [satisfactionNote, setSatisfactionNote] = useState("");
  const [finished, setFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const feedback = useMemo(() => {
    const text = taskOne.trim();
    const hasAction = /(해보고|되고|하고 싶|만들|기획|연구|개발|도전|준비)/.test(text);
    const hasReason = /(왜냐|때문|계기|관심|좋아|가치|보람|의미)/.test(text);
    const hasDetail = /(분야|직무|산업|회사|대학원|자격|경험|프로젝트)/.test(text);

    return [
      {
        title: "방향이 잘 보이는 점",
        text: hasAction
          ? "하고 싶은 일의 방향이 드러나요. 이 핵심을 다음 과제의 출발점으로 삼아보세요."
          : "관심사를 한 문장으로 압축하면 원하는 방향이 더 선명해질 거예요.",
      },
      {
        title: "한 걸음 더 생각할 점",
        text: hasReason
          ? "그 일을 원하는 이유가 담겨 있어 설득력이 있어요. 그 가치가 오래 지속될지 생각해보세요."
          : "왜 이 일을 하고 싶은지, 어떤 순간에 흥미를 느꼈는지 한 가지 경험을 더해보세요.",
      },
      {
        title: "과제 2로 가져갈 질문",
        text: hasDetail
          ? "지금 언급한 분야에서 필요한 역량은 무엇이고, 이번 학기에 무엇부터 시도할 수 있을까요?"
          : "희망 분야와 역할을 조금 더 좁힌 뒤, 필요한 경험·역량·사람을 차례로 적어보세요.",
      },
    ];
  }, [taskOne]);

  const next = (event: FormEvent, target: number) => {
    event.preventDefault();
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitSatisfaction = async (event: FormEvent) => {
    event.preventDefault();
    if (!rating || isSaving) return;

    setIsSaving(true);
    setSaveError("");
    try {
      await saveCareerSubmission({
        name: name.trim(),
        taskOne: taskOne.trim(),
        taskTwo: taskTwo.trim(),
        rating,
        satisfactionNote: satisfactionNote.trim(),
      });
      setFinished(true);
    } catch {
      setSaveError("저장하지 못했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const goBack = () => {
    setStep((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={() => setStep(0)} aria-label="나의 진로 여정 처음으로">
          <span className="brand-mark">↗</span>
          <span>나의 진로 여정</span>
        </a>
        <div className="header-note">진로설계 워크북</div>
      </header>

      <nav className="progress" aria-label="과제 진행 단계">
        {steps.map((label, index) => (
          <div className={`progress-step ${index === step ? "current" : ""} ${index < step ? "done" : ""}`} key={label}>
            <span className="progress-dot">{index < step ? "✓" : index + 1}</span>
            <span>{label}</span>
          </div>
        ))}
        <div className="progress-line" aria-hidden="true">
          <span style={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
        </div>
      </nav>

      <section className="content-wrap">
        {step === 0 && (
          <div className="intro-grid screen">
            <div className="intro-copy">
              <p className="eyebrow">CAREER DESIGN JOURNEY</p>
              <h1>반가워요.<br />어떻게 불러드릴까요?</h1>
              <p className="lead">
                두 번의 짧은 기록을 통해 내가 원하는 진로와
                그곳까지 가는 길을 차근차근 그려봐요.
              </p>
              <div className="journey-pill">
                <span>약 15분</span>
                <i />
                <span>2개의 과제</span>
                <i />
                <span>나만의 계획 완성</span>
              </div>
            </div>
            <form className="name-card" onSubmit={(event) => next(event, 1)}>
              <div className="card-number">01</div>
              <label htmlFor="name">이름이 무엇인가요?</label>
              <p>작성한 진로 계획에 이름을 남겨드릴게요.</p>
              <input
                id="name"
                autoFocus
                autoComplete="name"
                placeholder="이름을 입력해주세요"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
              <button className="primary-button" type="submit" disabled={!name.trim()}>
                여정 시작하기 <ArrowIcon />
              </button>
              <small>입력한 내용은 이 기기에만 임시로 머물러요.</small>
            </form>
          </div>
        )}

        {step === 1 && (
          <div className="task-layout screen">
            <aside className="task-aside">
              <button className="back-button" type="button" onClick={goBack}>← 이전</button>
              <p className="eyebrow">ASSIGNMENT 01</p>
              <div className="big-number">01</div>
              <h2>하고 싶은 일을<br />자유롭게 그려보기</h2>
              <p>정답은 없어요. 지금 떠오르는 생각을 솔직하게 적는 것이 가장 중요해요.</p>
              <div className="tip-card">
                <strong>막막하다면?</strong>
                <span>좋아하는 일, 잘하는 일, 해결하고 싶은 문제 중 하나에서 시작해보세요.</span>
              </div>
            </aside>
            <form className="writing-card" onSubmit={(event) => next(event, 2)}>
              <div className="writing-header">
                <div>
                  <span className="mini-label">나의 생각</span>
                  <h3>{name}님은 무엇을 하고 싶나요?</h3>
                </div>
                <span className="counter">{taskOne.length}자</span>
              </div>
              <textarea
                aria-label="하고 싶은 일 작성"
                placeholder={"예) 저는 사람들의 일상을 더 편리하게 만드는 서비스를 기획하고 싶어요.\n관찰하고 아이디어를 연결할 때 즐거움을 느끼기 때문입니다."}
                value={taskOne}
                onChange={(event) => setTaskOne(event.target.value)}
                required
              />
              <div className="writing-footer">
                <span>완벽한 문장보다 솔직한 생각이면 충분해요.</span>
                <button className="primary-button compact" type="submit" disabled={!taskOne.trim()}>
                  작성 완료 <ArrowIcon />
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="feedback-screen screen">
            <div className="section-heading">
              <div>
                <p className="eyebrow">REFLECTION</p>
                <h2>{name}님의 생각을 함께 살펴봤어요.</h2>
              </div>
              <p>좋은 출발이에요. 아래 포인트를 다음 여정에 연결해보세요.</p>
            </div>
            <div className="feedback-grid">
              <article className="answer-box">
                <div className="box-title">
                  <span className="box-icon">“</span>
                  <div><small>내가 작성한 내용</small><strong>나의 진로 생각</strong></div>
                </div>
                <p>{taskOne}</p>
                <button type="button" onClick={goBack}>수정하기</button>
              </article>
              <article className="feedback-box">
                <div className="box-title">
                  <span className="box-icon mint">✦</span>
                  <div><small>생각을 넓히는</small><strong>피드백 포인트</strong></div>
                </div>
                <div className="feedback-list">
                  {feedback.map((item, index) => (
                    <div className="feedback-item" key={item.title}>
                      <span>{index + 1}</span>
                      <div><strong>{item.title}</strong><p>{item.text}</p></div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
            <div className="feedback-action">
              <p><strong>이제 생각을 행동으로 바꿔볼 차례예요.</strong><br />피드백을 참고해 구체적인 여정을 설계해볼까요?</p>
              <button className="primary-button compact" type="button" onClick={() => setStep(3)}>
                과제 2 시작하기 <ArrowIcon />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="task-layout screen">
            <aside className="task-aside task-two">
              <button className="back-button" type="button" onClick={goBack}>← 이전</button>
              <p className="eyebrow">ASSIGNMENT 02</p>
              <div className="big-number">02</div>
              <h2>목표까지의 여정을<br />구체적으로 설계하기</h2>
              <p>피드백을 바탕으로 오늘부터 시작할 수 있는 행동을 시간 순서대로 적어보세요.</p>
              <div className="route-guide">
                <span>지금</span><i /><span>경험 쌓기</span><i /><span>목표</span>
              </div>
            </aside>
            <form className="writing-card" onSubmit={(event) => next(event, 4)}>
              <div className="writing-header">
                <div>
                  <span className="mini-label">나의 실행 계획</span>
                  <h3>원하는 진로까지 어떻게 나아갈까요?</h3>
                </div>
                <span className="counter">{taskTwo.length}자</span>
              </div>
              <div className="prompt-strip">
                <span>힌트</span>
                필요한 역량 → 이번 학기 경험 → 1년 뒤 목표 순서로 적어보세요.
              </div>
              <textarea
                aria-label="진로 여정 계획 작성"
                placeholder={"예) 이번 학기에는 관련 수업을 듣고 작은 팀 프로젝트에 참여하겠습니다.\n방학에는 현직자 인터뷰를 통해 직무를 이해하고, 1년 안에 포트폴리오를 완성하겠습니다."}
                value={taskTwo}
                onChange={(event) => setTaskTwo(event.target.value)}
                required
              />
              <div className="writing-footer">
                <span>구체적인 시기와 행동이 들어가면 더 좋아요.</span>
                <button className="primary-button compact" type="submit" disabled={!taskTwo.trim()}>
                  여정 완성하기 <ArrowIcon />
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 4 && (
          <div className="rating-screen screen">
            {!finished ? (
              <>
                <div className="finish-mark">✓</div>
                <p className="eyebrow">JOURNEY COMPLETE</p>
                <h2>{name}님, 진로 여정을 완성했어요!</h2>
                <p className="rating-lead">오늘의 기록이 앞으로의 선택을 더 단단하게 만들어줄 거예요.</p>
                <form className="rating-card" onSubmit={submitSatisfaction}>
                  <h3>이번 활동은 얼마나 만족스러웠나요?</h3>
                  <p>별을 눌러 솔직한 만족도를 알려주세요.</p>
                  <div className="stars" role="radiogroup" aria-label="만족도 별점">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={rating === star}
                        aria-label={`${star}점`}
                        className={star <= (hoveredRating || rating) ? "filled" : ""}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onFocus={() => setHoveredRating(star)}
                        onBlur={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                        key={star}
                      >★</button>
                    ))}
                  </div>
                  <label htmlFor="satisfaction">더 전하고 싶은 의견이 있나요? <span>(선택)</span></label>
                  <textarea
                    id="satisfaction"
                    placeholder="좋았던 점이나 아쉬웠던 점을 자유롭게 남겨주세요."
                    value={satisfactionNote}
                    onChange={(event) => setSatisfactionNote(event.target.value)}
                  />
                  {saveError && <p className="save-error" role="alert">{saveError}</p>}
                  <button className="primary-button rating-submit" type="submit" disabled={!rating || isSaving}>
                    {isSaving ? "저장하는 중..." : "피드백 보내기"} {!isSaving && <ArrowIcon />}
                  </button>
                </form>
              </>
            ) : (
              <div className="thank-you">
                <div className="finish-mark">♥</div>
                <p className="eyebrow">THANK YOU</p>
                <h2>소중한 의견, 고마워요.</h2>
                <p>{name}님의 새로운 여정을 응원할게요.<br />오늘 세운 첫 계획부터 천천히 시작해보세요.</p>
                <button className="secondary-button" type="button" onClick={() => { setStep(0); setFinished(false); }}>
                  처음으로 돌아가기
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <footer>
        <span>나의 진로 여정</span>
        <span>생각을 기록하고, 가능성을 발견하세요.</span>
      </footer>
    </main>
  );
}
