import { ref } from 'vue'

const globalLoading = ref(false)
const loadingText = ref('')

export function useGlobalLoading() {
  const setLoading = (loading: boolean, text: string = '') => {
    globalLoading.value = loading
    loadingText.value = text
  }

  const startLoading = (text: string = '') => {
    setLoading(true, text)
  }

  const stopLoading = () => {
    setLoading(false, '')
  }

  return {
    isLoading: globalLoading,
    loadingText,
    setLoading,
    startLoading,
    stopLoading
  }
}
