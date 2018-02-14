/*!
 *   Unslider Lazyload
 *   version 1.1.0
 *   MIT License
 *   by @jonathanarbely (https://bymagellan.co)
 *   https://github.com/jonathanarbely/unslider-lazyload
*/

// HOW TO INIT this Plugin:
// unsliderLazyLoad( images[array], imagesThumb[array], description[array], alt[array], instance[int], sliderName[object], toggleThumbnails[boolean] )

// Note: Init at the end of the body-tag, together with Unslider. Unslider dots and keyboard navigation aren not supported yet.

// PARAMETERS:
// images:              A one- or multi-dimensional array containing the URLs to the images that should be displayed - should be sorted in a descending manner (ie. biggest res to lowest res)
// description:         An array containing Strings that are used in the title-tag of each image
// alt:                 An array containing Strings that are used in the alt-tag of each image (including Thumbnails)
// instance:            If multiple lazy loaded Unslider-Galleries are initialized, give each of them an incrementing index starting with zer0
// sliderName:          The variable you've used to init Unslider (e.g. slider, like in: slider = $('#unslider').unslider())
// imagesThumb:         Optional - An array containing the URLs to the Thumbnails that should be displayed, prefferably in a lower resolution

// Global Namespace: ull_

// ----------------------------------------------

