// run pnpm test or
// pnpm test:watch

import { mount } from '@vue/test-utils'
import TrueFalse from '@/components/questions/TrueFalse.vue'
import { describe, it, expect } from 'vitest'

describe('TrueFalse Component', () => {
  const sampleExercise = {
    question: 'JavaScript is a programming language',
    correctAnswer: true
  }

  it('renders the question', () => {
    const wrapper = mount(TrueFalse, {
      props: {
        exercise: sampleExercise,
        selectedAnswer: false
      }
    })
    
    expect(wrapper.text()).toContain('JavaScript is a programming language')
  })

  it('renders true and false buttons', () => {
    const wrapper = mount(TrueFalse, {
      props: {
        exercise: sampleExercise,
        selectedAnswer: false
      }
    })
    
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(2)
    expect(buttons[0].text()).toContain('true')
    expect(buttons[1].text()).toContain('false')
  })

  it('emits update-answer event when a choice is selected', async () => {
    const wrapper = mount(TrueFalse, {
      props: {
        exercise: sampleExercise,
        selectedAnswer: false
      }
    })
    
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    
    const emitted = wrapper.emitted('update-answer')
    expect(emitted).toBeTruthy()
    if (emitted) {
      expect(emitted[0]).toEqual([true])
    }
  })
})