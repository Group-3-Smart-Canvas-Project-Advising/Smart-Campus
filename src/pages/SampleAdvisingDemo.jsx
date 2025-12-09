import React, { useState } from "react";
import { OSU_CS_PLAN, CODE_TO_COURSE } from "/src/pages/osucatalog.js";

/** ---------------- SAMPLE STUDENT PROFILE ------------------ */

const SAMPLE_PROFILE = {
  name: "Sample Student",
  major: "Computer Science",
  completedCourses: [
    { code: "CS 1113", name: "Intro to Computer Programming" },
    { code: "MATH 1513", name: "College Algebra" },
    { code: "ENGL 1113", name: "Freshman Composition I" },
    { code: "POLS 1113", name: "American Government" },
    { code: "CS 2114", name: "Object-Oriented Programming" },
    { code: "MATH 2144", name: "Calculus I" },
    { code: "CS 2133", name: "Computer Organization & Architecture" },
    { code: "PHYS 2014", name: "General Physics I" },
    { code: "STAT 2013", name: "Elements of Statistics" },
    { code: "CS 3000", name: "Special Topics: Project Lab" },
    { code: "HIST 1103", name: "Survey of American History" },
    { code: "CS 2253", name: "Discrete Structures" },
    { code: "SPCH 2713", name: "Intro to Speech Communication" },
    { code: "UNIV 1111", name: "First-Year Seminar" },
    { code: "CS 0001", name: "Orientation to Computing" },
  ],
};

// set of completed codes used for flow & prereqs
const SAMPLE_COMPLETED_CODES = new Set(
  SAMPLE_PROFILE.completedCourses.map((c) => c.code)
);

/** ----------------- DECISION TREE MODEL -------------------- */

const RECOMMENDER_TREE = {
  question: "workload",
  branches: {
    light: {
      question: "learningStyle",
      branches: {
        visual: {
          recommend: ["CS 4243", "CS 3723", "CS 3443"],
        },
        "hands-on": {
          recommend: ["CS 4273", "CS 3443", "CS 4433"],
        },
        default: {
          recommend: ["CS 3443", "CS 4433"],
        },
      },
    },
    medium: {
      question: "learningStyle",
      branches: {
        visual: {
          question: "groupWork",
          branches: {
            love: {
              recommend: ["CS 4243", "CS 4273", "CS 4433", "CS 3443"],
            },
            dislike: {
              recommend: ["CS 4243", "CS 4433", "CS 3443"],
            },
            default: {
              recommend: ["CS 4243", "CS 3443", "CS 4433"],
            },
          },
        },
        "hands-on": {
          question: "groupWork",
          branches: {
            love: {
              recommend: ["CS 4273", "CS 4523", "CS 3443", "CS 4433"],
            },
            default: {
              recommend: ["CS 3443", "CS 4323", "CS 4433", "CS 4273"],
            },
          },
        },
        default: {
          recommend: ["CS 3443", "CS 4323", "CS 4433", "CS 4273"],
        },
      },
    },
    heavy: {
      question: "learningStyle",
      branches: {
        visual: {
          recommend: [
            "CS 3443",
            "CS 4243",
            "CS 4433",
            "CS 4273",
            "CS 4323",
            "CS 4523",
          ],
        },
        "hands-on": {
          recommend: [
            "CS 3443",
            "CS 4273",
            "CS 4323",
            "CS 4433",
            "CS 4523",
            "CS 4983",
          ],
        },
        default: {
          recommend: [
            "CS 3443",
            "CS 4323",
            "CS 4433",
            "CS 4273",
            "CS 4523",
            "CS 4983",
          ],
        },
      },
    },
    default: {
      recommend: ["CS 3443", "CS 4433"],
    },
  },
};

function runDecisionTree(node, answers) {
  if (!node) return [];
  if (node.recommend) return node.recommend;

  const value = answers[node.question];
  const branch = node.branches?.[value] || node.branches?.default;
  if (!branch) return [];
  return runDecisionTree(branch, answers);
}