// Initilization
function unsliderlazyload(images, description, alt, instance, sliderName, imagesThumbs) {
    
    // Determine the type of images
    if(images[0][1] == 't') {
        var ull_imagesType = 'onedimensional-array';
        
        // Check for undefined or null in images array and remove if found
        // https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
        images = $.grep(images,function(n){ return n == 0 || n });
        // sync changes to all the other arrays - wip
        
        var ull_imagesLength = images.length;
    }
    else {
        var ull_imagesType = 'multidimensional-array',
            ull_imagesSrcsets = images.length;
        
        // Check for undefined or null in images array and remove if found
        for (var z = 0; z < ull_imagesSrcsets; z++)
            images[z][1] = $.grep(images[z][1],function(n){ return n == 0 || n });
        
        var ull_imagesLength = images[0][1].length;
    }
    //console.log(ull_imagesType);
    
    // Make sure the default Unslider dots are removed from the DOM, as this plugin does not recalculate them yet
    $('.unslider-nav ol').remove();
    
    // Fetching the Slider ID
    var sliderID = $(sliderName).attr('id');
    
    // The following code handles the initial layzloading right after DOMready: The first two images of each slider are loaded as soon as they enter the viewport
    
    // https://medium.com/talk-like/detecting-if-an-element-is-in-the-viewport-jquery-a6a4405a3ea2
    function viewport(e) {
        //console.log( $(e).parent().outerHeight() );
        var elementTop = $(e).offset().top,
            elementBottom = elementTop + $(e).parent().outerHeight(),
            viewportTop = $(window).scrollTop(),
            viewportBottom = viewportTop + $(window).height();
        return [elementBottom > viewportTop && elementTop < viewportBottom, sliderID];
    }
    
    // On domready: Check if slider is in viewport
    $(document).ready(function () {
        viewportCheck();
    });
    
    // On scroll: Check if slider is in viewport
    $(window).on('scroll', function() {
        viewportCheck();
    });
    
    // Check if slider is in viewport
    function viewportCheck() {
        var returnViewport = viewport( $('#'+sliderID).parent() ),
            inViewport = returnViewport[0],
            id = returnViewport[1];
        viewportLoad(sliderID, inViewport, $('#'+sliderID).parent());
    }
    
    function viewportLoad(id, inViewport, e) {
        
        if(inViewport && $(e).children().children('.unslider-wrap').children().length <= 1) {
            
            if(ull_imagesType == 'multidimensional-array') {
                
                // Append Image N°1 - Where the magic happens!
                var ull_break = false;
                for (var z = 0; z < ull_imagesSrcsets && ull_break == false; z++) {
                     if($(window).width() >= images[z][0]) {
                        //console.log(images[z][0]);
                        $('#'+sliderID +' .unslider-wrap').append('<li><img src="' +images[z][1][0] +'" alt="' +alt[0] +'" title="' +description[0] +'" data-imgid="1"></li>');
                        // stop the for loop when the right resolution was found
                        ull_break = true;
                    }
                    // If the correct resoltion could not be applied, apply the smallest one (since this should only occur on small screen sizes, aprox. <= 4")
                    else if(z == ull_imagesSrcsets-1) {
                        $('#'+sliderID +' .unslider-wrap').append('<li><img src="' +images[z][1][0] +'" alt="' +alt[0] +'" title="' +description[0] +'" data-imgid="1"></li>');
                    }
                }
                ull_break = false;

                // Append Image N°2 - Where the magic happens!
                for (var z = 0; z < ull_imagesSrcsets && ull_break == false; z++) {
                    if($(window).width() >= images[z][0]) {
                        //console.log(images[z][0]);
                        $('#'+sliderID +' .unslider-wrap').append('<li><img src="' +images[z][1][1] +'" alt="' +alt[1] +'" title="' +description[1] +'" data-imgid="2"></li>');
                        // stop the for loop when the right resolution was found
                        ull_break = true;
                    }
                    else if(z == ull_imagesSrcsets-1) {
                        $('#'+sliderID +' .unslider-wrap').append('<li><img src="' +images[z][1][1] +'" alt="' +alt[0] +'" title="' +description[0] +'" data-imgid="2"></li>');
                    }
                }
                ull_break = false;
            }
            else {
                 // Append Images - Where the magic happens!
                $('#'+id +' .unslider-wrap').append('<li><img src="' + images[0] + '" alt="' + alt[0] + '" title="' + description[0] + '"></li>'); // add the first image to the slider
                $('#'+id +' .unslider-wrap').append('<li><img src="' + images[1] + '" alt="' + alt[1] + '" title="' + description[1] + '"></li>'); // add the second image to the slider
            }
            
            // remove an optional placeholder image
            if($('#'+id +' .unslider-wrap').children().length != 2)
                $('#'+id +' .unslider-wrap').children().first().remove();
            
            // Let's recalculate Unslider so it knows what's going on
            sliderName.unslider('calculateSlides');
            
            // After the slider has loaded its first two images, let's launch interaction
            unsliderlazyload__interaction(images, description, alt, instance, sliderName, imagesThumbs, ull_imagesType, ull_imagesLength, ull_imagesSrcsets);
            
            // he debug, he attac
            //console.log('viewportLoad// ID: ' +id +' inViewport: ' +inViewport +' Children: ' +$(e).children().children('.unslider-wrap').children().length);
            
            // Remove content-placeholder with loading animation
            $('.unslider:eq('+instance+')').css('background','rgba(255,255,255,0)').css('animation-name','unset');
        }
    }
    // End of initial lazyload

}

