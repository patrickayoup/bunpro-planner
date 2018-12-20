// ==UserScript==
// @name bunpro-planner
// @namespace http://patrickayoup.com/
// @version 1.0.3
// @description  Better visualization of upcoming Bunpro Reviews
// @author Patrick Ayoup
// @include *bunpro.jp*
// @exclude *community.bunpro.jp*
// @grant none
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// ==/UserScript==

const bunproPlanner = {
    toAbsoluteTime: function (relativeTime) {
        let absoluteTime = null;
        relativeTime = relativeTime.toLowerCase();
        if (relativeTime === 'now') {
            absoluteTime = moment();
        } else {
            let tokens = relativeTime.split(" ");
            let value = tokens[0];
            let unit = tokens[1];
            absoluteTime = moment().add(parseInt(value), unit);
        }
    
        return absoluteTime.format();
    },

    getReviews: function () {
        const self = this;
        let cards = jQuery('div .srs-info .row');
        const reviews = cards.map(function () {
            let kids = jQuery(this).children();
            let rv = {
                timesCorrect: parseInt(jQuery(kids[0]).text().trim().replace("Times Correct: ", "")),
                nextReview: self.toAbsoluteTime(
                    jQuery(kids[1]).text().trim().replace("Next Review: ", "").replace("about ", "")
                )
            };
            return rv;
        });

        return reviews.get();
    },

    insertChartNode: function () {
        let showUpcomingGrammarButton = jQuery('div.show-upcoming-grammar').first();
        let container = jQuery('<div id="bunpro-planner-chart-container"></div>');
        let chart = jQuery('<canvas id="bunpro-planner-chart"></canvas>');
        container.append(chart);
        container.insertBefore(showUpcomingGrammarButton);
        return chart;
    },

    getCurrentHour: function () {
        return moment().hour();
    },

    generateChartLabels: function () {
        let thisHour = this.getCurrentHour();
        let hours = [];
        for (i = thisHour; i < thisHour + 24; ++i) {
            hours.push(i % 24);
        }
        return hours;
    },

    getReviewsPerHour: function (reviews, labels) {
        let now = moment();
    
        // Filter for cards scheduled in the next day.
        let filteredReviews = _.filter(reviews, function (card) {
            return moment(card.nextReview).diff(now, 'hours') < 23;
        });

        let groups = _.groupBy(filteredReviews, function (card) {
            let reviewTime = moment(card.nextReview);
    
            return reviewTime.hour();
        });
    
        return _.map(labels, function(hour) {
            if (groups[hour]) {
                return groups[hour].length;
            } else {
                return 0;
            }
        });
    },

    buildChart: function (chart, reviews) {
        var ctx = chart.get(0).getContext('2d');
        let labels = this.generateChartLabels();
        const reviewsPerHour = this.getReviewsPerHour(reviews, labels);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Reviews',
                    data: reviewsPerHour,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                },
                legend: {
                    display: false
                }
            }
        });
    }
};

waitForKeyElements('div .show-upcoming-grammar', function() {
    let reviews = bunproPlanner.getReviews();
    let chart = bunproPlanner.insertChartNode();
    bunproPlanner.buildChart(chart, reviews);
});
