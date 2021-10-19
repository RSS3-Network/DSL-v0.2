const fs = require('fs');

let overall = {
    count: 0,
    links: {},
    backlinks: {},
    assets: {},
    accounts: {},
}
let details = {};

fs.readdirSync('./storage').forEach((fileName) => {
    if (!fileName.endsWith('following') && !fileName.endsWith('swp')) {
        const content = fs.readFileSync('./storage/' + fileName);
        try {
            const file = JSON.parse(content);

            details[fileName] = {
                name: file.profile?.name,
                date_created: +new Date(file.date_created),
                date_updated: +new Date(file.date_updated),
                links: {},
                backlinks: {},
                assets: {},
                accounts: {},
            }

            // count
            overall.count += 1;

            // links
            file.links?.forEach((link) => {
                if (!overall.links[link.type]) {
                    overall.links[link.type] = 0;
                }
                overall.links[link.type] += link.list?.length || 0;
                details[fileName].links[link.type] = link.list?.length || 0;
            });

            // backlinks
            file['@backlinks']?.forEach((backlink) => {
                const list = JSON.parse(fs.readFileSync('./storage/' + backlink.list)).list;
                if (!overall.backlinks[backlink.type]) {
                    overall.backlinks[backlink.type] = 0;
                }
                overall.backlinks[backlink.type] += list?.length || 0;
                details[fileName].backlinks[backlink.type] = list?.length || 0;
            });

            // assets
            file.assets?.forEach((asset) => {
                if (!overall.assets[asset.platform]) {
                    overall.assets[asset.platform] = {};
                }
                if (!details[fileName].assets[asset.platform]) {
                    details[fileName].assets[asset.platform] = {};
                }
                if (!overall.assets[asset.platform][asset.type]) {
                    overall.assets[asset.platform][asset.type] = 0;
                }
                if (!details[fileName].assets[asset.platform][asset.type]) {
                    details[fileName].assets[asset.platform][asset.type] = 0;
                }
                overall.assets[asset.platform][asset.type]++;
                details[fileName].assets[asset.platform][asset.type]++;
            });

            // accounts
            file.accounts?.forEach((account) => {
                if (!overall.accounts[account.platform]) {
                    overall.accounts[account.platform] = 0;
                }
                if (!details[fileName].accounts[account.platform]) {
                    details[fileName].accounts[account.platform] = 0;
                }
                overall.accounts[account.platform]++;
                details[fileName].accounts[account.platform]++;
            });
        } catch (error) {
            console.error(`Error: ${file} ${error}`);
        }
    }
});

fs.writeFileSync('./statistics/overall.json', JSON.stringify(overall));
fs.writeFileSync('./statistics/details.json', JSON.stringify(details));