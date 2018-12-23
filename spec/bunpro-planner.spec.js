describe('bunpro-planner', function () {
    describe('toAbsoluteTime', function() {
        it('should convert the string now into the current time in absolute time', function () {
            const expected = moment().format();
            const actual = bunproPlanner.toAbsoluteTime('Now');
            expect(actual).toEqual(expected);
        });

        it('should convert a relative time string into the absolute time', function () {
            const expected = moment().add(2, 'days').format();
            const actual = bunproPlanner.toAbsoluteTime('2 days');
            expect(actual).toEqual(expected);
        });

        it('should convert pseudo-burned reviews with a relative time in the distant future into the absolute time', function () {
            const expected = moment().add(20, 'years').format();
            const actual = bunproPlanner.toAbsoluteTime('almost 20 years');
            expect(actual).toEqual(expected);
        });
    });

    describe('getReviews', function () {
        function generateReview(nextReview, timesCorrect) {
            return $(`<div class="col-xs-6 col-md-3 col-lg-3 no-padding">
                <div class="row profile-study-question no-padding">
                    <div class="col-xs-12 no-padding">
                        <div class="col-xs-12 no-padding profile-grammar-japanese">
                            <h2><a href="/grammar_points/208">ばよかった</a></h2>
                        </div>
                        <div class="col-xs-0 col-md-12 srs-info">
                            <div class="row">
                                <div class="col-xs-12">Times Correct: ${timesCorrect}</div>
                                <div class="col-xs-12">
                                    Next Review: ${nextReview}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);
        }

        it('should collect and process reviews from the page', function () {
            const expected = [
                { timesCorrect: 0, nextReview: moment().format() },
                { timesCorrect: 5, nextReview: moment().add(2, 'days').format() },
                { timesCorrect: 10, nextReview: moment().add(1, 'month').format() }
            ];

            const reviews = $('<div></div>');
            reviews.append(generateReview('Now', 0));
            reviews.append(generateReview('2 days', 5));
            reviews.append(generateReview('1 month', 10));

            const body = $('body');
            body.append(reviews);

            actual = bunproPlanner.getReviews();

            expect(actual).toEqual(expected);
        });
    });

    describe('insertChartNode', function () {
        it('should insert the chart above the show-upcoming-grammar button', function () {            
            const body = $('body');
            body.append($('<div>header stuff</div>'));
            body.append($('<div class="show-upcoming-grammar btn btn-primary update-button">+ Show Upcoming Grammar</div>'));
            body.append($('<div>footer stuff</div>'));

            bunproPlanner.insertChartNode();

            const upcomingGrammarButton = $('.show-upcoming-grammar').first();
            const previousNode = upcomingGrammarButton.first().prev();

            expect(previousNode.attr('id')).toEqual('bunpro-planner-chart-container');
            expect(previousNode.children().first().attr('id')).toEqual('bunpro-planner-chart');
        });
    });

    describe('getCurrentHour', function () {
        it('should get the current hour', function () {
            const expected = moment().hour();
            actual = bunproPlanner.getCurrentHour();
            expect(actual).toEqual(expected);
        });
    });

    describe('generateChartLabels', function () {
        it('should generate chart labels for each hour for the next 24 hours', function () {
            spyOn(bunproPlanner, 'getCurrentHour').and.returnValue(13);
            const expected = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            const actual = bunproPlanner.generateChartLabels();
            expect(expected).toEqual(actual);
        });
    });

    describe('getReviewsPerHour', function () {
        it('should get the number of reviews per hour for the next 24 hours', function () {
            const reviews = [
                { timesCorrect: 0, nextReview: moment().format() },
                { timesCorrect: 0, nextReview: moment().add(2, 'hours').format() },
                { timesCorrect: 0, nextReview: moment().add(10, 'hours').format() },
                { timesCorrect: 0, nextReview: moment().add(2, 'hours').format() },
                { timesCorrect: 5, nextReview: moment().add(2, 'days').format() },
                { timesCorrect: 10, nextReview: moment().add(1, 'month').format() },
                { timesCorrect: 10, nextReview: moment().add(20, 'years').format() }
            ];

            const labels = bunproPlanner.generateChartLabels();
            
            // The index is not the hour, but the matching
            // position to the label for that hour.
            const expected = labels.map(h => 0);
            expected[0] = 1;
            expected[2] = 2;
            expected[10] = 1;

            const actual = bunproPlanner.getReviewsPerHour(reviews, labels);

            expect(actual).toEqual(expected);
        });
    });

    describe('buildChart', function () {
        it('should build a chart to visualize review scheduling', function () {
            spyOn(window, 'Chart');

            const chart = $('<canvas id="bunpro-planner-chart"></canvas>');
            const reviews = [
                { timesCorrect: 0, nextReview: moment().format() },
                { timesCorrect: 0, nextReview: moment().add(2, 'hours').format() },
                { timesCorrect: 0, nextReview: moment().add(10, 'hours').format() },
                { timesCorrect: 0, nextReview: moment().add(2, 'hours').format() },
                { timesCorrect: 5, nextReview: moment().add(2, 'days').format() },
                { timesCorrect: 10, nextReview: moment().add(1, 'month').format() },
                { timesCorrect: 10, nextReview: moment().add(20, 'years').format() }
            ];
            const labels = bunproPlanner.generateChartLabels();
            const reviewsPerHour = bunproPlanner.getReviewsPerHour(reviews, labels);

            bunproPlanner.buildChart(chart, reviews);
            
            const dataObj = Chart.calls.argsFor(0)[1];
            expect(dataObj.type).toEqual('bar');
            expect(dataObj.data.labels).toEqual(labels);
            expect(dataObj.data.datasets[0]);
            expect(dataObj.data.datasets[0].label).toEqual('Reviews');
            expect(dataObj.data.datasets[0].data).toEqual(reviewsPerHour);
        });
    });
});
      