// ==UserScript==
// @name         Dollaris
// @version      0.1
// @description  A modular event-driven userscript to improve the drrr.com experience.
// @match        https://drrr.com/room/?id=*
// ==/UserScript==

namespace Dollaris {
    declare var $: any;

    /// Non-Systematic Tweaks
    // DM-Count-Button
    $('div.volume').after('<input type="button" value="Count DMs" onclick=\'$.get("/json.php?fast=1", (data)=>{ alert(35-data["talks"].length) });\' style="margin: 8px; background: transparent; border: 2px solid white; box-sizing: border-box; float: right;">');
    // Autofocus Textbox
    $(window).focus(() => $('textarea.form-control').focus());
}