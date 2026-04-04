import { createClient } from '@supabase/supabase-js'

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return Response.json({ error: 'No file provided' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const storageKey = serviceRoleKey || anonKey;

        if (!supabaseUrl || !storageKey) {
            return Response.json(
                { error: 'Missing Supabase storage environment variables' },
                { status: 500 }
            );
        }

        const supabase = createClient(supabaseUrl, storageKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });

        const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';
        const ext = file.name.split('.').pop();
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        const filename = `${timestamp}-${random}.${ext}`;
        const filePath = `content/${filename}`;
        const buffer = await file.arrayBuffer();

        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, Buffer.from(buffer), {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            if ((uploadError.message || '').toLowerCase().includes('bucket not found')) {
                return Response.json(
                    {
                        error: `Storage bucket \"${bucketName}\" was not found. Create it in Supabase Storage or set SUPABASE_STORAGE_BUCKET to an existing bucket name.`,
                        details: uploadError,
                    },
                    { status: 500 }
                );
            }

            return Response.json(
                {
                    error: uploadError.message || 'Failed to upload file',
                    details: uploadError,
                },
                { status: 500 }
            );
        }

        const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        return Response.json({
            url: publicUrlData.publicUrl,
            filename: file.name,
            size: file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        return Response.json(
            {
                error: error?.message || 'Failed to upload file',
            },
            { status: 500 }
        );
    }
}
