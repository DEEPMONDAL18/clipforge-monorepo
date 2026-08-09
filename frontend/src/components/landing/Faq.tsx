import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

const FAQ_ITEMS = [
  {
    question: 'Does splitting reduce video quality?',
    answer:
      'No. ClipForge copies the original video and audio streams instead of re-encoding them, so every clip is bit-identical to the corresponding section of your source file.'
  },
  {
    question: 'How large can my video be?',
    answer:
      'Up to 20 GB per file. Uploads are chunked, so large masters transfer reliably even on unstable connections.'
  },
  {
    question: 'How long are my files kept?',
    answer:
      'One hour from the moment processing completes. A countdown in the workspace shows the exact deletion time, after which both the source video and the generated clips are removed permanently.'
  },
  {
    question: 'Do I need an account?',
    answer:
      'No. There is no sign-up, no email, and no payment. Each job lives only in your browser session and on the processing server until it expires.'
  },
  {
    question: 'Which formats are supported?',
    answer:
      'MP4, MOV, MKV, WEBM, AVI and M4V. Clips are always returned in the same container as the source file.'
  },
  {
    question: 'Can I close the tab while processing?',
    answer:
      'Processing continues on the server, but the job identifier is held in this session. Keep the tab open to receive progress updates and download links.'
  }
] as const;

/** Six questions, answered plainly. */
export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="border-t py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 id="faq-heading" className="text-h1 font-semibold tracking-tight">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="mt-10">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="text-left text-small font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-small text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
