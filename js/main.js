(function($) {
    "use strict";

    $(document).ready(function(){
        $(".js-dropdwon-hover").hover(function(){
            let dropdownToggle = $(this).find(".dropdown-toggle"),
                dropdownMenu = $(this).find(".dropdown-menu"),
                widthMenu = $(this).data("width");
            dropdownToggle.addClass("show");
            dropdownToggle.attr("aria-expanded", "true");
            dropdownMenu.addClass("show").fadeIn(300);
            if(widthMenu) 
                dropdownMenu.css("width", widthMenu);
        }, function(){
            let dropdownToggle = $(this).find(".dropdown-toggle"),
                dropdownMenu = $(this).find(".dropdown-menu");
            dropdownToggle.removeClass("show");
            dropdownToggle.attr("aria-expanded", "false");
            dropdownMenu.removeClass("show").fadeOut(300);
            dropdownMenu.removeAttr("style");
        });

        $(".js-dropdwon-hover .dropdown-toggle").on('click', function(e){
            e.preventDefault();
        });

        $(".js-navbar-toggler").on('click', function(e){
            $("body").toggleClass("kl-menu-is-open");
        });

        //toast infos
        $('.kl-toast-infos-close').on('click', function(){
            $(this).closest('.kl-toast-infos').addClass('kl-closed');
        })

        //custom btn switch
        $(".kl-btn-switch input[type=radio]").on("change", function(){
            let wrapper_btn = $(this).closest(".kl-btn-switch"),
                radio = wrapper_btn.find("input[type=radio]"),
                radio_checked = radio.filter(":checked");
            radio.not(radio_checked).closest(".form-check").removeClass("active");
            radio_checked.closest(".form-check").addClass("active");
        });

        // slick page about
        $('.kl-slick-img-model').each(function (index, slider) {
            var id = index + 1; 
            $(slider).slick({
                  infinite: false,
                  dots: true,
                  arrows: true,
                  speed: 500,
                  autoplay: false,
                  slidesToShow: 2,
                  slidesToScroll: 1,
                  variableWidth: true,
                  prevArrow: "#id-slick-next-" + id,
                  nextArrow: "#id-slick-previous-" + id,
                  responsive: [
                    {
                      breakpoint: 480,
                      settings: {
                        slidesToShow: 1
                      }
                    }
                  ]
            });
        });

        //roadmap timeline
        set_height_roadmap_timeline();

        //recherche station
        $('.kl-dropdown-filter').on('click', function(e){
            e.stopPropagation();
        });

    });

    $(window).on('resize orientationchange', function(){
        //roadmap timeline
        set_height_roadmap_timeline();
    });

    document.querySelectorAll('.collapse').forEach((el) => {
        $(el).on("show.bs.collapse", function () {
            setTimeout(function () {
                scroller.update();
            }, 500)
        });
        $(el).on("hide.bs.collapse", function () {
            setTimeout(function () {
                scroller.update();
            }, 500)
        });
    })

    //tabs
    if(document.body.contains(document.querySelector('button[data-bs-toggle="tab"]'))){
        document.querySelectorAll('button[data-bs-toggle="tab"]').forEach((el) => {
            el.addEventListener('shown.bs.tab', event => {
                setTimeout(function () {
                    scroller.update();
                }, 500)
            })
        })
    }

    //pill
    if(document.body.contains(document.querySelector('button[data-bs-toggle="pill"]'))){
        document.querySelectorAll('button[data-bs-toggle="pill"]').forEach((el) => {
            el.addEventListener('shown.bs.tab', event => {
                setTimeout(function () {
                    scroller.update();
                }, 500)
            })
        })
    }

    //move all modals
    document.querySelectorAll(".modal").forEach((el) => {
        append_element_in_main(el);
    })

    if(document.body.contains(document.getElementById('id-wrapper-map-sidebar'))){
        append_element_in_main(document.getElementById('id-wrapper-map-sidebar'));
    }

    const modal_video = document.getElementById('id-modal-video'),
        video_in_modal = document.getElementById('id-video-in-modal');

    if(document.body.contains(modal_video)){
        modal_video.addEventListener('shown.bs.modal', () => {
            scroller.stop()
            play_video(video_in_modal);
        });

        modal_video.addEventListener('hidden.bs.modal', () => {
            scroller.start()
            stop_video(video_in_modal);
        });
    }

    function play_video(video) {
        video.play();
    }

    function pause_video(video) {
        video.pause();
    }

    function stop_video(video) {
        pause_video(video);
        video.currentTime = 0;
    }

    function append_element_in_main(el) {
        const clone = el.cloneNode(true),
            main = document.querySelector(".main");
        main.append(clone);
        el.remove();
    }

    function set_height_roadmap_timeline() {
        const roadmap_timeline = $('.kl-roadmap-timeline-line'),
            lastrow = $('.kl-roadmap-timeline-row').last();
        let height_lastrow = lastrow.outerHeight();
        
        roadmap_timeline.css({
            bottom: height_lastrow - 23
        })
    }

})(jQuery);


//locomotive scroll
const header = document.querySelector('.kl-header');
let lastscroll = 0;

const scroller = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    getDirection: true,
})

gsap.registerPlugin(ScrollTrigger)

scroller.on("scroll", obj => {
    lastscroll = obj.scroll.y;

    if(lastscroll > 35) {
        header.classList.add('kl-fixed')
    } else {
        header.classList.remove('kl-fixed')
    }

    ScrollTrigger.update
});

ScrollTrigger.scrollerProxy(
    '.kl-scroll-container', {
        scrollTop(value) {
            return arguments.length ?
            scroller.scrollTo(value, 0, 0) :
            scroller.scroll.instance.scroll.y
        },
        getBoundingClientRect() {
            return {
                left: 0, top: 0, 
                width: window.innerWidth,
                height: window.innerHeight
            }
        }
    }
)

if(document.body.contains(document.querySelector('.kl-image-bg'))){
    document.querySelectorAll(".kl-image-bg").forEach((el) => {
        ScrollTrigger.create({
            trigger: el,
            scroller: '.kl-scroll-container',
            start: 'top+=30% 50%',
            end: 'bottom-=40% 50%',
            animation: gsap.to(el, {backgroundSize: '110%'}),
            scrub: 2,
            // markers: true
        })
    })
}


ScrollTrigger.addEventListener('refresh', () => scroller.update())

ScrollTrigger.refresh()


//init AOS with locomotive scroll
AOS.init({
    once: true
});

let observer = new IntersectionObserver( (entries, observer) => { 
    entries.forEach(entry => { 
        if(entry.isIntersecting) {
            entry.target.classList.add('aos-animate')
        } /* else {
            if(entry.boundingClientRect.top < 0) {
                entry.target.classList.add('aos-animate')
            } else {
                entry.target.classList.remove('aos-animate')
            }
        } */
    }); 
});

document.querySelectorAll('[data-aos]').forEach(aosElem => { observer.observe(aosElem) });


//counter number animation
if(document.body.contains(document.querySelector('.js-counter'))){
    const counterUp = window.counterUp.default

    const callback = entries => {
        entries.forEach( entry => {
            const el = entry.target
            if ( entry.isIntersecting && ! el.classList.contains( 'is-visible' ) ) {
                counterUp( el, {
                    duration: 2000,
                    delay: 16,
                } )
                el.classList.add( 'is-visible' )
            }
        } )
    }

    const IO = new IntersectionObserver( callback, { threshold: 1 } )

    document.querySelectorAll('.js-counter').forEach(function (el) {
        IO.observe( el )
    });
}