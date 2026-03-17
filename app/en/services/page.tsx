import type { Metadata } from 'next'
import Container from '@/components/Container'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { getAllMarkdown, markdownToHtml } from '@/lib/markdown'

export async function generateMetadata(): Promise<Metadata> {
  const servicesPage = await getAllMarkdown('en').then(data => data.find(page => page.slug === 'services' || page.slug === 'servicii'))
  
  return {
    title: servicesPage?.title || 'Services',
    description: servicesPage?.description || 'Complete repair, maintenance and heating central installation services.',
  }
}

export default async function ServicesPage() {
  const servicesPage = await getAllMarkdown('en').then(data => data.find(page => page.slug === 'services' || page.slug === 'servicii'))
  
  if (!servicesPage) {
    return (
      <Container>
        <div className="py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Page not found</h1>
          <p className="text-gray-600">The Services content is missing.</p>
        </div>
      </Container>
    )
  }

  const contentHtml = await markdownToHtml(servicesPage.content)

  return (
    <>
      {/* Hero */}
      <section className="bg-primary-700 text-white py-10 md:py-12">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">{servicesPage.title}</h1>
            <p className="text-lg md:text-xl text-primary-100 max-w-3xl mx-auto">
              We offer complete solutions for heating centrals, from emergency repairs to preventive maintenance and new installations.
            </p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <MarkdownRenderer content={contentHtml} />
          </div>
        </Container>
      </section>

      {/* Quick Contact CTA */}
      <section className="bg-secondary-50 py-12">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need heating central services?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Contact us for a free evaluation. Our technicians are available 24/7 for emergencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/en/contact/"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
              >
                Request Free Quote
              </a>
              <a
                href="tel:0722123456"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-primary-700 border-2 border-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                Call Now: 0722 123 456
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}