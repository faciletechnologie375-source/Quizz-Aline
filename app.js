(function () {
  const STORAGE_KEYS = {
    users: "quizUsers",
    currentUser: "quizCurrentUser",
  };

  const ONLINE_LEADERBOARD = {
    enabled: Boolean(window.QUIZ_ONLINE_CONFIG && window.QUIZ_ONLINE_CONFIG.enabled),
    serviceUrl: (window.QUIZ_ONLINE_CONFIG && window.QUIZ_ONLINE_CONFIG.serviceUrl) || "",
    anonKey: (window.QUIZ_ONLINE_CONFIG && window.QUIZ_ONLINE_CONFIG.anonKey) || "",
    table: (window.QUIZ_ONLINE_CONFIG && window.QUIZ_ONLINE_CONFIG.table) || "quiz_leaderboard",
  };

  const ONLINE_ACCOUNTS = {
    enabled: Boolean(
      window.QUIZ_ONLINE_CONFIG &&
      (window.QUIZ_ONLINE_CONFIG.accountsEnabled !== undefined
        ? window.QUIZ_ONLINE_CONFIG.accountsEnabled
        : window.QUIZ_ONLINE_CONFIG.enabled)
    ),
    serviceUrl: (window.QUIZ_ONLINE_CONFIG && window.QUIZ_ONLINE_CONFIG.serviceUrl) || "",
    anonKey: (window.QUIZ_ONLINE_CONFIG && window.QUIZ_ONLINE_CONFIG.anonKey) || "",
    table: (window.QUIZ_ONLINE_CONFIG && window.QUIZ_ONLINE_CONFIG.accountsTable) || "quiz_accounts",
  };

  const GLOBAL_COUNTRIES_API =
    "https://restcountries.com/v3.1/all?fields=name,translations,capital,continents,latlng,population,cca2";

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
    resetScoreButton: document.getElementById("reset-score-button"),
    logoutButton: document.getElementById("logout-button"),
    accountStatus: document.getElementById("account-status"),
    startButton: document.getElementById("start-button"),
    startNotice: document.getElementById("start-notice"),
    uniqueCounter: document.getElementById("unique-counter"),
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
    flagImage: document.getElementById("flag-image"),
    flagCaption: document.getElementById("flag-caption"),
    optionsGrid: document.getElementById("options-grid"),
    hintButton: document.getElementById("hint-button"),
    skipButton: document.getElementById("skip-button"),
    pauseButton: document.getElementById("pause-button"),
    hintBox: document.getElementById("hint-box"),
    feedbackBox: document.getElementById("feedback-box"),
    nextButton: document.getElementById("next-button"),
    finishButton: document.getElementById("finish-button"),
    pauseOverlay: document.getElementById("pause-overlay"),
    resumePlayButton: document.getElementById("resume-play-button"),
    pauseFinishButton: document.getElementById("pause-finish-button"),
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
    leaderboardList: document.getElementById("leaderboard-list"),
    historyList: document.getElementById("history-list"),
    leaderboardListResult: document.getElementById("leaderboard-list-result"),
    historyListResult: document.getElementById("history-list-result"),
    leaderboardModeFilter: document.getElementById("leaderboard-mode-filter"),
    leaderboardModeFilterResult: document.getElementById("leaderboard-mode-filter-result"),
    leaderboardRefreshButton: document.getElementById("leaderboard-refresh-button"),
    leaderboardRefreshButtonResult: document.getElementById("leaderboard-refresh-button-result"),
    leaderboardCloudStatus: document.getElementById("leaderboard-cloud-status"),
    leaderboardCloudStatusResult: document.getElementById("leaderboard-cloud-status-result"),
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

  const COUNTRY_CODES = {
    "afrique du sud": "za",
    algerie: "dz",
    allemagne: "de",
    "arabie saoudite": "sa",
    argentine: "ar",
    australie: "au",
    autriche: "at",
    belgique: "be",
    bolivie: "bo",
    bresil: "br",
    canada: "ca",
    chili: "cl",
    chine: "cn",
    colombie: "co",
    "coree du sud": "kr",
    "costa rica": "cr",
    cuba: "cu",
    danemark: "dk",
    egypte: "eg",
    equateur: "ec",
    espagne: "es",
    "etats-unis": "us",
    fidji: "fj",
    france: "fr",
    ghana: "gh",
    grece: "gr",
    guatemala: "gt",
    hongrie: "hu",
    inde: "in",
    indonesie: "id",
    irlande: "ie",
    "iles salomon": "sb",
    islande: "is",
    italie: "it",
    jamaique: "jm",
    japon: "jp",
    kazakhstan: "kz",
    kenya: "ke",
    luxembourg: "lu",
    madagascar: "mg",
    maroc: "ma",
    mexique: "mx",
    norvege: "no",
    "nouvelle-zelande": "nz",
    panama: "pa",
    paraguay: "py",
    "papouasie-nouvelle-guinee": "pg",
    perou: "pe",
    philippines: "ph",
    pologne: "pl",
    portugal: "pt",
    "republique tcheque": "cz",
    "royaume-uni": "gb",
    samoa: "ws",
    senegal: "sn",
    singapour: "sg",
    suisse: "ch",
    tanzanie: "tz",
    thailande: "th",
    tunisie: "tn",
    tonga: "to",
    turquie: "tr",
    ukraine: "ua",
    uruguay: "uy",
    vanuatu: "vu",
    vietnam: "vn",
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
    usedQuestionKeys: [],
    questionGoal: null,
    questionStats: {},
    questionQueue: [],
    paused: false,
    audioContext: null,
    dataset: [],
    datasetLoading: false,
    datasetLoaded: false,
    onlineLeaderboard: [],
    onlinePollId: null,
    onlineStatus: "offline",
    leaderboardModeFilter: "all",
    onlineAccountsStatus: "offline",
    accountSyncId: null,
  };

  function init() {
    bindEvents();
    restoreCurrentUser();
    updateAuthUi();
    renderDashboard();
    preloadGlobalDataset();
    startOnlineLeaderboardSync();
    syncCurrentUserToOnlineLeaderboard();
    syncCurrentUserFromOnlineLeaderboard();
  }

  function bindEvents() {
    elements.createAccountButton.addEventListener("click", createAccount);
    elements.loginButton.addEventListener("click", login);
    elements.resumeButton.addEventListener("click", resumeSavedGame);
    elements.resetScoreButton.addEventListener("click", resetProgress);
    elements.logoutButton.addEventListener("click", logout);
    elements.startButton.addEventListener("click", startGame);
    elements.hintButton.addEventListener("click", revealHint);
    elements.skipButton.addEventListener("click", skipQuestion);
    elements.pauseButton.addEventListener("click", togglePause);
    elements.resumePlayButton.addEventListener("click", togglePause);
    elements.pauseFinishButton.addEventListener("click", finishSession);
    elements.nextButton.addEventListener("click", goToNextQuestion);
    elements.finishButton.addEventListener("click", finishSession);
    elements.restartButton.addEventListener("click", restart);
    elements.shareButton.addEventListener("click", shareScore);
    if (elements.leaderboardModeFilter) {
      elements.leaderboardModeFilter.addEventListener("change", onLeaderboardModeChange);
    }
    if (elements.leaderboardModeFilterResult) {
      elements.leaderboardModeFilterResult.addEventListener("change", onLeaderboardModeChange);
    }
    if (elements.leaderboardRefreshButton) {
      elements.leaderboardRefreshButton.addEventListener("click", refreshLeaderboardNow);
    }
    if (elements.leaderboardRefreshButtonResult) {
      elements.leaderboardRefreshButtonResult.addEventListener("click", refreshLeaderboardNow);
    }
    elements.difficultySelect.addEventListener("change", updateUniqueCounterPreview);
    elements.continentSelect.addEventListener("change", updateUniqueCounterPreview);
    elements.themeSelect.addEventListener("change", updateUniqueCounterPreview);
    elements.modeSelect.addEventListener("change", updateUniqueCounterPreview);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", saveGameProgress);
    updateUniqueCounterPreview();
  }

  function updateUniqueCounterPreview() {
    if (state.datasetLoading && !state.datasetLoaded) {
      elements.uniqueCounter.textContent = "Chargement de la base mondiale des pays...";
      return;
    }

    const settings = {
      difficulty: elements.difficultySelect.value,
      continent: elements.continentSelect.value,
      theme: elements.themeSelect.value,
      mode: elements.modeSelect.value,
    };

    const pool = buildPool(settings);
    const queueSize = buildQuestionQueue(pool, settings).length;

    if (!queueSize) {
      elements.uniqueCounter.textContent = "Questions uniques disponibles : 0. Elargis les filtres.";
      return;
    }

    if (settings.mode === "challenge") {
      const label =
        queueSize >= 10
          ? `Questions uniques disponibles : ${queueSize}. Le mode défi utilisera 10 questions sans répétition.`
          : `Questions uniques disponibles : ${queueSize}. Il faut au moins 10 pour lancer le mode défi.`;
      elements.uniqueCounter.textContent = label;
      return;
    }

    elements.uniqueCounter.textContent = `Questions uniques disponibles : ${queueSize}. Aucune répétition dans la session tant qu'il reste des questions inédites.`;
  }

  function onLeaderboardModeChange(event) {
    state.leaderboardModeFilter = event.target.value || "all";
    syncLeaderboardFilterInputs();
    renderLeaderboard();
  }

  function syncLeaderboardFilterInputs() {
    if (elements.leaderboardModeFilter && elements.leaderboardModeFilter.value !== state.leaderboardModeFilter) {
      elements.leaderboardModeFilter.value = state.leaderboardModeFilter;
    }
    if (
      elements.leaderboardModeFilterResult &&
      elements.leaderboardModeFilterResult.value !== state.leaderboardModeFilter
    ) {
      elements.leaderboardModeFilterResult.value = state.leaderboardModeFilter;
    }
  }

  function refreshLeaderboardNow() {
    fetchOnlineLeaderboard(true);
  }

  function onVisibilityChange() {
    if (document.visibilityState === "visible") {
      syncCurrentUserToOnlineLeaderboard();
      fetchOnlineLeaderboard(true);
    }
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
    state.usedQuestionKeys = [];
    state.questionStats = {};
    state.settings = settings;
    state.questionGoal = null;
    state.questionQueue = buildQuestionQueue(basePool, settings);

    if (settings.mode === "challenge" && state.questionQueue.length < 10) {
      showStartNotice(
        "Pas assez de questions uniques pour le mode défi (10). Elargis les filtres.",
        "error"
      );
      return;
    }

    state.questionGoal = settings.mode === "challenge" ? 10 : null;
    state.timeLeft = 60;
    state.paused = false;
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
    elements.gameModeTitle.textContent = buildSessionLabel(settings);
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
    return getDataset().filter((item) => {
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
    if (!state.questionQueue.length) {
      state.questionQueue = buildQuestionQueue(
        pool,
        settings,
        new Set(state.usedQuestionKeys)
      );
    }

    const nextSeed = state.questionQueue.shift();
    const sequenceNumber = state.questions.length;

    if (!nextSeed) {
      return;
    }

    const nextQuestion = {
      id: `${nextSeed.item.country}-${nextSeed.type}-${sequenceNumber}`,
      key: nextSeed.key,
      item: nextSeed.item,
      type: nextSeed.type,
      prompt: buildPrompt(nextSeed.type, nextSeed.item),
      answer: nextSeed.item.country,
      options: buildOptions(pool, nextSeed.item),
    };

    if (!nextQuestion) {
      return;
    }

    state.questions.push(nextQuestion);
    state.recentQuestionKeys.push(nextQuestion.key);
    state.usedQuestionKeys.push(nextQuestion.key);
    state.questionStats[nextQuestion.key] = (state.questionStats[nextQuestion.key] || 0) + 1;

    const maxRecent = Math.min(8, Math.max(3, pool.length - 1));
    if (state.recentQuestionKeys.length > maxRecent) {
      state.recentQuestionKeys = state.recentQuestionKeys.slice(-maxRecent);
    }
  }

  function buildQuestionQueue(pool, settings, excludedKeys) {
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
      candidates.push({ item, type: "flag", key: `flag:${item.country}` });
      candidates.push({ item, type: "fact", key: `fact:${item.country}` });
      candidates.push({ item, type: "hint", key: `hint:${item.country}` });
      if (item.monument) {
        candidates.push({ item, type: "monument", key: `monument:${item.country}` });
      }
    });

    const filteredCandidates = excludedKeys
      ? candidates.filter((candidate) => !excludedKeys.has(candidate.key))
      : candidates;

    return shuffle(filteredCandidates);
  }

  function generateQuestion(pool, settings, recentQuestionKeys, questionStats, sequenceNumber) {
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
    const minSeenCount = Math.min(
      ...selectionPool.map((candidate) => questionStats[candidate.key] || 0)
    );
    const balancedPool = selectionPool.filter(
      (candidate) => (questionStats[candidate.key] || 0) === minSeenCount
    );
    const picked = balancedPool[Math.floor(Math.random() * balancedPool.length)];

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

    if (type === "flag") {
      return "Quel pays correspond à ce drapeau ?";
    }

    if (type === "fact") {
      return `Quel pays correspond à cet indice : ${item.fact}`;
    }

    if (type === "hint") {
      return `Quel pays est visé par cet indice : ${item.hint}`;
    }

    return `Quel pays a pour capitale ${item.capital} ?`;
  }

  function buildSessionLabel(settings) {
    return `${MODE_LABELS[settings.mode]} · ${THEME_LABELS[settings.theme]}`;
  }

  function buildThemeSubtext() {
    if (state.settings.theme === "capitals") {
      return "Parcours 100% capitales : identifie le pays à partir de sa capitale.";
    }

    if (state.settings.theme === "monuments") {
      return "Parcours 100% monuments : associe chaque monument emblématique à son pays.";
    }

    return state.settings.mode === "learning"
      ? "Observe la reponse, puis profite du fait culturel pour retenir plus vite."
      : "Parcours mixte : alterne entre capitales et monuments, avec carte interactive.";
  }

  function buildOptions(pool, item) {
    const localPool = pool.filter((entry) => entry.country !== item.country);
    const globalFallback = getDataset().filter(
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
    elements.badgeType.textContent = getQuestionTypeLabel(type);
    elements.badgeDifficulty.textContent = DIFFICULTY_LABELS[item.difficulty];
    elements.questionText.textContent = prompt;
    elements.questionSubtext.textContent = buildThemeSubtext();
    renderFlagVisual(item, type);

    elements.optionsGrid.innerHTML = "";
    elements.feedbackBox.textContent = "";
    elements.feedbackBox.className = "feedback-box";
    elements.hintBox.textContent = "";
    elements.hintBox.classList.add("hidden");
    elements.nextButton.classList.add("hidden");
    elements.hintButton.disabled = false;
    elements.skipButton.disabled = false;
    elements.mapCaption.textContent = "Clique sur un pays";
    elements.pauseButton.textContent = state.paused ? "Reprendre" : "Pause";

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
    applyPausedUi();
    saveGameProgress();
  }

  function renderMap(optionCountries) {
    elements.miniMap.innerHTML = "";

    const glow = document.createElement("div");
    glow.className = "map-glow";
    elements.miniMap.appendChild(glow);

    optionCountries.forEach((country) => {
      const place = getDataset().find((entry) => entry.country === country);
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

  function renderFlagVisual(item, type) {
    const countryCode = (item.countryCode || getCountryCode(item.country) || "").toLowerCase();
    if (!countryCode) {
      elements.flagImage.classList.add("hidden");
      elements.flagCaption.textContent = `Pays cible : ${item.country}`;
      return;
    }

    elements.flagImage.classList.remove("hidden");
    elements.flagImage.src = `https://flagcdn.com/w160/${countryCode}.png`;
    elements.flagImage.alt = `Drapeau de ${item.country}`;
    elements.flagCaption.textContent =
      type === "monument"
        ? `Monument : ${item.monument}`
        : type === "flag"
          ? "Indice : observe le drapeau"
          : type === "fact"
            ? "Indice : fait culturel"
            : type === "hint"
              ? "Indice : aide contextuelle"
        : `Capitale : ${item.capital}`;
  }

  function getQuestionTypeLabel(type) {
    if (type === "monument") {
      return "Monuments";
    }
    if (type === "flag") {
      return "Drapeaux";
    }
    if (type === "fact") {
      return "Faits";
    }
    if (type === "hint") {
      return "Indices";
    }
    return "Capitales";
  }

  function getCountryCode(country) {
    return COUNTRY_CODES[normalizeCountryKey(country)] || null;
  }

  function normalizeCountryKey(country) {
    return country
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/œ/g, "oe")
      .replace(/æ/g, "ae")
      .replace(/[^a-z\- ]/g, "")
      .trim();
  }

  function revealHint() {
    if (!state.currentQuestion || state.hintUsed || state.answered || state.paused) {
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
    if (state.answered || !state.currentQuestion || state.paused) {
      return;
    }

    clearAutoNext();
    state.answered = true;
    state.selectedChoice = choice;
    const isCorrect = choice === state.currentQuestion.answer;
    const earnedPoints = computePoints(isCorrect);
    playFeedbackSound(isCorrect);

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

    if (isCorrect) {
      state.autoNextId = window.setTimeout(() => {
        if (state.answered && !state.paused) {
          goToNextQuestion();
        }
      }, 1200);
      return;
    }

    elements.nextButton.classList.remove("hidden");
  }

  function skipQuestion() {
    if (!state.currentQuestion || state.answered || state.paused) {
      return;
    }

    clearAutoNext();
    state.answered = true;
    state.selectedChoice = "Passée";
    state.feedbackText = `Question passée. La bonne réponse était ${state.currentQuestion.answer}. Capitale : ${state.currentQuestion.item.capital}. ${state.currentQuestion.item.fact}`;
    state.feedbackTone = "error";
    playFeedbackSound(false);

    state.answers.push({
      prompt: state.currentQuestion.prompt,
      answer: state.currentQuestion.answer,
      selected: "Passée",
      fact: state.currentQuestion.item.fact,
      capital: state.currentQuestion.item.capital,
      monument: state.currentQuestion.item.monument,
      isCorrect: false,
    });

    markOptions("Passée");
    elements.feedbackBox.textContent = state.feedbackText;
    elements.feedbackBox.classList.add(state.feedbackTone);
    elements.hintButton.disabled = true;
    elements.skipButton.disabled = true;
    elements.mapCaption.textContent = "Question sautée";
    saveGameProgress();

    if (shouldFinishGame()) {
      setTimeout(endGame, 1200);
      return;
    }

    elements.nextButton.classList.remove("hidden");
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
    if (!state.answered || state.paused) {
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
      if (state.paused) {
        return;
      }
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

  function togglePause() {
    if (!state.settings || !state.currentQuestion) {
      return;
    }

    state.paused = !state.paused;
    elements.pauseButton.textContent = state.paused ? "Reprendre" : "Pause";

    if (state.paused) {
      clearAutoNext();
      state.feedbackText = state.feedbackText || "Partie en pause. Reprends quand tu veux.";
      if (!state.feedbackTone) {
        state.feedbackTone = "";
      }
    }

    applyPausedUi();
    saveGameProgress();
  }

  function applyPausedUi() {
    const optionButtons = elements.optionsGrid.querySelectorAll(".option-button");
    const pins = elements.miniMap.querySelectorAll(".map-pin");
    const shouldLock = state.paused;

    optionButtons.forEach((button) => {
      button.disabled = shouldLock || state.answered;
    });

    pins.forEach((pin) => {
      pin.disabled = shouldLock || state.answered;
    });

    if (!state.answered) {
      elements.hintButton.disabled = shouldLock || state.hintUsed;
      elements.skipButton.disabled = shouldLock;
    }

    elements.nextButton.disabled = shouldLock;
    elements.pauseOverlay.classList.toggle("hidden", !state.paused);

    if (state.paused) {
      elements.feedbackBox.textContent = "Partie en pause. Clique sur Reprendre pour continuer.";
      elements.feedbackBox.className = "feedback-box";
    } else if (state.feedbackText) {
      elements.feedbackBox.textContent = state.feedbackText;
      elements.feedbackBox.className = "feedback-box";
      if (state.feedbackTone) {
        elements.feedbackBox.classList.add(state.feedbackTone);
      }
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
    const correctAnswers = state.answers.filter((entry) => entry.isCorrect).length;
    appendHistory(correctAnswers);
    updateRecords();
    clearSavedGame();
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
    elements.finalMode.textContent = buildSessionLabel(state.settings);
    renderReview();
    renderDashboard();
    showScreen("result");
  }

  function appendHistory(correctAnswers) {
    updateCurrentProfile((profile) => {
      const history = Array.isArray(profile.history) ? [...profile.history] : [];
      history.unshift({
        date: new Date().toISOString(),
        mode: state.settings.mode,
        theme: state.settings.theme,
        score: state.score,
        correct: correctAnswers,
        total: state.answers.length,
      });

      return {
        ...profile,
        history: history.slice(0, 20),
      };
    });
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
      const modeScores = { ...(profile.bestByMode || {}) };
      modeScores[state.settings.mode] = Math.max(modeScores[state.settings.mode] || 0, state.score);
      nextProfile.bestByMode = modeScores;
      if (state.settings.mode === "challenge") {
        nextProfile.bestChallenge = Math.max(
          profile.bestChallenge || 0,
          state.score
        );
      }
      return nextProfile;
    });
    loadRecords();
    syncCurrentUserToOnlineLeaderboard();
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

  async function createAccount() {
    const credentials = getCredentials();
    if (!credentials) {
      return;
    }

    if (hasOnlineAccountsConfig()) {
      const remoteExisting = await fetchRemoteAccount(credentials.key);
      if (remoteExisting) {
        updateAuthStatus(
          "Ce nom d'utilisateur existe déjà. Connecte-toi à la place.",
          "error"
        );
        return;
      }
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
      bestByMode: {
        standard: 0,
        learning: 0,
        challenge: 0,
        battle: 0,
      },
      savedGame: null,
      history: [],
    };
    setUsers(users);

    if (hasOnlineAccountsConfig()) {
      await upsertRemoteAccount(credentials.key, users[credentials.key]);
    }

    setCurrentUser(credentials.key);
    updateAuthUi();
    updateAuthStatus(
      `Compte créé. Bienvenue ${credentials.displayName}.`,
      "success"
    );
    clearStartNotice();
    syncCurrentUserToOnlineLeaderboard();
  }

  async function login() {
    const credentials = getCredentials();
    if (!credentials) {
      return;
    }

    const users = getUsers();
    let profile = users[credentials.key] || null;
    const passwordHash = hashPassword(credentials.password);

    if ((!profile || profile.passwordHash !== passwordHash) && hasOnlineAccountsConfig()) {
      const remote = await fetchRemoteAccount(credentials.key);
      if (remote) {
        const remoteProfile = remoteAccountToLocalProfile(remote, credentials.displayName);
        if (remoteProfile.passwordHash === passwordHash) {
          users[credentials.key] = remoteProfile;
          setUsers(users);
          profile = remoteProfile;
        }
      }
    }

    if (!profile || profile.passwordHash !== passwordHash) {
      updateAuthStatus("Identifiants invalides.", "error");
      return;
    }

    if (hasOnlineAccountsConfig()) {
      await upsertRemoteAccount(credentials.key, profile);
    }

    setCurrentUser(credentials.key);
    updateAuthUi();
    updateAuthStatus(
      `Connexion réussie. Bonjour ${profile.displayName}.`,
      "success"
    );
    clearStartNotice();
    syncCurrentUserToOnlineLeaderboard();
    syncCurrentUserFromOnlineLeaderboard();
  }

  function logout() {
    clearTimer();
    clearAutoNext();
    state.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.currentUser);
    updateAuthUi();
    updateAuthStatus("Déconnecté. Reconnecte-toi pour reprendre ou lancer une partie.");
    showScreen("start");
    fetchOnlineLeaderboard();
  }

  async function resetProgress() {
    if (!state.currentUser) {
      return;
    }

    const profile = getCurrentProfile();
    if (!profile) {
      return;
    }

    const confirmed = window.confirm(
      "Confirmer la réinitialisation ? Ton score, historique et progression seront remis à zéro."
    );

    if (!confirmed) {
      return;
    }

    clearTimer();
    clearAutoNext();

    state.score = 0;
    state.botScore = 0;
    state.questionIndex = 0;
    state.questions = [];
    state.answers = [];
    state.currentQuestion = null;
    state.settings = null;
    state.timeLeft = 60;
    state.hintUsed = false;
    state.answered = false;
    state.selectedChoice = null;
    state.feedbackText = "";
    state.feedbackTone = "";
    state.hintText = "";
    state.recentQuestionKeys = [];
    state.usedQuestionKeys = [];
    state.questionGoal = null;
    state.questionStats = {};
    state.questionQueue = [];
    state.paused = false;

    updateCurrentProfile((current) => ({
      ...current,
      bestScore: 0,
      bestChallenge: 0,
      bestByMode: {
        standard: 0,
        learning: 0,
        challenge: 0,
        battle: 0,
      },
      history: [],
      savedGame: null,
    }));

    const updatedProfile = getCurrentProfile();
    if (updatedProfile && hasOnlineAccountsConfig()) {
      await upsertRemoteAccount(state.currentUser, updatedProfile);
    }

    showScreen("start");
    clearStartNotice();
    loadRecords();
    updateAuthUi();
    updateAuthStatus("Ton compte a été réinitialisé. Tu repars à zéro.", "success");
    syncCurrentUserToOnlineLeaderboard();
    fetchOnlineLeaderboard(true);
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
    state.usedQuestionKeys =
      snapshot.usedQuestionKeys ||
      (Array.isArray(snapshot.questions)
        ? snapshot.questions.map((question) => question.key).filter(Boolean)
        : []);
    state.questionGoal = snapshot.questionGoal || null;
    state.questionStats = snapshot.questionStats || {};
    state.questionQueue = snapshot.questionQueue || [];
    state.paused = Boolean(snapshot.paused);

    if (!state.questionQueue.length && state.settings) {
      state.questionQueue = buildQuestionQueue(
        buildPool(state.settings),
        state.settings,
        new Set(state.usedQuestionKeys)
      );
    }

    if (!state.settings || !state.questions.length) {
      clearSavedGame();
      updateAuthStatus("La sauvegarde était incomplète. Elle a été supprimée.", "error");
      return;
    }

    elements.gameModeTitle.textContent = buildSessionLabel(state.settings);
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
    elements.resetScoreButton.disabled = !profile;
    elements.logoutButton.classList.toggle("hidden", !profile);
    elements.usernameInput.value = profile ? profile.displayName : "";
    elements.passwordInput.value = "";

    if (!profile) {
      updateAuthStatus(
        "Connecte-toi pour lancer une partie et sauvegarder ta progression."
      );
      renderDashboard();
      return;
    }

    if (hasSavedGame) {
      updateAuthStatus(
        `${profile.displayName} est connecté. Une partie sauvegardée est prête à reprendre.`
      );
      renderDashboard();
      return;
    }

    updateAuthStatus(`${profile.displayName} est connecté. Tu peux démarrer une nouvelle partie.`);
    renderDashboard();
  }

  function renderDashboard() {
    syncLeaderboardFilterInputs();
    renderCloudStatus();
    renderLeaderboard();
    renderHistory();
  }

  function renderLeaderboard() {
    const ranking = buildLeaderboardRanking();

    if (!ranking.length) {
      const emptyMessage = "<p>Aucun score enregistré pour le moment.</p>";
      elements.leaderboardList.innerHTML = emptyMessage;
      if (elements.leaderboardListResult) elements.leaderboardListResult.innerHTML = emptyMessage;
      return;
    }

    const html = ranking
      .map(
        (entry, index) =>
          `<p><strong>#${index + 1}</strong> ${entry.name} <span>${entry.score} pts</span></p>`
      )
      .join("");
    
    elements.leaderboardList.innerHTML = html;
    if (elements.leaderboardListResult) elements.leaderboardListResult.innerHTML = html;
  }

  function buildLeaderboardRanking() {
    const selectedMode = state.leaderboardModeFilter || "all";
    const merged = new Map();
    const localUsers = getUsers();

    Object.entries(localUsers).forEach(([username, profile]) => {
      const score = getScoreForMode(profile, selectedMode);
      merged.set(username, {
        username,
        name: profile.displayName || "Joueur",
        score,
      });
    });

    state.onlineLeaderboard.forEach((entry) => {
      if (!entry || !entry.username) {
        return;
      }

      const score = getRemoteScoreForMode(entry, selectedMode);

      const existing = merged.get(entry.username);
      if (!existing || score > existing.score) {
        merged.set(entry.username, {
          username: entry.username,
          name: entry.display_name || entry.username,
          score,
        });
      }
    });

    return Array.from(merged.values())
      .filter((entry) => entry.score > 0 || selectedMode === "all")
      .sort((a, b) => b.score - a.score);
  }

  function getScoreForMode(profile, mode) {
    if (!profile) {
      return 0;
    }

    if (mode === "all") {
      return profile.bestScore || 0;
    }

    const modeScores = profile.bestByMode || {};
    return modeScores[mode] || 0;
  }

  function getRemoteScoreForMode(entry, mode) {
    if (mode === "all") {
      return entry.best_score || 0;
    }

    const modeScores = entry.mode_scores;
    if (modeScores && typeof modeScores === "object") {
      return modeScores[mode] || 0;
    }

    return entry.best_score || 0;
  }

  function renderCloudStatus() {
    const status = buildCloudStatusLabel();
    updateCloudStatusElement(elements.leaderboardCloudStatus, status);
    updateCloudStatusElement(elements.leaderboardCloudStatusResult, status);
  }

  function updateCloudStatusElement(element, status) {
    if (!element) {
      return;
    }

    element.textContent = status.text;
    element.className = `cloud-status ${status.tone}`;
  }

  function buildCloudStatusLabel() {
    if (!hasOnlineLeaderboardConfig()) {
      return { text: "Mode local", tone: "offline" };
    }

    if (state.onlineStatus === "syncing") {
      return { text: "Synchronisation...", tone: "syncing" };
    }

    if (state.onlineStatus === "online") {
      return { text: "En ligne", tone: "online" };
    }

    if (state.onlineStatus === "error") {
      return { text: "Hors ligne", tone: "error" };
    }

    return { text: "Connexion...", tone: "offline" };
  }

  function renderHistory() {
    const profile = getCurrentProfile();
    const history = Array.isArray(profile && profile.history) ? profile.history : [];

    if (!history.length) {
      const emptyMessage = "<p>Aucune session jouée pour ce compte.</p>";
      elements.historyList.innerHTML = emptyMessage;
      if (elements.historyListResult) elements.historyListResult.innerHTML = emptyMessage;
      return;
    }

    const html = history
      .slice(0, 8)
      .map((session) => {
        const date = new Date(session.date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
        });
        return `<p><strong>${date}</strong> ${MODE_LABELS[session.mode]} · ${THEME_LABELS[session.theme]} <span>${session.score} pts (${session.correct}/${session.total})</span></p>`;
      })
      .join("");
    
    elements.historyList.innerHTML = html;
    if (elements.historyListResult) elements.historyListResult.innerHTML = html;
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
        usedQuestionKeys: state.usedQuestionKeys,
        questionGoal: state.questionGoal,
        questionStats: state.questionStats,
        questionQueue: state.questionQueue,
        paused: state.paused,
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
    elements.skipButton.disabled = true;
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

  function getDataset() {
    if (state.datasetLoaded && state.dataset.length) {
      return state.dataset;
    }

    return Array.isArray(window.QUIZ_DATA) ? window.QUIZ_DATA : [];
  }

  async function preloadGlobalDataset() {
    if (state.datasetLoading || !navigator.onLine) {
      return;
    }

    state.datasetLoading = true;

    try {
      const response = await fetch(GLOBAL_COUNTRIES_API);
      if (!response.ok) {
        return;
      }

      const rows = await response.json();
      if (!Array.isArray(rows) || !rows.length) {
        return;
      }

      const generated = rows.map(mapCountryApiItemToQuiz).filter(Boolean);
      if (!generated.length) {
        return;
      }

      state.dataset = mergeDatasets(window.QUIZ_DATA, generated);
      state.datasetLoaded = true;
      updateUniqueCounterPreview();
    } catch (error) {
      // Keep local embedded dataset as fallback.
    } finally {
      state.datasetLoading = false;
    }
  }

  function mergeDatasets(localDataset, generatedDataset) {
    const mergedByKey = new Map();

    generatedDataset.forEach((item) => {
      mergedByKey.set(normalizeCountryKey(item.country), item);
    });

    (localDataset || []).forEach((item) => {
      const key = normalizeCountryKey(item.country);
      const existing = mergedByKey.get(key);

      if (!existing) {
        mergedByKey.set(key, item);
        return;
      }

      mergedByKey.set(key, {
        ...existing,
        ...item,
        country: item.country || existing.country,
        capital: item.capital || existing.capital,
        continent: item.continent || existing.continent,
        fact: item.fact || existing.fact,
        hint: item.hint || existing.hint,
        countryCode: item.countryCode || existing.countryCode || null,
      });
    });

    return Array.from(mergedByKey.values());
  }

  function mapCountryApiItemToQuiz(item) {
    if (!item || !Array.isArray(item.capital) || !item.capital.length) {
      return null;
    }

    const continent = mapApiContinentToQuizContinent(item.continents && item.continents[0]);
    if (!continent) {
      return null;
    }

    const country =
      (item.translations && item.translations.fra && item.translations.fra.common) ||
      (item.name && item.name.common);
    const capital = item.capital[0];

    if (!country || !capital) {
      return null;
    }

    const lat = Array.isArray(item.latlng) ? item.latlng[0] : null;
    const lon = Array.isArray(item.latlng) ? item.latlng[1] : null;
    const population = Number(item.population || 0);

    return {
      country,
      capital,
      continent,
      countryCode: item.cca2 ? String(item.cca2).toLowerCase() : null,
      difficulty: getDifficultyFromPopulation(population),
      fact: `${country} fait partie du continent ${continent}.`,
      hint: `La capitale recherchée commence par ${capital.charAt(0)}.`,
      monument: null,
      x: projectLongitudeToMapX(lon),
      y: projectLatitudeToMapY(lat),
    };
  }

  function mapApiContinentToQuizContinent(continent) {
    if (continent === "Europe") {
      return "Europe";
    }
    if (continent === "Africa") {
      return "Afrique";
    }
    if (continent === "Asia") {
      return "Asie";
    }
    if (continent === "North America") {
      return "Amérique du Nord";
    }
    if (continent === "South America") {
      return "Amérique du Sud";
    }
    if (continent === "Oceania") {
      return "Océanie";
    }
    return null;
  }

  function getDifficultyFromPopulation(population) {
    if (population >= 50000000) {
      return "easy";
    }
    if (population >= 10000000) {
      return "medium";
    }
    return "hard";
  }

  function projectLongitudeToMapX(lon) {
    if (typeof lon !== "number" || Number.isNaN(lon)) {
      return 50;
    }

    const raw = ((lon + 180) / 360) * 100;
    return Math.max(4, Math.min(96, Math.round(raw)));
  }

  function projectLatitudeToMapY(lat) {
    if (typeof lat !== "number" || Number.isNaN(lat)) {
      return 50;
    }

    const raw = ((90 - lat) / 180) * 100;
    return Math.max(6, Math.min(94, Math.round(raw)));
  }

  function hasOnlineLeaderboardConfig() {
    return Boolean(
      ONLINE_LEADERBOARD.enabled &&
      ONLINE_LEADERBOARD.serviceUrl &&
      ONLINE_LEADERBOARD.anonKey
    );
  }

  function hasOnlineAccountsConfig() {
    return Boolean(
      ONLINE_ACCOUNTS.enabled &&
      ONLINE_ACCOUNTS.serviceUrl &&
      ONLINE_ACCOUNTS.anonKey
    );
  }

  function getOnlineEndpoint(query) {
    const baseUrl = ONLINE_LEADERBOARD.serviceUrl.replace(/\/$/, "");
    return `${baseUrl}/rest/v1/${ONLINE_LEADERBOARD.table}${query ? `?${query}` : ""}`;
  }

  function getOnlineAccountsEndpoint(query) {
    const baseUrl = ONLINE_ACCOUNTS.serviceUrl.replace(/\/$/, "");
    return `${baseUrl}/rest/v1/${ONLINE_ACCOUNTS.table}${query ? `?${query}` : ""}`;
  }

  function getOnlineHeaders() {
    return {
      apikey: ONLINE_LEADERBOARD.anonKey,
      Authorization: `Bearer ${ONLINE_LEADERBOARD.anonKey}`,
      "Content-Type": "application/json",
    };
  }

  function getOnlineAccountsHeaders() {
    return {
      apikey: ONLINE_ACCOUNTS.anonKey,
      Authorization: `Bearer ${ONLINE_ACCOUNTS.anonKey}`,
      "Content-Type": "application/json",
    };
  }

  async function fetchRemoteAccount(username) {
    if (!hasOnlineAccountsConfig()) {
      return null;
    }

    try {
      const response = await fetch(
        getOnlineAccountsEndpoint(
          `select=username,display_name,password_hash,best_score,best_challenge,best_by_mode,history,saved_game&username=eq.${encodeURIComponent(username)}&limit=1`
        ),
        {
          method: "GET",
          headers: getOnlineAccountsHeaders(),
        }
      );

      if (!response.ok) {
        return null;
      }

      const rows = await response.json();
      return Array.isArray(rows) && rows.length ? rows[0] : null;
    } catch (error) {
      return null;
    }
  }

  async function upsertRemoteAccount(username, profile) {
    if (!hasOnlineAccountsConfig() || !profile) {
      return false;
    }

    const payload = [
      {
        username,
        display_name: profile.displayName || username,
        password_hash: profile.passwordHash || "",
        best_score: profile.bestScore || 0,
        best_challenge: profile.bestChallenge || 0,
        best_by_mode: profile.bestByMode || {
          standard: 0,
          learning: 0,
          challenge: 0,
          battle: 0,
        },
        history: Array.isArray(profile.history) ? profile.history : [],
        saved_game: profile.savedGame || null,
      },
    ];

    try {
      const response = await fetch(getOnlineAccountsEndpoint("on_conflict=username"), {
        method: "POST",
        headers: {
          ...getOnlineAccountsHeaders(),
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(payload),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  function remoteAccountToLocalProfile(remote, fallbackDisplayName) {
    return {
      displayName: remote.display_name || fallbackDisplayName || remote.username || "Joueur",
      passwordHash: remote.password_hash || "",
      bestScore: remote.best_score || 0,
      bestChallenge: remote.best_challenge || 0,
      bestByMode: remote.best_by_mode || {
        standard: 0,
        learning: 0,
        challenge: 0,
        battle: 0,
      },
      savedGame: remote.saved_game || null,
      history: Array.isArray(remote.history) ? remote.history : [],
    };
  }

  function startOnlineLeaderboardSync() {
    if (!hasOnlineLeaderboardConfig()) {
      state.onlineStatus = "offline";
      renderCloudStatus();
      return;
    }

    fetchOnlineLeaderboard(true);
    if (state.onlinePollId) {
      clearInterval(state.onlinePollId);
    }
    state.onlinePollId = window.setInterval(fetchOnlineLeaderboard, 15000);
  }

  async function fetchOnlineLeaderboard(showStatus) {
    if (!hasOnlineLeaderboardConfig()) {
      return;
    }

    if (showStatus) {
      state.onlineStatus = "syncing";
      renderCloudStatus();
    }

    try {
      let response = await fetch(
        getOnlineEndpoint("select=username,display_name,best_score,mode_scores&order=best_score.desc"),
        {
          method: "GET",
          headers: getOnlineHeaders(),
        }
      );

      if (!response.ok) {
        response = await fetch(
          getOnlineEndpoint("select=username,display_name,best_score&order=best_score.desc"),
          {
            method: "GET",
            headers: getOnlineHeaders(),
          }
        );
      }

      if (!response.ok) {
        state.onlineStatus = "error";
        renderCloudStatus();
        return;
      }

      const rows = await response.json();
      state.onlineLeaderboard = Array.isArray(rows) ? rows : [];
      state.onlineStatus = "online";
      renderCloudStatus();
      renderLeaderboard();
    } catch (error) {
      state.onlineStatus = "error";
      renderCloudStatus();
      // Network failures should not block gameplay.
    }
  }

  function syncCurrentUserToOnlineLeaderboard() {
    if (!state.currentUser || !hasOnlineLeaderboardConfig()) {
      return;
    }

    const profile = getCurrentProfile();
    if (!profile) {
      return;
    }

    const payload = [
      {
        username: state.currentUser,
        display_name: profile.displayName || state.currentUser,
        best_score: profile.bestScore || 0,
        mode_scores: profile.bestByMode || {
          standard: 0,
          learning: 0,
          challenge: 0,
          battle: 0,
        },
      },
    ];

    fetch(getOnlineEndpoint("on_conflict=username"), {
      method: "POST",
      headers: {
        ...getOnlineHeaders(),
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("mode upsert failed");
        }
        state.onlineStatus = "online";
        renderCloudStatus();
        return fetchOnlineLeaderboard();
      })
      .catch(() => {
        const fallbackPayload = [
          {
            username: state.currentUser,
            display_name: profile.displayName || state.currentUser,
            best_score: profile.bestScore || 0,
          },
        ];

        fetch(getOnlineEndpoint("on_conflict=username"), {
          method: "POST",
          headers: {
            ...getOnlineHeaders(),
            Prefer: "resolution=merge-duplicates,return=minimal",
          },
          body: JSON.stringify(fallbackPayload),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("fallback upsert failed");
            }
            state.onlineStatus = "online";
            renderCloudStatus();
            return fetchOnlineLeaderboard();
          })
          .catch(() => {
            state.onlineStatus = "error";
            renderCloudStatus();
            // Keep local mode operational when sync fails.
          });
      });
  }

  function syncCurrentUserFromOnlineLeaderboard() {
    if (!state.currentUser || !hasOnlineLeaderboardConfig()) {
      return;
    }

    fetch(
      getOnlineEndpoint(
        `select=username,display_name,best_score,mode_scores&username=eq.${encodeURIComponent(state.currentUser)}&limit=1`
      ),
      {
        method: "GET",
        headers: getOnlineHeaders(),
      }
    )
      .then((response) => {
        if (!response.ok) {
          return null;
        }
        return response.json();
      })
      .then((rows) => {
        if (!rows || !rows.length) {
          return;
        }

        const remote = rows[0];
        updateCurrentProfile((profile) => ({
          ...profile,
          displayName: remote.display_name || profile.displayName,
          bestScore: Math.max(profile.bestScore || 0, remote.best_score || 0),
          bestByMode:
            remote.mode_scores && typeof remote.mode_scores === "object"
              ? { ...(profile.bestByMode || {}), ...remote.mode_scores }
              : profile.bestByMode || {
                  standard: 0,
                  learning: 0,
                  challenge: 0,
                  battle: 0,
                },
        }));

        loadRecords();
        renderLeaderboard();
      })
      .catch(() => {
        // Local gameplay remains available if remote sync fails.
      });
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

    if (hasOnlineAccountsConfig()) {
      scheduleRemoteAccountSync();
    }
  }

  function scheduleRemoteAccountSync() {
    if (!state.currentUser) {
      return;
    }

    if (state.accountSyncId) {
      clearTimeout(state.accountSyncId);
    }

    state.accountSyncId = window.setTimeout(async () => {
      state.accountSyncId = null;
      const profile = getCurrentProfile();
      if (!profile) {
        return;
      }
      await upsertRemoteAccount(state.currentUser, profile);
    }, 1200);
  }

  function hashPassword(password) {
    let hash = 0;
    for (let index = 0; index < password.length; index += 1) {
      hash = (hash * 31 + password.charCodeAt(index)) >>> 0;
    }
    return String(hash);
  }

  function playFeedbackSound(isCorrect) {
    try {
      const AudioContextImpl = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextImpl) {
        return;
      }

      if (!state.audioContext) {
        state.audioContext = new AudioContextImpl();
      }

      const context = state.audioContext;
      if (context.state === "suspended") {
        context.resume();
      }

      if (isCorrect) {
        playTone(context, 620, 0, 0.09, "sine", 0.13);
        playTone(context, 820, 0.1, 0.13, "sine", 0.15);
        return;
      }

      playTone(context, 210, 0, 0.12, "sawtooth", 0.18);
      playTone(context, 160, 0.09, 0.18, "square", 0.2);
    } catch (error) {
      // If the browser blocks audio, gameplay should continue silently.
    }
  }

  function playTone(context, frequency, delay, duration, type, volume) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const startAt = context.currentTime + delay;
    const endAt = startAt + duration;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startAt);

    gainNode.gain.setValueAtTime(0.0001, startAt);
    gainNode.gain.exponentialRampToValueAtTime(volume, startAt + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, endAt);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(startAt);
    oscillator.stop(endAt + 0.01);
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