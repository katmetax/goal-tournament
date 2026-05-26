<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const emit = defineEmits<{ close: [] }>()

const closeBtn = ref<HTMLButtonElement | null>(null)

const STEPS = [
  {
    n: '01',
    title: 'Choose a deck',
    body: 'Start from a curated library of 20 common goals, type your own list, or mix the two.',
  },
  {
    n: '02',
    title: 'Swipe to eliminate',
    body: 'Go through the deck one card at a time. Swipe right (or →) to keep, left (or ←) to pass. Hit Undo if you change your mind.',
  },
  {
    n: '03',
    title: 'Set your target',
    body: 'Decide how many goals you want to end up with — your top 1, 3, 5, whatever feels right.',
  },
  {
    n: '04',
    title: 'Head-to-head tournament',
    body: 'Survivors face off in pairs. Tap the one you want to keep. Repeat until only your target number remains.',
  },
  {
    n: '05',
    title: 'See your winners',
    body: 'The cards left standing are your final goals. You can share the with others if you choose to.',
  },
]

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
  closeBtn.value?.focus()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      class="backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-it-works-title"
      @click.self="emit('close')"
    >
      <div class="panel">
        <button ref="closeBtn" class="close-btn" aria-label="Close" @click="emit('close')">
          ✕
        </button>

        <div class="eyebrow">How it works</div>

        <h2 id="how-it-works-title" class="heading">A quick tour, in 5 steps.</h2>

        <p class="lead">
          <strong>Goal Tournament</strong> helps you narrow a long list of goals down to the few
          that actually matter — first by eliminating, then by crowning.
        </p>

        <ol class="steps">
          <li v-for="step in STEPS" :key="step.n" class="step">
            <div class="step-num" aria-hidden="true">{{ step.n }}</div>
            <div class="step-body">
              <div class="step-title">{{ step.title }}</div>
              <div class="step-desc">{{ step.body }}</div>
            </div>
          </li>
        </ol>

        <div class="footer">
          <div class="esc-hint hide-on-mobile">Press <kbd>Esc</kbd> to close</div>
          <button class="got-it-btn" @click="emit('close')">Got it</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: help-fade-in 0.22s ease-out;
}

.panel {
  position: relative;
  background: var(--bg);
  color: var(--ink);
  border-radius: var(--card-radius);
  border: 1.5px solid var(--rule);
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.35);
  max-width: 560px;
  width: 100%;
  max-height: 88vh;
  overflow-y: auto;
  padding: 36px 36px 32px;
  font-family: var(--font-body);
  animation: help-pop-in 0.28s cubic-bezier(0.2, 0.7, 0.2, 1.2);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 18px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--ink-soft);
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}

.close-btn:hover,
.close-btn:focus-visible {
  background: var(--bg-alt);
  color: var(--ink);
}

.close-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.eyebrow {
  margin-bottom: 10px;
}

.heading {
  font-family: var(--font-display);
  font-size: 38px;
  font-weight: 600;
  line-height: 1.02;
  letter-spacing: -0.025em;
  margin: 0 0 6px;
  text-wrap: balance;
}

.lead {
  font-size: 15px;
  line-height: 1.5;
  color: var(--ink-soft);
  margin: 0 0 26px;
  max-width: 460px;
  text-wrap: pretty;
}

.steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.step-num {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: var(--bg-alt);
  border: 1.5px solid var(--rule);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: 0.04em;
}

.step-body {
  flex: 1;
  padding-top: 2px;
}

.step-title {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ink);
  margin-bottom: 4px;
}

.step-desc {
  font-size: 14.5px;
  line-height: 1.5;
  color: var(--ink-soft);
  text-wrap: pretty;
}

.footer {
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid var(--rule);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.esc-hint {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--ink-soft);
  text-transform: uppercase;
}

kbd {
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 2px 6px;
  border: 1px solid var(--rule);
  border-radius: 4px;
  background: var(--bg-alt);
}

.got-it-btn {
  background: var(--ink);
  color: var(--bg);
  border: none;
  padding: 10px 22px;
  border-radius: var(--button-radius);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.15s;
}

.got-it-btn:hover {
  opacity: 0.85;
}

.got-it-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

@keyframes help-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes help-pop-in {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 780px) {
  .backdrop {
    align-items: flex-end;
    padding: 0;
  }

  .panel {
    max-width: 100%;
    max-height: 92vh;
    border-radius: 28px 28px 0 0;
    padding: 28px 24px 32px;
    animation: help-slide-up 0.3s cubic-bezier(0.2, 0.7, 0.2, 1.1);
  }

  .heading {
    font-size: 28px;
  }

  .hide-on-mobile {
    opacity: 0;
  }
}

@keyframes help-slide-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
