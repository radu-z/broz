'use client'

import { useState } from 'react'

interface ContactFormClientProps {
  lang: 'ro' | 'en'
}

export default function ContactFormClient({ lang }: ContactFormClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form submitted:', data)
      setSubmitStatus('success')
      e.currentTarget.reset()
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const labels = {
    fullName: lang === 'ro' ? 'Nume complet *' : 'Full name *',
    email: lang === 'ro' ? 'Email *' : 'Email *',
    phone: lang === 'ro' ? 'Telefon *' : 'Phone *',
    subject: lang === 'ro' ? 'Subiect' : 'Subject',
    selectSubject: lang === 'ro' ? 'Selectează...' : 'Select...',
    emergency: lang === 'ro' ? 'Urgență - defecțiune centrală' : 'Emergency - heating central failure',
    maintenance: lang === 'ro' ? 'Întreținere programată' : 'Scheduled maintenance',
    installation: lang === 'ro' ? 'Instalare nouă / înlocuire' : 'New installation / replacement',
    consultation: lang === 'ro' ? 'Consultanță tehnică' : 'Technical consultation',
    other: lang === 'ro' ? 'Altul' : 'Other',
    message: lang === 'ro' ? 'Mesaj *' : 'Message *',
    placeholderMessage: lang === 'ro' ? 'Descrieți problema sau solicitarea dvs...' : 'Describe your problem or request...',
    submit: lang === 'ro' ? 'Trimite Mesaj' : 'Send Message',
    requiredFields: lang === 'ro' ? '* Câmpurile marcate sunt obligatorii. Vă promitem răspunsul în maxim 24 de ore.' : '* Required fields. We promise to respond within 24 hours.',
  }

  return (
    <div className="bg-white">
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">{lang === 'ro' ? 'Mesaj trimis cu succes!' : 'Message sent successfully!'}</p>
          <p className="text-green-700 text-sm mt-1">{lang === 'ro' ? 'Vă vom contacta în cel mai scurt timp.' : 'We will contact you shortly.'}</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">{lang === 'ro' ? 'A apărut o eroare' : 'An error occurred'}</p>
          <p className="text-red-700 text-sm mt-1">{lang === 'ro' ? 'Vă rugăm să încercați din nou sau contactați-ne direct.' : 'Please try again or contact us directly.'}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {labels.fullName}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={lang === 'ro' ? 'Ion Popescu' : 'John Doe'}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {labels.email}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="ion@email.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            {labels.phone}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="0722 123 456"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            {labels.subject}
          </label>
          <select
            id="subject"
            name="subject"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">{labels.selectSubject}</option>
            <option value="emergency">{labels.emergency}</option>
            <option value="maintenance">{labels.maintenance}</option>
            <option value="installation">{labels.installation}</option>
            <option value="consultation">{labels.consultation}</option>
            <option value="other">{labels.other}</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            {labels.message}
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
            placeholder={labels.placeholderMessage}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {lang === 'ro' ? 'Se trimite...' : 'Sending...'}
              </>
            ) : (
              labels.submit
            )}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            {labels.requiredFields}
          </p>
        </div>
      </form>
    </div>
  )
}