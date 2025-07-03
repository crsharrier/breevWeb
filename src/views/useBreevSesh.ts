import { storeToRefs } from "pinia";
import useBreevSeshStore, {
  type BreevSeshSettings,
} from "../stores/breevSeshstore";
import { useRouter } from "vue-router";
import { ref } from "vue";

export type BreevSeshRoundRecord = {
  holdDurationMs: number;
};
export type BreevSeshRecord = {
  rounds: BreevSeshRoundRecord[];
  breathsPerRound: number;
  avgHoldDurationMs?: number;
  completedAt?: string;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const useBreevSesh = () => {
  const breevSeshStore = useBreevSeshStore();
  const { mainText, subText, isBreathingIn, isHoldingBreath, isActiveSesh } =
    storeToRefs(breevSeshStore);
  const { settings, saveSesh } = breevSeshStore;

  const router = useRouter();

  let seshRecord = ref<BreevSeshRecord>({
    rounds: [],
    breathsPerRound: settings.breaths,
  });

  function _initSeshRecord() {
    seshRecord.value = {
      breathsPerRound: settings.breaths,
      rounds: [],
      completedAt: undefined, // or set this below when you finish
    };
  }

  function _finishSesh() {
    saveSesh(seshRecord.value);
    mainText.value = "";
    subText.value = "";
    isActiveSesh.value = false;
    router.push("/latest");
  }

  function _finishRound(s: BreevSeshSettings) {
    console.log("finishing round, rounds left:", s.rounds);
    if (s.rounds > 1) {
      s.rounds--;
      s.breaths = settings.breaths;
      isBreathingIn.value = false;
      _startRound(s);
    } else {
      _finishSesh();
    }
  }

  function endHoldBreath() {
    const holdDuration = Date.now() - startHoldTime;
    console.log("ending hold, hold duration:", holdDuration);
    seshRecord.value.rounds.push({ holdDurationMs: holdDuration });
    console.log("sesh record:", seshRecord.value);
    isHoldingBreath.value = false;
  }

  let startHoldTime: number;

  async function _holdBreath(s: BreevSeshSettings) {
    startHoldTime = Date.now();
    isBreathingIn.value = false;
    isHoldingBreath.value = true;
    mainText.value = "Hold your breath...";
    subText.value = "as long as you can!";

    // Poll every 200ms to see if user ended the hold
    while (isHoldingBreath.value) {
      if (!isActiveSesh.value) {
        return;
      }
      await delay(50);
    }

    _finishRound(s);
  }

  async function _doRound(s: BreevSeshSettings) {
    subText.value = `${s.breaths} remaining`;

    while (s.breaths >= 0) {
      if (!isActiveSesh.value) {
        return;
      }
      // Breathe in
      isBreathingIn.value = true;
      mainText.value = "Breathe in...";
      subText.value =
        s.breaths > 0
          ? `${s.breaths} remaining`
          : "Get ready to breathe all the way out";
      await delay(s.breathDuration * 1000);

      // Breathe out
      isBreathingIn.value = false;
      mainText.value = "Breathe out...";
      if (s.breaths === 0) {
        subText.value = "alllll the way out!";
      }
      await delay(s.breathDuration * 1000);

      s.breaths--;
    }

    await _holdBreath(s);
  }

  async function _startRound(s: BreevSeshSettings) {
    for (let count = settings.countdown; count >= -1; count--) {
      if (!isActiveSesh.value) {
        return;
      }
      if (count > 0) {
        mainText.value = count > 1 ? count.toString() : "Ready...";
        subText.value = `Round ${settings.rounds - s.rounds + 1} of ${
          settings.rounds
        }`;
      } else if (count === 0) {
        mainText.value = "Start!";
        subText.value = "";
      } else {
        await _doRound(s);
      }
      await delay(1000);
    }
  }

  async function startSesh() {
    isActiveSesh.value = true;
    _initSeshRecord();
    const s = { ...settings };
    await _startRound(s);
  }

  function cancelSesh() {
    isActiveSesh.value = false;
    mainText.value = "";
    subText.value = "";
    isBreathingIn.value = false;
    isHoldingBreath.value = false;
  }

  return {
    startSesh,
    cancelSesh,
    endHoldBreath,
  };
};

export default useBreevSesh;
