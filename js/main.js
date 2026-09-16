/**
 *
 * preloader
 * headerSticky
 * footer
 * changeValue
 * video
 * infiniteScroll
 * textRotate
 * counter
 * progresslevel
 * totalNumberVariant
 * deleteFile
 * datePicker
 * autoPopup
 * ajaxContactForm
 * handleSidebarFilter
 * checkPaymentCard
 * handleAccordionBorders
 * togglePassword
 * parallaxImage
 * goTop
 * preloader
 *
 **/

(function ($) {
    ("use strict");

    var headerSticky = function () {
        let lastScrollTop = 0;
        let delta = 5;
        let navbarHeight = $(".header-sticky").outerHeight();
        let didScroll = false;

        $(window).scroll(function () {
            didScroll = true;
        });

        setInterval(function () {
            if (didScroll) {
                let st = $(window).scrollTop();
                navbarHeight = $(".header-sticky").outerHeight();

                if (st > navbarHeight) {
                    if (st > lastScrollTop + delta) {
                        $(".header-sticky").css("top", `-${navbarHeight}px`);
                    } else if (st < lastScrollTop - delta) {
                        $(".header-sticky").css("top", "0");
                        $(".header-sticky").addClass("header-bg");
                    }
                } else {
                    $(".header-sticky").css("top", "unset");
                    $(".header-sticky").removeClass("header-bg");
                }
                lastScrollTop = st;
                didScroll = false;
            }
        }, 250);
    };

    var footer = function () {
        function checkScreenSize() {
            if (window.matchMedia("(max-width: 550px)").matches) {
                $(".tf-collapse-content").css("display", "none");
            } else {
                $(".footer-menu-list").siblings().removeClass("open");
                $(".tf-collapse-content").css("display", "unset");
            }
        }
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        var args = { duration: 250 };
        $(".title-mobile").on("click", function () {
            $(this).parent(".footer-col-block").toggleClass("open");
            if (!$(this).parent(".footer-col-block").is(".open")) {
                $(this).next().slideUp(args);
            } else {
                $(this).next().slideDown(args);
            }
        });
    };

    var changeValue = function () {
        if ($(".tf-dropdown-sort").length > 0) {
            $(".select-item").click(function (event) {
                $(this)
                    .closest(".tf-dropdown-sort")
                    .find(".text-sort-value")
                    .text($(this).find(".text-value-item").text());

                $(this)
                    .closest(".dropdown-menu")
                    .find(".select-item.active")
                    .removeClass("active");

                $(this).addClass("active");

                var color = $(this).data("value-color");
                $(this)
                    .closest(".tf-dropdown-sort")
                    .find(".btn-select")
                    .find(".current-color")
                    .css("background", color);
            });
        }
    };

    var video = function () {
        if (
            $("div").hasClass("wg-video") ||
            $("div").hasClass("post-format-video")
        ) {
            $(".popup-youtube, .wg-curve-text-video").magnificPopup({
                type: "iframe",
            });
        }
    };

    var infiniteScroll = function () {
        if ($("body").hasClass("loadmore")) {
            $(".fl-item").slice(0, 8).show();
            $(".fl-item2").slice(0, 3).show();


            if ($(".scroll-loadmore").length > 0) {
                $(window).scroll(function () {
                    if (
                        $(window).scrollTop() >=
                        $(document).height() - $(window).height()
                    ) {
                        setTimeout(() => {
                            $(".fl-item:hidden").slice(0, 2).show();
                            if ($(".fl-item:hidden").length == 0) {
                                $(".view-more-button").hide();
                            }
                        });
                    }
                });
            }
            if ($(".loadmore-item").length > 0) {
                $(".btn-loadmore").on("click", function () {
                    setTimeout(() => {
                        $(".fl-item:hidden").slice(0, 2).show();
                        if ($(".fl-item:hidden").length == 0) {
                            $(".view-more-button").hide();
                        }
                    }, 600);
                });
            }
            if ($(".loadmore-item2").length > 0) {
                $(".btn-loadmore2").on("click", function () {
                    setTimeout(() => {
                        $(".fl-item2:hidden").slice(0, 1).show();
                        if ($(".fl-item2:hidden").length == 0) {
                            $(".view-more-button2").hide();
                        }
                    }, 600);
                });
            }
        }
    };

    var counter = function () {
        if ($(document.body).hasClass("counter-scroll")) {
            const observer = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const element = $(entry.target);

                            if (!element.hasClass("odometer-activated")) {
                                const to = element.data("to");
                                element.addClass("odometer-activated");

                                element.html(to);
                            }

                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );

            $(".counter .number").each(function () {
                observer.observe(this);
            });
        }
    };

    var ajaxContactForm = function () {
        // The styled subject dropdown is not a real form control, so mirror the chosen option into a hidden input.
        $(document).on("click", "form .nice-select .option", function () {
            var $option = $(this);
            var value = $option.hasClass("option-all") ? "" : $.trim($option.text());
            $option.closest("form").find('input[name="subject"]').val(value);
        });

        $(document).on("click", ".flat-alert .close", function (e) {
            e.preventDefault();
            $(this).closest(".flat-alert").remove();
        });

        $("#contactform,#commentform").each(function () {
            $(this).validate({
                submitHandler: function (form) {
                    var $form = $(form),
                        $button = $form.find('[type="submit"]'),
                        str = $form.serialize() + "&page=" + encodeURIComponent(window.location.pathname);

                    var showResult = function (text, cls) {
                        $form.find(".flat-alert").remove();
                        $form.prepend(
                            $("<div />", {
                                class: "flat-alert mb-20 " + cls,
                                role: "status",
                                text: text,
                            }).append('<a class="close" href="#" aria-label="Dismiss">&times;</a>')
                        );
                    };

                    $.ajax({
                        type: "POST",
                        url: $form.attr("action"),
                        data: str,
                        beforeSend: function () {
                            $button.prop("disabled", true).addClass("is-sending");
                        },
                        success: function (msg) {
                            if ($.trim(msg) === "Success") {
                                showResult("Thank you! Your message has been sent. We'll be in touch shortly.", "msg-success");
                                form.reset();
                                $form.find('input[type="hidden"]').val("");
                                $form.find(".nice-select").each(function () {
                                    var $first = $(this).find(".option").first();
                                    $(this).find(".selected").removeClass("selected");
                                    $first.addClass("selected");
                                    $(this).find(".current").text($.trim($first.text()));
                                });
                            } else {
                                showResult("Sorry, your message could not be sent. Please try again or email sales@clipflow.co.zw.", "msg-error");
                            }
                        },
                        error: function (xhr) {
                            var text = xhr.status === 422 && xhr.responseText
                                ? xhr.responseText
                                : "Sorry, your message could not be sent. Please try again or email sales@clipflow.co.zw.";
                            showResult(text, "msg-error");
                        },
                        complete: function () {
                            $button.prop("disabled", false).removeClass("is-sending");
                        },
                    });
                },
            });
        });
    };

    var handleSidebarFilter = function () {
        $("#filterShop,.sidebar-btn").on("click", function () {
            if ($(window).width() <= 1200) {
                $(".sidebar-filter,.overlay-filter").addClass("show");
            }
        });
        $(".close-filter,.overlay-filter").on("click", function () {
            $(".sidebar-filter,.overlay-filter").removeClass("show");
        });
    };

    var parallaxImage = function () {
        if ($(".parallax-img").length > 0) {
            $(".parallax-img").each(function () {
                new SimpleParallax(this, {
                    delay: 0.6,
                    orientation: "up",
                    scale: 1.3,
                    transition: "cubic-bezier(0,0,0,1)",
                    customContainer: "",
                    customWrapper: "",
                });
            });
        }
    };

    var goTop = function () {
        if ($("div").hasClass("progress-wrap")) {
            var progressPath = document.querySelector(".progress-wrap path");
            var pathLength = progressPath.getTotalLength();
            progressPath.style.transition = progressPath.style.WebkitTransition =
                "none";
            progressPath.style.strokeDasharray = pathLength + " " + pathLength;
            progressPath.style.strokeDashoffset = pathLength;
            progressPath.getBoundingClientRect();
            progressPath.style.transition = progressPath.style.WebkitTransition =
                "stroke-dashoffset 10ms linear";
            var updateprogress = function () {
                var scroll = $(window).scrollTop();
                var height = $(document).height() - $(window).height();
                var progress = pathLength - (scroll * pathLength) / height;
                progressPath.style.strokeDashoffset = progress;
            };
            updateprogress();
            $(window).scroll(updateprogress);
            var offset = 200;
            var duration = 0;
            jQuery(window).on("scroll", function () {
                var offset = 200;
                var scrollTop = jQuery(this).scrollTop();
                var footerOffsetTop = jQuery(".footer-go-top").offset().top;
                var windowHeight = jQuery(window).height();

                if (scrollTop > offset && scrollTop + windowHeight < footerOffsetTop) {
                    jQuery(".progress-wrap").addClass("active-progress");
                } else {
                    jQuery(".progress-wrap").removeClass("active-progress");
                }
            });

            jQuery(".progress-wrap").on("click", function (event) {
                event.preventDefault();
                jQuery("html, body").animate({ scrollTop: 0 }, duration);
                return false;
            });
        }
    };

    var preloader = function () {
        $("#loading").fadeOut("slow", function () {
            $(this).remove();
        });
    };

    // Dom Ready
    $(function () {
        headerSticky();
        footer();
        changeValue();
        video();
        infiniteScroll();
        counter();
        ajaxContactForm();
        handleSidebarFilter();
        parallaxImage();
        goTop();
        preloader();
    });
})(jQuery);
