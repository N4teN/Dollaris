// ==UserScript==
// @name         Dollaris
// @version      0.1
// @description  A modular event-driven userscript to improve the drrr.com experience.
// @match        https://drrr.com/room/?id=*
// ==/UserScript==

namespace Dollaris {
    declare var $: any;

    /// Constants
    const storageKey = "Dollaris";

    /// Non-Systematic Tweaks
    $('div.volume').after('<input type="button" value="Count DMs" onclick=\'$.get("/json.php?fast=1", (data)=>{ alert(35-data["talks"].length) });\' style="margin: 8px; background: transparent; border: 2px solid white; box-sizing: border-box; float: right;">');
    $(window).focus(() => $('textarea.form-control').focus());

    /// Modules
    export let modules: Module[] = [
    ];

    // Load data once if available, otherwise this will take care of initialization
    let ls = JSON.parse(window.localStorage.getItem(storageKey)!);
    if (!(ls?.modulesData)) ls = { modulesData: {} };
    for (let module of modules)
        if (ls.modulesData[module.name])
            Object.assign(module.data, ls.modulesData[module.name]);
        else ls.modulesData[module.name] = module.data;

    // Proxy module data to detect changes
    for (let module of modules)
        module.data = new Proxy(module.data, {
            set(target, property, value) {
                target[property] = value;
                save();
                return true;
            }
        });

    /** Saves settings and module data to local storage. */
    function save() {
        let modulesData: any = {};
        for (let module of modules)
            modulesData[module.name] = module.data;
        localStorage.setItem(storageKey, JSON.stringify({ modulesData }));
    }
    save();
}

