import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

const MANGA_SOURCE = path.resolve('Weekly Viz, ShonenJump and MangaPlus Chapter Updates (Digital) (Rillant)');
const OUTPUT_DIR = path.resolve('public', 'manga');

// Basic synopsis data for popular series
const SYNOPSIS_DATA = {
    'chainsaw-man': 'Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while repaying his debt by harvesting devil corpses.',
    'dandadan': 'After Momo Ayase\'s classmate Ken Takakura gets abducted by aliens, she discovers she has psychic powers. Together they face the bizarre supernatural and extraterrestrial threats that lurk in their world.',
    'kagurabachi': 'Chihiro Rokuhira\'s father was murdered and his enchanted blades stolen. Now Chihiro hunts the killers with the one remaining blade, seeking justice in a world of sorcery.',
    'one-punch-man': 'Saitama is a hero who can defeat any opponent with a single punch. But being too strong has left him bored — until he meets Genos and joins the Hero Association.',
    'blue-box': 'Taiki Inomata, a badminton player, and Chinatsu Kano, a basketball player, both aim for nationals. When circumstances lead them to live under the same roof, their relationship grows.',
    'sakamoto-days': 'Taro Sakamoto was once the greatest hitman in the underworld. After falling in love, he retired to run a convenience store. Despite his peaceful life, his past catches up to him.',
    'boruto---two-blue-vortex': 'Boruto Uzumaki returns after a time skip, stronger and more determined. With new threats emerging and old bonds tested, the next generation of ninja faces their greatest challenges.',
    'jujutsu-kaisen-modulo': 'In a world where cursed spirits feed on unsuspecting humans, fragments of the legendary Sukuna have been scattered. A boy swallows one and enters the world of Jujutsu sorcerers.',
    'ruridragon': 'Ruri Aoki is a normal high school girl — until she wakes up one day with dragon horns growing from her head. Turns out her dad is a dragon, and her life will never be normal again.',
    'me---roboco': 'The Platinums get a household robot maid, but Roboco is far from your typical helper. Hilarity ensues as she navigates daily life with her clumsy, overpowered antics.',
    'witch-watch': 'Morihito Otogi, an ogre boy, is tasked with protecting Nico Wakatsuki, a girl destined to become a witch. Together with their friends, they navigate school life and magical mishaps.',
    'nue-s-exorcist': 'A battle between exorcists and yokai unfolds as ancient powers clash with modern-day threats. Dark secrets and supernatural abilities collide in this action-packed series.',
    'the-elusive-samurai': 'Young lord Hojo Tokiyuki must master the art of running and hiding after his clan is destroyed. With the help of a cunning priest, he plans to reclaim his birthright.',
    'fly-me-to-the-moon': 'Nasa Yuzaki, a genius, meets the beautiful Tsukasa on a snowy night. She agrees to date him — but only if they get married first. A wholesome romance comedy begins.',
    'akane-banashi': 'Akane Osaki dreams of becoming a master rakugo performer after her father was denied the rank of shin\'uchi. With fierce determination, she enters the traditional world of Japanese storytelling.',
    'ichi-the-witch': 'In a world of witches and magic, a mysterious boy named Ichi possesses apocalyptic power. The Witch Association wants him controlled, but his cheerful nature hides unfathomable depth.',
    'marriagetoxin': 'Gero Asa is a poison-user assassin who is hopelessly unlucky in love. Desperate to continue his family line, he teams up with a hapless matchmaker in this dark romantic comedy.',
};

