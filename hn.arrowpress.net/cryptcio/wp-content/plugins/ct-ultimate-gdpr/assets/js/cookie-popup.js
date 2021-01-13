/**
 * cookie popup features
 * @var object ct_ultimate_gdpr_cookie - from wp_localize_script
 * @var object ct_ultimate_gdpr_cookie_shortcode_popup - from wp_localize_script
 *
 * */
jQuery(document).ready(function ($) {

    function isModalAlwaysVisible() {
        return false;
        // return !! ( window.ct_ultimate_gdpr_cookie_shortcode_popup && ct_ultimate_gdpr_cookie_shortcode_popup.always_visible );
    }

    function hidePopup() {

        if (isModalAlwaysVisible()) return;

        jQuery('#ct-ultimate-gdpr-cookie-popup').hide();
        jQuery('#ct-ultimate-gdpr-cookie-open').show();
    }

    function showPopup() {
        jQuery('#ct-ultimate-gdpr-cookie-popup').show();
    }

    function hideModal() {

        if (isModalAlwaysVisible()) return;

        jQuery('#ct-ultimate-gdpr-cookie-modal').hide();
        jQuery('#ct-ultimate-gdpr-cookie-open').show();
    }

    function showModal() {
        jQuery('#ct-ultimate-gdpr-cookie-modal').show();
        jQuery('#ct-ultimate-gdpr-cookie-open').hide();
    }

    // hide popup and show small gear icon if user already given consent
    if (ct_ultimate_gdpr_cookie.consent) {
        hidePopup();
    } else {
        showPopup();
        $('body').removeClass("ct-ultimate-gdpr-cookie-bottomPanel-padding");
        $('body').removeClass("ct-ultimate-gdpr-cookie-topPanel-padding");
    }

    function setJsCookie(consent_level) {

        try {

            var consent_expire_time = ct_ultimate_gdpr_cookie.consent_expire_time;
            var consent_time = ct_ultimate_gdpr_cookie.consent_time;
            var content = {
                'consent_level': consent_level,
                'expire_time': consent_expire_time,
                'consent_time': consent_time,
                'consent_declined': false
            };

            content = btoa(JSON.stringify(content));
            var js_expire_time = new Date(1000 * consent_expire_time).toUTCString();
            document.cookie = "ct-ultimate-gdpr-cookie=" + content + "; expires=" + js_expire_time + "; path=/";

        } catch (e) {

        }

    }

    function onAccept() {

        var level = 5;
        setJsCookie(level);

        jQuery.post(ct_ultimate_gdpr_cookie.ajaxurl, {
                "action": "ct_ultimate_gdpr_cookie_consent_give",
                "level": level
            },
            function () {
                if (ct_ultimate_gdpr_cookie.reload) {
                    window.location.reload(true);
                }
            }
        ).fail(function () {


            jQuery.post(ct_ultimate_gdpr_cookie.ajaxurl, {
                "skip_cookies": true,
                "action": "ct_ultimate_gdpr_cookie_consent_give",
                "level": level
            }, function () {
                if (ct_ultimate_gdpr_cookie.reload) {
                    window.location.reload(true);
                }
            })

        });

        if (!ct_ultimate_gdpr_cookie.reload) {
            hidePopup()
        }
        $('body').removeClass("ct-ultimate-gdpr-cookie-bottomPanel-padding");
        $('body').removeClass("ct-ultimate-gdpr-cookie-topPanel-padding");

    }

    function onRead() {
        if (ct_ultimate_gdpr_cookie && ct_ultimate_gdpr_cookie.readurl) {
            window.location.href = ct_ultimate_gdpr_cookie.readurl;
        }
    }

    function onSave(e) {

        e.preventDefault();
        var level = $('.ct-ultimate-gdpr-cookie-modal-slider-item--active input').val();

        jQuery.post(ct_ultimate_gdpr_cookie.ajaxurl, {
            "action": "ct_ultimate_gdpr_cookie_consent_give",
            "level": level
        }, function () {
            if (ct_ultimate_gdpr_cookie.reload) {
                window.location.reload(true);
            }
        }).fail(function () {

            jQuery.post(ct_ultimate_gdpr_cookie.ajaxurl, {
                "skip_cookies": true,
                "action": "ct_ultimate_gdpr_cookie_consent_give",
                "level": level
            }, function () {
                setJsCookie(level);
                if (ct_ultimate_gdpr_cookie.reload) {
                    window.location.reload(true);
                }
            })

        });

        if (!ct_ultimate_gdpr_cookie.reload) {
            hideModal();
            hidePopup();
        }
        $('body').removeClass("ct-ultimate-gdpr-cookie-bottomPanel-padding");
        $('body').removeClass("ct-ultimate-gdpr-cookie-topPanel-padding");
        $('html').removeClass("cookie-modal-open");

    }

    $('#ct-ultimate-gdpr-cookie-accept').bind('click', onAccept);
    $('#ct-ultimate-gdpr-cookie-read-more').bind('click', onRead);
    $('.ct-ultimate-gdpr-cookie-modal-btn.save').bind('click', onSave);

    //MODAL
    $('#ct-ultimate-gdpr-cookie-open,#ct-ultimate-gdpr-cookie-change-settings,.ct-ultimate-triggler-modal-sc').on('click', function (e) {
        var modalbody = $("body");
        var modal = $("#ct-ultimate-gdpr-cookie-modal");
        modal.show();
        modalbody.addClass("cookie-modal-open");
        $("html").addClass("cookie-modal-open");
        e.stopPropagation();
    });

    //Close modal on x button
    $('#ct-ultimate-gdpr-cookie-modal-close').on('click', function () {

        if (isModalAlwaysVisible()) return;

        var modalbody = $("body");
        var modal = $("#ct-ultimate-gdpr-cookie-modal");
        modal.hide();
        modalbody.removeClass("cookie-modal-open");
        $("html").removeClass("cookie-modal-open");
    });

    //Close modal when clicking outside of modal area.
    $(document).on("click", function (e) {

        if (isModalAlwaysVisible()) return;

        if (!($(e.target).closest('#ct-ultimate-gdpr-cookie-change-settings, .ct-ultimate-gdpr-cookie-modal-content').length)) {
            var modalbody = $("body");
            var modal = $("#ct-ultimate-gdpr-cookie-modal");
            modal.hide();
            modalbody.removeClass("cookie-modal-open");
            $("html").removeClass("cookie-modal-open");
        }

        e.stopPropagation();
    });

    //SVG
    jQuery('img.ct-svg').each(function () {
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        jQuery.get(imgURL, function (data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Check if the viewport is set, else we gonna set it if we can.
            if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');
    });


    $(window).on('load', function () {

        var selected = $('.ct-ultimate-gdpr-cookie-modal-slider-item--active');
        var checked = selected.find('input[name=radio-group]');
        var input_id = checked.attr('id');

        selected.find('path').css('fill', '#82aa3b');
        selected.prevUntil('#ct-ultimate-gdpr-cookie-modal-slider-item-block').addClass('ct-ultimate-gdpr-cookie-modal-slider-item--selected');
        checked.parent().prevUntil('#ct-ultimate-gdpr-cookie-modal-slider-item-block').find('path').css('fill', '#82aa3b');

        $('#ct-ultimate-gdpr-cookie-modal-slider-form').attr('class', 'ct-slider-' + input_id);
        $('.ct-ultimate-gdpr-cookie-modal-slider-info.' + input_id).css('display', 'block');

    });

    $('.ct-ultimate-gdpr-cookie-modal-slider').each(function () {

        var $btns = $('.ct-ultimate-gdpr-cookie-modal-slider-item').click(function () {

            var $input = $(this).find('input').attr('id');

            var $el = $('.' + $input).show();
            var form_class = $('#ct-ultimate-gdpr-cookie-modal-slider-form');
            var modalBody = $('div#ct-ultimate-gdpr-cookie-modal-body');

            form_class.attr('class', 'ct-slider-' + $input);
            $('.ct-ultimate-gdpr-cookie-modal-slider-wrap > div').not($el).hide();

            $btns.removeClass('ct-ultimate-gdpr-cookie-modal-slider-item--active');
            $(this).addClass('ct-ultimate-gdpr-cookie-modal-slider-item--active');

            $(this).prevUntil('#ct-ultimate-gdpr-cookie-modal-slider-item-block').find('path').css('fill', '#82aa3b');
            $(this).prevUntil('#ct-ultimate-gdpr-cookie-modal-slider-item-block').addClass('ct-ultimate-gdpr-cookie-modal-slider-item--selected');
            $(this).find('path').css('fill', '#82aa3b');
            $(this).nextAll().find('path').css('fill', '#595959');
            $(this).removeClass('ct-ultimate-gdpr-cookie-modal-slider-item--selected');
            $(this).nextAll().removeClass('ct-ultimate-gdpr-cookie-modal-slider-item--selected');

            if ($(this).attr('id') === 'ct-ultimate-gdpr-cookie-modal-slider-item-block') {
                modalBody.addClass('ct-ultimate-gdpr-slider-block');
                modalBody.removeClass('ct-ultimate-gdpr-slider-not-block');
            } else {
                modalBody.removeClass('ct-ultimate-gdpr-slider-block');
                modalBody.addClass('ct-ultimate-gdpr-slider-not-block');
            }

        });

    });

    if ($("#ct-ultimate-gdpr-cookie-popup").hasClass("ct-ultimate-gdpr-cookie-topPanel")) {
        if (!ct_ultimate_gdpr_cookie.consent) {
            $('body').addClass("ct-ultimate-gdpr-cookie-topPanel-padding");
        }
    }

    if ($("#ct-ultimate-gdpr-cookie-popup").hasClass("ct-ultimate-gdpr-cookie-bottomPanel")) {
        if (!ct_ultimate_gdpr_cookie.consent) {
            $('body').addClass("ct-ultimate-gdpr-cookie-bottomPanel-padding");
        }
    }

    if ($("#ct-ultimate-gdpr-cookie-popup").hasClass("ct-ultimate-gdpr-cookie-topPanel ct-ultimate-gdpr-cookie-popup-modern")) {
        $('body').addClass("popup-modern-style");
    }

    if ($("#ct-ultimate-gdpr-cookie-popup").hasClass("ct-ultimate-gdpr-cookie-bottomPanel ct-ultimate-gdpr-cookie-popup-modern")) {
        $('body').addClass("popup-modern-style");
    }

});
