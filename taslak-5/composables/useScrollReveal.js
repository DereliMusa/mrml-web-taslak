// composables/useScrollReveal.js
// Scroll-reveal animasyonlarini Vue lifecycle ile yonet

export function useScrollReveal() {
  function initScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal')
    const checkReveal = () => {
      const triggerBottom = window.innerHeight * 0.85
      elements.forEach(el => {
        if (el.getBoundingClientRect().top < triggerBottom) {
          const delay = el.getAttribute('data-delay') || 0
          setTimeout(() => el.classList.add('visible'), parseInt(delay))
        }
      })
    }
    checkReveal()
    window.addEventListener('scroll', checkReveal, { passive: true })
    return () => window.removeEventListener('scroll', checkReveal)
  }

  onMounted(() => {
    const cleanup = initScrollReveal()
    onUnmounted(cleanup)
  })
}
