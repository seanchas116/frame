interface ResizeObserver {
  observe (e: Element): void
  unobserve (e: Element): void
}

interface ResizeObserverStatic {
  new (callback: () => void): ResizeObserver
}
declare var ResizeObserver: ResizeObserverStatic
