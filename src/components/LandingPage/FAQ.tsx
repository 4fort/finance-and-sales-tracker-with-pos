import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'

export function FAQ() {
  return (
    <section
      id="faq"
      className="w-full py-12 md:py-24 lg:py-32 px-4 md:px-6 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-3xl mx-auto">
          {[
            {
              question: 'How easy is it to migrate from my current platform?',
              answer:
                'We offer seamless migration tools and dedicated support to ensure a smooth transition from your current platform. Our team will guide you through the entire process.',
            },
            {
              question: 'Can I customize the admin interface?',
              answer:
                'Yes, our platform offers extensive customization options. You can tailor the dashboard, reports, and even create custom modules to fit your specific business needs.',
            },
            {
              question: 'What kind of support do you offer?',
              answer:
                'We provide 24/7 customer support via email and chat for all plans. Our Pro and Enterprise plans also include priority phone support and a dedicated account manager.',
            },
            {
              question: 'Is there a free trial available?',
              answer:
                'Yes, we offer a 14-day free trial for our Starter and Pro plans. You can explore all features risk-free and decide which plan best suits your needs.',
            },
          ].map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
