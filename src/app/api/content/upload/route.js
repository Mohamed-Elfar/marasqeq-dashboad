import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return Response.json({ error: 'No file provided' }, { status: 400 });
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'public/uploads');
        mkdirSync(uploadsDir, { recursive: true });

        // Generate unique filename
        const ext = file.name.split('.').pop();
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        const filename = `${timestamp}-${random}.${ext}`;
        const filepath = join(uploadsDir, filename);

        // Convert file to buffer and save
        const buffer = await file.arrayBuffer();
        writeFileSync(filepath, Buffer.from(buffer));

        return Response.json({
            url: `/uploads/${filename}`,
            filename: file.name,
            size: file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        return Response.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
