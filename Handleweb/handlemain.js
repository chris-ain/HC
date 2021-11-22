
import { chessScene, id } from "./chess.js";
import { curtainsmain, curtains } from "./curtainsmain.js";
import { projekte, curtainsProj } from "./projekte.js";
import { intro } from "./intro.js";
import {
  curtainsAg,
  pl,
  curtainsgenturfunc,
} from "./curtainsagentur.js";
import { curtainsProjDet, curtainsDet } from "./curtainsdet.js";
import { curtainsproundermain, curtainsprounder } from "./curtainprounder.js";
//INTRO//
gsap.registerPlugin(ScrollTrigger);

//MAIN//


  function init() {
    var imagesLoaded = 0;

    const body = document.body;
    const select = (e) => document.querySelector(e);
    const selectAll = (e) => document.querySelectorAll(e);
    const pageWrap = select(".page_wrap");
    const loader = select(".js-loader");
    const loaderInner = select(".js-loader__inner");
    const progressBar = select(".js-loader__progress");
    const loaderMask = select(".js-loader__mask");
    const canvastrans = document.querySelector("#chess");
    const homeCurtainsCanvas = document.querySelector(".canvas_agentur");
    let smoothScroll;

    ////////BARBA INIT//////////
    gsap.set(pageWrap, { autoAlpha: 0 });

    // show loader on page load
    gsap.set(loader, { autoAlpha: 1 });

    // scale loader down
    gsap.set(loaderInner, { scaleY: 0.005, transformOrigin: "bottom" });

    initPageTransitions();

    function pageTransitionIn({ container }) {
      // timeline to stretch the loader over the whole screen
      const tl = gsap.timeline({
        defaults: {
          duration: 1,
          ease: "power2.inOut",
        },
      });
      tl.set(loaderInner, { autoAlpha: 0 })
        .fromTo(loader, { yPercent: -100 }, { yPercent: 0 })
        .fromTo(loaderMask, { yPercent: 80 }, { yPercent: 0 }, 0)
        
      
      // .to(container, { y: 150}, 0)
      return tl;
    }

    function pageTransitionOut({ container }) {
      // timeline to move loader away down
      const tl = gsap.timeline({
        defaults: {
          duration: 1,
          ease: "power2.inOut",
        },
        onComplete: () => initScript(),
      });
      tl.to(loader, { yPercent: 100 }).to(loaderMask, { yPercent: -80 }, 0);
     


      // .from(container, { y: -150}, 0)
      return tl;
    }

    function initPageTransitions() {
      barba.hooks.before(() => {

        select("html").classList.add("is-transitioning");
      });

      barba.hooks.after(() => {

        select("html").classList.remove("is-transitioning");
        // reinit locomotive scroll
        smoothScroll.init();
      });

      // scroll to the top of the page
      barba.hooks.enter(() => {
        window.scrollTo(0, 0);
      });

      // barba.use(barbaPrefetch);

      /////////// VIEWS /////////////////////////

      barba.init({
        views: [
          /////////// HOME /////////////////////////
          {
            namespace: "home",

            beforeEnter() {
   gsap.to(loader, {
                opacity: 1,
                duration: 0,
              });
            },

            afterEnter() {
              gsap.to(".page_wrap",{ autoAlpha: 1, duration: 1, delay:3 });
              $(document).ready(function () {

              curtainsmain(smoothScroll);
              chessScene();
              });
            },

            beforeLeave(data) {
              cancelAnimationFrame( id );
              curtains.clear();

              curtains.dispose();

            },
          },
          /////////// AGENTUR /////////////////////////
          {
            namespace: "agentur",
            beforeEnter() {
              curtainsAg.clear();

            },

            afterEnter() {
              $(document).ready(function () {

              curtainsgenturfunc(smoothScroll);

              });
            },

            beforeLeave(data) {
              setTimeout(function () {
                curtainsAg.dispose();
                curtainsAg.clear();


              }, 1000);
            },
          },
          /////////// PROJEKTE /////////////////////////
          {
            namespace: "projekte",
            beforeEnter() {
              // gsap.to(loader, {
              //   opacity: 1,
              //   duration: 0,
              // });

            },

            afterEnter() {
              // projekte(smoothScroll);
              curtainsproundermain(smoothScroll);
            },

            beforeLeave(data) {
              setTimeout(function () {
              // curtainsProj.dispose();
              curtainsprounder.dispose();
            }, 1000);

              // gsap.to(loader, {
              //   opacity: 0,
              //   duration: 0,
              // });
            },
          },
          /////////// PROJEKTDETAIL /////////////////////////
          {
            namespace: "projektdetail",
            beforeEnter() {
              // gsap.to(loader, {
              //   opacity: 0,
              //   duration: 0,
              // });
            },
            afterEnter() {
              $(document).ready(function () {
                // When we begin, assume no images are loaded.
                // Count the total number of images on the page when the page has loaded.
                var totalImages = $("img").length;

                // After an image is loaded, add to the count, and if that count equals the
                // total number of images, fire the allImagesLoaded() function.
                $("img").on("load", function (event) {
                  imagesLoaded++;
                  if (imagesLoaded == totalImages) {
                    allImagesLoaded();
                  }
                });

                function allImagesLoaded() {
                  console.log("ALL IMAGES LOADED");
                }

                $.when(allImagesLoaded()).then(function () {
                  curtainsProjDet(smoothScroll);
                });
              });

              gsap.to(".img_fullscreen", {
                delay: 0.4,
                opacity: 0.5,
                duration: 1,
              });
            },

            beforeLeave(data) {
              // gsap.to(loader, {
              //   opacity: 0,
              //   duration: 0,
              // });

              setTimeout(function () {         
                curtainsDet.dispose();     
              }, 2000);
            },
          },
        ],

        /////////// TRANSITIONS /////////////////////////

        sync: true,
        debug: true,
        // timeout: 7000,
        transitions: [
          {
            name: "overlay-transition",
            once(data) {
              // do something once on the initial page load
              initSmoothScroll(data.next.container);

              initLoader();
              intro();
            },
            async leave(data) {
              // animate loading screen in

              pageTransitionIn(data.current);

              await delay(2000);

              data.current.container.remove();
            },
            async enter(data) {
              // animate loading screen away
              pageTransitionOut(data.next);
            },
            async beforeEnter(data) {
              ScrollTrigger.getAll().forEach((t) => t.kill());
              smoothScroll.destroy();

              initSmoothScroll(data.next.container);
              Webflow.destroy();
              Webflow.ready();
              Webflow.require("ix2").init();
            },
          },
        ],
      });
    }

    function lerp(start, end, amt) {
      return (1 - amt) * start + amt * end * 0.5;
    }

    function initSmoothScroll(container) {
      smoothScroll = new LocomotiveScroll({
        el: document.getElementById("page-content"),
        smooth: true,
        inertia: 0.5,
        passive: true,
      });

      smoothScroll.on("scroll", ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(".smooth-scroll", {
        scrollTop(value) {
          return arguments.length
            ? smoothScroll.scrollTo(value, 0, 0)
            : smoothScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },

        pinType: document.querySelector(".smooth-scroll").style.transform
          ? "transform"
          : "fixed",
      });
      const scrollbar = selectAll(".c-scrollbar");

      if (scrollbar.length > 1) {
        scrollbar[0].remove();
      }

      // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
      ScrollTrigger.addEventListener("refresh", () => smoothScroll.update());

      // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
      ScrollTrigger.refresh();
    }

    //////BARBA LOADER///////

    function initLoader() {
      const tlLoaderIn = gsap.timeline({
        id: "tlLoaderIn",
        defaults: {
          duration: 1.1,
          delay: 2,
          ease: "power2.out",
        },
        onComplete: () => initScript(),
      });

      tlLoaderIn
        //.set(loaderContent, {autoAlpha: 1})
        .to(loaderInner, {
          scaleY: 1,
          transformOrigin: "bottom",
          ease: "power1.inOut",
        });

      const tlLoaderOut = gsap.timeline({
        id: "tlLoaderOut",
        defaults: {
          delay: 1,
          duration: 1.2,
          ease: "power2.inOut",
        },
      });

      tlLoaderOut.to(loader, { yPercent: -100 }, 0.2);
      tlLoaderOut.from('.main', {y: 150}, 0.2);
      tlLoaderOut.to(".page_wrap", {
        opacity: 1, duration: .5, delay: 1

      })
      tlLoaderOut.from(".h1_chars_full", {
       stagger:.05,opacity: 0, duration: .7, y:50, 
      },"-=3")

      tlLoaderOut.to(".sub_hero", {
       opacity: 1, duration: .7, y:50, delay:10
      })

      const tlLoader = gsap.timeline();
      tlLoader.add(tlLoaderIn).add(tlLoaderOut);
    }

    function delay(n) {
      n = n || 2000;
      return new Promise((done) => {
        setTimeout(() => {
          done();
        }, n);
      });
    }

    /* Fire all scripts on page load*/
    function initScript() {
      select("body").classList.remove("is-loading");
      // chessScene();
    }
  }

  $(document).ready(function () {


  init();

  });



