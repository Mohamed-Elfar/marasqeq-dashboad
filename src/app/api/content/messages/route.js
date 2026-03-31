import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const dataDir = join(process.cwd(), 'public/content-data');
const messagesFile = join(dataDir, 'messages.json');
const defaultData = { messages: [] };

function readMessages() {
    try {
        const data = readFileSync(messagesFile, 'utf-8');
        return JSON.parse(data);
    } catch {
        writeFileSync(messagesFile, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
}

export async function GET() {
    try {
        return Response.json(readMessages());
    } catch {
        return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const data = readMessages();

        const newMessage = {
            id: body.id || `msg-${Date.now()}`,
            name: body.name || '',
            email: body.email || '',
            subject: body.subject || 'Website Message',
            message: body.message || '',
            status: body.status || 'open',
            createdAt: body.createdAt || new Date().toISOString()
        };

        data.messages.unshift(newMessage);
        writeFileSync(messagesFile, JSON.stringify(data, null, 2));
        return Response.json(newMessage);
    } catch {
        return Response.json({ error: 'Failed to create message' }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const body = await req.json();
        const { id, status } = body;

        const data = readMessages();
        const idx = data.messages.findIndex((msg) => msg.id === id);

        if (idx === -1) {
            return Response.json({ error: 'Message not found' }, { status: 404 });
        }

        data.messages[idx] = {
            ...data.messages[idx],
            status: status || data.messages[idx].status
        };

        writeFileSync(messagesFile, JSON.stringify(data, null, 2));
        return Response.json(data.messages[idx]);
    } catch {
        return Response.json({ error: 'Failed to update message' }, { status: 500 });
    }
}
