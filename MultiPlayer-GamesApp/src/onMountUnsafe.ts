/*
 * The whole issue of `useEffect` running twice even though no dependency
 * was provided (empty `[]`) is because of React's StrictMode which ran the
 * useEffect 2 (TWO) times only in DEVELOPMENT MODE. So in theory the code
 * should have worked if I built it and then tested it. But since this is like
 * a core feature of the app, I've decided to make a fix
 *
 * I could remove StrictMode, but it might help me in some other place. So
 * instead of removing StrictMode from the app, I decided to make this
 * onMountUnsafe function.
 * This is not recommended, but for now this is the only option I have
 * (other than removing StrictMode)
 *
 * I'm not sure  who in thier right mind decided to run useEffect twice
 * without having a giant banner on the documentation page
 *
 * I had a initial version I made myself, to handle all the edge cases, I
 * copied the code from `https://stackoverflow.com/a/75126229`
 */
import type { EffectCallback } from "react";
import { useEffect, useRef } from "react";

export function useOnMountUnsafe(effect: EffectCallback) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      effect();
    }
  }, []);
}
