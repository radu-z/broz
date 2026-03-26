import type { Metadata } from 'next'

import fs from 'node:fs'
import path from 'node:path'

import Container from '@/components/Container'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { getAllMarkdown, getMarkdownBySlug } from '@/lib/markdown'

type Params = {
  segments?: string[]
}

type Locale = 'ro' | 'en'

type SiteMetadataJson = {
  title?: string | { default?: string; template?: string }
  description?: string
}

const DEFAULT_RO_SITE_METADATA: SiteMetadataJson = {
  title: {
    default: 'Centrala Termică Service - Reparații și Mentenanță',
    template: '%s | Centrala Termică Service',
  },
  description: 'Servicii profesionale de reparații, mentenanță și instalare de centrale termice.',
}

function readSiteMetadata(locale: Locale): SiteMetadataJson {
  const safeReadJson = (p: string): SiteMetadataJson | null => {
    try {
      const raw = fs.readFileSync(p, 'utf-8')
      if (!raw || raw.trim().length === 0) return null
      return JSON.parse(raw) as SiteMetadataJson
    } catch {
      return null
    }
  }

  const base = process.cwd()
  const primaryPath = path.join(base, 'content', locale, 'metadata.json')
  const roPath = path.join(base, 'content', 'ro', 'metadata.json')

  const primary = safeReadJson(primaryPath)
  const ro = locale === 'ro' ? null : safeReadJson(roPath)

  const title = primary?.title ?? ro?.title ?? DEFAULT_RO_SITE_METADATA.title
  const description = primary?.description ?? ro?.description ?? DEFAULT_RO_SITE_METADATA.description

  return {
    title,
    description,
  }
}

function getDefaultTitle(meta: SiteMetadataJson): string | undefined {
  if (!meta.title) return undefined
  if (typeof meta.title === 'string') return meta.title
  if (typeof meta.title === 'object' && typeof meta.title.default === 'string') return meta.title.default
  return undefined
}

function parseRoute(segments?: string[]) {
  const parts = segments ?? []
  const first = parts[0]

  const hasLocalePrefix = first === 'en' || first === 'ro'
  const locale = hasLocalePrefix ? (first as 'en' | 'ro') : 'ro'
  const slugParts = hasLocalePrefix ? parts.slice(1) : parts
  const slug = slugParts.length === 0 ? 'index' : slugParts.join('/')

  return { locale, slug }
}

export async function generateStaticParams(): Promise<Params[]> {
  const params: Params[] = []

  // Romanian root: / -> catch-all gets zero segments -> empty array
  params.push({ segments: [] })
  // English root: /en -> catch-all gets one segment: 'en'
  params.push({ segments: ['en'] })

  const [roPages, enPages] = await Promise.all([getAllMarkdown('ro'), getAllMarkdown('en')])

  for (const page of roPages) {
    if (!page.slug || page.slug === 'index') continue
    params.push({ segments: page.slug.split('/') })
  }

  for (const page of enPages) {
    if (!page.slug || page.slug === 'index') continue
    params.push({ segments: ['en', ...page.slug.split('/')] })
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params> | Params
}): Promise<Metadata> {
  const resolved = await params
  const { locale, slug } = parseRoute(resolved.segments)

  const siteMeta = readSiteMetadata(locale)
  const siteTitle = getDefaultTitle(siteMeta)
  const siteDescription = siteMeta.description

  const page = await getMarkdownBySlug(slug, locale)

  const isHome = slug === 'index'

  const title = isHome
    ? siteTitle
    : (page?.title ?? siteTitle ?? (locale === 'en' ? 'Page Not Found' : 'Pagina nu a fost gasita'))

  const description = isHome ? siteDescription : (page?.excerpt || page?.description || siteDescription)

  return {
    title,
    description,
  }
}

interface PageProps {
  params: Promise<Params> | Params
}

export default async function Page({ params }: PageProps) {
  const resolved = await params
  const { locale, slug } = parseRoute(resolved.segments)
  const isEnglish = locale === 'en'

  const page = await getMarkdownBySlug(slug, locale)

  if (!page) {
    return (
      <Container>
        <div className="py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{isEnglish ? 'Page Not Found' : 'Pagina nu a fost gasita'}</h1>
          <p className="text-gray-600">
            {isEnglish ? 'The page you are looking for does not exist.' : 'Pagina pe care o cauti nu exista.'}
          </p>
        </div>
      </Container>
    )
  }

  const isHome = slug === 'index'
  const excerpt = page.excerpt ? page.excerpt : page.content.split('\n\n')[0]

  if (isHome) {
    return (
      <>
        <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
          <div className="container py-8 md:py-10 lg:py-12">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                {page.title}
              </h1>
              <div className="text-lg md:text-xl mb-6 md:mb-8 leading-relaxed max-w-3xl mx-auto">
                <MarkdownRenderer content={excerpt} invert />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={isEnglish ? '/en/about/' : '/despre-noi/'}
                  className="inline-flex items-center justify-center px-6 md:px-8 py-2.5 md:py-3 text-base font-medium text-primary-700 bg-white hover:bg-primary-50 rounded-lg transition-colors shadow-lg"
                >
                  {isEnglish ? 'Learn More' : 'Afla Mai Multe'}
                </a>
                <a
                  href={isEnglish ? '/en/services/' : '/servicii/'}
                  className="inline-flex items-center justify-center px-6 md:px-8 py-2.5 md:py-3 text-base font-medium text-white border-2 border-white hover:bg-white hover:text-primary-700 rounded-lg transition-colors"
                >
                  {isEnglish ? 'View Services' : 'Vezi Serviciile'}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <Container>
            <div className="max-w-4xl mx-auto">
              <MarkdownRenderer content={page.content} />
            </div>
          </Container>
        </section>

        <section className="bg-secondary-50 py-16">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">10+</div>
                <div className="text-gray-700 font-medium">{isEnglish ? 'Years Experience' : 'Ani de Experienta'}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
                <div className="text-gray-700 font-medium">{isEnglish ? 'Emergency Availability' : 'Disponibilitate Urgente'}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
                <div className="text-gray-700 font-medium">{isEnglish ? 'Satisfied Clients' : 'Clienti Satisfacuti'}</div>
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-primary-700 text-white py-16">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                {isEnglish ? 'Need urgent intervention?' : 'Ai nevoie de interventie urgenta?'}
              </h2>
              <p className="text-xl text-primary-200 mb-8">
                {isEnglish
                  ? 'Contact us now to schedule a technician. We serve Bucharest and Ilfov.'
                  : 'Contacteaza-ne imediat pentru a programa un tehnician. Servim Bucuresti si Ilfov.'}
              </p>
              <a
                href={isEnglish ? '/en/contact/' : '/contact/'}
                className="inline-flex items-center justify-center px-10 py-4 text-lg font-medium text-primary-700 bg-white hover:bg-primary-50 rounded-lg transition-colors shadow-lg"
              >
                {isEnglish ? 'Call Now' : 'Suna Acum'}
              </a>
            </div>
          </Container>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="bg-primary-700 text-white py-10 md:py-12">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">{page.title}</h1>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <MarkdownRenderer content={page.content} />
          </div>
        </Container>
      </section>
    </>
  )
}
