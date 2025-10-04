import { z } from 'zod';

export const SupportTicketSchema = z.object({
  name: z.string().describe('The name of the customer'),
  email: z.string().email().describe('The email of the customer'),
  incidentDescription: z.string().describe('The description of the incident'),
  product: z
    .string()
    .optional()
    .describe(
      'Optional: The product that the customer is using. If not provided, assume "unknown"'
    ),
  // Note: Langchain and GenKit both succeed in parsing into proper date here, but AI SDK currently fails
  date: z.string().describe('The date of the incident'),
});
