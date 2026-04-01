(function () {
  const STORAGE_KEYS = {
    users: "quizUsers",
    currentUser: "quizCurrentUser",
  };

  const SCREENS = {
    start: document.getElementById("screen-start"),
    game: document.getElementById("screen-game"),
    result: document.getElementById("screen-result"),
  };

  const elements = {
    bestScore: document.getElementById("best-score"),
    bestChallenge: document.getElementById("best-challenge"),
    difficultySelect: document.getElementById("difficulty-select"),
    continentSelect: document.getElementById("continent-select"),
    themeSelect: document.getElementById("theme-select"),
    modeSelect: document.getElementById("mode-select"),
    usernameInput: document.getElementById("username-input"),
    passwordInput: document.getElementById("password-input"),
    createAccountButton: document.getElementById("create-account-button"),
    loginButton: document.getElementById("login-button"),
    resumeButton: document.getElementById("resume-button"),
    logoutButton: document.getElementById("logout-button"),
    accountStatus: document.getElementById("account-status"),
    startButton: document.getElementById("start-button"),
    startNotice: document.getElementById("start-notice"),
    gameModeTitle: document.getElementById("game-mode-title"),
    scoreValue: document.getElementById("score-value"),
    progressValue: document.getElementById("progress-value"),
    timerPill: document.getElementById("timer-pill"),
    timerValue: document.getElementById("timer-value"),
    battleBar: document.getElementById("battle-bar"),
    botMeter: document.getElementById("bot-meter"),
    botScore: document.getElementById("bot-score"),
    badgeContinent: document.getElementById("badge-continent"),
    badgeType: document.getElementById("badge-type"),
    badgeDifficulty: document.getElementById("badge-difficulty"),
    questionText: document.getElementById("question-text"),
    questionSubtext: document.getElementById("question-subtext"),
    optionsGrid: document.getElementById("options-grid"),
    hintButton: document.getElementById("hint-button"),
    hintBox: document.getElementById("hint-box"),
    feedbackBox: document.getElementById("feedback-box"),
    nextButton: document.getElementById("next-button"),
    finishButton: document.getElementById("finish-button"),
    miniMap: document.getElementById("mini-map"),
    mapCaption: document.getElementById("map-caption"),
    resultTitle: document.getElementById("result-title"),
    resultSummary: document.getElementById("result-summary"),
    finalScore: document.getElementById("final-score"),
    correctCount: document.getElementById("correct-count"),
    finalMode: document.getElementById("final-mode"),
    reviewList: document.getElementById("review-list"),
    restartButton: document.getElementById("restart-button"),
    shareButton: document.getElementById("share-button"),
  };

  const MODE_LABELS = {
    standard: "Mode standard",
    learning: "Mode apprentissage",
    challenge: "Défi 10 pays / 1 minute",
    battle: "Duel contre le bot",
  };

  const DIFFICULTY_LABELS = {
    all: "Tous niveaux",
    easy: "Facile",
    medium: "Moyen",
    hard: "Difficile",
  };

  const THEME_LABELS = {
    capitals: "Capitales",
    monuments: "Monuments",
    mixed: "Mixte",
  };

  const state = {
    score: 0,
    botScore: 0,
    questionIndex: 0,
    questions: [],
    answers: [],
    currentQuestion: null,
    hintUsed: false,
    answered: false,
    settings: null,
    timerId: null,
    timeLeft: 60,
    currentUser: null,
    selectedChoice: null,
    feedbackText: "",
    feedbackTone: "",
    hintText: "",
    autoNextId: null,
    recentQuestionKeys: [],
    questionGoal: null,
  };

  function init() {
    bindEvents();
    restoreCurrentUser();
    updateAuthUi();
  }

  function bindEvents() {
    elements.createAccountButton.addEventListener("click", createAccount);
    elements.loginButton.addEventListener("click", login);
    elements.resumeButton.addEventListener("click", resumeSavedGame);
    elements.logoutButton.addEventListener("click", logout);
    elements.startButton.addEventListener("click", startGame);
    elements.hintButton.addEventListener("click", revealHint);
    elements.nextButton.addEventListener("click", goToNextQuestion);
    elements.finishButton.addEventListener("click", finishSession);
    elements.restartButton.addEventListener("click", restart);
    elements.shareButton.addEventListener("click", shareScore);
    window.addEventListener("beforeunload", saveGameProgress);
  }

  function loadRecords() {
    const profile = getCurrentProfile();
    elements.bestScore.textContent = profile ? profile.bestScore || 0 : 0;
    elements.bestChallenge.textContent = profile ? profile.bestChallenge || 0 : 0;
  }

  function startGame() {
    if (!state.currentUser) {
      showStartNotice(
        "Crée un compte ou connecte-toi avant de commencer.",
        "error"
      );
      return;
    }

    const settings = {
      difficulty: elements.difficultySelect.value,
      continent: elements.continentSelect.value,
      theme: elements.themeSelect.value,
      mode: elements.modeSelect.value,
    };

    const basePool = buildPool(settings);
    clearStartNotice();

    if (basePool.length < 2) {
      showStartNotice(
        "Pas assez de pays pour cette combinaison. Essaie un filtre plus large.",
        "error"
      );
      return;
    }

    clearAutoNext();
    state.score = 0;
    state.botScore = 0;
    state.questionIndex = 0;
    state.answers = [];
    state.hintUsed = false;
    state.answered = false;
    state.selectedChoice = null;
    state.feedbackText = "";
    state.feedbackTone = "";
    state.hintText = "";
    state.recentQuestionKeys = [];
    state.settings = settings;
    state.questionGoal = settings.mode === "challenge" ? 10 : null;
    state.timeLeft = 60;
    state.questions = [];

    appendNextQuestion(basePool, settings);

    if (!state.questions.length) {
      showStartNotice(
        "Impossible de generer des questions avec cette selection.",
        "error"
      );
      return;
    }

    elements.feedbackBox.textContent = "";
    elements.gameModeTitle.textContent = MODE_LABELS[settings.mode];
    elements.battleBar.classList.toggle("hidden", settings.mode !== "battle");
    elements.timerPill.classList.toggle("hidden", settings.mode !== "challenge");

    if (settings.mode === "challenge") {
      startTimer();
    } else {
      clearTimer();
    }

    showScreen("game");
    renderQuestion();
    updateAuthStatus(`Session ouverte pour ${getCurrentProfile().displayName}.`, "success");
  }

  function buildPool(settings) {
    return window.QUIZ_DATA.filter((item) => {
      const matchesDifficulty =
        settings.difficulty === "all" || item.difficulty === settings.difficulty;
      const matchesContinent =
        settings.continent === "all" || item.continent === settings.continent;
      const matchesTheme =
        settings.theme !== "monuments" || Boolean(item.monument);

      return matchesDifficulty && matchesContinent && matchesTheme;
    });
  }

  function appendNextQuestion(pool, settings) {
    const nextQuestion = generateQuestion(
      pool,
      settings,
      state.recentQuestionKeys,
      state.questions.length
    );

    if (!nextQuestion) {
      return;
    }

    state.questions.push(nextQuestion);
    state.recentQuestionKeys.push(nextQuestion.key);

    const maxRecent = Math.min(8, Math.max(3, pool.length - 1));
    if (state.recentQuestionKeys.length > maxRecent) {
      state.recentQuestionKeys = state.recentQuestionKeys.slice(-maxRecent);
    }
  }

  function generateQuestion(pool, settings, recentQuestionKeys, sequenceNumber) {
    const candidates = [];

    pool.forEach((item) => {
      if (settings.theme === "capitals") {
        candidates.push({ item, type: "capital", key: `capital:${item.country}` });
        return;
      }

      if (settings.theme === "monuments") {
        if (item.monument) {
          candidates.push({ item, type: "monument", key: `monument:${item.country}` });
        }
        return;
      }

      candidates.push({ item, type: "capital", key: `capital:${item.country}` });
      if (item.monument) {
        candidates.push({ item, type: "monument", key: `monument:${item.country}` });
      }
    });

    const freshCandidates = candidates.filter(
      (candidate) => !recentQuestionKeys.includes(candidate.key)
    );
    const selectionPool = freshCandidates.length ? freshCandidates : candidates;
    const picked = selectionPool[Math.floor(Math.random() * selectionPool.length)];

    if (!picked) {
      return null;
    }

    return {
      id: `${picked.item.country}-${picked.type}-${sequenceNumber}`,
      key: picked.key,
      item: picked.item,
      type: picked.type,
      prompt: buildPrompt(picked.type, picked.item),
      answer: picked.item.country,
      options: buildOptions(pool, picked.item),
    };
  }

  function buildPrompt(type, item) {
    if (type === "monument") {
      return `Dans quel pays se trouve ${item.monument} ?`;
    }

    return `Quel pays a pour capitale ${item.capital} ?`;
  }

  function buildOptions(pool, item) {
    const localPool = pool.filter((entry) => entry.country !== item.country);
    const globalFallback = window.QUIZ_DATA.filter(
      (entry) =>
        entry.country !== item.country &&
        !localPool.some((candidate) => candidate.country === entry.country)
    );

    const distractors = shuffle([...localPool, ...globalFallback])
      .slice(0, 3)
      .map((entry) => entry.country);

    return shuffle([item.country, ...distractors]);
  }

  function renderQuestion() {
    state.currentQuestion = state.questions[state.questionIndex];
    if (!state.currentQuestion) {
      endGame();
      return;
    }

    if (!state.answered) {
      state.hintUsed = false;
      state.selectedChoice = null;
      state.feedbackText = "";
      state.feedbackTone = "";
      state.hintText = "";
    }

    const { item, type, prompt, options } = state.currentQuestion;
    const progressLabel = state.questionGoal
      ? `${state.questionIndex + 1} / ${state.questionGoal}`
      : `${state.questionIndex + 1} / infini`;

    elements.scoreValue.textContent = state.score;
    elements.progressValue.textContent = progressLabel;
    elements.badgeContinent.textContent = item.continent;
    elements.badgeType.textContent = THEME_LABELS[type === "capital" ? "capitals" : "monuments"];
    elements.badgeDifficulty.textContent = DIFFICULTY_LABELS[item.difficulty];
    elements.questionText.textContent = prompt;
    elements.questionSubtext.textContent =
      state.settings.mode === "learning"
        ? "Observe la reponse, puis profite du fait culturel pour retenir plus vite."
        : "Choisis un pays dans les propositions ou clique directement sur la mini-carte.";

    elements.optionsGrid.innerHTML = "";
    elements.feedbackBox.textContent = "";
    elements.feedbackBox.className = "feedback-box";
    elements.hintBox.textContent = "";
    elements.hintBox.classList.add("hidden");
    elements.nextButton.classList.add("hidden");
    elements.hintButton.disabled = false;
    elements.mapCaption.textContent = "Clique sur un pays";

    options.forEach((country) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-button";
      button.textContent = country;
      button.addEventListener("click", () => submitAnswer(country));
      elements.optionsGrid.appendChild(button);
    });

    renderMap(options);

    if (state.settings.mode === "battle") {
      updateBotMeter();
    }

    if (state.settings.mode === "challenge") {
      elements.timerValue.textContent = `${state.timeLeft}s`;
    }

    restoreQuestionUi();
    saveGameProgress();
  }

  function renderMap(optionCountries) {
    elements.miniMap.innerHTML = "";

    const glow = document.createElement("div");
    glow.className = "map-glow";
    elements.miniMap.appendChild(glow);

    optionCountries.forEach((country) => {
      const place = window.QUIZ_DATA.find((entry) => entry.country === country);
      const pin = document.createElement("button");
      pin.type = "button";
      pin.className = "map-pin";
      pin.style.left = `${place.x}%`;
      pin.style.top = `${place.y}%`;
      pin.innerHTML = `<span></span><small>${country}</small>`;
      pin.addEventListener("click", () => submitAnswer(country));
      elements.miniMap.appendChild(pin);
    });
  }

  function revealHint() {
    if (!state.currentQuestion || state.hintUsed || state.answered) {
      return;
    }

    state.hintUsed = true;
    const { item, type } = state.currentQuestion;
    const answerLead = item.country.charAt(0);
    const hintText =
      type === "monument"
        ? `${item.hint} Le nom du pays commence par ${answerLead}.`
        : `${item.hint} La reponse commence par ${answerLead}.`;

    state.hintText = hintText;
    elements.hintBox.textContent = hintText;
    elements.hintBox.classList.remove("hidden");
    elements.hintButton.disabled = true;
    saveGameProgress();
  }

  function submitAnswer(choice) {
    if (state.answered || !state.currentQuestion) {
      return;
    }

    clearAutoNext();
    state.answered = true;
    state.selectedChoice = choice;
    const isCorrect = choice === state.currentQuestion.answer;
    const earnedPoints = computePoints(isCorrect);

    state.score += earnedPoints;
    if (state.settings.mode === "battle") {
      simulateBotRound();
    }

    state.answers.push({
      prompt: state.currentQuestion.prompt,
      answer: state.currentQuestion.answer,
      selected: choice,
      fact: state.currentQuestion.item.fact,
      capital: state.currentQuestion.item.capital,
      monument: state.currentQuestion.item.monument,
      isCorrect,
    });

    markOptions(choice);

    const feedback = isCorrect
      ? `Bonne reponse. +${earnedPoints} points. ${state.currentQuestion.item.fact}`
      : `Incorrect. La bonne reponse etait ${state.currentQuestion.answer}. Capitale : ${state.currentQuestion.item.capital}. ${state.currentQuestion.item.fact}`;

    state.feedbackText =
      state.settings.mode === "learning"
        ? `${feedback} Astuce memoire : associe ${state.currentQuestion.item.country} a ${state.currentQuestion.item.capital}.`
        : feedback;
    state.feedbackTone = isCorrect ? "success" : "error";

    elements.scoreValue.textContent = state.score;
    elements.feedbackBox.textContent = state.feedbackText;
    elements.feedbackBox.classList.add(state.feedbackTone);
    elements.mapCaption.textContent = isCorrect ? "Trajet valide" : "Destination corrigee";
    elements.hintButton.disabled = true;

    saveGameProgress();

    if (shouldFinishGame()) {
      setTimeout(endGame, 1200);
      return;
    }

    elements.nextButton.classList.remove("hidden");

    if (state.settings.mode !== "learning") {
      state.autoNextId = window.setTimeout(() => {
        if (state.settings.mode !== "challenge" && state.answered) {
          goToNextQuestion();
        }
      }, 1800);
    }
  }

  function computePoints(isCorrect) {
    if (!isCorrect) {
      return 0;
    }

    const base = state.currentQuestion.item.difficulty === "hard"
      ? 18
      : state.currentQuestion.item.difficulty === "medium"
        ? 14
        : 10;

    return state.hintUsed ? Math.max(4, base - 4) : base;
  }

  function simulateBotRound() {
    const luck = Math.random();
    if (luck > 0.35) {
      state.botScore += 10;
    }
    updateBotMeter();
  }

  function updateBotMeter() {
    elements.botScore.textContent = state.botScore;
    const total = Math.max(state.botScore, state.score, 10);
    const percent = Math.min(100, Math.round((state.botScore / total) * 100));
    elements.botMeter.style.width = `${percent}%`;
  }

  function markOptions(choice) {
    const buttons = elements.optionsGrid.querySelectorAll(".option-button");
    buttons.forEach((button) => {
      button.disabled = true;
      if (button.textContent === state.currentQuestion.answer) {
        button.classList.add("correct");
      } else if (button.textContent === choice) {
        button.classList.add("wrong");
      }
    });

    const pins = elements.miniMap.querySelectorAll(".map-pin");
    pins.forEach((pin) => {
      pin.disabled = true;
      const label = pin.querySelector("small").textContent;
      if (label === state.currentQuestion.answer) {
        pin.classList.add("correct");
      } else if (label === choice) {
        pin.classList.add("wrong");
      }
    });
  }

  function goToNextQuestion() {
    if (!state.answered) {
      return;
    }

    clearAutoNext();
    state.questionIndex += 1;

    if (state.questionGoal && state.questionIndex >= state.questionGoal) {
      endGame();
      return;
    }

    if (state.questionIndex >= state.questions.length) {
      appendNextQuestion(buildPool(state.settings), state.settings);
    }

    state.answered = false;
    renderQuestion();
  }

  function startTimer() {
    clearTimer();
    elements.timerValue.textContent = `${state.timeLeft}s`;
    state.timerId = window.setInterval(() => {
      state.timeLeft -= 1;
      elements.timerValue.textContent = `${state.timeLeft}s`;
      saveGameProgress();
      if (state.timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function clearTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function shouldFinishGame() {
    return Boolean(
      state.questionGoal && state.questionIndex >= state.questionGoal - 1
    );
  }

  function endGame() {
    clearTimer();
    clearAutoNext();
    updateRecords();
    clearSavedGame();

    const correctAnswers = state.answers.filter((entry) => entry.isCorrect).length;
    const battleResult =
      state.settings.mode === "battle"
        ? state.score > state.botScore
          ? "Victoire contre le bot"
          : state.score === state.botScore
            ? "Egalite contre le bot"
            : "Le bot prend l'avantage"
        : "";

    elements.resultTitle.textContent = battleResult || "Ton voyage se termine ici";
    elements.resultSummary.textContent = buildResultSummary(correctAnswers, battleResult);
    elements.finalScore.textContent = state.score;
    elements.correctCount.textContent = `${correctAnswers} / ${state.answers.length}`;
    elements.finalMode.textContent = MODE_LABELS[state.settings.mode];
    renderReview();
    showScreen("result");
  }

  function buildResultSummary(correctAnswers, battleResult) {
    const base = `${correctAnswers} bonnes reponses, ${state.score} points, parcours ${THEME_LABELS[state.settings.theme]}.`;
    if (state.settings.mode === "challenge") {
      return `${base} Temps ecoule ou serie terminee en mode defi.`;
    }
    if (battleResult) {
      return `${base} ${battleResult}. Score bot : ${state.botScore}.`;
    }
    return base;
  }

  function updateRecords() {
    updateCurrentProfile((profile) => {
      const nextProfile = { ...profile };
      nextProfile.bestScore = Math.max(profile.bestScore || 0, state.score);
      if (state.settings.mode === "challenge") {
        nextProfile.bestChallenge = Math.max(
          profile.bestChallenge || 0,
          state.score
        );
      }
      return nextProfile;
    });
    loadRecords();
  }

  function renderReview() {
    elements.reviewList.innerHTML = "";

    state.answers.forEach((entry, index) => {
      const reviewCard = document.createElement("article");
      reviewCard.className = `review-card ${entry.isCorrect ? "review-correct" : "review-wrong"}`;
      reviewCard.innerHTML = `
        <div class="review-top">
          <span>Question ${index + 1}</span>
          <strong>${entry.isCorrect ? "Correct" : "A revoir"}</strong>
        </div>
        <h3>${entry.prompt}</h3>
        <p>Ta reponse : ${entry.selected || "Aucune"}</p>
        <p>Bonne reponse : ${entry.answer}</p>
        <p>Capitale : ${entry.capital}</p>
        <p>${entry.fact}</p>
      `;
      elements.reviewList.appendChild(reviewCard);
    });
  }

  function shareScore() {
    const shareText = `J'ai marque ${state.score} points sur Cap sur le Quiz en ${MODE_LABELS[state.settings.mode].toLowerCase()}.`;

    if (navigator.share) {
      navigator.share({
        title: "Cap sur le Quiz",
        text: shareText,
      });
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(() => {
        elements.resultSummary.textContent = `${elements.resultSummary.textContent} Score copie dans le presse-papiers.`;
      });
    }
  }

  function restart() {
    clearTimer();
    clearAutoNext();
    showScreen("start");
  }

  function finishSession() {
    if (!state.questions.length) {
      showScreen("start");
      return;
    }

    endGame();
  }

  function createAccount() {
    const credentials = getCredentials();
    if (!credentials) {
      return;
    }

    const users = getUsers();
    if (users[credentials.key]) {
      updateAuthStatus(
        "Ce nom d'utilisateur existe déjà. Connecte-toi à la place.",
        "error"
      );
      return;
    }

    users[credentials.key] = {
      displayName: credentials.displayName,
      passwordHash: hashPassword(credentials.password),
      bestScore: 0,
      bestChallenge: 0,
      savedGame: null,
    };
    setUsers(users);
    setCurrentUser(credentials.key);
    updateAuthUi();
    updateAuthStatus(
      `Compte créé. Bienvenue ${credentials.displayName}.`,
      "success"
    );
    clearStartNotice();
  }

  function login() {
    const credentials = getCredentials();
    if (!credentials) {
      return;
    }

    const profile = getUsers()[credentials.key];
    if (!profile || profile.passwordHash !== hashPassword(credentials.password)) {
      updateAuthStatus("Identifiants invalides.", "error");
      return;
    }

    setCurrentUser(credentials.key);
    updateAuthUi();
    updateAuthStatus(
      `Connexion réussie. Bonjour ${profile.displayName}.`,
      "success"
    );
    clearStartNotice();
  }

  function logout() {
    clearTimer();
    clearAutoNext();
    state.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.currentUser);
    updateAuthUi();
    updateAuthStatus("Déconnecté. Reconnecte-toi pour reprendre ou lancer une partie.");
    showScreen("start");
  }

  function resumeSavedGame() {
    const profile = getCurrentProfile();
    if (!profile || !profile.savedGame) {
      updateAuthStatus("Aucune partie sauvegardée pour ce compte.", "error");
      return;
    }

    restoreGame(profile.savedGame);
    updateAuthStatus("Partie restaurée.", "success");
  }

  function restoreGame(snapshot) {
    clearTimer();
    clearAutoNext();

    state.score = snapshot.score || 0;
    state.botScore = snapshot.botScore || 0;
    state.questionIndex = snapshot.questionIndex || 0;
    state.questions = snapshot.questions || [];
    state.answers = snapshot.answers || [];
    state.settings = snapshot.settings || null;
    state.timeLeft = snapshot.timeLeft || 60;
    state.hintUsed = Boolean(snapshot.hintUsed);
    state.answered = Boolean(snapshot.answered);
    state.selectedChoice = snapshot.selectedChoice || null;
    state.feedbackText = snapshot.feedbackText || "";
    state.feedbackTone = snapshot.feedbackTone || "";
    state.hintText = snapshot.hintText || "";
    state.recentQuestionKeys = snapshot.recentQuestionKeys || [];
    state.questionGoal = snapshot.questionGoal || null;

    if (!state.settings || !state.questions.length) {
      clearSavedGame();
      updateAuthStatus("La sauvegarde était incomplète. Elle a été supprimée.", "error");
      return;
    }

    elements.gameModeTitle.textContent = MODE_LABELS[state.settings.mode];
    elements.battleBar.classList.toggle("hidden", state.settings.mode !== "battle");
    elements.timerPill.classList.toggle("hidden", state.settings.mode !== "challenge");

    showScreen("game");
    renderQuestion();

    if (state.settings.mode === "challenge" && !state.answered && state.timeLeft > 0) {
      startTimer();
    }
  }

  function restoreCurrentUser() {
    const savedUser = localStorage.getItem(STORAGE_KEYS.currentUser);
    const users = getUsers();
    if (savedUser && users[savedUser]) {
      state.currentUser = savedUser;
    }
  }

  function updateAuthUi() {
    const profile = getCurrentProfile();
    const hasSavedGame = Boolean(profile && profile.savedGame);

    loadRecords();
    elements.startButton.disabled = !profile;
    elements.resumeButton.classList.toggle("hidden", !hasSavedGame);
    elements.logoutButton.classList.toggle("hidden", !profile);
    elements.usernameInput.value = profile ? profile.displayName : "";
    elements.passwordInput.value = "";

    if (!profile) {
      updateAuthStatus(
        "Connecte-toi pour lancer une partie et sauvegarder ta progression."
      );
      return;
    }

    if (hasSavedGame) {
      updateAuthStatus(
        `${profile.displayName} est connecté. Une partie sauvegardée est prête à reprendre.`
      );
      return;
    }

    updateAuthStatus(`${profile.displayName} est connecté. Tu peux démarrer une nouvelle partie.`);
  }

  function updateAuthStatus(message, tone) {
    elements.accountStatus.textContent = message;
    elements.accountStatus.className = "feedback-box";
    if (tone) {
      elements.accountStatus.classList.add(tone);
    }
  }

  function showStartNotice(message, tone) {
    elements.startNotice.textContent = message;
    elements.startNotice.className = "feedback-box";
    if (tone) {
      elements.startNotice.classList.add(tone);
    }
  }

  function clearStartNotice() {
    elements.startNotice.textContent = "";
    elements.startNotice.className = "feedback-box hidden";
  }

  function getCredentials() {
    const displayName = elements.usernameInput.value.trim();
    const password = elements.passwordInput.value.trim();

    if (displayName.length < 3) {
      updateAuthStatus(
        "Le nom d'utilisateur doit contenir au moins 3 caractères.",
        "error"
      );
      return null;
    }

    if (password.length < 4) {
      updateAuthStatus(
        "Le mot de passe doit contenir au moins 4 caractères.",
        "error"
      );
      return null;
    }

    return {
      key: displayName.toLowerCase(),
      displayName,
      password,
    };
  }

  function saveGameProgress() {
    if (!state.currentUser || !state.settings || !state.questions.length) {
      return;
    }

    updateCurrentProfile((profile) => ({
      ...profile,
      savedGame: {
        score: state.score,
        botScore: state.botScore,
        questionIndex: state.questionIndex,
        questions: state.questions,
        answers: state.answers,
        settings: state.settings,
        timeLeft: state.timeLeft,
        hintUsed: state.hintUsed,
        answered: state.answered,
        selectedChoice: state.selectedChoice,
        feedbackText: state.feedbackText,
        feedbackTone: state.feedbackTone,
        hintText: state.hintText,
        recentQuestionKeys: state.recentQuestionKeys,
        questionGoal: state.questionGoal,
      },
    }));

    updateAuthUi();
  }

  function clearSavedGame() {
    if (!state.currentUser) {
      return;
    }

    updateCurrentProfile((profile) => ({
      ...profile,
      savedGame: null,
    }));
    updateAuthUi();
  }

  function restoreQuestionUi() {
    if (state.hintUsed && state.hintText) {
      elements.hintBox.textContent = state.hintText;
      elements.hintBox.classList.remove("hidden");
      elements.hintButton.disabled = true;
    }

    if (state.feedbackText) {
      elements.feedbackBox.textContent = state.feedbackText;
      if (state.feedbackTone) {
        elements.feedbackBox.classList.add(state.feedbackTone);
      }
    }

    if (!state.answered || !state.selectedChoice) {
      return;
    }

    markOptions(state.selectedChoice);
    elements.hintButton.disabled = true;
    if (!shouldFinishGame()) {
      elements.nextButton.classList.remove("hidden");
    }
  }

  function clearAutoNext() {
    if (state.autoNextId) {
      clearTimeout(state.autoNextId);
      state.autoNextId = null;
    }
  }

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || "{}");
    } catch (error) {
      return {};
    }
  }

  function setUsers(users) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }

  function setCurrentUser(username) {
    state.currentUser = username;
    localStorage.setItem(STORAGE_KEYS.currentUser, username);
  }

  function getCurrentProfile() {
    if (!state.currentUser) {
      return null;
    }

    return getUsers()[state.currentUser] || null;
  }

  function updateCurrentProfile(updater) {
    if (!state.currentUser) {
      return;
    }

    const users = getUsers();
    const currentProfile = users[state.currentUser];
    if (!currentProfile) {
      return;
    }

    users[state.currentUser] = updater(currentProfile);
    setUsers(users);
  }

  function hashPassword(password) {
    let hash = 0;
    for (let index = 0; index < password.length; index += 1) {
      hash = (hash * 31 + password.charCodeAt(index)) >>> 0;
    }
    return String(hash);
  }

  function showScreen(screenName) {
    Object.entries(SCREENS).forEach(([name, screen]) => {
      screen.classList.toggle("active", name === screenName);
    });
  }

  function shuffle(array) {
    for (let index = array.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
    }
    return array;
  }

  init();
})();