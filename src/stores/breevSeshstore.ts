import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import type { BreevSeshRecord } from "../views/useBreevSesh";
import { generateMockBreevSeshHistory } from "../__test__/testUtils";

const DEFAULT_SETTINGS = {
  countdown: 3,
  betweenRounds: 5,
  breaths: 25,
  rounds: 3,
  breathDuration: 2,
};

function loadSettings(): BreevSeshSettings {
  const saved = localStorage.getItem("breevSettings");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        countdown: parsed.countdown ?? DEFAULT_SETTINGS.countdown,
        betweenRounds: parsed.betweenRounds ?? DEFAULT_SETTINGS.betweenRounds,
        breaths: parsed.breaths ?? DEFAULT_SETTINGS.breaths,
        rounds: parsed.rounds ?? DEFAULT_SETTINGS.rounds,
        breathDuration:
          parsed.breathDuration ?? DEFAULT_SETTINGS.breathDuration,
      };
    } catch (e) {
      console.warn("Failed to parse local settings. Using defaults.", e);
    }
  }
  return DEFAULT_SETTINGS;
}

function loadHistory() {
  const saved = localStorage.getItem("breevSeshHistory");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to parse history. Using empty array.", e);
    }
  }
  return [];
}

export type BreevSeshSettings = {
  countdown: number;
  betweenRounds: number;
  breaths: number;
  rounds: number;
  breathDuration: number;
};

const useBreevSeshStore = defineStore("breevSesh", () => {
  const mainText = ref("");
  const subText = ref("");
  const isBreathingIn = ref(false);
  const isHoldingBreath = ref(false);
  const isActiveSesh = ref(false);

  const settings = reactive<BreevSeshSettings>(loadSettings());
  const history = ref(loadHistory());
  function saveSesh(sesh: BreevSeshRecord) {
    sesh.avgHoldDurationMs =
      sesh.rounds.reduce((sum, round) => sum + round.holdDurationMs, 0) /
        sesh.rounds.length || 0;
    sesh.completedAt = new Date().toISOString();
    history.value.push(sesh);
    // Save to localStorage
    localStorage.setItem("breevSeshHistory", JSON.stringify(history.value));
    console.log("Sesh saved:", sesh);
  }

  watch(
    () => ({ ...settings }), // shallow clone for full-object tracking
    (newVal) => {
      localStorage.setItem("breevSettings", JSON.stringify(newVal));
    },
    { deep: true }
  );

  return {
    mainText,
    subText,
    isBreathingIn,
    isHoldingBreath,
    isActiveSesh,
    settings,
    history,
    // methods
    saveSesh,
  };
});

export default useBreevSeshStore;
