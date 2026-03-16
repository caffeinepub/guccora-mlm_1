import { useState } from "react";

const SESSION_KEY = "guccora_mobile_session";

interface MobileSession {
  phone: string;
  name: string;
  isLoggedIn: boolean;
}

function readSession(): MobileSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MobileSession;
  } catch {
    return null;
  }
}

export function useMobileSession() {
  const [mobileSession, setMobileSessionState] = useState<MobileSession | null>(
    () => readSession(),
  );

  const setMobileSession = (phone: string, name: string) => {
    const session: MobileSession = { phone, name, isLoggedIn: true };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setMobileSessionState(session);
  };

  const clearMobileSession = () => {
    localStorage.removeItem(SESSION_KEY);
    setMobileSessionState(null);
  };

  return { mobileSession, setMobileSession, clearMobileSession };
}
