const API_URL = 'https://api.jsonserve.com/Uw5CrX';

// Fallback questions if API fails
const FALLBACK_QUESTIONS = {
  title: "Genetics and Evolution",
  description: "Test your knowledge with 5 random questions. Each question has 30 seconds timer.",
  duration: 30, // 30 seconds per question
  negative_marks: 1.0,
  correct_answer_marks: 4.0,
  questions: [
    {
      id: 1,
      description: "If the base sequence in DNA is 5' AAAT 3' then the base sequence in mRNA is:",
      topic: "Molecular Basis Of Inheritance",
      difficulty_level: "Medium",
      options: [
        { id: 1, description: "5'UUUU3'", is_correct: false },
        { id: 2, description: "3'UUUU5'", is_correct: false },
        { id: 3, description: "5'AAAU3'", is_correct: true },
        { id: 4, description: "3'AAAU5'", is_correct: false }
      ],
      detailed_solution: "During transcription, RNA is synthesized in the 5' to 3' direction using DNA as a template. The RNA sequence is complementary to the DNA template strand, with U replacing T in RNA."
    },
    {
      id: 2,
      description: "Avery, MacLeod and McCarty used S and R strains of Streptococcus pneumoniae to identify the transforming principle. They concluded that:",
      topic: "Molecular Basis Of Inheritance",
      difficulty_level: "Medium",
      options: [
        { id: 5, description: "DNA was the transforming agent", is_correct: true },
        { id: 6, description: "RNA was the transforming agent", is_correct: false },
        { id: 7, description: "Protein was the transforming agent", is_correct: false },
        { id: 8, description: "All were transforming agents", is_correct: false }
      ],
      detailed_solution: "Through their experiments, they demonstrated that DNA was responsible for transforming non-virulent R strain bacteria into virulent S strain, proving DNA as the genetic material."
    },
    {
      id: 3,
      description: "Which nitrogenous base is not found in DNA?",
      topic: "Molecular Basis Of Inheritance",
      difficulty_level: "Easy",
      options: [
        { id: 9, description: "Adenine", is_correct: false },
        { id: 10, description: "Thymine", is_correct: false },
        { id: 11, description: "Uracil", is_correct: true },
        { id: 12, description: "Cytosine", is_correct: false }
      ],
      detailed_solution: "Uracil is found in RNA, while DNA contains Thymine instead. The other bases (Adenine, Cytosine, and Guanine) are present in both DNA and RNA."
    },
    {
      id: 4,
      description: "The process of DNA replication is:",
      topic: "Molecular Basis Of Inheritance",
      difficulty_level: "Medium",
      options: [
        { id: 13, description: "Conservative", is_correct: false },
        { id: 14, description: "Dispersive", is_correct: false },
        { id: 15, description: "Semi-conservative", is_correct: true },
        { id: 16, description: "Non-conservative", is_correct: false }
      ],
      detailed_solution: "DNA replication follows the semi-conservative model, where each new double helix contains one original strand and one newly synthesized strand."
    },
    {
      id: 5,
      description: "The enzyme DNA ligase:",
      topic: "Molecular Basis Of Inheritance",
      difficulty_level: "Medium",
      options: [
        { id: 17, description: "Breaks DNA", is_correct: false },
        { id: 18, description: "Joins Okazaki fragments", is_correct: true },
        { id: 19, description: "Adds primers", is_correct: false },
        { id: 20, description: "Removes primers", is_correct: false }
      ],
      detailed_solution: "DNA ligase is responsible for joining Okazaki fragments during DNA replication by forming phosphodiester bonds between adjacent nucleotides."
    },
    {
      id: 6,
      description: "Which of the following is responsible for packaging DNA in eukaryotic cells?",
      topic: "Molecular Basis Of Inheritance",
      difficulty_level: "Medium",
      options: [
        { id: 21, description: "Histones", is_correct: true },
        { id: 22, description: "Ribosomes", is_correct: false },
        { id: 23, description: "Centrosomes", is_correct: false },
        { id: 24, description: "Lysosomes", is_correct: false }
      ],
      detailed_solution: "Histones are proteins that package DNA into nucleosomes, helping to compact DNA in eukaryotic cells."
    },
    {
      id: 7,
      description: "The genetic code is:",
      topic: "Molecular Basis Of Inheritance",
      difficulty_level: "Medium",
      options: [
        { id: 25, description: "Ambiguous", is_correct: false },
        { id: 26, description: "Universal", is_correct: true },
        { id: 27, description: "Overlapping", is_correct: false },
        { id: 28, description: "Non-degenerate", is_correct: false }
      ],
      detailed_solution: "The genetic code is universal, meaning it is the same in most organisms with few exceptions."
    }
  ]
};

