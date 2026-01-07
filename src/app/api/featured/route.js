import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const configPath = path.join(process.cwd(), 'prisma', 'featured_config.json');

// GET handler to retrieve the featured grid configuration
export async function GET() {
  try {
    const fileContent = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(fileContent);
    return NextResponse.json(config);
  } catch (error) {
    // If the file doesn't exist, return a default configuration
    if (error.code === 'ENOENT') {
      return NextResponse.json({ layout: 'hero', exhibitIds: [] });
    }
    return NextResponse.json({ message: 'Error reading configuration' }, { status: 500 });
  }
}

// POST handler to save the featured grid configuration
export async function POST(request) {
  try {
    const newConfig = await request.json();
    if (!newConfig || !newConfig.layout || !Array.isArray(newConfig.exhibitIds)) {
      return NextResponse.json({ message: 'Invalid configuration format' }, { status: 400 });
    }
    await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2));
    return NextResponse.json({ message: 'Configuration saved successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error saving configuration' }, { status: 500 });
  }
}

// DELETE handler to reset the configuration
export async function DELETE() {
    try {
      await fs.unlink(configPath);
      return NextResponse.json({ message: 'Configuration reset successfully' });
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, which is fine.
        return NextResponse.json({ message: 'Configuration is already reset' });
      }
      return NextResponse.json({ message: 'Error resetting configuration' }, { status: 500 });
    }
  }
