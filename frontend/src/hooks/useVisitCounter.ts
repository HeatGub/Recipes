import { useEffect } from "react"
import { Counter } from "counterapi"

export function useVisitCounter(
  workspace: string = "heatgubs-workspace-slug",
  counterName: string = "recipe-views",
  refreshCounterName = "recipe-refreshes"
) {
  useEffect(() => {
    if (import.meta.env.DEV) return

    const counter = new Counter({
      workspace,
      debug: false,
      timeout: 1000,
    })

    // REFRESHES
    counter.up(refreshCounterName).catch(() => {})

    // UNIQUE VIEWS
    const key = `visit-counted-${counterName}`

    if (localStorage.getItem(key)) return

    counter
      .up(counterName) // .reset(counterName)
      .then(() => localStorage.setItem(key, "true"))
      .catch(() => {})
    //   .catch((err) => console.error("CounterAPI increment views failed:", err))
  }, [workspace, counterName, refreshCounterName])
}
