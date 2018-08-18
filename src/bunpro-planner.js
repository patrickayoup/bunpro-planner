// ==UserScript==
// @name bunpro-planner
// @namespace http://patrickayoup.com/
// @version 1.0.0
// @description  Better visualization of upcoming Bunpro Reviews
// @author Patrick Ayoup
// @include *bunpro.jp/users*
// @grant none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js
// ==/UserScript==
(()=> {

    
function toAbsoluteTime(relativeTime) {
    let absoluteTime = null;
    relativeTime = relativeTime.toLowerCase();
    if (relativeTime === 'now') {
        absoluteTime = moment();
    } else {
        // Format: X hours
        let tokens = relativeTime.split(" ");
        let value = tokens[0];
        let unit = tokens[1];
        absoluteTime = moment().add(parseInt(value), unit);
    }

    return absoluteTime.format();
}


function getReviews() {
    let cards = $('div .srs-info .row');
    return cards.map(function () {
        // Each card has 2 children, one for times correct, the other for next review time.
        let kids = $(this).children();
        let rv = {
            timesCorrect: $(kids[0]).text().trim().replace("Times Correct: ", ""),
            nextReview: toAbsoluteTime(
                $(kids[1]).text().trim().replace("Next Review: ", "").replace("about ", "")
            )
        };
        return rv;
    });
}


$(document).ready(function () {
    let reviews = getReviews();
    console.log(reviews);
});

})();