/** ----------------- REASONS & RECOMMENDER ------------------ */

function buildReason(course, answers) {
  const { learningStyle, groupWork, workload, careerGoal } = answers;
  const tags = new Set(course.tags || []);
  const sentences = [];

  // 1) Core vs elective framing
  if (course.category?.startsWith("core")) {
    sentences.push(
      "This course is part of the core OSU Computer Science curriculum, so it directly moves you toward finishing the major."
    );
  } else if (course.category === "elective") {
    sentences.push(
      "This course counts as an approved CS elective, letting you shape the degree around your interests."
    );
  }

  // 2) Learning style alignment
  if (learningStyle === "visual" && ["graphics", "visual", "xr"].some((t) => tags.has(t))) {
    sentences.push(
      "The material is very visual (graphics / UI / XR oriented), which lines up with your visual learning preference."
    );
  }

  if (learningStyle === "hands-on" && ["project", "mobile", "games", "internship", "cloud"].some((t) => tags.has(t))) {
    sentences.push(
      "It’s built around projects and applied work, which fits your preference for hands-on learning."
    );
  }

  if (learningStyle === "independent" && !["team", "project"].some((t) => tags.has(t))) {
    sentences.push(
      "Most of the work is individual rather than group-based, which matches your independent learning style."
    );
  }

  if (learningStyle === "theory" && ["theory", "math-heavy", "numerical", "ai-ml"].some((t) => tags.has(t))) {
    sentences.push(
      "The content is math-heavy / theoretical, which supports your interest in the theory side of CS."
    );
  }

  // 3) Group-work preference
  if (groupWork === "love" && ["team", "project", "capstone"].some((t) => tags.has(t))) {
    sentences.push(
      "It includes substantial team-based project work, which fits your preference for collaborative classes."
    );
  }

  if (groupWork === "dislike" && !["team", "project"].some((t) => tags.has(t))) {
    sentences.push(
      "It focuses more on individual assignments than large group projects, which matches your preference to work solo."
    );
  }

  // 4) Career goal alignment
  const goal = (careerGoal || "").toLowerCase();

  if (goal.includes("security") && ["security"].some((t) => tags.has(t))) {
    sentences.push(
      "The topics are directly related to cybersecurity, which you mentioned as a career interest."
    );
  }

  if ((goal.includes("ai") || goal.includes("machine")) && ["ai-ml"].some((t) => tags.has(t))) {
    sentences.push(
      "It builds core AI / machine-learning skills that support your long-term goal in that area."
    );
  }

  if (goal.includes("game") && ["games"].some((t) => tags.has(t))) {
    sentences.push(
      "It focuses on game development, which aligns with your interest in working on games."
    );
  }

  if (goal.includes("mobile") && ["mobile"].some((t) => tags.has(t))) {
    sentences.push(
      "It targets mobile app development, matching your interest in mobile / app-based careers."
    );
  }

  if (goal.includes("backend") && ["databases", "cloud", "systems"].some((t) => tags.has(t))) {
    sentences.push(
      "It strengthens backend / infrastructure skills like databases, systems, or cloud computing."
    );
  }

  // 5) Workload fit
  if (workload === "light") {
    sentences.push(
      "Given that you prefer a lighter workload, this course is a reasonable addition without overloading your schedule."
    );
  } else if (workload === "medium") {
    sentences.push(
      "It fits well into a steady, medium-load semester with a balanced amount of work."
    );
  } else if (workload === "heavy") {
    sentences.push(
      "Because you’re comfortable with a heavier load, this course helps you make faster progress through the degree."
    );
  }

  if (sentences.length === 0) {
    return "This course fits naturally into your progress toward the OSU CS degree.";
  }

  // Join into one explanation paragraph
  return sentences.join(" ");
}


