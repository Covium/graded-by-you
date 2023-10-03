// ==UserScript==
// @name         Graded by YOU / Kodland BackOffice
// @version      1.1
// @description  Changes the color of tasks graded by a robot if a teacher found the first robot-graded task.
// @author       Covium
// @match        *://backoffice.kodland.org/*/*/
// @downloadURL  https://github.com/Covium/graded-by-you/raw/rated-by-you.user.js
// @updateURL    https://github.com/Covium/graded-by-you/raw/rated-by-you.user.js
// ==/UserScript==

function recolor() {
    // <ul> is the element that represents a list of grade boxes for a single student.
    const ULs = document.getElementById("table_body").getElementsByTagName("ul");

    // <span> is the element that contains the grade as a text.
    // We need an element and not just text to manipulate its background.
    let SPANs = [];

    // Getting <span>s out of <ul>s to make a grade matrix.
    for (const UL of ULs) {
        const LIs = UL.children;
        let LI_SPANs = [];

        for (const LI of LIs) {
            LI_SPANs.push(LI.getElementsByTagName("a")[0].getElementsByTagName("span")[0]);
        }

        SPANs.push(LI_SPANs);
    }

    let grades = [];
    for (let y = 0; y < SPANs.length; y++) {
        for (let x = 0; x < SPANs[y].length; x++) {
            grades = SPANs[y][x].textContent.split("/").map(e => parseInt(e));

            if (grades[0] === grades[1] + 1) {
                for (let y1 = 0; y1 < SPANs.length; y1++) {
                    grades = SPANs[y1][x].textContent.split("/").map(e => parseInt(e));

                    if (grades[0] === grades[1]) {
                        SPANs[y1][x].style.setProperty("background-color", "#3a7cec", "important");
                    }
                }
            }
        }
    }
}


(function() {
    'use strict';

	// On-load call.
    recolor();

	// An observer that waits for the pan-loader between lesson data loads.
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
            recolor();
        });
    });

	// Linking an observer to the loader elemens. The observer waits for a style change.
    let target = document.getElementById('ajax-loader');
    observer.observe(target, { attributes : true, attributeFilter : ["style"] });
})();