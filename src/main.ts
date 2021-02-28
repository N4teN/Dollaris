// ==UserScript==
// @name         Dollaris
// @version      0.1
// @description  A modular event-driven userscript to improve the drrr.com experience.
// @match        https://drrr.com/room/?id=*
// ==/UserScript==

namespace Dollaris {
    declare var $: any;

    /// Non-Systematic Tweaks
    $('div.volume').after('<input type="button" value="Count DMs" onclick=\'$.get("/json.php?fast=1", (data)=>{ alert(35-data["talks"].length) });\' style="margin: 8px; background: transparent; border: 2px solid white; box-sizing: border-box; float: right;">');
    $(window).focus(() => $('textarea.form-control').focus());

    /// Constants
    const storageKey = "Dollaris";

    /// System globals
    let events = {
        userJoined: [] as UserEvent[],
        userLeft: [] as UserEvent[],
        rolled: [] as RolledEvent[],
        messageReceived: [] as MessageReceivedEvent[],
        messageReceivedAny: [] as MessageReceivedEvent[],
    }
    
    // Hacky proxy to get module data easily
    export let data = new Proxy({}, {
        get (target, property, receiver) {
            return modules.find(x => x.name == property)?.data;
        }
    }) as { [key: string]: any };

    /// Intercepts
    let xhrSend = window.XMLHttpRequest.prototype.send;
    let xhrOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.send = function(body) {
        xhrSend.call(this, body);
    };
    window.XMLHttpRequest.prototype.open = function(method, url, isAsync?: boolean, user?: string, password?: string) {
        if (url.includes("update"))
            this.addEventListener('load', function() {
                let response = JSON.parse(this.responseText);
                if (response?.talks)
                    for (let talk of response.talks)
                        processMessage(talk);
            });
        xhrOpen.call(this, method, url, isAsync!, user, password);
    };

    /// Modules
    export let modules: Module[] = [
        {
            name: "ping",
            data: {
                pongMessage: "Pong!"
            },
            events: {
                messageReceived(e) {
                    if (e.message.message.startsWith("!ping"))
                        sendMessage(data.ping.pongMessage);
                    if (e.message.message.startsWith("!setpong"))
                        data.ping.pongMessage = e.message.message.substr(e.message.message.indexOf(" ") + 1);
                }
            }
        }
    ];

    /// Module Setup
    // Load data once if available, otherwise this will take care of initialization
    let ls = JSON.parse(window.localStorage.getItem(storageKey)!);
    if (!(ls?.modulesData)) ls = { modulesData: {} };
    for (let module of modules)
        if (ls.modulesData[module.name])
            Object.assign(module.data, ls.modulesData[module.name]);
        else ls.modulesData[module.name] = module.data;

    // Proxy module data to detect changes, and specifically watch for enabledness
    for (let module of modules)
        module.data = new Proxy(module.data, {
            set(target, property, value) {
                if (target[property] !== value) {
                    target[property] = value;
                    save();

                    if (property === "enabled")
                        if (value) enableModule(module);
                        else disableModule(module);
                }
                return true;
            }
        });
    
    // Enable Modules
    for (let module of modules)
        if(module.data?.enabled)
            enableModule(module);
    
    /// System Methods
    /** Saves settings and module data to local storage. */
    export function save() {
        let modulesData: any = {};
        for (let module of modules)
            modulesData[module.name] = module.data;
        localStorage.setItem(storageKey, JSON.stringify({ modulesData }));
    }
    save();

    function processMessage(message: Message) {
        fire<MessageReceivedEventArgs>("messageReceivedAny", {message});
        switch (message.type) {
            case "message":
            case "me": fire<MessageReceivedEventArgs>("messageReceived", {message}); break;
            case "join": fire<UserEventArgs>("userJoined", {id: message.id, time: message.time, user: message.user as User}); break;
            case "leave": fire<UserEventArgs>("userLeft", {id: message.id, time: message.time, user: message.user as User}); break;
            case "roll": fire<RolledEventArgs>("rolled", {id: message.id, time: message.time, from: message.from as User, to: message.to as User}); break;
        }
    }

    export function enableModule(module: Module) {
        for (let handler in module.events)
            (events as any)[handler].push((module.events as any)[handler]);
    }

    export function disableModule(module: Module) {
        for (let handler in module.events)
            (events as any)[handler] = (events as any)[handler].filter((x: any) => x !== (module.events as any)[handler])
    }

    function fire<EventArgs>(event: string, args: EventArgs) {
        for (let handler of (events as any)[event])
            handler(args);
    };

    /// Outwards interaction
    export function sendMessage(message: string, to?: string, url?: string) { $.post("", { message, to, url }); }
    export function kick(user: string) { $.post("", { kick: user }); }
    export function ban(user: string) { $.post("", { ban_user: user }); }
    export function reportAndBan(user: string) { $.post("", { report_and_ban_user: user }); }
}