function prereqsSatisfied(course, completedSet) {
  return (course.prereqs || []).every((p) => completedSet.has(p));
}

function planNextCourses(answers, completedCodesFromProfile) {
  const completedSet = new Set(completedCodesFromProfile || []);

  const eligible = OSU_CS_PLAN.filter(
    (c) => !completedSet.has(c.code) && prereqsSatisfied(c, completedSet)
  );

  const treeCodes = runDecisionTree(RECOMMENDER_TREE, answers);

  const treePreferred = [];
  const used = new Set();

  for (const code of treeCodes) {
    const course = CODE_TO_COURSE.get(code);
    if (course && eligible.includes(course) && !used.has(course.code)) {
      treePreferred.push(course);
      used.add(course.code);
    }
  }

  const goal = (answers.careerGoal || "").toLowerCase();
  const prefLearning = answers.learningStyle;
  const prefGroup = answers.groupWork;

  function scoreElective(c) {
    if (c.category !== "elective") return -100;
    if (used.has(c.code)) return -100;

    let score = 0;
    const tags = new Set(c.tags || []);

    if (prefLearning === "visual" && ["graphics", "visual", "xr"].some((t) => tags.has(t))) score += 3;
    if (prefLearning === "hands-on" && ["project", "mobile", "games", "internship", "cloud"].some((t) => tags.has(t))) score += 3;
    if (prefLearning === "independent" && !["team", "project"].some((t) => tags.has(t))) score += 2;

    if (prefGroup === "love" && ["team", "project", "capstone"].some((t) => tags.has(t))) score += 2;
    if (prefGroup === "dislike" && !["team", "project"].some((t) => tags.has(t))) score += 1;

    if (goal.includes("security") && ["security"].some((t) => tags.has(t))) score += 4;
    if ((goal.includes("ai") || goal.includes("machine")) && ["ai-ml"].some((t) => tags.has(t))) score += 4;
    if (goal.includes("game") && ["games"].some((t) => tags.has(t))) score += 4;
    if (goal.includes("mobile") && ["mobile"].some((t) => tags.has(t))) score += 4;
    if (goal.includes("backend") && ["databases", "cloud", "systems"].some((t) => tags.has(t))) score += 3;

    return score;
  }

  const extraElectives = eligible
    .filter((c) => !used.has(c.code) && c.category === "elective")
    .map((c) => ({ course: c, score: scoreElective(c) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.course);

  const otherCore = eligible.filter(
    (c) => !used.has(c.code) && c.category !== "elective"
  );

  const ordered = [...treePreferred, ...extraElectives, ...otherCore];

  let total;
  switch (answers.workload) {
    case "light":
      total = Math.min(2, ordered.length);
      break;
    case "heavy":
      total = Math.min(6, ordered.length);
      break;
    case "medium":
    default:
      total = Math.min(4, ordered.length);
      break;
  }

  const chosen = ordered.slice(0, total).map((course) => ({
    ...course,
    reason: buildReason(course, answers),
  }));

  const half = Math.ceil(chosen.length / 2);

  return {
    nextTerm: chosen.slice(0, half),
    followingTerm: chosen.slice(half),
  };
}

/** ------------------ COMPONENT & STYLES --------------------- */

const SampleAdvisingDemo = () => {
  const [major, setMajor] = useState("cs");
  const [learningStyle, setLearningStyle] = useState("");
  const [workload, setWorkload] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [groupWork, setGroupWork] = useState("");
  const [plan, setPlan] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const answers = {
      major,
      learningStyle,
      workload,
      careerGoal,
      groupWork,
    };

    const completedCodes = Array.from(SAMPLE_COMPLETED_CODES);
    const coursePlan = planNextCourses(answers, completedCodes);

    setPlan({
      answers,
      coursePlan,
      profile: SAMPLE_PROFILE,
    });
  };

  // ---------- shared styles to match OSU / primary theme ----------
  const pageStyle = {
    minHeight: "100vh",
    background: "#f5f5f5",
    padding: "2rem 1rem",
    display: "flex",
    justifyContent: "center",
  };

  const cardStyle = {
    background: "white",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "1000px",
    padding: "2rem 2.5rem",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    border: "1px solid #e5e5e5",
  };

  const labelStyle = {
    fontSize: "0.95rem",
    fontWeight: 600,
    paddingBottom: "4px",
    color: "#333",
  };

  const selectStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    background: "white",
    color: "#333",
    fontSize: "1rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    background: "white",
    color: "#333",
    fontSize: "1rem",
  };

  const orangeButton = {
    padding: "0.75rem 1.6rem",
    borderRadius: "28px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(90deg, #f97316, #ea580c, #c2410c)",
    color: "white",
    fontSize: "1.05rem",
    fontWeight: 600,
    marginTop: "1rem",
    width: "100%",
  };

  const chipStyle = {
    borderRadius: "999px",
    border: "1px solid #e5e5e5",
    padding: "0.35rem 0.8rem",
    fontSize: "0.85rem",
    background: "#ffffff",
    color: "#444",
  };

  const nodeBase = {
    borderRadius: "12px",
    padding: "0.6rem 0.9rem",
    border: "1px solid #fed7aa",
    fontSize: "0.9rem",
    minWidth: "260px",
    maxWidth: "100%",
    textAlign: "left",
  };

  const nodeCompleted = {
    ...nodeBase,
    background: "#fff7ed",
    color: "#5b3410",
  };

  const nodeUpcoming = {
    ...nodeBase,
    background: "#ffffff",
    color: "#5b3410",
  };

  const nodeHeaderCode = {
    color: "#b45309",
    fontWeight: 700,
  };

  const arrowDown = {
    fontSize: "1.4rem",
    color: "#b45309",
    margin: "0.3rem 0",
  };

  const explanationBox = {
  padding: "0.85rem 1rem",
  borderRadius: "12px",
  background: "#fffdfa",
  border: "1px solid #facc15",   // ✅ correct
};


  // degree completion stats for progress bar
  const completedDegreeCoursesCount = OSU_CS_PLAN.filter((c) =>
  SAMPLE_COMPLETED_CODES.has(c.code)
).length;
const totalDegreeCourses = OSU_CS_PLAN.length;

  const completionPercent = Math.round(
    (completedDegreeCoursesCount / totalDegreeCourses) * 100
  );

  const recommendedCodes =
    plan == null
      ? new Set()
      : new Set(
          [...plan.coursePlan.nextTerm, ...plan.coursePlan.followingTerm].map(
            (c) => c.code
          )
        );

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {/* Header */}
        <h1
          style={{
            fontSize: "1.9rem",
            marginBottom: "6px",
            textAlign: "center",
            color: "#c2410c",
          }}
        >
          Advising Demo Survey
        </h1>
        <p
          style={{
            marginBottom: "1.8rem",
            color: "#555",
            fontSize: "0.98rem",
            textAlign: "center",
          }}
        >
          This example uses a sample student who has already completed 15
          classes. Your answers help the system suggest the next steps in their
          degree flow, and the chart shows an example route to graduation.
        </p>

        {/* Survey Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.4rem",
            marginBottom: "2rem",
          }}
        >
          {/* Major */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Intended Major</label>
            <select
              style={selectStyle}
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              required
            >
              <option value="cs">Computer Science</option>
              <option value="business" disabled>
                Business (demo profile is CS)
              </option>
              <option value="undecided" disabled>
                Undecided (demo profile is CS)
              </option>
            </select>
          </div>

          {/* Career Goal */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Career Goal (optional)</label>
            <input
              style={inputStyle}
              type="text"
              placeholder="e.g., Software Engineer, Data Analyst, UX Designer"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
            />
          </div>

          {/* Learning Style */}
          <div>
            <label style={labelStyle}>Learning Style</label>
            <select
              style={selectStyle}
              value={learningStyle}
              onChange={(e) => setLearningStyle(e.target.value)}
              required
            >
              <option value="">Select...</option>
              <option value="visual">Visual</option>
              <option value="hands-on">Hands-on / project-based</option>
              <option value="independent">Independent / self-paced</option>
            </select>
          </div>

          {/* Group Work */}
          <div>
            <label style={labelStyle}>Group Work Preference</label>
            <select
              style={selectStyle}
              value={groupWork}
              onChange={(e) => setGroupWork(e.target.value)}
              required
            >
              <option value="">Select...</option>
              <option value="love">I enjoy group projects</option>
              <option value="neutral">Neutral</option>
              <option value="dislike">I prefer working solo</option>
            </select>
          </div>

          {/* Workload */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Preferred Workload</label>
            <select
              style={selectStyle}
              value={workload}
              onChange={(e) => setWorkload(e.target.value)}
              required
            >
              <option value="">Select...</option>
              <option value="light">Light (focus on balance / adjustment)</option>
              <option value="medium">Medium (steady)</option>
              <option value="heavy">Heavy (fast-track)</option>
            </select>
          </div>

          {/* Submit Button */}
          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" style={orangeButton}>
              Generate Recommendations
            </button>
          </div>
        </form>

        {/* SAMPLE PROFILE + PROGRESS BAR */}
        <div
          style={{
            marginBottom: "2rem",
            padding: "1rem 1.2rem",
            borderRadius: "12px",
            background: "#fafafa",
            border: "1px solid #e5e5e5",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: "0.4rem",
              fontSize: "1.1rem",
              color: "#b45309",
            }}
          >
            Sample Student Profile
          </h2>

          <p style={{ margin: 0, fontSize: "0.92rem", color: "#555" }}>
            {SAMPLE_PROFILE.name} – {SAMPLE_PROFILE.major} major with{" "}
            {SAMPLE_PROFILE.completedCourses.length} courses completed.
          </p>

          <div style={{ marginTop: "0.75rem", marginBottom: "0.4rem" }}>
            <div
              style={{
                width: "100%",
                height: "10px",
                borderRadius: "999px",
                background: "#e5e7eb",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: "inherit",
                  background:
                    "linear-gradient(90deg, #f97316, #ea580c, #c2410c)",
                  width: `${Math.max(8, completionPercent)}%`,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <div
              style={{
                marginTop: "0.3rem",
                fontSize: "0.85rem",
                color: "#6b7280",
              }}
            >
              {completedDegreeCoursesCount} of {totalDegreeCourses} core CS
              courses in this sample flow completed ({completionPercent}%)
            </div>
          </div>

          <div
            style={{
              marginTop: "0.4rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4rem",
              justifyContent: "center",
            }}
          >
            {SAMPLE_PROFILE.completedCourses.map((c) => (
              <span key={c.code} style={chipStyle}>
                {c.code}
              </span>
            ))}
          </div>
        </div>

        {/* FULL VERTICAL FLOW */}
        {plan && (
          <div>
            <h2
              style={{
                fontSize: "1.4rem",
                marginBottom: "0.4rem",
                color: "#b45309",
                textAlign: "center",
              }}
            >
               Graduation Path (Sample)
            </h2>
            <p
              style={{
                textAlign: "center",
                fontSize: "0.92rem",
                color: "#555",
                marginBottom: "1.3rem",
              }}
            >
              Completed classes are lightly filled. Upcoming classes stay
              outlined. Courses marked “Next up” are suggested based on this
              survey.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.3rem",
                marginBottom: "1.8rem",
              }}
            >
              {OSU_CS_PLAN.map((course, index) => {
                const isCompleted = SAMPLE_COMPLETED_CODES.has(course.code);
                const isRecommended = recommendedCodes.has(course.code);
                const styleNode = isCompleted ? nodeCompleted : nodeUpcoming;

                return (
                  <React.Fragment key={course.code}>
                    <div style={styleNode}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "0.75rem",
                          marginBottom: course.prereqs?.length ? 4 : 0,
                        }}
                      >
                        <span>
                          <span style={nodeHeaderCode}>{course.code}</span>
                          {": "}
                          {course.name}
                        </span>
                        {isRecommended && (
                          <span
                            style={{
                              borderRadius: "999px",
                              padding: "0.15rem 0.6rem",
                              fontSize: "0.75rem",
                              background:
                                "linear-gradient(90deg, #f97316, #ea580c)",
                              color: "white",
                              fontWeight: 600,
                            }}
                          >
                            Next up
                          </span>
                        )}
                      </div>
                      {course.prereqs && course.prereqs.length > 0 && (
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#6b7280",
                          }}
                        >
                          Prerequisite
                          {course.prereqs.length > 1 ? "s" : ""}:{" "}
                          {course.prereqs.join(", ")}
                        </div>
                      )}
                    </div>

                    {index < OSU_CS_PLAN.length - 1 && (
                      <div style={arrowDown}>⬇</div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <h3
              style={{
                fontSize: "1.1rem",
                marginBottom: "0.6rem",
                color: "#444",
              }}
            >
              Why these next classes fit this student
            </h3>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#555",
                marginBottom: "0.6rem",
              }}
            >
              Below are short explanations describing how each recommended class
              supports the student’s interests, learning preferences, and
              long-term goals.
            </p>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              {[...plan.coursePlan.nextTerm, ...plan.coursePlan.followingTerm].map(
                (course) => (
                  <div key={course.code} style={explanationBox}>
                    <strong style={{ color: "#7c2d12" }}>
                      {course.code} – {course.name}
                    </strong>
                    <p
                      style={{
                        margin: "0.25rem 0 0",
                        fontSize: "0.92rem",
                        color: "#444",
                      }}
                    >
                      {course.reason}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * CORE_SEQUENCE is used for “what should come next” suggestions.
 * It reuses upper-level courses from the plan.
 */
const CORE_SEQUENCE = OSU_CS_PLAN.filter((c) => c.focus);

/** ------------- REASONS / MATCH EXPLANATIONS ------------- */






const OSU_CATALOG = [
  // Core / Required (simplified example)
  { code:"CS 1113", name:"Computer Science I", prereqs: [] },
  { code:"CS 2133", name:"Computer Science II", prereqs:["CS 1113"] },
  { code:"CS 2253", name:"Discrete Structures", prereqs:["MATH 1513"] },
  { code:"CS 3443", name:"Data Structures & Algorithms", prereqs:["CS 2133","CS 2253"] },
  { code:"CS 3613", name:"Operating Systems", prereqs:["CS 3443"] },
  // etc. add more core classes based on curriculum...

  // Electives / Optional CS courses
  { code:"CS 2433", name:"C/C++ Programming", prereqs:["CS 1113"] },
  { code:"CS 4153", name:"Mobile Applications Development", prereqs:["CS 2133","CS 2433"] },
  { code:"CS 4243", name:"Introduction to Computer Security", prereqs:["CS 3443"] },
  { code:"CS 4173", name:"Video Game Development", prereqs:["CS 2133","CS 2433","MATH 2144"] },
  { code:"CS 4433", name:"Introduction to Database Systems", prereqs:["CS 2133"] },
  { code:"CS 4523", name:"Cloud Computing & Distributed Systems", prereqs:["CS 3443","CS 3353"] },
  { code:"CS 4793", name:"Artificial Intelligence I", prereqs:["CS 3353"] },
  { code:"CS 3030", name:"Industrial Practice", prereqs:["CS 3443","MATH 2144"] },
  { code:"CS 3570", name:"Special Problems in CS", prereqs:[] },  // independent-study elective
  // ... add more electives as needed
];

export default SampleAdvisingDemo;
