var cheerio = require('cheerio'),
    _ = require('lodash'),
    S = require('string'),
    weekdays = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag'];

exports.url = "http://www.yourvismawebsite.com/sarimner-restauranger-ab/restaurang-hilda/lunch-meny/svenska";

function extractWeek(line) {
    var parts = line.split(' ');
    return +parts.pop();
}

function containsWeekday(line) {
    return _.find(weekdays, function(weekday) {
        return _.contains(line, weekday);
    });
}

exports.scrape = function(body) {
    var $ = cheerio.load(body, {
            decodeEntities: true
        }),
        scrapedMenu = {
            title: "Restaurang Hilda",
            week: 1,
            days: [],
            isMultiLanguage: false
        },
        day;

    var paragraphs = $('.overflowHidden p'),
        day,
        menu = [],
        idx = 0;

    _.each(paragraphs, function(p) {
        var text = S($(p).text()).collapseWhitespace().trim();
        if (!text.isEmpty()) {
            if (text.contains('Vecka')) {
                scrapedMenu.week = extractWeek(text.s);
            } else if (containsWeekday(text.s)) {
                if (day) {
                    day.menu = menu;
                    scrapedMenu.days.push(day)
                }
                menu = [];
                day = {
                    title: text.s
                };
                idx = 0;
            } else if (text.contains(':') && idx <= 3) {
                menu.push(text.s);
            }
            idx++;
        }
    });
    day.menu = menu;
    scrapedMenu.days.push(day);

    return scrapedMenu;
};
