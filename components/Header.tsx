'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface NavItem {
  id: string
  labelRo: string
  labelEn: string
  hrefRo: string
  hrefEn: string
}

const navigation: NavItem[] = [
  { id: 'home', labelRo: 'Acasă', labelEn: 'Home', hrefRo: '/', hrefEn: '/en/' },
  { id: 'about', labelRo: 'Despre Noi', labelEn: 'About Us', hrefRo: '/despre-noi/', hrefEn: '/en/about/' },
  { id: 'services', labelRo: 'Servicii', labelEn: 'Services', hrefRo: '/servicii/', hrefEn: '/en/services/' },
  { id: 'contact', labelRo: 'Contact', labelEn: 'Contact', hrefRo: '/contact/', hrefEn: '/en/contact/' },
]

const languages = [
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

export default function Header() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  
  const isEnglish = pathname.startsWith('/en')
  const currentLang = isEnglish ? 'en' : 'ro'
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const getNavLabel = (item: NavItem) => {
    return isEnglish ? item.labelEn : item.labelRo
  }

  if (!mounted) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <nav className="container">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-200 rounded"></div>
              <div className="h-6 w-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </nav>
      </header>
    )
  }

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={isEnglish ? '/en/' : '/'} className="flex items-center space-x-3">
            <div className="relative h-10 w-10">
              <Image
                src="/logo-broz.png"
                alt="Centrala Termică Service"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-primary-700 hidden sm:block">
              Centrala Termică Service
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const href = isEnglish ? item.hrefEn : item.hrefRo
              const isActive = pathname === href
              return (
                <Link
                  key={item.id}
                  href={href}
                  className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                    isActive
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-700'
                  }`}
                >
                  {getNavLabel(item)}
                </Link>
              )
            })}
          </div>

          {/* Language Switcher & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                aria-expanded={langMenuOpen}
              >
                <span className="text-lg">{currentLanguage.flag}</span>
                <span>{currentLanguage.name}</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  {languages
                    .filter(lang => lang.code !== currentLang)
                    .map((lang) => {
                      const newPath = isEnglish ? pathname.replace('/en', `/${lang.code}`) : (pathname === '/' ? `/${lang.code}/` : `/${lang.code}${pathname}`)
                      // Ensure we don't double up slashes
                      const normalizedPath = newPath.replace(/\/\//g, '/')
                      return (
                        <Link
                          key={lang.code}
                          href={normalizedPath}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setLangMenuOpen(false)}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </Link>
                      )
                    })}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href={isEnglish ? '/en/contact/' : '/contact/'}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
            >
              {currentLang === 'ro' ? 'Sună Acum' : 'Call Now'}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600"
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            aria-expanded="false"
          >
            <span className="sr-only">Open menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {langMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {/* Language switcher mobile */}
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  {currentLang === 'ro' ? 'Limba / Language' : 'Language'}
                </p>
                <div className="flex space-x-2">
                  {languages.map((lang) => {
                    const newPath = isEnglish ? pathname.replace('/en', `/${lang.code}`) : (pathname === '/' ? `/${lang.code}/` : `/${lang.code}${pathname}`)
                    const normalizedPath = newPath.replace(/\/\//g, '/')
                    return (
                      <Link
                        key={lang.code}
                        href={normalizedPath}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm ${
                          lang.code === currentLang
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setLangMenuOpen(false)}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
              
              {/* Navigation links */}
              {navigation.map((item) => {
                const href = isEnglish ? item.hrefEn : item.hrefRo
                const isActive = pathname === href
                return (
                  <Link
                    key={item.id}
                    href={href}
                    className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setLangMenuOpen(false)}
                  >
                    {getNavLabel(item)}
                  </Link>
                )
              })}
              <Link
                href={isEnglish ? '/en/contact/' : '/contact/'}
                className="mx-3 mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
                onClick={() => setLangMenuOpen(false)}
              >
                {currentLang === 'ro' ? 'Sună Acum' : 'Call Now'}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}