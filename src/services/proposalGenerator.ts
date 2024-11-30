import { Template, Opportunity, PricingCalculation } from '../types';

interface ProposalSection {
  title: string;
  content: string;
}

export const generateProposal = (
  opportunity: Opportunity,
  templates: Template[],
  pricing: PricingCalculation
): ProposalSection[] => {
  const coverLetterTemplate = templates.find(t => t.category === 'cover_letter');
  const technicalTemplate = templates.find(t => t.category === 'technical');
  const pastPerfTemplate = templates.find(t => t.category === 'past_performance');
  const capabilityTemplate = templates.find(t => t.category === 'capability_statement');

  const sections: ProposalSection[] = [
    {
      title: 'Cover Letter',
      content: generateCoverLetter(opportunity, coverLetterTemplate)
    },
    {
      title: 'Executive Summary',
      content: generateExecutiveSummary(opportunity, capabilityTemplate)
    },
    {
      title: 'Technical Approach',
      content: generateTechnicalSection(opportunity, technicalTemplate)
    },
    {
      title: 'Past Performance',
      content: generatePastPerformance(pastPerfTemplate)
    },
    {
      title: 'Pricing',
      content: generatePricingSection(pricing)
    }
  ];

  return sections;
};

const generateCoverLetter = (opportunity: Opportunity, template?: Template): string => {
  if (!template) {
    return `[Company Letterhead]
[Date]

[Contracting Officer]
${opportunity.agency}

RE: ${opportunity.noticeId} - ${opportunity.title}

Dear Contracting Officer,

[Company Name] is pleased to submit our proposal for the above-referenced opportunity...`;
  }

  return template.content
    .replace('[Project Title]', opportunity.title)
    .replace('[Solicitation Number]', opportunity.noticeId)
    .replace('[Agency Name]', opportunity.agency)
    .replace('[Date]', new Date().toLocaleDateString());
};

const generateExecutiveSummary = (opportunity: Opportunity, template?: Template): string => {
  if (!template) {
    return `# Executive Summary

## Overview
This proposal is in response to ${opportunity.noticeId} for ${opportunity.title}, issued by ${opportunity.agency}.

## Our Approach
[Company Name] proposes a comprehensive solution that meets or exceeds all requirements...`;
  }

  return template.content;
};

const generateTechnicalSection = (opportunity: Opportunity, template?: Template): string => {
  if (!template) {
    return `# Technical Approach

## Understanding of Requirements
[Company Name] thoroughly understands the requirements outlined in the Statement of Work...

## Technical Solution
Our approach incorporates industry best practices and proven methodologies...`;
  }

  return template.content;
};

const generatePastPerformance = (template?: Template): string => {
  if (!template) {
    return `# Past Performance

## Reference 1
[Contract details and performance description...]

## Reference 2
[Contract details and performance description...]`;
  }

  return template.content;
};

const generatePricingSection = (pricing: PricingCalculation): string => {
  const laborTotal = pricing.laborRates.reduce((sum, item) => sum + (item.rate * item.hours), 0);
  const materialsTotal = pricing.materials.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const subtotal = laborTotal + materialsTotal;
  const overheadAmount = subtotal * (pricing.overhead / 100);
  const profitAmount = (subtotal + overheadAmount) * (pricing.profit / 100);
  
  return `# Price Proposal

## Labor Costs
${pricing.laborRates.map(rate => `- ${rate.role}: $${rate.rate.toLocaleString()}/hr × ${rate.hours} hours = $${(rate.rate * rate.hours).toLocaleString()}`).join('\n')}

Total Labor: $${laborTotal.toLocaleString()}

## Materials
${pricing.materials.map(material => `- ${material.item}: $${material.unitPrice.toLocaleString()} × ${material.quantity} = $${(material.unitPrice * material.quantity).toLocaleString()}`).join('\n')}

Total Materials: $${materialsTotal.toLocaleString()}

## Cost Summary
- Direct Costs: $${subtotal.toLocaleString()}
- Overhead (${pricing.overhead}%): $${overheadAmount.toLocaleString()}
- Profit (${pricing.profit}%): $${profitAmount.toLocaleString()}

Total Proposed Price: $${pricing.totalPrice.toLocaleString()}`;
};

export const generateGoogleDocsContent = (sections: ProposalSection[]): string => {
  return sections.map(section => `# ${section.title}\n\n${section.content}`).join('\n\n');
};

export const generateWordContent = (sections: ProposalSection[]): string => {
  return sections.map(section => `${section.title}\n\n${section.content}`).join('\n\n');
};