function slugify(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function getChapterNumber(filename) {
    const match = filename.match(/(\d{2,4})/);
    return match ? parseInt(match[1], 10) : 1;
}

function getGenre(seriesName) {
    const actionSeries = ['Chainsaw Man', 'Kagurabachi', 'One-Punch Man', 'Sakamoto Days', 'Boruto', 'Dandadan', 'Nue\'s Exorcist', 'The Elusive Samurai', 'Blood Wing Hunter', 'Dogsred', 'KAMI KILL', 'Punk Gun', 'GHOST REAPER GIRL'];
    const romanceSeries = ['Blue Box', 'Fly Me to the Moon', 'Care for Something Sweet', 'I Want to End This Love Game', 'Love Through a Prism', 'Hope You\'re Happy, Lemon', 'Akira Failing in Love'];
    const comedySeries = ['Me & Roboco', 'WITCH WATCH', 'Dealing with Mikadono Sisters Is a Breeze', 'Shiba Inu Rooms', 'Red Cat Ramen'];
    const supernaturalSeries = ['Jujutsu Kaisen Modulo', 'RuriDragon', 'Ichi the Witch', 'Make the Exorcist Fall in Love', 'WITCHRIV', 'The Creepy and Freaky', 'Ultimate Exorcist Kiyoshi'];

    if (actionSeries.some(s => seriesName.includes(s))) return ['Action', 'Shōnen'];
    if (romanceSeries.some(s => seriesName.includes(s))) return ['Romance', 'Shōnen'];
    if (comedySeries.some(s => seriesName.includes(s))) return ['Comedy', 'Shōnen'];
    if (supernaturalSeries.some(s => seriesName.includes(s))) return ['Supernatural', 'Shōnen'];
    return ['Shōnen', 'Adventure'];
}

async function extractManga() {
    console.log('🌸 Sakura Manga Extractor');
    console.log('========================\n');

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const seriesDirs = fs.readdirSync(MANGA_SOURCE);
    const catalog = { series: [] };
    let processed = 0;

    for (const seriesName of seriesDirs) {
        const seriesPath = path.join(MANGA_SOURCE, seriesName);
        if (!fs.statSync(seriesPath).isDirectory()) continue;

        const cbzFiles = fs.readdirSync(seriesPath).filter(f => f.endsWith('.cbz'));
        if (cbzFiles.length === 0) continue;

        const slug = slugify(seriesName);
        const chapters = [];

        for (const cbzFile of cbzFiles) {
            const chapterNum = getChapterNumber(cbzFile);
            const chapterDir = path.join(OUTPUT_DIR, slug, String(chapterNum));

            if (fs.existsSync(chapterDir) && fs.readdirSync(chapterDir).length > 0) {
                // Already extracted, just count pages
                const pages = fs.readdirSync(chapterDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
                chapters.push({
                    number: chapterNum,
                    pageCount: pages.length,
                    path: `/manga/${slug}/${chapterNum}`,
                });
                console.log(`  ⏭ Skipping ${seriesName} Ch.${chapterNum} (already extracted)`);
                continue;
            }

            fs.mkdirSync(chapterDir, { recursive: true });

            try {
                const zip = new AdmZip(path.join(seriesPath, cbzFile));
                const entries = zip.getEntries()
                    .filter(e => !e.isDirectory && /\.(jpg|jpeg|png|webp)$/i.test(e.entryName))
                    .sort((a, b) => a.entryName.localeCompare(b.entryName));

                let pageNum = 1;
                for (const entry of entries) {
                    const ext = path.extname(entry.entryName).toLowerCase();
                    const outFile = path.join(chapterDir, `${String(pageNum).padStart(3, '0')}${ext}`);
                    fs.writeFileSync(outFile, entry.getData());
                    pageNum++;
                }

                chapters.push({
                    number: chapterNum,
                    pageCount: entries.length,
                    path: `/manga/${slug}/${chapterNum}`,
                });

                processed++;
                console.log(`  ✅ ${seriesName} Ch.${chapterNum} — ${entries.length} pages`);
            } catch (err) {
                console.error(`  ❌ Failed: ${seriesName} Ch.${chapterNum} — ${err.message}`);
            }
        }

        if (chapters.length > 0) {
            chapters.sort((a, b) => a.number - b.number);
            const genres = getGenre(seriesName);
            catalog.series.push({
                id: slug,
                title: seriesName,
                slug,
                genres,
                chapters,
                cover: `${chapters[0].path}/001.jpg`,
                synopsis: SYNOPSIS_DATA[slug] || `Follow the thrilling adventures in ${seriesName}, a captivating manga series from Weekly Shōnen Jump.`,
            });
        }
    }

    catalog.series.sort((a, b) => a.title.localeCompare(b.title));

    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'catalog.json'),
        JSON.stringify(catalog, null, 2)
    );

    console.log(`\n🎉 Done! Extracted ${processed} chapters from ${catalog.series.length} series.`);
    console.log(`📁 Output: ${OUTPUT_DIR}`);
    console.log(`📋 Catalog: ${path.join(OUTPUT_DIR, 'catalog.json')}`);
}

extractManga().catch(console.error);
