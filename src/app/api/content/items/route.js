import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const dataDir = join(process.cwd(), 'public/content-data');
const itemsFile = join(dataDir, 'items.json');

const defaultData = { properties: [], news: [] };

function getItemsFile() {
    try {
        const data = readFileSync(itemsFile, 'utf-8');
        return JSON.parse(data);
    } catch {
        writeFileSync(itemsFile, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // 'properties' or 'news'

        const data = getItemsFile();

        if (type && data[type]) {
            return Response.json({ [type]: data[type] });
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error: 'Failed to fetch items' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { type, item } = body; // type: 'properties' or 'news'

        const data = getItemsFile();

        if (!data[type]) {
            data[type] = [];
        }

        // Generate ID if not present
        if (!item.id) {
            item.id = Date.now().toString();
        }

        // Update or add item
        const itemIndex = data[type].findIndex(i => i.id === item.id);
        if (itemIndex >= 0) {
            data[type][itemIndex] = item;
        } else {
            data[type].push(item);
        }

        writeFileSync(itemsFile, JSON.stringify(data, null, 2));
        return Response.json(item);
    } catch (error) {
        return Response.json({ error: 'Failed to save item' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const id = searchParams.get('id');

        const data = getItemsFile();

        if (data[type]) {
            data[type] = data[type].filter(item => item.id !== id);
            writeFileSync(itemsFile, JSON.stringify(data, null, 2));
        }

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: 'Failed to delete item' }, { status: 500 });
    }
}
