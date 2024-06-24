import { DEVCONNECT_2023_END, DEVCONNECT_2023_START } from "./sharedConstants";

export function isDuringDevconnect(): boolean {
  const currentTimeMs = new Date().getTime();
  return (
    currentTimeMs >= DEVCONNECT_2023_START &&
    currentTimeMs < DEVCONNECT_2023_END
  );
}

export function getOutdatedBrowserErrorMessage(): string {
  let outdatedBrowserErrorMessage =
    "Proof failed. Please update your browser and device to the latest version. ";
  outdatedBrowserErrorMessage += isDuringDevconnect()
    ? "If you are currently at Devconnect, you may visit the Zupass Help Desk at the entrance of the Istanbul Congress Center (ICC) for support."
    : "If you are still having issues, please send an email to support@zupass.org.";
  return outdatedBrowserErrorMessage;
}

export function getOOMErrorMessage(): string {
  return `Oops! Please try closing the other tabs in your browser and reloading this page to try again.`;
}
