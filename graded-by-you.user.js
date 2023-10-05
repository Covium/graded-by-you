// ==UserScript==
// @name         Graded by YOU / Kodland BackOffice
// @version      1.3.1
// @description  Changes the color of tasks graded by a robot if a teacher found the first robot-graded task.
// @grant        GM_addElement
// @author       Covium
// @match        *://backoffice.kodland.org/*/*/
// @updateURL    https://github.com/Covium/graded-by-you/raw/graded-by-you.user.js
// @downloadURL  https://github.com/Covium/graded-by-you/raw/graded-by-you.user.js
// ==/UserScript==

function firstCheckingPageInjection() {
    // Restoring dropdown select menus full width.
    const input_field = document.getElementById("test2").children[0].children[0].children[0].children[0];
    input_field.style.paddingRight = "2%";

    // Updating the legend on top of the table.
    const legend_boxes = document.getElementById("test2").children[0].children[0].getElementsByClassName("yellow")[0].parentElement;
    legend_boxes.style.position = "relative";
    GM_addElement(legend_boxes, "div", {
        style: "height: 20px; width: 20px; position: absolute; top: 50px; clip-path: polygon(100% 0, 0 100%, 100% 100%); background: #3a7cec;"
    });
}

function updateCheckingPageTable() {
    // <ul> is the element that represents a list of grade boxes for a single student.
    const ULs = document.getElementById("table_body").getElementsByTagName("ul");
    
    // <span> is the element that contains the grade as a text.
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
    
    // Changing cell's background color to blue if it is equal to maximum points
    // after maximum + 1 was found in the same column.
    let grades = [];
    let robot_rated = [];
    for (let y = 0; y < SPANs.length; y++) {
        for (let x = 0; x < SPANs[y].length; x++) {
            if (robot_rated.includes(x)) continue;
            
            grades = SPANs[y][x].textContent.split("/").map(e => parseInt(e));
            if (grades[0] === grades[1] + 1) {
                robot_rated.push(x);

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
    
    if (window.location.href.includes("group_")) {
        // On-load calls.
        firstCheckingPageInjection()
        updateCheckingPageTable();

        // An observer that waits for the pan-loader between lesson data loads.
        const target = document.getElementById('ajax-loader');
        const observer = new MutationObserver(function () {
            if (target.style.display === 'none') updateCheckingPageTable();
        });

        // Linking an observer to the loader elemens. The observer waits for a style change.
        observer.observe(target, { attributes: true, attributeFilter: ["style"] });
    }
})();
