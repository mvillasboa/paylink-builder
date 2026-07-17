import { useCallback, useEffect, useState } from "react";
import {
  ONBOARDING_STORAGE_KEY,
  OnboardingState,
  initialOnboardingState,
} from "@/data/mockOnboarding";

function readState(): OnboardingState {
  if (typeof window === "undefined") return initialOnboardingState;
  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return initialOnboardingState;
    return { ...initialOnboardingState, ...JSON.parse(raw) };
  } catch {
    return initialOnboardingState;
  }
}

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(readState);

  useEffect(() => {
    try {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const update = useCallback((patch: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setState(initialOnboardingState);
    try {
      window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { state, update, reset };
}
