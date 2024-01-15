$(function () {

    fnOnScroll();

    scroller.on("scroll", obj => {
        fnOnScroll(obj.scroll.y);
    });

    $(window).on('resize', function () {
        fnOnResize();
    });

    var agTimeline = $('.kl-timeline-wrap'),
        agTimelineLine = $('.kl-timeline-line'),
        agTimelineLineProgress = $('.kl-timeline-line-progress'),
        agTimelinePoint = $('.kl-circle'),
        agTimelineItem = $('.kl-timeline-right'),
        agOuterHeight = $(window).outerHeight(),
        agHeight = $(window).height(),
        f = -1,
        agFlag = false;

    function fnOnScroll(ScrollTop) {
        agPosY = ScrollTop;
        fnUpdateFrame();
    }

    function fnOnResize() {
        agPosY = $(window).scrollTop();
        agHeight = $(window).height();
        fnUpdateFrame();
    }

    function fnUpdateWindow() {
        agFlag = false;

        agTimelineLine.css({
            top: agTimelineItem.first().find(agTimelinePoint).offset().top - agTimelineItem.first().offset().top,
            bottom: agTimeline.offset().top + agTimeline.outerHeight() - agTimelineItem.last().find(agTimelinePoint).offset().top
        });

        f !== agPosY && (f = agPosY, agHeight, fnUpdateProgress());
    }

    function fnUpdateProgress() {
        var agTop = agTimelineItem.last().find(agTimelinePoint).offset().top;

        i = agTop + agPosY - $(window).scrollTop();
        a = agTimelineLineProgress.offset().top + agPosY - $(window).scrollTop();
        n = agPosY - a + agOuterHeight / 2;
        i <= agPosY + agOuterHeight / 2 && (n = i - a);
        agTimelineLineProgress.css({height: n + "px"});

        agTimelineItem.each(function () {
            var agTop = $(this).find(agTimelinePoint).offset().top;

            (agTop + agPosY - $(window).scrollTop()) < agPosY + .5 * agOuterHeight ? $(this).addClass('active') : $(this).removeClass('active');
        })
    }

    function fnUpdateFrame() {
        agFlag || requestAnimationFrame(fnUpdateWindow);
        agFlag = true;
    }

});


