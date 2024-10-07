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
      className="w-full min-h-[90vh] py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800 px-4 md:px-6 flex flex-row justify-center items-center">
      <div className="w-[90%] md:w-[70%] flex flex-col space-y-12">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
            Frequently Asked Questions
          </h2>
          <p
            className="
            text-center
            max-w-[600px]
            mx-auto
            mt-4
            text-gray-700
            dark:text-gray-300
            md:text-xl
          ">
            Find answers to common queries about our platform and services.
          </p>
        </div>
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
              <AccordionTrigger className='text-2xl'>{item.question}</AccordionTrigger>
              <AccordionContent className='text-md'>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
