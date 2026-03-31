import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const dataDir = join(process.cwd(), 'public/content-data');
const pagesFile = join(dataDir, 'pages.json');

export async function GET(req) {
    try {
        const data = readFileSync(pagesFile, 'utf-8');
        const pages = JSON.parse(data);
        return Response.json(pages);
    } catch (error) {
        return Response.json({ error: 'Failed to fetch pages' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const data = readFileSync(pagesFile, 'utf-8');
        const pages = JSON.parse(data);

        // Update or add page
        const pageIndex = pages.pages.findIndex(p => p.id === body.id);
        if (pageIndex >= 0) {
            pages.pages[pageIndex] = body;
        } else {
            pages.pages.push(body);
        }

        writeFileSync(pagesFile, JSON.stringify(pages, null, 2));
        return Response.json(body);
    } catch (error) {
        return Response.json({ error: 'Failed to save page' }, { status: 500 });
    }
}
