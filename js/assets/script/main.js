window.gLocalAssetContainer["main"] = function(g) { (function(exports, require, module, __filename, __dirname) {
function main() {
  function absValue(x) {
    return x < 0 ? -x : x;
  }
  function approxSin(x) {
    var PI = 3.141592653589793;
    var TWO_PI = PI * 2;
    while (x > PI) {
      x -= TWO_PI;
    }
    while (x < -PI) {
      x += TWO_PI;
    }
    var y = x * (1.27323954 - 0.405284735 * absValue(x));
    var py = absValue(y);
    return y * (0.775 + 0.225 * (1 - py));
  }
  var Trig = {
    sin: function (x) {
      if (g.game && g.game.Math && g.game.Math["sin"]) {
        return g.game.Math["sin"](x);
      }
      return approxSin(x);
    },
    cos: function (x) {
      if (g.game && g.game.Math && g.game.Math["cos"]) {
        return g.game.Math["cos"](x);
      }
      return approxSin(x + 1.5707963267948966);
    }
  };
  var CONFIG = {
    WIDTH: 1280,
    HEIGHT: 720,
    FPS: 30,
    READY_SECONDS: 10,
    PLAY_TIME: 60,
    CUP_LERP_RATE: 1.0,
    CUP_WIDTH: 220,
    CUP_HEIGHT: 170,
    CUP_HOLD_OFFSET_Y: -70,
    CUP_HITBOX_WIDTH: 162,
    CUP_HITBOX_HEIGHT: 46,
    POPCORN_GRAVITY: 0.28,
    POPCORN_MIN_SPEED: 10,
    POPCORN_MAX_SPEED: 15,
    SPAWN_INTERVAL_EARLY: [20, 28],
    SPAWN_INTERVAL_MID: [14, 22],
    SPAWN_INTERVAL_LATE: [10, 16],
    SPAWN_INTERVAL_FEVER: [4, 7],
    BURNT_POPCORN_RATE_EARLY: 0.15,
    BURNT_POPCORN_RATE_MID: 0.2,
    BURNT_POPCORN_RATE_LATE: 0.22,
    BIG_POPCORN_RATE_EARLY: 0.06,
    BIG_POPCORN_RATE_MID: 0.1,
    BIG_POPCORN_RATE_LATE: 0.12,
    HINA_POPCORN_RATE_EARLY: 0.02,
    HINA_POPCORN_RATE_MID: 0.04,
    HINA_POPCORN_RATE_LATE: 0.1,
    HEART_POPCORN_RATE_EARLY: 0.03,
    HEART_POPCORN_RATE_MID: 0.05,
    HEART_POPCORN_RATE_LATE: 0.06,
    DOUBLE_SPAWN_MID_RATE: 0.12,
    DOUBLE_SPAWN_LATE_RATE: 0.2,
    DOUBLE_SPAWN_FEVER_RATE: 0.75,
    TRIPLE_SPAWN_FEVER_RATE: 0.35,
    PREVIEW_MIN_FRAMES: 5,
    PREVIEW_MAX_FRAMES: 10,
    END_SCENE_DELAY_MS: 900
  };
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  function rangeRandom(min, max) {
    return min + g.game.random.generate() * (max - min);
  }
  function intRandom(min, max) {
    return Math.floor(rangeRandom(min, max + 1));
  }
  function randomAngleDeg(lastAngle) {
    var angle;
    var attempts = 0;
    do {
      angle = rangeRandom(-175, 175);
      attempts += 1;
      if (attempts > 10) {
        break;
      }
    } while (Math.abs(angle - lastAngle) < 20 || angle > 70 && angle < 120 || angle < -120 && angle > -150);
    return angle;
  }
  function createButton(scene, font, text, x, y, w, h, onClick) {
    var button = new g.FilledRect({
      scene: scene,
      x: x,
      y: y,
      width: w,
      height: h,
      cssColor: "#ff9bb5",
      touchable: true,
      opacity: 0.95,
      cornerRadius: 20,
      parent: scene
    });
    var shadow = new g.FilledRect({
      scene: scene,
      x: 0,
      y: h - 8,
      width: w,
      height: 8,
      cssColor: "#e77e9a",
      cornerRadius: 20,
      parent: button
    });
    var label = new g.Label({
      scene: scene,
      text: text,
      font: font,
      fontSize: 36,
      textColor: "#5f3d55",
      x: w / 2,
      y: h / 2,
      anchorX: 0.5,
      anchorY: 0.5,
      parent: button
    });
    button.onPointDown.add(function () {
      button.y += 4;
      button.modified();
      shadow.hide();
      label.y += 2;
      label.modified();
      onClick();
    });
    button.onPointUp.add(function () {
      button.y -= 4;
      button.modified();
      shadow.show();
      label.y -= 2;
      label.modified();
    });
    return button;
  }
  function createTitleScene() {
    var scene = new g.Scene({
      game: g.game,
      assetIds: ["title_bg"]
    });
    scene.onLoad.add(function () {
      var bg = new g.Sprite({
        scene: scene,
        src: scene.asset.getImageById("title_bg"),
        x: 0,
        y: 0,
        parent: scene
      });
      var titleFont = new g.DynamicFont({
        game: g.game,
        size: 96,
        fontFamily: g.FontFamily.Serif
      });
      var textFont = new g.DynamicFont({
        game: g.game,
        size: 44,
        fontFamily: g.FontFamily.SansSerif
      });
      new g.Label({
        scene: scene,
        text: "ひなぽかポンッ",
        font: titleFont,
        fontSize: 96,
        textColor: "#7a3f5e",
        strokeColor: "#fff6fb",
        strokeWidth: 12,
        textAlign: g.TextAlign.Center,
        width: CONFIG.WIDTH,
        y: 120,
        parent: scene
      });
      new g.Label({
        scene: scene,
        text: "ポップコーンをキャッチしよう!",
        font: textFont,
        fontSize: 42,
        textColor: "#7b512e",
        strokeColor: "#fff6df",
        strokeWidth: 6,
        textAlign: g.TextAlign.Center,
        width: CONFIG.WIDTH,
        y: 240,
        parent: scene
      });
      createButton(scene, textFont, "スタート", 470, 380, 340, 92, function () {
        g.game.replaceScene(createGameScene());
      });
      createButton(scene, textFont, "あそびかた", 470, 498, 340, 92, function () {
        g.game.replaceScene(createHowToScene());
      });
    });
    return scene;
  }
  function createInstructionPanel(scene, options) {
    var panel = new g.E({
      scene: scene,
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height,
      parent: options.parent || scene
    });
    new g.FilledRect({
      scene: scene,
      x: 10,
      y: 12,
      width: options.width,
      height: options.height,
      cssColor: "#3b2a1d",
      opacity: 0.28,
      cornerRadius: 30,
      parent: panel
    });
    new g.FilledRect({
      scene: scene,
      x: 0,
      y: 0,
      width: options.width,
      height: options.height,
      cssColor: "#cfb07a",
      opacity: 0.92,
      cornerRadius: 30,
      parent: panel
    });
    new g.FilledRect({
      scene: scene,
      x: 12,
      y: 12,
      width: options.width - 24,
      height: options.height - 24,
      cssColor: "#efdfb8",
      opacity: 0.93,
      cornerRadius: 24,
      parent: panel
    });
    new g.FilledRect({
      scene: scene,
      x: 22,
      y: 22,
      width: options.width - 44,
      height: options.height - 44,
      cssColor: "#476e56",
      opacity: 0.94,
      cornerRadius: 22,
      parent: panel
    });
    new g.Label({
      scene: scene,
      text: "ゲーム説明",
      font: options.titleFont,
      fontSize: options.titleFontSize || 50,
      textColor: "#fff6da",
      strokeColor: "#183624",
      strokeWidth: 8,
      anchorX: 0.5,
      x: options.width / 2,
      y: 34,
      parent: panel
    });
    new g.Label({
      scene: scene,
      text: "・ポップコーンを上手くカップに入れよう！",
      font: options.bodyFont,
      fontSize: options.bodyFontSize || 30,
      textColor: "#fffdf4",
      x: 68,
      y: 128,
      parent: panel
    });
    new g.Label({
      scene: scene,
      text: "・焦げ（茶色い）コーンは減点だぞ！",
      font: options.bodyFont,
      fontSize: options.bodyFontSize || 30,
      textColor: "#fffdf4",
      x: 68,
      y: 180,
      parent: panel
    });
    function addScoreEntry(centerX, y, assetId, scoreText, textColor) {
      var image = scene.asset.getImageById(assetId);
      new g.Sprite({
        scene: scene,
        src: image,
        width: 42,
        height: 42,
        srcWidth: image.width,
        srcHeight: image.height,
        x: centerX - 78,
        y: y - 2,
        parent: panel
      });
      new g.Label({
        scene: scene,
        text: scoreText,
        font: options.bodyFont,
        fontSize: 26,
        textColor: textColor,
        strokeColor: "#183624",
        strokeWidth: 4,
        x: centerX - 28,
        y: y + 2,
        parent: panel
      });
    }
    addScoreEntry(options.width * 0.25, 220, "pop_normal", "+100", "#fff9ef");
    addScoreEntry(options.width * 0.5, 220, "pop_big", "+200", "#ffe18a");
    addScoreEntry(options.width * 0.75, 220, "pop_heart", "+300", "#ffb5bb");
    addScoreEntry(options.width * 0.36, 266, "pop_hina", "+700", "#ffd768");
    addScoreEntry(options.width * 0.67, 266, "pop_burnt", "-150", "#ff8f87");
    new g.Label({
      scene: scene,
      text: "・特典: 残り10秒でラッシュ突入（出現アップ）",
      font: options.bodyFont,
      fontSize: 28,
      textColor: "#f1ce63",
      strokeColor: "#3d3418",
      strokeWidth: 4,
      x: 68,
      y: 318,
      parent: panel
    });
    new g.Label({
      scene: scene,
      text: "・同時発射では焦げポップコーンも混ざるので注意！",
      font: options.bodyFont,
      fontSize: 28,
      textColor: "#f8ddd7",
      strokeColor: "#4e302a",
      strokeWidth: 4,
      x: 68,
      y: 360,
      parent: panel
    });
    if (options.footerText) {
      new g.Label({
        scene: scene,
        text: options.footerText,
        font: options.bodyFont,
        fontSize: 26,
        textColor: "#dcefd3",
        strokeColor: "#183624",
        strokeWidth: 4,
        textAlign: g.TextAlign.Center,
        width: options.width,
        y: options.height - 78,
        parent: panel
      });
    }
    var countdownLabel = null;
    if (options.countdownText) {
      countdownLabel = new g.Label({
        scene: scene,
        text: options.countdownText,
        font: options.bodyFont,
        fontSize: options.countdownFontSize || 62,
        textColor: "#ffe45e",
        strokeColor: "#5d4400",
        strokeWidth: 7,
        anchorX: 0.5,
        x: options.width / 2,
        y: options.height - 92,
        parent: panel
      });
    }
    return {
      panel: panel,
      countdownLabel: countdownLabel
    };
  }
  function createHowToScene() {
    var scene = new g.Scene({
      game: g.game,
      assetIds: ["title_bg", "pop_normal", "pop_big", "pop_heart", "pop_hina", "pop_burnt"]
    });
    scene.onLoad.add(function () {
      new g.Sprite({
        scene: scene,
        src: scene.asset.getImageById("title_bg"),
        x: 0,
        y: 0,
        parent: scene
      });
      var titleFont = new g.DynamicFont({
        game: g.game,
        size: 64,
        fontFamily: g.FontFamily.Serif
      });
      var bodyFont = new g.DynamicFont({
        game: g.game,
        size: 34,
        fontFamily: g.FontFamily.SansSerif
      });
      createInstructionPanel(scene, {
        x: 120,
        y: 72,
        width: 1040,
        height: 480,
        titleFont: titleFont,
        titleFontSize: 58,
        bodyFont: bodyFont,
        bodyFontSize: 30,
        footerText: "カップはタップした位置へ移動。焦げはしっかり避けよう"
      });
      createButton(scene, bodyFont, "タイトルへ", 470, 590, 340, 92, function () {
        g.game.replaceScene(createTitleScene());
      });
    });
    return scene;
  }
  function createGameScene() {
    var scene = new g.Scene({
      game: g.game,
      assetIds: ["game_bg", "machine", "cup", "pop_normal", "pop_burnt", "pop_big", "pop_hina", "pop_heart", "start", "end", "hit_correct", "hit_wrong", "bgm_main"]
    });
    scene.onLoad.add(function () {
      var uiFont = new g.DynamicFont({
        game: g.game,
        size: 46,
        fontFamily: g.FontFamily.SansSerif
      });
      var readyTitleFont = new g.DynamicFont({
        game: g.game,
        size: 58,
        fontFamily: "Hiragino Maru Gothic ProN, Hiragino Sans, Meiryo, sans-serif"
      });
      var readyBodyFont = new g.DynamicFont({
        game: g.game,
        size: 34,
        fontFamily: "Hiragino Maru Gothic ProN, Hiragino Sans, Meiryo, sans-serif"
      });
      var fxFont = new g.DynamicFont({
        game: g.game,
        size: 62,
        fontFamily: g.FontFamily.Serif
      });
      var bg = new g.Sprite({
        scene: scene,
        src: scene.asset.getImageById("game_bg"),
        x: 0,
        y: 0,
        parent: scene
      });
      var machine = new g.Sprite({
        scene: scene,
        src: scene.asset.getImageById("machine"),
        x: CONFIG.WIDTH / 2 - 180,
        y: 70,
        parent: scene
      });
      var machineMouth = {
        x: CONFIG.WIDTH / 2,
        y: 220
      };
      var cupState = {
        x: CONFIG.WIDTH / 2,
        y: CONFIG.HEIGHT - 120,
        targetX: CONFIG.WIDTH / 2,
        targetY: CONFIG.HEIGHT - 120
      };
      var cup = new g.Sprite({
        scene: scene,
        src: scene.asset.getImageById("cup"),
        width: CONFIG.CUP_WIDTH,
        height: CONFIG.CUP_HEIGHT,
        srcWidth: 240,
        srcHeight: 190,
        x: cupState.x - CONFIG.CUP_WIDTH / 2,
        y: cupState.y - CONFIG.CUP_HEIGHT / 2,
        parent: scene
      });
      var score = 0;
      var combo = 0;
      var maxCombo = 0;
      var totalCatch = 0;
      var burntCatch = 0;
      var hinaCatch = 0;
      var frame = 0;
      var playFrame = 0;
      var readyFrame = CONFIG.READY_SECONDS * CONFIG.FPS;
      var ended = false;
      var isPlaying = false;
      var isFever = false;
      var isPointerDown = false;
      var spawnFrame = 0;
      var previewFrame = -1;
      var previewAngle = 0;
      var lastAngle = 0;
      var popcorns = [];
      var fxLabels = [];
      var shakeFrame = 0;
      var shakePower = 0;
      var endVoicePlayed = false;
      var startVoicePlayed = false;
      var hasUserInteracted = false;
      var pendingStartSe = false;
      var pendingEndSe = false;
      var pendingBgm = false;
      var browserGestureUnlockHandler = null;
      var bgmPlayer = null;
      var scoreLabel = new g.Label({
        scene: scene,
        text: "SCORE: 0",
        font: uiFont,
        fontSize: 46,
        textColor: "#563449",
        strokeColor: "#fff8ff",
        strokeWidth: 6,
        x: 24,
        y: 16,
        parent: scene
      });
      var timeLabel = new g.Label({
        scene: scene,
        text: "TIME: 60.0",
        font: uiFont,
        fontSize: 46,
        textColor: "#2d4d71",
        strokeColor: "#f4fbff",
        strokeWidth: 6,
        x: CONFIG.WIDTH - 280,
        y: 16,
        parent: scene
      });
      var comboLabel = new g.Label({
        scene: scene,
        text: "COMBO x0",
        font: uiFont,
        fontSize: 40,
        textColor: "#7a5b20",
        strokeColor: "#fff9df",
        strokeWidth: 5,
        textAlign: g.TextAlign.Center,
        width: 320,
        x: CONFIG.WIDTH / 2 - 160,
        y: 18,
        parent: scene
      });
      var judgeLabel = new g.Label({
        scene: scene,
        text: "",
        font: fxFont,
        fontSize: 62,
        textColor: "#4f3d70",
        strokeColor: "#fff8ff",
        strokeWidth: 8,
        textAlign: g.TextAlign.Center,
        width: CONFIG.WIDTH,
        y: CONFIG.HEIGHT - 240,
        opacity: 0,
        parent: scene
      });
      var feverTint = new g.FilledRect({
        scene: scene,
        x: 0,
        y: 0,
        width: CONFIG.WIDTH,
        height: CONFIG.HEIGHT,
        cssColor: "#ffe85c",
        opacity: 0,
        parent: scene
      });
      var feverLabel = new g.Label({
        scene: scene,
        text: "",
        font: fxFont,
        fontSize: 72,
        textColor: "#8a5b00",
        strokeColor: "#fff8d5",
        strokeWidth: 10,
        textAlign: g.TextAlign.Center,
        width: CONFIG.WIDTH,
        y: 110,
        opacity: 0,
        parent: scene
      });
      var readyPanel = createInstructionPanel(scene, {
        x: 140,
        y: 108,
        width: 1000,
        height: 510,
        titleFont: readyTitleFont,
        titleFontSize: 48,
        bodyFont: readyBodyFont,
        bodyFontSize: 28,
        countdownText: "開始まで: 10",
        countdownFontSize: 64
      });
      var readyModal = readyPanel.panel;
      var readyCountdown = readyPanel.countdownLabel;
      var preview = new g.FilledRect({
        scene: scene,
        x: machineMouth.x,
        y: machineMouth.y,
        width: 84,
        height: 10,
        cssColor: "#fff5a8",
        anchorX: 0.1,
        anchorY: 0.5,
        opacity: 0,
        parent: scene
      });
      function syncScoreToRuntime(currentScore) {
        if (!g.game.vars.gameState) {
          g.game.vars.gameState = {
            score: 0,
            playThreshold: 1,
            clearThreshold: 0
          };
        }
        g.game.vars.gameState.score = currentScore;
        g.game.score = currentScore;
      }
      g.game.vars.gameState = {
        score: 0,
        playThreshold: 1,
        clearThreshold: 0
      };
      syncScoreToRuntime(0);
      function getAudioAsset(id) {
        return scene.assets[id] || g.game.assets[id] || null;
      }
      function playSe(id) {
        try {
          var audio = getAudioAsset(id);
          if (audio && typeof audio.play === "function") {
            audio.play();
            return true;
          }
        } catch (e) {}
        return false;
      }
      function startBgm() {
        if (bgmPlayer) {
          return true;
        }
        var bgmAsset = getAudioAsset("bgm_main");
        if (!bgmAsset || typeof bgmAsset.play !== "function") {
          return false;
        }
        try {
          bgmPlayer = bgmAsset.play();
          return true;
        } catch (e) {
          return false;
        }
      }
      function stopBgm() {
        if (!bgmPlayer) {
          return;
        }
        try {
          if (typeof bgmPlayer.stop === "function") {
            bgmPlayer.stop();
          }
        } catch (e) {}
        bgmPlayer = null;
      }
      function markAudioUnlocked() {
        if (hasUserInteracted) {
          return;
        }
        hasUserInteracted = true;
        if (pendingStartSe) {
          startVoicePlayed = playSe("start");
          pendingStartSe = !startVoicePlayed;
        }
        if (pendingEndSe) {
          pendingEndSe = !playSe("end");
        }
        if (pendingBgm && isPlaying) {
          pendingBgm = !startBgm();
        }
      }
      if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
        browserGestureUnlockHandler = function () {
          markAudioUnlocked();
          if (typeof window.removeEventListener === "function") {
            window.removeEventListener("pointerdown", browserGestureUnlockHandler, true);
            window.removeEventListener("mousedown", browserGestureUnlockHandler, true);
            window.removeEventListener("touchstart", browserGestureUnlockHandler, true);
          }
        };
        window.addEventListener("pointerdown", browserGestureUnlockHandler, true);
        window.addEventListener("mousedown", browserGestureUnlockHandler, true);
        window.addEventListener("touchstart", browserGestureUnlockHandler, true);
      }
      function showJudge(text, color) {
        judgeLabel.text = text;
        judgeLabel.textColor = color;
        judgeLabel.opacity = 1;
        judgeLabel.invalidate();
      }
      function pushScoreFx(text, x, y, color) {
        var label = new g.Label({
          scene: scene,
          text: text,
          font: uiFont,
          fontSize: 36,
          textColor: color,
          strokeColor: "#60485e",
          strokeWidth: 5,
          x: x,
          y: y,
          parent: scene
        });
        fxLabels.push({
          label: label,
          life: 24
        });
      }
      function triggerScreenShake(power, frames) {
        shakePower = power;
        shakeFrame = frames;
      }
      function scheduleSpawn() {
        var sec = playFrame / CONFIG.FPS;
        var range = CONFIG.SPAWN_INTERVAL_EARLY;
        if (sec >= 50) {
          range = CONFIG.SPAWN_INTERVAL_FEVER;
        } else if (sec >= 45) {
          range = CONFIG.SPAWN_INTERVAL_LATE;
        } else if (sec >= 20) {
          range = CONFIG.SPAWN_INTERVAL_MID;
        }
        spawnFrame = playFrame + intRandom(range[0], range[1]);
        previewFrame = spawnFrame - intRandom(CONFIG.PREVIEW_MIN_FRAMES, CONFIG.PREVIEW_MAX_FRAMES);
        previewAngle = randomAngleDeg(lastAngle);
      }
      function choosePopcornType(sec) {
        var burntRate = CONFIG.BURNT_POPCORN_RATE_EARLY;
        var bigRate = CONFIG.BIG_POPCORN_RATE_EARLY;
        var hinaRate = CONFIG.HINA_POPCORN_RATE_EARLY;
        var heartRate = CONFIG.HEART_POPCORN_RATE_EARLY;
        if (sec >= 45) {
          burntRate = CONFIG.BURNT_POPCORN_RATE_LATE;
          bigRate = CONFIG.BIG_POPCORN_RATE_LATE;
          hinaRate = CONFIG.HINA_POPCORN_RATE_LATE;
          heartRate = CONFIG.HEART_POPCORN_RATE_LATE;
        } else if (sec >= 20) {
          burntRate = CONFIG.BURNT_POPCORN_RATE_MID;
          bigRate = CONFIG.BIG_POPCORN_RATE_MID;
          hinaRate = CONFIG.HINA_POPCORN_RATE_MID;
          heartRate = CONFIG.HEART_POPCORN_RATE_MID;
        }
        var r = g.game.random.generate();
        if (r < burntRate) {
          return "burnt";
        }
        r -= burntRate;
        if (r < hinaRate) {
          return "hina";
        }
        r -= hinaRate;
        if (r < bigRate) {
          return "big";
        }
        r -= bigRate;
        if (r < heartRate) {
          return "heart";
        }
        return "normal";
      }
      function spawnOne(angleDeg, sec) {
        var type = choosePopcornType(sec);
        var imageId = "pop_normal";
        var size = 70;
        var baseScore = 100;
        if (type === "burnt") {
          imageId = "pop_burnt";
          size = 74;
          baseScore = -150;
        } else if (type === "big") {
          imageId = "pop_big";
          size = 86;
          baseScore = 200;
        } else if (type === "hina") {
          imageId = "pop_hina";
          size = 70;
          baseScore = 700;
        } else if (type === "heart") {
          imageId = "pop_heart";
          size = 78;
          baseScore = 300;
        }
        var image = scene.asset.getImageById(imageId);
        var speed = rangeRandom(CONFIG.POPCORN_MIN_SPEED, CONFIG.POPCORN_MAX_SPEED);
        var rad = angleDeg * Math.PI / 180;
        var sprite = new g.Sprite({
          scene: scene,
          src: image,
          width: size,
          height: size,
          srcWidth: image.width,
          srcHeight: image.height,
          x: machineMouth.x - size / 2,
          y: machineMouth.y - size / 2,
          parent: scene
        });
        popcorns.push({
          type: type,
          x: machineMouth.x - size / 2,
          y: machineMouth.y - size / 2,
          vx: Trig.cos(rad) * speed,
          vy: Trig.sin(rad) * speed,
          gravity: CONFIG.POPCORN_GRAVITY,
          radius: size / 2,
          baseScore: baseScore,
          sprite: sprite
        });
      }
      function doSpawn() {
        var sec = playFrame / CONFIG.FPS;
        lastAngle = previewAngle;
        spawnOne(previewAngle, sec);
        var doubleRate = sec >= 50 ? CONFIG.DOUBLE_SPAWN_FEVER_RATE : sec >= 45 ? CONFIG.DOUBLE_SPAWN_LATE_RATE : sec >= 20 ? CONFIG.DOUBLE_SPAWN_MID_RATE : 0;
        if (g.game.random.generate() < doubleRate) {
          var extra = previewAngle + rangeRandom(-26, 26);
          spawnOne(extra, sec);
        }
        if (sec >= 50 && g.game.random.generate() < CONFIG.TRIPLE_SPAWN_FEVER_RATE) {
          var extra2 = previewAngle + rangeRandom(-40, 40);
          spawnOne(extra2, sec);
        }
        scheduleSpawn();
      }
      function catchCheck(pop) {
        var cx = pop.x + pop.radius;
        var cy = pop.y + pop.radius;
        var hx = cupState.x;
        var hy = cupState.y - 48;
        var nx = (cx - hx) / (CONFIG.CUP_HITBOX_WIDTH / 2);
        var ny = (cy - hy) / (CONFIG.CUP_HITBOX_HEIGHT / 2);
        return nx * nx + ny * ny <= 1;
      }
      function collect(pop) {
        totalCatch += 1;
        if (pop.type === "burnt") {
          score += pop.baseScore;
          combo = 0;
          burntCatch += 1;
          playSe("hit_wrong");
          triggerScreenShake(16, 9);
          showJudge("OH NO!", "#534039");
          pushScoreFx(String(pop.baseScore), pop.x, pop.y - 8, "#6b4c3b");
        } else {
          score += pop.baseScore;
          playSe("hit_correct");
          combo += 1;
          maxCombo = Math.max(maxCombo, combo);
          if (pop.type === "hina") {
            hinaCatch += 1;
          }
          var bonusRate = 0;
          if (combo >= 20) {
            bonusRate = 0.3;
          } else if (combo >= 10) {
            bonusRate = 0.2;
          } else if (combo >= 5) {
            bonusRate = 0.1;
          }
          var bonus = Math.floor(pop.baseScore * bonusRate);
          score += bonus;
          if (pop.type === "hina") {
            showJudge("HINAPOKA!", "#ffef7a");
          } else if (combo >= 10) {
            showJudge("GREAT!", "#fff486");
          } else {
            showJudge("GOOD!", "#fff8f0");
          }
          var plusText = "+" + pop.baseScore;
          if (bonus > 0) {
            plusText += " (+" + bonus + ")";
          }
          pushScoreFx(plusText, pop.x, pop.y - 8, "#62461f");
        }
      }
      function updateHud(timeLeft) {
        scoreLabel.text = "SCORE: " + score;
        scoreLabel.invalidate();
        timeLabel.text = "TIME: " + timeLeft.toFixed(1);
        timeLabel.invalidate();
        comboLabel.text = "COMBO x" + combo;
        comboLabel.invalidate();
      }
      function beginPlay() {
        if (isPlaying) {
          return;
        }
        isPlaying = true;
        readyModal.hide();
        if (!startVoicePlayed) {
          startVoicePlayed = playSe("start");
          pendingStartSe = !startVoicePlayed;
        }
        if (!startBgm()) {
          pendingBgm = true;
        }
        scheduleSpawn();
      }
      function endGame() {
        if (ended) {
          return;
        }
        ended = true;
        isPlaying = false;
        syncScoreToRuntime(score);
        stopBgm();
        if (!endVoicePlayed) {
          endVoicePlayed = playSe("end");
          pendingEndSe = !endVoicePlayed;
        }
        while (popcorns.length > 0) {
          var p = popcorns.pop();
          p.sprite.destroy();
        }
        feverLabel.text = "TIME UP! SCORE: " + score;
        feverLabel.textColor = "#4a3d68";
        feverLabel.strokeColor = "#6e5f8f";
        feverLabel.opacity = 1;
        feverLabel.invalidate();
        scene.setTimeout(function () {
          syncScoreToRuntime(score);
          if (typeof g.MessageEvent === "function" && typeof g.game.raiseEvent === "function") {
            try {
              g.game.raiseEvent(new g.MessageEvent({
                data: {
                  type: "end",
                  score: score,
                  totalCatch: totalCatch,
                  burntCatch: burntCatch,
                  hinaCatch: hinaCatch,
                  maxCombo: maxCombo
                }
              }));
            } catch (e) {}
          }
          if (typeof scene.end === "function") {
            try {
              scene.end();
            } catch (e) {}
          }
          if (browserGestureUnlockHandler && typeof window !== "undefined" && typeof window.removeEventListener === "function") {
            window.removeEventListener("pointerdown", browserGestureUnlockHandler, true);
            window.removeEventListener("mousedown", browserGestureUnlockHandler, true);
            window.removeEventListener("touchstart", browserGestureUnlockHandler, true);
          }
        }, CONFIG.END_SCENE_DELAY_MS);
      }
      scene.onPointDownCapture.add(function (event) {
        isPointerDown = true;
        markAudioUnlocked();
      });
      scene.onPointMoveCapture.add(function (event) {
        if (!isPointerDown) {
          return;
        }
        cupState.targetX = event.point.x + event.startDelta.x;
        cupState.targetY = event.point.y + event.startDelta.y + CONFIG.CUP_HOLD_OFFSET_Y;
      });
      scene.onPointUpCapture.add(function () {
        isPointerDown = false;
      });
      scene.onUpdate.add(function () {
        frame += 1;
        var elapsed = playFrame / CONFIG.FPS;
        var timeLeft = Math.max(0, CONFIG.PLAY_TIME - elapsed);
        var shakeX = 0;
        var shakeY = 0;
        if (shakeFrame > 0) {
          shakeFrame -= 1;
          shakeX = rangeRandom(-shakePower, shakePower);
          shakeY = rangeRandom(-shakePower, shakePower);
          shakePower *= 0.82;
        }
        bg.x = shakeX * 0.28;
        bg.y = shakeY * 0.28;
        bg.modified();
        machine.x = CONFIG.WIDTH / 2 - 180 + shakeX;
        machine.y = 70 + Trig.sin(frame / 18) * 4 + shakeY;
        machine.modified();
        cupState.x += (cupState.targetX - cupState.x) * CONFIG.CUP_LERP_RATE;
        cupState.y += (cupState.targetY - cupState.y) * CONFIG.CUP_LERP_RATE;
        cupState.x = clamp(cupState.x, CONFIG.CUP_WIDTH / 2, CONFIG.WIDTH - CONFIG.CUP_WIDTH / 2);
        cupState.y = clamp(cupState.y, 300, CONFIG.HEIGHT - CONFIG.CUP_HEIGHT / 2);
        cup.x = cupState.x - CONFIG.CUP_WIDTH / 2 + shakeX;
        cup.y = cupState.y - CONFIG.CUP_HEIGHT / 2 + shakeY;
        cup.modified();
        preview.x = machineMouth.x + shakeX;
        preview.y = machineMouth.y + shakeY;
        preview.modified();
        if (isPlaying && playFrame === previewFrame) {
          preview.opacity = 0.85;
          preview.angle = previewAngle;
          preview.modified();
        }
        if (preview.opacity > 0) {
          preview.opacity -= 0.07;
          preview.modified();
        }
        if (!isPlaying && !ended) {
          readyFrame -= 1;

          // 参照実装に合わせ、ゲーム開始2秒前に開始SEを先行再生する。
          if (!startVoicePlayed && readyFrame <= 2 * CONFIG.FPS && readyFrame > 0) {
            startVoicePlayed = playSe("start");
            pendingStartSe = !startVoicePlayed;
          }
          if (readyFrame <= 0) {
            readyCountdown.text = "スタート!";
            readyCountdown.invalidate();
            beginPlay();
          } else {
            readyCountdown.text = "開始まで: " + Math.ceil(readyFrame / CONFIG.FPS);
            readyCountdown.invalidate();
          }
        }
        if (isPlaying && !ended) {
          playFrame += 1;
        }
        if (isPlaying && playFrame >= CONFIG.FPS * 50 && !isFever) {
          isFever = true;
          feverLabel.text = "FEVER TIME!";
          feverLabel.textColor = "#7a5200";
          feverLabel.strokeColor = "#946100";
          feverLabel.opacity = 1;
          feverLabel.invalidate();
          showJudge("FEVER!", "#fff7a0");
        }
        if (isFever && !ended) {
          feverTint.opacity = 0.08 + Trig.sin(frame / 4) * 0.05;
          feverTint.modified();
        } else {
          feverTint.opacity = Math.max(0, feverTint.opacity - 0.03);
          feverTint.modified();
        }
        if (isPlaying && playFrame >= spawnFrame && !ended) {
          doSpawn();
        }
        for (var i = popcorns.length - 1; i >= 0; i -= 1) {
          var pop = popcorns[i];
          pop.x += pop.vx;
          pop.y += pop.vy;
          pop.vy += pop.gravity;
          pop.sprite.x = pop.x + shakeX;
          pop.sprite.y = pop.y + shakeY;
          pop.sprite.modified();
          if (catchCheck(pop)) {
            collect(pop);
            pop.sprite.destroy();
            popcorns.splice(i, 1);
            continue;
          }
          if (pop.y > CONFIG.HEIGHT + 120 || pop.x < -120 || pop.x > CONFIG.WIDTH + 120) {
            pop.sprite.destroy();
            popcorns.splice(i, 1);
          }
        }
        for (var j = fxLabels.length - 1; j >= 0; j -= 1) {
          var fx = fxLabels[j];
          fx.life -= 1;
          fx.label.y -= 1.1;
          fx.label.opacity -= 0.035;
          fx.label.modified();
          if (fx.life <= 0) {
            fx.label.destroy();
            fxLabels.splice(j, 1);
          }
        }
        judgeLabel.opacity = Math.max(0, judgeLabel.opacity - 0.025);
        judgeLabel.modified();
        feverLabel.opacity = Math.max(0, feverLabel.opacity - 0.01);
        feverLabel.modified();
        updateHud(timeLeft);
        if (isPlaying && timeLeft <= 0) {
          endGame();
        }
      });
    });
    return scene;
  }
  g.game.pushScene(createGameScene());
}
module.exports = main;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}