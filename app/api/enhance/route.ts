import { NextRequest, NextResponse } from 'next/server';
import { enhanceResume } from '@/app/lib/resume-enhancer';
import { generateHTMLResume } from '@/app/lib/template-generator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, targetRole, instructions, clientContext } = body;

    if (!text || !targetRole) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const enhancedData = await enhanceResume(
      text,
      targetRole,
      instructions,
      clientContext
    );

    const htmlResume = generateHTMLResume(enhancedData);

    return NextResponse.json({
      success: true,
      data: {
        enhanced: enhancedData,
        html: htmlResume
      }
    });

  } catch (error) {
    console.error('Enhancement error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance resume' },
      { status: 500 }
    );
  }
}