// Contains the logic that handles UI interaction (like Thumbnails and Arrows)
function unsliderlazyload__interaction(images, description, alt, instance, sliderName, imagesThumbs, ull_imagesType, ull_imagesLength, ull_imagesSrcsets) {
    
    // A plugin-namespace will be introduced soon
    var sliderID = $(sliderName).attr('id');
    var next = $('#'+sliderID).parent('.unslider').children('.next'),
        previous = $('#'+sliderID).parent('.unslider').children('.prev'),
        //caption = $('.pg_caption:eq('+instance+')'),
        index = $('.pg_index:eq('+instance+')'),
        //sum = $('.pg_sum:eq('+instance+')'),
        i = 0, // Image counter
        offset = 0, // Generally, this equals x+=thumbAmount+1
        lazyLoad = true,
        swipeGesture = false,
        swipeDirection = false,
        mobile = false,
        mobileWidth = 1024,
        ull_break = false,
        ull_switchThumbnails = true,
        ull_thumbnailLength = imagesThumbs.length-1;
    
    // Console log instance (uncomment for debugging)
    /*console.log('------------------------');
    console.log(sliderName);
    console.log('Next: ');
    console.dir( next );
    console.log('Index: ');
    console.dir( index );
    //console.log('Sum: ');
    //console.dir( sum );
    console.log( 'i: ' +i );
    console.log( 'LazLoad: ' +lazyLoad );
    console.log( 'Instance: ' +instance );
    console.log( 'ID: ' +sliderID );
    console.log( 'swipeGesture: ' +swipeGesture );
    console.log( 'swipeDirection: ' +swipeDirection );
    console.log( 'mobileWidth: ' +mobileWidth );
    console.log( 'ull_imagesLength: ' +ull_imagesLength );
    console.log('Index DOM-Element: ');
    console.dir( index );*/
    
    removeThumbnails();

    if (!mobile) {
        var x = 0, // Set counter
            thumbAmount = 7, // Define the amount of thumbnails that should be displayed at a time / a set of Thumbnails
            nextThumbs = $('.pg_nextThumbs:eq('+instance+')'),
            prevThumbs = $('.pg_prevThumbs:eq('+instance+')'),
            currentThumb = 1;
        
        // Hide thumbnail-arrows when there are less than 7 slides
        if(imagesThumbs.length <= 7) {
            nextThumbs.hide();
            prevThumbs.hide();
            ull_switchThumbnails = false;
        }
    }
    
    //console.log( 'mobile: ' +mobile );
    //console.log('Next Thumbset: ');
    //console.dir( nextThumbs );
    //console.log( 'x: ' +x );

    // Next Slide
    next.click(function () {
        
        setImageArray = setImage(i, true); // returns incremented i and lazyLoad true/false
        i = setImageArray[0];
        lazyLoad = setImageArray[1];

        hidePreviousButton();

        // As this is a clickhandler, false swipeGesture
        swipeGesture = false;

        //$('.next:eq('+instance+')').click();
    });

    // Previous Slide
    previous.click(function (e) {
        
        /*console.log(i);
        console.log($(index).text());
        console.log(imagesThumbs.length);
        console.log(currentThumb);
        console.dir($('.c-photogallery-thumbnails__image--inactive'));
        console.log($('.c-photogallery-thumbnails__image--inactive').data('thumbid'));*/
        
        // Select the last slide when navigating backwards on the first slide (only if ull_switchThumbnails == false)
        if(i == 0 && $(index).text() == 1 && currentThumb == 1 && !ull_switchThumbnails)
            $('.c-photogallery-thumbnails__item:eq('+imagesThumbs.length+')').children().children().click();
        // Display the previous set of thumbnails
        else {
            setImageArray = setImage(i, false); // returns decremented i and lazyLoad true/false
            i = setImageArray[0];
            lazyLoad = setImageArray[1];

            hidePreviousButton();

            // As this is a clickhandler, false swipeGesture
            swipeGesture = false;
        }
        
    });

    // Set thumbnails - Call on domready
    if (!mobile) {
        setThumbs(x);
        activeThumb(i);
    }

    // Switch Thumbnails
    if (!mobile) {
        nextThumbs.click(function () {

            // Increase x by the amount of thumbnails to display (e.g. +7)
            x += thumbAmount;
            //console.log(ull_imagesLength - 1 - x);

            // Check end (if result is <0, end of images is reached)
            if (ull_imagesLength - 1 - x >= 0) {
                //console.log('next setting thumbs: ' + x + ' / ' + i);
                setThumbs(x, 'nextThumbs');
            } else {
                // reset x when the end of the thumbnails array is reached
                x = 0;
                // Switch to the first set of Thumbnails
                setThumbs(x, 'nextThumbs');
                //setIndex(i);
            }
        });
        prevThumbs.click(function () {
            // Decrease x by the amount of thumbnails to display (e.g. -7)
            x -= thumbAmount;

            //console.log(x); //console.log(ull_imagesLength-1-x)

            if (x < 0) {
                //console.log('x<0');
                // when the at the beginning of the thumbnails array, switch to the last set
                x = parseInt(ull_imagesLength / thumbAmount) * thumbAmount;
                setThumbs(x, 'prevThumbs');
            } else {
                //console.log('x<0 - prev setting thumbs: ' + x + ' / ' + i);
                // Show the previous set of Thumbnails
                setThumbs(x, 'prevThumbs');
            }
        });

        // Click Thumbnail
        $('.c-photogallery-thumbnails__list:eq('+instance+') .c-photogallery-thumbnails__image').click(function () {
            thumbid = $(this).attr('data-thumbID');
            //console.warn('Thumbnail clicked:' + i + '/' + thumbid);

            // Slide one slide back
            if (i - 1 == thumbid)
                previous.click();
            // Slide one slide forward
            else if (i == thumbid - 1)
                next.click();
            // Jump over multiple slides
            else {
                if (i <= thumbid) {
                    // When a thumb is clicked, just click next/previous as often as needed to also lazyload all images inbetween
                    for (y = i; y != thumbid; y++)
                        next.click();
                } else {
                    //alert(i +'/'+thumbid);
                    for (y = i; y != thumbid; y--)
                        previous.click();
                }
                // From Docs: 'Move the slider to a specific slide, update any navigation and fire an unslider.change event.'
                sliderName.unslider('animate:' + i);
                //console.warn('animate:'+i);
            }
        });
    }
    
    function setIndex(i) {
        i++; // Increment i in scope of function (not global) for better usability (first pic is numbered 1 instead of 0)
        index.text(i);
    }

    // Defines the set of Thubmnails that should be displayed (1-7,8-14,15-21,usw.)
    function setThumbs(x, mode) {
        // Prevents the function from executing in the rare case there's a glitch or loop
        if (x >= 0 && !mobile) {
            //console.log('switching thumbnailset:' + x);
            hidePreviousThumbsButton(x);

            $('.pg_thumbs:eq('+instance+') img').each(function () {
                //console.log(ull_imagesLength-x);
                if (ull_imagesLength - 1 - x >= 0) {
                    $(this).attr('src', imagesThumbs[x]).attr('data-thumbID', x).show().attr('alt', alt[x]).attr('title', alt[x]);
                    //console.log('set thumbs: ' + x +'/' + i);
                } else
                    $(this).hide();

                // x is increased (in sets of 7) for every loop (but not returned from the function to the global scope)
                //console.log(x);
                x++;
            });
            
            // If next thumbnail set is selected
            if(mode=='next') { //rename to sliderarrows
                // If the thumb set switches, set the first thumbnail as active
                if (i != 0)
                    activeThumb(i + 1);
                else
                    activeThumb(i);

                // When the set switches and the first Thumb is set as active, display the correct index value
                //console.error(currentThumb);
                setIndex(i+1);
            }
            // If previous thumbnail set is selected, the active image in the slider defines the active thumbnail
            else if(mode=='prevThumbs' || mode=='nextThumbs') {
                var imgid = parseInt($('.unslider-active').children().first().attr('data-imgid'));
                if(imgid > 0) {
                    activeThumb( imgid-1 );
                    setIndex( imgid-1 );
                }
                // First thumbnail
                else {
                    activeThumb( 0 );
                    setIndex( 0 );
                }
            }
            
        } else
            console.log('error: glitch/loop in unslider lazyload - function setThumbs()');
    }
    
    function setImage(i, mode) { // mode defines the direction of navigation, where true=forward and false=backward
        //console.log('------------------');
        //console.log('i: ' + i + ' / Images length: ' + ull_imagesLength + ' / Mode: ' + mode + ' / Lazyload: ' + lazyLoad);
        
        // Select the last set of thumbnails (when on the first slide)
        if(mode == false && !mobile && i == 0 && $('.c-photogallery-thumbnails__image--inactive').attr('data-thumbid') == 0) {
            
            // Navigate to the last set of thumbnails
            var ull_thumbnailSets = Math.round(imagesThumbs.length/thumbAmount)-1;
            for(var z = 0;z < ull_thumbnailSets;z++)
                $(nextThumbs).click();
            
            // click last thumbnail
            setTimeout(function () {
                $('.c-photogallery-thumbnails__image[data-thumbid='+ull_thumbnailLength+']').click();
            }, 60);
        }
        else {

            if (!mobile)
                currentThumb = $('.c-photogallery-thumbnails__image--inactive:eq('+instance+')').data('thumbid');
            //console.log(currentThumb);
            //console.log('current thumb: ' + currentThumb + ' current i: ' + i);

            // Choosing the previous set of thumbnails
            //console.log(i % thumbAmount);
            if (mode == false && i % thumbAmount == 0 && !mobile) {
                x -= thumbAmount;
                setThumbs(x, 'next');
            }

            // Increment counter, since the next image was selected
            // Increment only when the current image is not the last image
            if (i < ull_imagesLength && mode == true)
                i++;
            // Decrement counter, since the previous image was selected
            if (i != 0 && mode == false)
                i--;

            // The end of the gallery is reached
            if (i == ull_imagesLength) {
                console.log('The end of the gallery is reached');

                // Stop lazyloading, as all images in the images array have been loaded
                lazyLoad = false;

                // reset i
                i = 0;

                if (!mobile) {
                    // reset x and thumbnailset
                    x = 0;
                    setThumbs(x, 'next');

                    // Set the active Thumbnail
                    activeThumb(i);
                }

                // Reset UI index-counter
                setIndex(i);

                // Stop the whole function
                return [i, lazyLoad];
            }

            //console.log('i before:'+i);
            //console.log(mode);

            // Set active thumbnail
            if (!mobile)
                activeThumb(i);

            // Initially there are two images per gallery preloaded in the DOM (after domready) and one additional is lazyloaded for every interaction that leads one step further in the gallery - example: image1(preloaded & visible), image2(preloaded) -> when image1 continues to image2 through user interaction -> image3(LazyLoaded through this JS-File) -> when image2 continues to image3 through user interaction -> image4(LazyLoaded through this JS-File)
            if (i != ull_imagesLength - 1 && lazyLoad == true && mode == true) {
                if (i + 1 == $('.unslider-wrap:eq('+instance+')').children().length) {

                    if(ull_imagesType == 'multidimensional-array') {

                        var imgid = parseInt($('.unslider-wrap:eq('+instance+')').children().length)+1;

                        // discarded single img (or picture element) with srcset as unslider isn't compatible (.unslider-wrap's width messes with the way the browser interprets the viewport resolution and tricks it into always choosing the highest available res)
                        // ...thus, this solution was chosen:

                        // Check viewport width and dynamically load the correct image resolution (if provided)
                        for (var z = 0; z < ull_imagesSrcsets && ull_break == false; z++) {
                            if($(window).width() >= images[z][0]) {
                                //console.log(images[z][0]);
                                $('#'+sliderID +' .unslider-wrap').append('<li><img src="' +images[z][1][i+1] +'" alt="' +alt[i+1] +'" title="' +description[i+1] +'" data-imgid="'+imgid +'"></li>');
                                // stop the for loop when the right resolution was found
                                ull_break = true;
                            }
                            else if(z == ull_imagesSrcsets-1) {
                                $('#'+sliderID +' .unslider-wrap').append('<li><img src="' +images[z][1][i+1] +'" alt="' +alt[i+0] +'" title="' +description[i+0] +'" data-imgid="'+imgid +'"></li>');
                            }
                        }
                        ull_break = false;
                    }
                    // when no sourceset is defined
                    else {
                        // Append Image - Where the magic happens!
                        $('#'+sliderID +' .unslider-wrap').append('<li><img src="' + images[i+1] + '" alt="' + alt[i+1] + '" title="' + description[i+1] + '"></li>');
                    }

                    // Let's recalculate Unslider so it knows what's going on
                    sliderName.unslider('calculateSlides');
                } //else
                    //console.log('Image already loaded, no lazyLoad.');
            }
            if (i <= ull_imagesLength) {
                // Switch Caption
                //caption.text(description[i]);
                // Set UI Indexvalue
                setIndex(i);
            }

            // Switch Thumbnail set when necessary
            if (!mobile)
                offset = x + thumbAmount;
            //offsetBack = x + thumbAmount - 1;

            //console.log('i: ' +i);

            if (i % offset == 0 && i != 0 && mode == true && !mobile) {
                x += thumbAmount;
                setThumbs(x, 'next');
            }

        }
        // Return i and lazyLoad as an unlabeled array
        return [i, lazyLoad];
    }

    // Assign the active thumbnail a css-class
    function activeThumb(i) {
        // In the current CSS, inactive means active
        // reset class and remove counter
        $('.pg_thumbs:eq('+instance+') img').removeClass('c-photogallery-thumbnails__image--inactive').parent().children('span').remove();
        // Place counter inside the active Thumbnail
        $('.pg_thumbs:eq('+instance+') img[data-thumbid="' + i + '"]').addClass('c-photogallery-thumbnails__image--inactive').parent().append('<span class="c-photogallery-teaser-image-infos__image-number__wrapper"><span class="c-photogallery-teaser-image-infos__image-number pg_index">1</span><span class="c-photogallery-teaser-image-infos__count pg_sum"> /'+ull_imagesLength+'</span></span>');
        index = $('.pg_index:eq('+instance+')');
    }

    // SUPPORT FOR SWIPEGESTURES ----------------------

    //  Listen to slide changes
    sliderName.on('unslider.change', function (event, index, slide) {
        //console.dir(slide.prevObject.length);
        //alert(swipeDirection);
        //console.log('swipe allowed');
        setTimeout(function () {
            // Swipe to next image triggers lazyLoad through setImage()
            if (swipeGesture == true && swipeDirection == true) {
                //console.log('-> Swipe to next image triggers lazyLoad through setImage() / ' + i);
                setImageArray = setImage(i, true);
                i = setImageArray[0];
                lazyLoad = setImageArray[1];

                hidePreviousButton();
            }
            // Swipe to previous image triggers setImage(), but not lazyLoad
            if (swipeGesture == true && swipeDirection == false) {
                //console.log('-> Swipe to previous image triggers setImage(), but not lazyLoad / ' + i);
                setImageArray = setImage(i, false);
                i = setImageArray[0];
                lazyLoad = setImageArray[1];

                hidePreviousButton();
            }
        }, 60)
    }).on('swipeleft', function () {
        //console.log('swipeleft');
        swipeGesture = true;
        swipeDirection = true; // true for forward, false for backward
    }).on('swiperight', function () {
        //console.log('swiperight');
        swipeGesture = true;
        swipeDirection = false;
    }).on('movestart', function(e){
        //console.log('movestart');
        //console.log(e.distX);
        //console.log(i);
        // Prevent sliding to the previous image when on the first slide, with the exception of when all slides have been loaded
        if(lazyLoad && e.distX >= 1 && i==0) {
            e.preventDefault();
            //console.log('prevented swiperight');
        }

    });

    //  ---------------------

    // Hide 'previous' when at the first slide (prevents lazyloading all images at once)
    function hidePreviousButton() {
        //console.log(i);
        //console.log(lazyLoad);
        if(lazyLoad)
            if (i == 0)
                previous.hide();
            else
                previous.show();
        //previous.show();
    }

    function hidePreviousThumbsButton(x) {
        //alert(x);
        if (x == 0)
            prevThumbs.addClass('invisible');
        else
            prevThumbs.removeClass('invisible');
    }

    // Remove all Thumbnails from the DOM when on a mobile device or toggleThubmnails==false to save bandwith and a small amount of RAM through less listeners and vars
    //  mobile {Initial load: 713kb / RAM 17.54K}
    // !mobile {Initial load: 835kb / RAM 18.06K}
    function removeThumbnails() {
        if ($(window).width() <= mobileWidth || imagesThumbs.length == 0) {
            mobile = true;
            $('.pg_thumbs:eq('+instance+')').remove();
        }
    }
    
    $(window).resize(function () {
        removeThumbnails()
    });
    
} // END OF function unsliderlazyload__interaction()

// END OF Unslider Lazyload
