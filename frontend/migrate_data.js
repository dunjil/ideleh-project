const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const PG_URL = 'postgresql://postgres:postgres@localhost:5432/ideleh';
const STRAPI_URL = 'http://localhost:1337/api';

const client = new Client({ connectionString: PG_URL });

async function uploadMedia(imageData, filename) {
    if (!imageData) return null;
    try {
        const formData = new FormData();
        let blob;

        if (imageData.startsWith('data:')) {
            // base64
            const arr = imageData.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            blob = new Blob([u8arr], {type: mime});
            if (!filename) {
                const ext = mime.split('/')[1];
                filename = `upload_${Date.now()}.${ext}`;
            }
        } else if (imageData.startsWith('http')) {
            // URL
            const res = await fetch(imageData);
            blob = await res.blob();
            if (!filename) {
                const urlObj = new URL(imageData);
                filename = path.basename(urlObj.pathname) || `upload_${Date.now()}.jpg`;
            }
        } else {
            return null; // Local paths like /placeholder.svg
        }

        formData.append('files', blob, filename);
        const res = await fetch(`${STRAPI_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        const json = await res.json();
        if (json && json[0]) {
            return json[0].id; // numeric ID for relations in v5
        } else {
            console.error("Upload failed", json);
        }
    } catch (e) {
        console.error("Failed to upload media:", e);
    }
    return null;
}

async function createEntry(collection, data) {
    const res = await fetch(`${STRAPI_URL}/${collection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
    });
    if (!res.ok) {
        const err = await res.json();
        console.error(`Error creating ${collection}:`, JSON.stringify(err));
        return null;
    }
    return await res.json();
}

async function migrate() {
    await client.connect();
    console.log("Connected to PostgreSQL");

    // 1. Hero Images
    try {
        const res = await client.query('SELECT * FROM hero_images');
        for (const row of res.rows) {
            const imageId = await uploadMedia(row.image_data, `hero_${row.id}.jpg`);
            await createEntry('hero-images', {
                title: row.title,
                description: row.description,
                is_active: row.is_active,
                display_order: row.display_order,
                image: imageId || null
            });
            console.log(`Migrated hero image: ${row.title}`);
        }
    } catch(e) { console.error('Hero Images Error', e.message); }

    // 2. Site Content
    try {
        const res = await client.query('SELECT * FROM site_content');
        for (const row of res.rows) {
            await createEntry('site-contents', {
                key: row.key,
                title: row.title,
                content: row.content
            });
            console.log(`Migrated site content: ${row.key}`);
        }
    } catch(e) { console.error('Site Content Error', e.message); }

    // 3. Events
    try {
        const res = await client.query('SELECT * FROM events');
        for (const row of res.rows) {
            const imageId = await uploadMedia(row.image_data, `event_${row.id}.jpg`);
            // we will need the Strapi Event documentId to link registrations.
            const eventJson = await createEntry('events', {
                title: row.title,
                description: row.description,
                event_date: row.event_date.toISOString(),
                image: imageId || null
            });
            
            console.log(`Migrated event: ${row.title}`);

            if (eventJson && eventJson.data && eventJson.data.documentId) {
                const strapiEventId = eventJson.data.documentId;
                // 4. Registrations for this event
                try {
                    const regRes = await client.query('SELECT * FROM registrations WHERE event_id = $1', [row.id]);
                    for (const reg of regRes.rows) {
                        await createEntry('registrations', {
                            first_name: reg.first_name,
                            last_name: reg.last_name,
                            gender: reg.gender,
                            expectation: reg.expectation,
                            email: reg.email,
                            phone: reg.phone,
                            event: strapiEventId
                        });
                    }
                    console.log(`Migrated ${regRes.rows.length} registrations for event ${row.title}`);
                } catch(e) { console.error('Registrations Error', e.message); }
            }
        }
    } catch(e) { console.error('Events Error', e.message); }

    // 5. Gallery
    try {
        const res = await client.query('SELECT * FROM gallery');
        for (const row of res.rows) {
            const imageId = await uploadMedia(row.image_data, `gallery_${row.id}.jpg`);
            await createEntry('galleries', {
                title: row.title,
                image: imageId || null
            });
            console.log(`Migrated gallery item: ${row.title}`);
        }
    } catch(e) { console.error('Gallery Error', e.message); }

    // 6. Team Members
    try {
        const res = await client.query('SELECT * FROM team_members');
        for (const row of res.rows) {
            const imageId = await uploadMedia(row.image_data, `team_${row.id}.jpg`);
            await createEntry('team-members', {
                name: row.name,
                position: row.position,
                bio: row.bio,
                image: imageId || null
            });
            console.log(`Migrated team member: ${row.name}`);
        }
    } catch(e) { console.error('Team Member Error', e.message); }

    // 7. Projects
    try {
        const res = await client.query('SELECT * FROM projects');
        for (const row of res.rows) {
            const imageId = await uploadMedia(row.image_data, `project_${row.id}.jpg`);
            await createEntry('projects', {
                title: row.title,
                description: row.description,
                is_featured: row.is_featured,
                image: imageId || null
            });
            console.log(`Migrated project: ${row.title}`);
        }
    } catch(e) { console.error('Projects Error', e.message); }

    await client.end();
    console.log("Migration complete!");
}

migrate();
