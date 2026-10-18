import type { AxisId } from "../types";
import type { AxisEn } from "../i18n";

/** PLACEBO 7軸の英訳。letter・内部ID・英名(en)は日本語のデータが持つ。 */
export const axesEn: Record<AxisId, AxisEn> = {
  PS: {
    short: "Perceptual",
    lead: "What comes to be seen anew?",
    publicText:
      "Can it make us grasp the familiar anew, through a way of seeing we had not noticed?",
    definition:
      "For a specified audience and context, the work of a device that lets taken-for-granted uses, roles, attention, classifications, or relations be grasped anew in a different outline.",
    levels: [
      "Reception mostly stays within ordinary use, attention, classification, and relations; there is almost no device that establishes another concrete way of grasping the subject.",
      "There is surprise or a shift of attention, but any other way of grasping the subject is faint and stays within its ordinary handling.",
      "Another concrete way of seeing the subject is established. One reading is added to the ordinary way of grasping it.",
      "A moment in which the ordinary way of grasping is suspended and the subject is received again in a different outline arises from concrete experience.",
      "The experience of grasping the subject anew in a different outline is the core of the project, and its concrete devices can explain why the subject can no longer be fully received through its conventional handling alone.",
    ],
    boundary: [
      "Do not raise the score for the difficulty of the ideas, the scale of the issue addressed, or the intensity of the stimulus. Separate the fact that a bodily action changed from the interpretation that the way the subject is seen changed. Quiet shifts in perception can also merit a high score.",
    ],
    keep: "What subject, ordinarily treated in what way, emerges as what, through which change of conditions?",
    distinct: [
      "Whereas Coherence reads “the connection leading there,” Perceptual Shift reads “the different outline that emerges.”",
    ],
  },
  PL: {
    short: "Ludic",
    lead: "What is enjoyable about the way of engaging itself?",
    publicText:
      "Is there play in the process itself, not just in the intended result?",
    definition:
      "The work of letting people enjoy not only the attainment of results but the very process of trying, make-believe, maneuvering, and toying.",
    levels: [
      "Practical achievement or ordinary interaction is central; there is almost no engagement as play.",
      "There are small playful accents, but they are not central to how one engages.",
      "Play is established in which specific trials, make-believe, pranks, or the like are enjoyed as a process.",
      "Ways of trying, reinterpreting, maneuvering, and the like form an important part of the experience, and the process itself can be enjoyed.",
      "Play sustains the project, and the process itself stands strongly on its own as a purpose for engaging.",
    ],
    boundary: [
      "Do not count comfort or enjoyment in general as play. Bodily manipulation, multiple ways of playing, and long stays are not required. Make-believe with a single image also counts. Do not deduct merely because there are practical benefits or rewards.",
      "The rename to Ludic Quality is a change of label only. It does not narrow the range of play that was read under Playfulness, nor score only specialized forms of play highly.",
    ],
    keep: "What is it about trying, make-believe, or maneuvering that has become enjoyable in itself?",
    distinct: [
      "Engagement Pull reads the motive to engage; Ludic Quality reads the play in the process. A service with low Ludic Quality can still work as a FLIP.",
    ],
  },
  AG: {
    short: "Agency",
    lead: "How far does the audience itself become the one who makes things happen?",
    publicText:
      "Within the device as built, what can the audience itself set in motion?",
    definition:
      "The extent to which the actions, judgments, and bodies of the audience primarily being evaluated are built into the device in a role that makes the experience happen or moves outcomes or a shared situation.",
    levels: [
      "Witnessing events or a fixed presentation is central. No individual role of judging or acting is assigned to the audience.",
      "The role of forming one’s own reading or judgment is central to the presentation. However, that judgment does not change the presentation or the outcome.",
      "Carrying out set conditions with one’s body or actions is necessary for one’s own experience to happen. Discretion to choose or change outcomes or the shared situation is limited.",
      "One’s own choices and inputs concretely change individual outcomes or the content presented. This includes individual exploration results and adding answers to a shared surface.",
      "One’s own choices and actions act directly on the state, use, or allocation of something shared with others, becoming a role that moves a situation others must also take on.",
    ],
    boundary: [
      "A stage definition specific to this archive. It does not measure the audience’s personal initiative, immersion, empathy, or how much an issue feels like “their own.” Do not give a 2 merely because “all viewing involves interpretation”; check whether the presentation centers a role of judging.",
    ],
    keep: "What can the audience judge, choose, or carry out? Depending on that difference, what changes in their own experience, the outcome, or the situation shared with others?",
    distinct: [
      "Do not separate 4 and 5 solely by how widely the added content is made public. At 5, discretion over a shared object—using, altering, or competing for it—becomes the main act. Do not convert automatically from the level of Bottom-up Emergence or the amount of bodily movement.",
      "These stages are a convention for reading the role of involvement, not a ranking in which more physical participation makes a better work. There are strong FLIPs that work through viewing alone.",
    ],
  },
  CO: {
    short: "Coherence",
    lead: "How unified are the device and the seeing anew?",
    publicText:
      "Are the invitation into the experience, the action, and the seeing anew joined by a single device?",
    definition:
      "The degree to which the reasons the audience is drawn in, their actual actions and perceptions, and the way the subject comes to be seen anew are bound together by the same device.",
    levels: [
      "The device that draws people in and the meaning or question explained afterward are almost entirely separate.",
      "It deals with the same subject matter, but the connection between experience and seeing anew is supplied mainly by added explanation.",
      "Part of the entry point or the action concretely contributes to an experience of touching another way of seeing.",
      "The main rules, materials, and actions support both the motive and the seeing anew. Reaching the different outline still requires one further step of connection through attention, judgment, or backstory.",
      "Conditions for touching a different outline of the subject are built into the very main action one undertakes for the reason one was drawn in, making the device and the seeing anew hard to separate.",
    ],
    boundary: [
      "Does not demand uniqueness in the sense that “it could never work any other way.” Nor is this an axis for scoring efficiency, formal beauty, or how neatly the author’s intent is resolved. Do not deduct merely because explanation exists for learning the rules or origins.",
    ],
    keep: "Wanting to do what, by doing what, does one come to touch which different outline?",
    distinct: [
      "Do not carry over the Perceptual Shift score. “A strong seeing anew with one step of connection remaining” and “a small seeing anew reached directly” can coexist. Record reasons for 4 vs. 5 as an editorial boundary judgment.",
      "5 does not mean “everyone reaches the same conclusion.” Because the difference between 4 and 5 also depends on what was specified as the subject to be seen anew, do not change the subject midway to raise the score.",
    ],
  },
  EP: {
    short: "Engagement",
    lead: "Why does one want to engage?",
    publicText: "Why does one want to engage, past the effort and the unease?",
    definition:
      "The degree to which the project’s devices establish reasons for the intended audience to engage of their own accord, set against the time, effort, cost, and anxiety they bear.",
    levels: [
      "There is almost no reason to engage voluntarily; it relies mainly on obligation, instruction, or support for the author.",
      "There is a trigger for interest, but the reason to take on the main burdens and engage is weak.",
      "A concrete motive and entry point are established. Yet at key points of the required involvement, the motive remains weak relative to the burden.",
      "Project-specific motives are strong, and there is a path to taking on the main burdens and engaging. Friction still remains between the appeal and the conditions.",
      "What one wants to gain or find out consistently sustains the required involvement, establishing a strong reason to choose it voluntarily, main burdens included.",
    ],
    boundary: [
      "Do not decide by instant legibility, being free, prize money, fame, or attendance figures alone. The motive may become established after learning the necessary explanation. Do not narrow the audience, after scoring, to only enthusiastic, successful participants.",
    ],
    keep: "Who is drawn to what, takes on which burdens, and has reason to do what?",
    distinct: [
      "Ludic Quality is the play in the process of engaging. Since anticipation of play can also be a reason to engage, do not separate the two simply as “before / after participation.”",
    ],
  },
  EM: {
    short: "Emergence",
    lead: "What next developments arise from participation?",
    publicText:
      "From present engagement, do developments the author has not fully determined arise and lead to what comes next?",
    definition:
      "The degree to which content, developments, or relationships not individually determined by the author arise from the inputs of audiences or the environment, and feed back into the conditions of further involvement.",
    levels: [
      "Contact with a fixed form, image, or record is central; inputs do not update content or conditions of involvement.",
      "Reactions or environmental inputs change the presentation or development on the spot, but are hardly carried over into subsequent content or conditions.",
      "Different content, conversations, or outcomes arise from inputs and remain or accumulate. Their effect in changing subsequent conditions is limited.",
      "Earlier inputs and choices concretely change the conditions or options for the next actions of later participants or of the same person.",
      "Chains of updates give rise to roles, cooperative relationships, secondary goals, and the like not individually specified by the author, which in turn reshape how people engage.",
    ],
    boundary: [
      "A working term within this archive that inherits the function of the former “Generativity.” It is not a scale for certifying emergence in the academic sense; content generation and state updates from inputs are included in the lower stages. Do not raise the score on comment counts, press coverage, amounts of randomness, or cooperation with upkeep alone.",
      "The qualifier Bottom-up indicates that content and developments arise from individual acts of involvement. Weak authorial control and large numbers of participants are not made new scoring requirements.",
    ],
    keep: "Whose input of what changes what, and how does it return to whose next options or roles?",
    distinct: [
      "Agency asks what function the audience is made to bear. Bottom-up Emergence asks what arises after that input and how it returns to what comes next. Self-sustaining operation or the author’s absence is not a necessary condition.",
    ],
  },
  OR: {
    short: "Originality",
    lead: "What did it invent, relative to prior examples?",
    publicText:
      "Compared with prior examples, what did the finished device newly make possible?",
    definition:
      "The degree to which, compared with relevant prior examples at the time of release, there is a meaningful, distinctive invention or recombination in how the device or experience is brought about.",
    levels: [
      "Uses the central device of the prior examples checked almost as is.",
      "There are changes in material, name, place, or the like, but the central experience of involvement is nearly the same.",
      "A meaningful experiential difference arises through recombining existing devices or making new connections.",
      "While sharing a basic framework with prior examples, it brings about a central experience or interaction not found within the range compared.",
      "Comparison with the relevant body of prior examples can account for it as a distinctive invention of the very central method by which the experience is brought about.",
    ],
    boundary: [
      "Finding no precedent in a search, the author’s own claims, and later fame are not evidence for a high score. If comparative material is insufficient, leave it unrated. Do not push it down to a middle score merely because a higher stage cannot be proven.",
    ],
    keep: "What is shared with the prior examples compared, what differs, and what experience changed because of that difference?",
    distinct: [
      "Coherence concerns connections internal to the project; Originality concerns comparison with prior examples. Even a known method can have high Coherence.",
    ],
  },
};
