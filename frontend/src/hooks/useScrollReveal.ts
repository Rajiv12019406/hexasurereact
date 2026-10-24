import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(threshold = 0.1, rootMargin = '0px') {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, isVisible }
}

export function useScrollRevealMultiple(count: number, threshold = 0.1) {
  const refs = useRef<(HTMLElement | null)[]>(new Array(count).fill(null))
  const [visible, setVisible] = useState<boolean[]>(new Array(count).fill(false))
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const index = refs.current.indexOf(entry.target as HTMLElement)
          if (index !== -1 && entry.isIntersecting) {
            setVisible(prev => {
              const next = [...prev]
              next[index] = true
              return next
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    refs.current.forEach((el, i) => {
      if (el) observer.observe(el)
    })

    if (container) observer.observe(container)

    return () => observer.disconnect()
  }, [threshold])

  const setRef = (index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el
  }

  return { ref: containerRef, setRef, visible }
}