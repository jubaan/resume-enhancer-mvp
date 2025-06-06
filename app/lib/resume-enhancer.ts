import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const ResumeSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    title: z.string(),
    location: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
  }),
  summary: z.string(),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    duration: z.string(),
    location: z.string().optional(),
    achievements: z.array(z.string()),
    technologies: z.array(z.string()),
  })),
  skills: z.object({
    backend: z.array(z.string()),
    frontend: z.array(z.string()),
    databases: z.array(z.string()),
    cloud: z.array(z.string()),
    testing: z.array(z.string()),
    tools: z.array(z.string()),
  }),
  education: z.array(z.object({
    degree: z.string(),
    school: z.string(),
    duration: z.string(),
    description: z.string().optional(),
  })),
  languages: z.array(z.string()),
});

export type EnhancedResume = z.infer<typeof ResumeSchema>;

export async function enhanceResume(
  resumeText: string,
  targetRole: string,
  instructions?: string,
  clientContext?: string
): Promise<EnhancedResume> {
  const prompt = `
You are a professional resume writer specializing in tech roles. 
Enhance this resume for a ${targetRole} position.

ORIGINAL RESUME:
${resumeText}

REQUIREMENTS:
- Keep all facts accurate and truthful
- Improve formatting and structure
- Quantify achievements where possible
- Organize skills by relevant categories
- Write a compelling professional summary
- Optimize for ${targetRole} role
${instructions ? `- Special focus: ${instructions}` : ''}
${clientContext ? `- Target industry: ${clientContext}` : ''}

CONSTRAINTS:
- Do NOT add fake experience or skills
- Do NOT inflate job titles or responsibilities
- Do NOT change dates or company names
- DO enhance language and presentation
- DO reorganize for better readability
- DO use action verbs and quantified achievements

Please structure the response according to the provided schema.
  `;

  try {
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: ResumeSchema,
      prompt,
    });

    return object;
  } catch (error) {
    throw new Error(`Failed to enhance resume: ${error.message}`);
  }
}