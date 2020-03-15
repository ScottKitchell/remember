import { useEffect, EffectCallback } from 'react'

/**
 * Accepts a function that contains imperative, possibly effectful code. This function will only
 * run after the first render.
 *
 * @param effect — Imperative function that can return a cleanup function
 * */
export const useMountEffect = (effect: EffectCallback) => useEffect(effect, [])
