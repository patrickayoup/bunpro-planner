let customMatchers = {
    toEqualMoment: (util, customEqualityTesters) => {
        return {
            compare: (actual, expected) => {
                var result = {};
                result.pass = actual.isSame(expected);
                return result;
            }
        };
    }
};

describe('bunpro-planner', () => {
    let bunproPlanner;

    beforeEach(() => {
        bunproPlanner = new BunproPlanner();
    });

    describe('toAbsoluteTime', () => {
        it('should convert the string now into the current time in absolute time', () => {
            const expected = moment().format();
            const actual = bunproPlanner.toAbsoluteTime('Now');
            expect(actual).toEqual(expected);
        });

        it('should convert a relative time string into the absolute time', () => {
            const expected = moment().add(2, 'days').format();
            const actual = bunproPlanner.toAbsoluteTime('2 days');
            expect(actual).toEqual(expected);
        });

        it('should convert pseudo-burned reviews with a relative time in the distant future into the absolute time', () => {
            const expected = moment().add(20, 'years').format();
            const actual = bunproPlanner.toAbsoluteTime('almost 20 years');
            expect(actual).toEqual(expected);
        });
    });

    describe('getReviews',  () => {
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

        it('should collect and process reviews from the page',  () => {
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

            bunproPlanner.getReviews();
            actual = bunproPlanner.reviews;

            expect(actual).toEqual(expected);
        });
    });

    describe('insertChartNode',  () => {
        it('should insert the chart above the show-upcoming-grammar button',  () => {            
            const body = $('body');
            body.append($('<div>header stuff</div>'));
            body.append($('<div class="show-upcoming-grammar btn btn-primary update-button">+ Show Upcoming Grammar</div>'));
            body.append($('<div>footer stuff</div>'));

            bunproPlanner.insertChartNode();

            const containerNode = $('#bunpro-planner-chart-container').first();
            const intervalNode = $('#bunpro-planner-interval').first();
            const chartNode = $('#bunpro-planner-chart').first();

            expect(containerNode.attr('id')).toEqual('bunpro-planner-chart-container');
            expect(intervalNode.attr('id')).toEqual('bunpro-planner-interval');
            expect(chartNode.attr('id')).toEqual('bunpro-planner-chart');
        });
    });

    describe('generateIntervals',  () => {
        let startAt;

        beforeEach(() => {
            startAt = moment([2019, 0, 15, 13, 0]);
            jasmine.addMatchers(customMatchers);
        });

        describe('when interval is set to 4 hours', () => {
            beforeEach(() => {
                bunproPlanner.interval = 4;
            });

            it('should generate chart intervals for every 4 hours for 24 intervals', () => {
                const expected = [
                    moment([2019, 0, 15, 13, 0]),
                    moment([2019, 0, 15, 17, 0]),
                    moment([2019, 0, 15, 21, 0]),
                    moment([2019, 0, 16, 1, 0]),
                    moment([2019, 0, 16, 5, 0]),
                    moment([2019, 0, 16, 9, 0]),
                    moment([2019, 0, 16, 13, 0]),
                    moment([2019, 0, 16, 17, 0]),
                    moment([2019, 0, 16, 21, 0]),
                    moment([2019, 0, 17, 1, 0]),
                    moment([2019, 0, 17, 5, 0]),
                    moment([2019, 0, 17, 9, 0]),
                    moment([2019, 0, 17, 13, 0]),
                    moment([2019, 0, 17, 17, 0]),
                    moment([2019, 0, 17, 21, 0]),
                    moment([2019, 0, 18, 1, 0]),
                    moment([2019, 0, 18, 5, 0]),
                    moment([2019, 0, 18, 9, 0]),
                    moment([2019, 0, 18, 13, 0]),
                    moment([2019, 0, 18, 17, 0]),
                    moment([2019, 0, 18, 21, 0]),
                    moment([2019, 0, 19, 1, 0]),
                    moment([2019, 0, 19, 5, 0]),
                    moment([2019, 0, 19, 9, 0])
                ];

                const actual = bunproPlanner.generateIntervals(startAt);
                _.zip(actual, expected).forEach((pair) => {
                    const actualMoment = pair[0];
                    const expectedMoment = pair[1];
                    expect(actualMoment).toEqualMoment(expectedMoment);
                });
            });
        });

        describe('when interval is set to 2 hours', () => {
            beforeEach(() => {
                bunproPlanner.interval = 2;
            });

            it('should generate chart intervals for every 2 hours for 24 intervals', () => {
                const expected = [
                    moment([2019, 0, 15, 13, 0]),
                    moment([2019, 0, 15, 15, 0]),
                    moment([2019, 0, 15, 17, 0]),
                    moment([2019, 0, 15, 19, 0]),
                    moment([2019, 0, 15, 21, 0]),
                    moment([2019, 0, 15, 23, 0]),
                    moment([2019, 0, 16, 01, 0]),
                    moment([2019, 0, 16, 03, 0]),
                    moment([2019, 0, 16, 05, 0]),
                    moment([2019, 0, 16, 07, 0]),
                    moment([2019, 0, 16, 09, 0]),
                    moment([2019, 0, 16, 11, 0]),
                    moment([2019, 0, 16, 13, 0]),
                    moment([2019, 0, 16, 15, 0]),
                    moment([2019, 0, 16, 17, 0]),
                    moment([2019, 0, 16, 19, 0]),
                    moment([2019, 0, 16, 21, 0]),
                    moment([2019, 0, 16, 23, 0]),
                    moment([2019, 0, 17, 01, 0]),
                    moment([2019, 0, 17, 03, 0]),
                    moment([2019, 0, 17, 05, 0]),
                    moment([2019, 0, 17, 07, 0]),
                    moment([2019, 0, 17, 09, 0]),
                    moment([2019, 0, 17, 11, 0])
                ];
                const actual = bunproPlanner.generateIntervals(startAt);
                _.zip(actual, expected).forEach((pair) => {
                    const actualMoment = pair[0];
                    const expectedMoment = pair[1];
                    expect(actualMoment).toEqualMoment(expectedMoment);
                });
            });
        });

        describe('when interval is set to 1 hour', () => {
            beforeEach(() => {
                bunproPlanner.interval = 1;
            });

            it('should generate chart intervals for each hour for 24 intervals', () => {
                const expected = [
                    moment([2019, 0, 15, 13, 0]),
                    moment([2019, 0, 15, 14, 0]),
                    moment([2019, 0, 15, 15, 0]),
                    moment([2019, 0, 15, 16, 0]),
                    moment([2019, 0, 15, 17, 0]),
                    moment([2019, 0, 15, 18, 0]),
                    moment([2019, 0, 15, 19, 0]),
                    moment([2019, 0, 15, 20, 0]),
                    moment([2019, 0, 15, 21, 0]),
                    moment([2019, 0, 15, 22, 0]),
                    moment([2019, 0, 15, 23, 0]),
                    moment([2019, 0, 16, 0, 0]),
                    moment([2019, 0, 16, 01, 0]),
                    moment([2019, 0, 16, 02, 0]),
                    moment([2019, 0, 16, 03, 0]),
                    moment([2019, 0, 16, 04, 0]),
                    moment([2019, 0, 16, 05, 0]),
                    moment([2019, 0, 16, 06, 0]),
                    moment([2019, 0, 16, 07, 0]),
                    moment([2019, 0, 16, 08, 0]),
                    moment([2019, 0, 16, 09, 0]),
                    moment([2019, 0, 16, 10, 0]),
                    moment([2019, 0, 16, 11, 0]),
                    moment([2019, 0, 16, 12, 0])
                ];
                const actual = bunproPlanner.generateIntervals(startAt);
                _.zip(actual, expected).forEach((pair) => {
                    const actualMoment = pair[0];
                    const expectedMoment = pair[1];
                    expect(actualMoment).toEqualMoment(expectedMoment);
                });
            });
        });

        describe('when interval is set to 0.5 hours', () => {
            beforeEach(() => {
                bunproPlanner.interval = 0.5;
            });

            it('should generate chart intervals for each half hour for 24 intervals', () => {
                const expected = [
                    moment([2019, 0, 15, 13, 0]), 
                    moment([2019, 0, 15, 13, 30]),
                    moment([2019, 0, 15, 14, 0]), 
                    moment([2019, 0, 15, 14, 30]),
                    moment([2019, 0, 15, 15, 0]), 
                    moment([2019, 0, 15, 15, 30]),
                    moment([2019, 0, 15, 16, 0]), 
                    moment([2019, 0, 15, 16, 30]),
                    moment([2019, 0, 15, 17, 0]), 
                    moment([2019, 0, 15, 17, 30]),
                    moment([2019, 0, 15, 18, 0]), 
                    moment([2019, 0, 15, 18, 30]),
                    moment([2019, 0, 15, 19, 0]), 
                    moment([2019, 0, 15, 19, 30]),
                    moment([2019, 0, 15, 20, 0]), 
                    moment([2019, 0, 15, 20, 30]),
                    moment([2019, 0, 15, 21, 0]), 
                    moment([2019, 0, 15, 21, 30]),
                    moment([2019, 0, 15, 22, 0]), 
                    moment([2019, 0, 15, 22, 30]),
                    moment([2019, 0, 15, 23, 0]), 
                    moment([2019, 0, 15, 23, 30]),
                    moment([2019, 0, 16, 0, 0]), 
                    moment([2019, 0, 16, 0, 30])
                ];
                const actual = bunproPlanner.generateIntervals(startAt);
                _.zip(actual, expected).forEach((pair) => {
                    const actualMoment = pair[0];
                    const expectedMoment = pair[1];
                    expect(actualMoment).toEqualMoment(expectedMoment);
                });
            });
        });

        describe('when interval is set to 0.25 hours', () => {
            beforeEach(() => {
                bunproPlanner.interval = 0.25;
            });

            it('should generate chart intervals for each quarter hour for 24 intervals', () => {
                const expected = [
                    moment([2019, 0, 15, 13, 0]), 
                    moment([2019, 0, 15, 13, 15]), 
                    moment([2019, 0, 15, 13, 30]), 
                    moment([2019, 0, 15, 13, 45]),
                    moment([2019, 0, 15, 14, 0]), 
                    moment([2019, 0, 15, 14, 15]), 
                    moment([2019, 0, 15, 14, 30]), 
                    moment([2019, 0, 15, 14, 45]),
                    moment([2019, 0, 15, 15, 0]), 
                    moment([2019, 0, 15, 15, 15]), 
                    moment([2019, 0, 15, 15, 30]), 
                    moment([2019, 0, 15, 15, 45]),
                    moment([2019, 0, 15, 16, 0]), 
                    moment([2019, 0, 15, 16, 15]), 
                    moment([2019, 0, 15, 16, 30]), 
                    moment([2019, 0, 15, 16, 45]),
                    moment([2019, 0, 15, 17, 0]), 
                    moment([2019, 0, 15, 17, 15]), 
                    moment([2019, 0, 15, 17, 30]), 
                    moment([2019, 0, 15, 17, 45]),
                    moment([2019, 0, 15, 18, 0]), 
                    moment([2019, 0, 15, 18, 15]), 
                    moment([2019, 0, 15, 18, 30]), 
                    moment([2019, 0, 15, 18, 45])
                ];
                const actual = bunproPlanner.generateIntervals(startAt);
                _.zip(actual, expected).forEach((pair) => {
                    const actualMoment = pair[0];
                    const expectedMoment = pair[1];
                    expect(actualMoment).toEqualMoment(expectedMoment);
                });
            });
        });
    });

    describe('getReviewsPerInterval',  () => {
        it('should get the number of reviews per interval',  () => {
            const now = moment();

            const reviews = [
                { timesCorrect: 0, nextReview: moment().format() },
                { timesCorrect: 0, nextReview: moment().add(2, 'hours').format() },
                { timesCorrect: 0, nextReview: moment().add(10, 'hours').format() },
                { timesCorrect: 0, nextReview: moment().add(2, 'hours').format() },
                { timesCorrect: 5, nextReview: moment().add(2, 'days').format() },
                { timesCorrect: 10, nextReview: moment().add(1, 'month').format() },
                { timesCorrect: 10, nextReview: moment().add(20, 'years').format() }
            ];

            const intervals = bunproPlanner.generateIntervals(now);
            
            // The index is not the hour, but the matching
            // position to the label for that hour.
            const expected = intervals.map(h => 0);
            expected[0] = 1;
            expected[2] = 2;
            expected[10] = 1;

            bunproPlanner.reviews = reviews;
            const actual = bunproPlanner.getReviewsPerInterval(intervals);

            expect(actual).toEqual(expected);
        });
    });

    describe('getAccumulatedReviewsPerHour',  () => {
        it('should accumulate the number of reviews up until each hour if not done',  () => {
            const reviews = [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            
            const expected = [1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];            
            const actual = bunproPlanner.getAccumulatedReviewsPerInterval(reviews);

            expect(actual).toEqual(expected);
        });
    });

    describe('buildChart',  () => {
        it('should build a chart to visualize review scheduling',  () => {
            const now = moment();
            spyOn(window, 'Chart');

            const chart = $('<canvas id="bunpro-planner-chart"></canvas>');
            bunproPlanner.chart = chart;
            
            const reviews = [
                { timesCorrect: 0, nextReview: moment().format() },
                { timesCorrect: 0, nextReview: moment().add(2, 'hours').format() },
                { timesCorrect: 0, nextReview: moment().add(10, 'hours').format() },
                { timesCorrect: 0, nextReview: moment().add(2, 'hours').format() },
                { timesCorrect: 5, nextReview: moment().add(2, 'days').format() },
                { timesCorrect: 10, nextReview: moment().add(1, 'month').format() },
                { timesCorrect: 10, nextReview: moment().add(20, 'years').format() }
            ];

            bunproPlanner.reviews = reviews;

            const intervals = bunproPlanner.generateIntervals(now);
            const reviewsPerHour = bunproPlanner.getReviewsPerInterval(intervals);
            const accumulatedReviewsPerHour = bunproPlanner.getAccumulatedReviewsPerInterval(reviewsPerHour);

            const labels = intervals.map((interval) => {
                return interval.format('MM/DD HH:mm');
            });    

            bunproPlanner.buildChart();
            
            const dataObj = Chart.calls.argsFor(0)[1];
            expect(dataObj.type).toEqual('bar');
            expect(dataObj.data.labels).toEqual(labels);
            
            expect(dataObj.data.datasets[0]).toBeDefined();
            expect(dataObj.data.datasets[0].label).toEqual('Reviews');
            expect(dataObj.data.datasets[0].data).toEqual(reviewsPerHour);

            expect(dataObj.data.datasets[1]).toBeDefined();
            expect(dataObj.data.datasets[1].label).toEqual('Accumulated Reviews');
            expect(dataObj.data.datasets[1].data).toEqual(accumulatedReviewsPerHour);
        });
    });
});
      
