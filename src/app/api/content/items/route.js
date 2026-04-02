import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const dataDir = join(process.cwd(), 'public/content-data');
const itemsFile = join(dataDir, 'items.json');

const defaultData = { properties: [], news: [], services: [], portfolio: [], faq: [], social: [] };

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
        const type = searchParams.get('type'); // 'properties', 'news', 'services', 'portfolio', 'faq', 'social'

        const data = getItemsFile();

        // Initialize social media data if it doesn't exist
        if (!data.social || data.social.length === 0) {
            data.social = [
                {
                    id: '1',
                    name: 'Facebook',
                    icon: 'FaFacebookF',
                    url: 'https://www.facebook.com/maraseqgroup',
                    position: 'both',
                    active: true,
                    order: 1
                },
                {
                    id: '2', 
                    name: 'Twitter',
                    icon: 'FaTwitter',
                    url: 'https://twitter.com/maraseqgroup',
                    position: 'both',
                    active: true,
                    order: 2
                },
                {
                    id: '3',
                    name: 'Instagram', 
                    icon: 'FaInstagram',
                    url: 'https://www.instagram.com/maraseqgroup/',
                    position: 'both',
                    active: true,
                    order: 3
                },
                {
                    id: '4',
                    name: 'LinkedIn',
                    icon: 'FaLinkedin', 
                    url: 'https://www.linkedin.com/in/maraseqgroup/',
                    position: 'both',
                    active: true,
                    order: 4
                }
            ];
            writeFileSync(itemsFile, JSON.stringify(data, null, 2));
        }

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
        const { itemType, item, id } = body; // itemType: 'properties', 'news', 'services', 'portfolio', 'faq'

        const data = getItemsFile();

        if (!data[itemType]) {
            data[itemType] = [];
        }

        // Generate ID if not present
        if (!item.id) {
            item.id = Date.now().toString();
        }

        // Update or add item
        const itemIndex = data[itemType].findIndex(i => i.id === item.id);
        if (itemIndex >= 0) {
            data[itemType][itemIndex] = item;
        } else {
            data[itemType].push(item);
        }

        writeFileSync(itemsFile, JSON.stringify(data, null, 2));
        return Response.json(item);
    } catch (error) {
        return Response.json({ error: 'Failed to save item' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json();
        const { itemType, id } = body; // itemType: 'properties', 'news', 'services', 'portfolio', 'faq'

        const data = getItemsFile();

        if (data[itemType]) {
            data[itemType] = data[itemType].filter(item => item.id !== id);
            writeFileSync(itemsFile, JSON.stringify(data, null, 2));
        }

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: 'Failed to delete item' }, { status: 500 });
    }
}
