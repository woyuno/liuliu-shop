import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useSpecStore = defineStore('spec', () => {
  const specText = ref<string>('')
  const count = ref<number>(1)
  const total = ref<number>(0)
  function setSpec(spec: string) {
    specText.value = spec
  }
  function setCount(num: number) {
    count.value = num
  }
  function setTotal(num: number) {
    total.value = num
  }
  return { specText, setSpec, count, setCount, total, setTotal }
})
