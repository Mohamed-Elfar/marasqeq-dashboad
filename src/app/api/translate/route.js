import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { text, targetLang } = await req.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Determine source language (simple detection: if it contains Arabic characters, it's 'ar')
    const hasArabic = /[\u0600-\u06FF]/.test(text)
    const sourceLang = hasArabic ? 'ar' : 'en'
    const finalTargetLang = targetLang || (sourceLang === 'ar' ? 'en' : 'ar')

    // Using Google Translate free API (gtx client)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${finalTargetLang}&dt=t&q=${encodeURIComponent(text)}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch from translation service')
    }

    const data = await response.json()
    const translatedText = data[0].map(item => item[0]).join('')

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
  }
}
