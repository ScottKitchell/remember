import produce, { Draft } from "immer"
import { useEffect, EffectCallback, useState, useCallback } from "react"
import { AppState, AppStateStatus } from "react-native"

/**
 * Accepts a function that contains imperative, possibly effectful code. This function will only
 * run after the first render.
 *
 * @param effect — Imperative function that can return a cleanup function
 * */
export const useMountEffect = (effect: EffectCallback) => useEffect(effect, [])

export type ImmerHook<S> = [S, (f: (draft: Draft<S>) => void | S) => void]

export function useImmer<S = any>(
  initialValue: S | (() => S),
): [S, (f: (draft: Draft<S>) => void | S) => void]

export function useImmer(initialValue: any) {
  const [val, updateValue] = useState(initialValue)
  return [
    val,
    useCallback(updater => {
      updateValue(produce(updater))
    }, []),
  ]
}

/**
 * Accepts a function that will be called when the app has come to the foreground.
 */
export function useOnAppOpen(handler: () => void) {
  const [appState, setAppState] = useState(AppState.currentState)

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") handler()
      setAppState(nextAppState)
    },
    [appState, handler],
  )

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange)

    return () => {
      AppState.removeEventListener("change", handleAppStateChange)
    }
  }, [handleAppStateChange])
}
