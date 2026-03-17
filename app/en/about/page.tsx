import type { Metadata } from 'next'
import Container from '@/components/Container'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { getAllMarkdown, markdownToHtml } from '@/lib/markdown'

export async function generateMetadata(): Promise<Metadata> {
  const aboutPage = await getAllMarkdown('en').then(data => data.find(page => page.slug === 'about' || page.slug === 'despre-noi'))
  
  return {
    title: aboutPage?.title || 'About Us',
    description: aboutPage?.description || 'Meet our team and our history.',
  }
}

export default async function AboutPage() {
  const aboutPage = await getAllMarkdown('en').then(data => data.find(page => page.slug === 'about' || page.slug === 'despre-noi'))
  
  if (!aboutPage) {
    return (
      <Container>
        <div className="py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Page not found</h1>
          <p className="text-gray-600">The About Us content is missing.</p>
        </div>
      </Container>
    )
  }

  const contentHtml = await markdownToHtml(aboutPage.content)

  return (
    <>
      {/* Hero */}
      <section className="bg-primary-700 text-white py-10 md:py-12">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">{aboutPage.title}</h1>
            <p className="text-lg md:text-xl text-primary-100 max-w-3xl mx-auto">
              Meet our team, experience and values that set us apart.
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

      {/* Experience Section */}
      <section className="bg-secondary-50 py-16">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Why choose us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-4">10+</div>
                <h3 className="text-xl font-semibold mb-2">Years of Experience</h3>
                <p className="text-gray-600">We have solved thousands of heating central problems</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-4">24/7</div>
                <h3 className="text-xl font-semibold mb-2">Availability</h3>
                <p className="text-gray-600">Emergency interventions whenever you need</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-4">4</div>
                <h3 className="text-xl font-semibold mb-2">Brands</h3>
                <p className="text-gray-600">Specialization in Ariston, Viessmann, Ferroli, Motan</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}