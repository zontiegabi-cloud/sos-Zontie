import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DynamicContentSource, FAQItem } from '@/lib/content-store';
import { ContentItem } from './types';

export function AccordionView({ items, source }: { items: ContentItem[], source: DynamicContentSource }) {
  return (
    <Accordion type="single" collapsible className="space-y-4 w-full">
      {items.map((item, index) => {
        // Safe access for FAQ items or fallback properties
        const question = 'question' in item ? (item as FAQItem).question : 'title' in item ? (item as { title: string }).title : 'name' in item ? (item as { name: string }).name : 'Item';
        const answer = 'answer' in item ? (item as FAQItem).answer : 'description' in item ? (item as { description: string }).description : '';

        return (
          <AccordionItem
            key={item.id}
            value={`item-${index}`}
            className="bg-card border border-border rounded px-6 data-[state=open]:border-primary/50 transition-colors"
          >
            <AccordionTrigger className="font-heading text-lg uppercase text-foreground hover:text-primary py-6 text-left">
              {question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
              <div className="prose prose-sm prose-invert max-w-none whitespace-pre-line">
                {answer}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
