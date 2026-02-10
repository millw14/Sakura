import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('public', 'manga');
const catalogPath = path.join(OUTPUT_DIR, 'catalog.json');

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

let fixed = 0;

for (const series of catalog.series) {
    for (const chapter of series.chapters) {
        const chapterDir = path.join(OUTPUT_DIR, series.slug, String(chapter.number));
        if (!fs.existsSync(chapterDir)) continue;

        const files = fs.readdirSync(chapterDir)
            .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
            .sort();

        if (files.length > 0) {
            chapter.pageCount = files.length;
            // Store the actual file extension pattern  
            chapter.firstPageExt = path.extname(files[0]).toLowerCase();
        }
    }

    // Fix cover path
    if (series.chapters.length > 0) {
        const firstChapter = series.chapters[0];
        const chapterDir = path.join(OUTPUT_DIR, series.slug, String(firstChapter.number));
        if (fs.existsSync(chapterDir)) {
            const files = fs.readdirSync(chapterDir)
                .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
                .sort();
            if (files.length > 0) {
                const ext = path.extname(files[0]).toLowerCase();
                const oldCover = series.cover;
                series.cover = `/manga/${series.slug}/${firstChapter.number}/001${ext}`;
                if (oldCover !== series.cover) {
                    fixed++;
                    console.log(`Fixed: ${series.title} — ${oldCover} → ${series.cover}`);
                }
            }
        }
    }
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
console.log(`\nFixed ${fixed} cover paths in catalog.json`);
