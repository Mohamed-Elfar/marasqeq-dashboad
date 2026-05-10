export const translateText = async (text, targetLang = null) => {
  if (!text || text.trim() === '') return ''

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, targetLang }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Translation failed')
    }

    const data = await response.json()
    return data.translatedText
  } catch (error) {
    console.error('Translation helper error:', error)
    return ''
  }
}
