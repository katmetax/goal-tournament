import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useJourneyStore = defineStore('journey', () => {
  const deck = ref<string[]>([])
  const kept = ref<string[]>([])
  const target = ref(3)
  const winners = ref<string[]>([])

  function setDeck(newDeck: string[]) {
    deck.value = newDeck
  }

  function setKept(cards: string[]) {
    kept.value = cards
  }

  function setTarget(n: number) {
    target.value = n
  }

  function setWinners(cards: string[]) {
    winners.value = cards
  }

  function reset() {
    deck.value = []
    kept.value = []
    target.value = 3
    winners.value = []
  }

  return { deck, kept, target, winners, setDeck, setKept, setTarget, setWinners, reset }
})