const quizService = {
  hintsRemaining: 3, // Track available hints

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  async fetchQuizData() {
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return this.processQuizData(data);

    } catch (error) {
      console.warn('API fetch failed, using fallback questions:', error);
      return this.processQuizData(FALLBACK_QUESTIONS);
    }
  },

  processQuizData(data) {
    const transformedQuestions = (data.questions || []).map(q => ({
      id: q.id,
      question: q.description || q.question,
      options: (q.options || []).map(opt => ({
        id: opt.id,
        text: opt.description || opt.text,
        isCorrect: opt.is_correct || opt.isCorrect
      })),
      explanation: q.detailed_solution || q.explanation,
      hint: q.hint || "",
      conceptualHint: q.conceptualHint || {
        topic: q.topic || "General",
        keyPoints: q.keyPoints || [],
        relatedTopics: q.relatedTopics || [],
        neetContext: q.neetContext || ""
      }
    }));

    const shuffledQuestions = this.shuffleArray(transformedQuestions)
      .slice(0, 5)
      .map(q => ({
        ...q,
        options: this.shuffleArray(q.options)
      }));

    return {
      title: data.title || "Science Quiz",
      questions: shuffledQuestions,
      timeLimit: data.duration || 30,
      passingScore: data.passing_score || 60,
      negative_marks: data.negative_marks || 1.0,
      correct_answer_marks: data.correct_answer_marks || 4.0
    };
  },

  calculateScore(answers, questions, skippedQuestions) {
    const results = {
      score: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      skipped: skippedQuestions.size,
      total: questions.length,
      averageTime: 0,
      questionResults: [],
      timeAnalysis: []
    };

    let totalTime = 0;

    questions.forEach(question => {
      const answer = answers[question.id];
      const isSkipped = skippedQuestions.has(question.id);
      const correctOption = question.options.find(opt => opt.isCorrect);
      
      if (answer) {
        totalTime += answer.timeSpent;
        results.timeAnalysis.push({
          questionNumber: results.questionResults.length + 1,
          timeSpent: answer.timeSpent
        });
      }

      const questionResult = {
        question: question.question,
        correctAnswer: correctOption.text,
        explanation: question.explanation,
        timeSpent: answer ? answer.timeSpent : (isSkipped ? 0 : 30)
      };

      if (isSkipped) {
        questionResult.status = 'skipped';
        questionResult.userAnswer = null;
      } else if (!answer) {
        questionResult.status = 'timeout';
        questionResult.userAnswer = null;
      } else if (answer.isCorrect) {
        results.score += 4;
        results.correctAnswers++;
        questionResult.status = 'correct';
        questionResult.userAnswer = question.options.find(opt => opt.id === answer.selectedId)?.text;
      } else {
        results.incorrectAnswers++;
        questionResult.status = 'incorrect';
        questionResult.userAnswer = question.options.find(opt => opt.id === answer.selectedId)?.text;
      }

      results.questionResults.push(questionResult);
    });

    const attemptedQuestions = results.correctAnswers + results.incorrectAnswers;
    results.averageTime = attemptedQuestions > 0 ? totalTime / attemptedQuestions : 0;
    results.percentage = Math.round((results.correctAnswers / results.total) * 100);
    results.passed = results.percentage >= 60;

    return results;
  },

  getQuestionHint(question) {
    if (this.hintsRemaining <= 0) {
      return {
        generalHint: null,
        conceptual: null,
        remainingHints: 0,
        error: "No hints remaining"
      };
    }

    this.hintsRemaining--;

    const hint = {
      generalHint: question.hint,
      conceptual: {
        ...question.conceptualHint,
        keyPoints: this.shuffleArray(question.conceptualHint?.keyPoints || []).slice(0, 2),
        relatedTopics: this.shuffleArray(question.conceptualHint?.relatedTopics || []).slice(0, 2)
      },
      remainingHints: this.hintsRemaining
    };

    return hint;
  },

  resetHints() {
    this.hintsRemaining = 3;
  },

  getRelatedQuestions(topic, limit = 3) {
    if (!topic) return [];

    const questions = FALLBACK_QUESTIONS.questions;
    const relatedQuestions = questions.filter(q => 
      (q.conceptualHint?.relatedTopics || []).includes(topic) ||
      (q.conceptualHint?.topic || "").includes(topic) ||
      (q.topic || "").includes(topic)
    );

    return this.shuffleArray(relatedQuestions).slice(0, limit);
  }
};

export default quizService;