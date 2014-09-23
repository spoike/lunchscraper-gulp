var cheerio = require('cheerio'),
    S = require('string'),
    _ = require('lodash'),
    moment = require('moment');

var days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"],
    dayHeadings = ["Måndag/Monday", "Tisdag/Tuesday", "Onsdag/Wednesday", "Torsdag/Thursday", "Fredag/Friday"];

exports.url = "http://www.fazer.se/scotlandyard";

exports.scrape = function(body) {
    var scrapedMenu = {
            title: "Scotland Yard",
            week: moment().week(),
            days: [],
            logo: "http://cdn.fazer.com/cdn-1cf4a9f1a633b00/Frameworks/Default/Images/PageHeader.gif",
            isMultiLanguage: true,
            languages: ['sv', 'en']
        },
        $ = cheerio.load(body),
        menuEls = $("#Meny .boxBody .OrangeHeader td"),
        currentDay = 0,
        isEnglish = true,
        menu = [];

    _.each(menuEls, function(td) {
        var text = S($(td).text()).collapseWhitespace().trim();
        if (text.isEmpty()) {
            return;
        }
        //console.log(text.s);
        var foundIndex = days.indexOf(text.s);
        if (foundIndex >= 0) {
            currentDay = foundIndex;
            if (currentDay == 0) {
                isEnglish = !isEnglish;
            }
            return;
        }
        var menuDay = menu[currentDay];
        if (!menuDay) {
            menuDay = menu[currentDay] = {
                title: dayHeadings[currentDay],
                en: [],
                sv: []
            };
        }
        var langKey = isEnglish ? 'en' : 'sv';
        menuDay[langKey].push(text.s);
    });

    scrapedMenu.days = _.reduce(menu, function(memo, day) {
        memo.push({
            title: day.title,
            menu: _.zip(day.en, day.sv)
        });
        return memo;
    }, []);

    return scrapedMenu;
}
