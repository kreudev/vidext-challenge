import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(request: Request) {
  if (!openai) {
    return NextResponse.json(
      { 
        error: 'OpenAI API not configured',
        details: 'Please set OPENAI_API_KEY environment variable'
      },
      { status: 503 }
    );
  }

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a shape generator for Tldraw. Your ONLY task is to convert text descriptions into a valid JSON shape object.

IMPORTANT: You must ONLY output a valid JSON object, no other text or explanation.

Required JSON structure:
{
  "type": "geo",
  "props": {
    "geo": "SHAPE",
    "color": "COLOR",
    "size": "SIZE"
  }
}

Allowed values:
- SHAPE: "rectangle", "ellipse", "triangle", "diamond", "star"
- COLOR: "blue", "red", "green", "yellow"
- SIZE: "s", "m", "l", "xl"

Examples:
"create a red circle" ->
{
  "type": "geo",
  "props": {
    "geo": "ellipse",
    "color": "red",
    "size": "m"
  }
}

"make a big blue square" ->
{
  "type": "geo",
  "props": {
    "geo": "rectangle",
    "color": "blue",
    "size": "xl"
  }
}`
        },
        {
          role: "user",
          content: `Generate a shape JSON for: "${prompt}". Remember to ONLY output the JSON object, nothing else.`
        }
      ],
      temperature: 0,
      max_tokens: 150
    });

    let shapeData;
    const rawResponse = completion.choices[0].message.content;
    console.log('Raw OpenAI Response:', rawResponse);

    try {
      shapeData = JSON.parse(rawResponse || '{}');
      console.log('Parsed Shape Data:', shapeData);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error(`Invalid JSON response: ${rawResponse}`);
    }

    if (shapeData.type !== 'geo') {
      throw new Error('Shape type must be "geo"');
    }

    if (!shapeData.props?.geo || !shapeData.props?.color || !shapeData.props?.size) {
      throw new Error(`Missing required properties. Received: ${JSON.stringify(shapeData)}`);
    }

    const validShapes = ['rectangle', 'ellipse', 'triangle', 'diamond', 'star'];
    const validColors = ['blue', 'red', 'green', 'yellow'];
    const validSizes = ['s', 'm', 'l', 'xl'];

    if (!validShapes.includes(shapeData.props.geo)) {
      throw new Error(`Invalid shape: ${shapeData.props.geo}`);
    }
    if (!validColors.includes(shapeData.props.color)) {
      throw new Error(`Invalid color: ${shapeData.props.color}`);
    }
    if (!validSizes.includes(shapeData.props.size)) {
      throw new Error(`Invalid size: ${shapeData.props.size}`);
    }

    return NextResponse.json({
      type: 'geo',
      props: {
        geo: shapeData.props.geo,
        color: shapeData.props.color,
        size: shapeData.props.size
      }
    });
  } catch (error) {
    console.error('Error details:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate shape',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 