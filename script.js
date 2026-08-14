// Taima CyTube compatibility
var IGNORE_SCROLL_EVENT = true;

function stripImages(msg) {
    return msg;
}


/*!
 **|  CyTube Channel: Wooo Internal Script
 **|
 **|  All code written by Xaekai except where otherwise noted.
 **|  Copyright 2014-2016 All Rights Reserved
 **|
 **@preserve
 */
if (!this[CHANNEL.name]) {
    this[CHANNEL.name] = {}
}
if (!this[CHANNEL.name].branding) {
    this[CHANNEL.name].branding = $(".navbar-brand").html("LNS")
}
if (!this[CHANNEL.name].favicon) {
    this[CHANNEL.name].favicon = $("<link/>").prop("id", "favicon").attr("rel", "shortcut icon").attr("type", "image/png").attr("sizes", "64x64").attr("href", "LNS").appendTo("head")
}
/*!
 **|   Xaekai's Sequenced Module Loader
 **|
 **@preserve
 */

({
    options: {
        designator: {
            prefix: 'ScoopAss-',
            delay: 90 * 1000
        },
        playlist: {
            collapse: true,
            hidePlaylist: true,
            inlineBlame: false,
            moveReporting: false,
            quickQuality: false,
            recentMedia: false,
            simpleLeader: false,
            syncCheck: true,
            thumbnails: true,
            timeEstimates: true
        },
        chatext: {
            smartScroll: true,
            maxMessages: 120
        },
        userlist: {
            autoHider: true
        },
        various: {
            notepad: true,
            emoteToggle: true,
        },
        whispers: {
            joins: true,
            parts: true
        }
    },
    modules: {
        'settings': {
            active: 1,
            rank: -1,
            url: "https://resources.pink.horse/newscripts/module_settings.min.js",
            done: true
        },
        'whispers': {
            active: 0,
            rank: -1,
            url: "https://resources.pink.horse/newscripts/module_whispers.min.js",
            done: true
        },
        'userlist': {
            active: 0,
            rank: -1,
            url: "https://resources.pink.horse/newscripts/module_userlist.min.js",
            done: true
        },
        'md5hash': {
            active: 1,
            rank: -1,
            url: "https://resources.pink.horse/newscripts/module_md5.min.js",
            done: true
        },
        'designator': {
            active: 1,
            rank: -1,
            url: "https://resources.pink.horse/newscripts/module_designator.min.js",
            done: true
        },
        'playlist': {
            active: 1,
            rank: -1,
            url: "https://resources.pink.horse/newscripts/module_playlist.min.js",
            done: true
        },
        'chatext': {
            active: 1,
            rank: -1,
            url: "https://resources.pink.horse/newscripts/module_chatext.min.js",
            done: true
        },
        'layout': { 
            active: 1,
            rank: -1,
            url: "https://resources.pink.horse/newscripts/module_layout.min.js",
            done: true
        },
        'various': {
            active: 1,
            rank: -1,
            url: "https://resources.pink.horse/newscripts/module_various.min.js",
            done: true
        },
    },

    /*
     ** You generally don't need to touch anything below
     */
    initialize: function() {
        if (CLIENT.modules) {
            return
        } else {
            CLIENT.modules = this
        }

        // Backwards compat
        window[CHANNEL.name].modulesOptions = this.options;

        console.info('[XaeModule]', 'Begin Loading.');

        this.index = Object.keys(this.modules);
        this.sequencerLoader();
    },
    sequencerLoader: function() {
        // After first run we curry the previous modules postload hook (the "done")
        // This is mainly used to invoke a cleanup/settings function to 
        //   reassign variables in modules/scripts that don't use module options
        if (this.state.prev) {
            setTimeout(this.modules[this.state.prev].done, 0)
            this.state.prev = "";
        }

        if (this.state.pos >= this.index.length) {
            return console.info('[XaeModule]', 'Loading Complete.');
        }

        var currKey = this.index[this.state.pos];
        if (this.state.pos < this.index.length) {
            if (this.modules[currKey].active) {
                if (this.modules[currKey].rank <= CLIENT.rank) {
                    console.info('[XaeModule]', 'Loading:', currKey);
                    this.state.prev = currKey;
                    this.state.pos++;
                    $.getScript(this.modules[currKey].url, this.sequencerLoader.bind(this))
                } else {
                    if (this.modules[currKey].rank === 0 && CLIENT.rank === -1) {
                        (function(module) {
                            socket.once('login', (data) => {
                                if (data.success) {
                                    $.getScript(module.url);
                                }
                            })
                        })(this.modules[currKey])
                    }
                    this.state.pos++;
                    this.sequencerLoader()
                }
            } else {
                this.state.pos++;
                this.sequencerLoader()
            }
        }
    },
    state: {
        prev: '',
        pos: 0
    },
}).initialize();

$("a#showchansettings").text("Moderator");
$(".server-msg-reconnect").text("LateNiteScoop");
$(".server-msg-disconnect").text("Your Connection Is Shit!");
$("#showsearch").text("Search");
$("#showmediaurl").text("Add");
$("#clearplaylist").text("Clear");
$("#mediarefresh").text("Refresh");
$("#unimojiDropLabel").text("");

function formatUserlistItem(a) {
    var e = {
            name: a.data("name") || "",
            rank: a.data("rank"),
            profile: a.data("profile") || {
                image: "",
                text: ""
            },
            leader: a.data("leader") || !1,
            icon: a.data("icon") || !1,
            afk: a.data("afk") || !1
        },
        s = $(a.children()[1]);
    s.removeClass(), s.css("font-style", ""), s.addClass(getNameColor(e.rank));
    var t = e.name.replace(/[^\w-]/g, "\\$");
    s.addClass("userlist-" + t), a.find(".profile-box").remove(), e.afk ? a.addClass("userlist_afk") : a.removeClass("userlist_afk"), a.data("meta") && a.data("meta").muted ? a.addClass("userlist_muted") : a.removeClass("userlist_muted"), a.data("meta") && a.data("meta").smuted ? a.addClass("userlist_smuted") : a.removeClass("userlist_smuted");
    var o = null;
    s.mouseenter(function(s) {
        o && o.remove();
        var t = s.clientY + 5,
            d = s.clientX;
        o = $("<div/>").addClass("profile-box linewrap").css("top", t + "px").appendTo(a), e.profile.image && $("<img/>").addClass("profile-image").attr("src", e.profile.image).appendTo(o), $("<strong/>").text(e.name).appendTo(o);
        var l = a.data("meta") || {};
        l.ip && ($("<br/>").appendTo(o), $("<em/>").text(l.ip).appendTo(o)), l.aliases && ($("<br/>").appendTo(o), $("<em/>").text("aliases: " + l.aliases.join(", ")).appendTo(o)), $("<hr/>").css("margin-top", "5px").css("margin-bottom", "5px").appendTo(o), $("<p/>").text(e.profile.text).appendTo(o), $("body").hasClass("synchtube") && (d -= o.outerWidth()), o.css("left", d + "px")
    }), s.mousemove(function(a) {
        var e = a.clientY + 5,
            s = a.clientX;
        $("body").hasClass("synchtube") && (s -= o.outerWidth()), o.css("left", s + "px").css("top", e + "px")
    }), s.mouseleave(function() {
        o.remove()
    });
    var d = a.children()[0];
    d.innerHTML = "", e.leader && $("<span/>").addClass("glyphicon glyphicon-star-empty").appendTo(d), e.afk && (s.css("font-style", "italic"), $("<span/>").addClass("glyphicon glyphicon-time").appendTo(d)), e.icon && $("<span/>").addClass("glyphicon " + e.icon).prependTo(d)
}


(function() {
    if (document.getElementById('room-ticker-wrap')) return;

    const mainContainer = document.getElementById('mainpage');
    if (mainContainer) {
        const tickerWrap = document.createElement('div');
        tickerWrap.id = 'room-ticker-wrap';
        
        // Change the text inside the <span> tags to whatever you want to broadcast
        tickerWrap.innerHTML = `
            <div class="ticker-title"><img src="https://i.ibb.co/KxVMmyfQ/Untitled-July-22-2026-at-22-51-32-1-1.png" style="max-height: 35px; width: auto; vertical-align: middle;"></div>
            <div class="ticker-content">
                <div class="ticker-text">
                    <span>🍦 WELCOME TO LATE NITE SCOOP • GRAB A DAB AND ENJOY THE TUBE 🍦</span>
                    <span>⚠️ RESPECT THE CHAT BUT MOST IMPORTANTLY RESPECT EACH OTHER ⚠️</span>
                    <span>⚠️ BETTER EXPERIENCE? Go to OPTIONS & make THEME: Modern & LAYOUT: Fluid - then REFRESH ⚠️</span>
                    <span>🎬 TONIGHT: Collision 🎬</span>
                    <span>❗ FREE SAL❗</span>
                </div>
            </div>
        `;
        
        // Insert it right at the top of the main container
        mainContainer.insertBefore(tickerWrap, mainContainer.firstChild);
    }
})();
(function() {
    // Prevent duplicate buttons if the script reloads
    if (document.getElementById('toggle-playlist-btn')) return;

    const controlRow = document.getElementById('videocontrols');
    if (controlRow) {
        const playlistBtn = document.createElement('button');
        playlistBtn.id = 'toggle-playlist-btn';
        playlistBtn.className = 'btn btn-sm btn-default';
        playlistBtn.innerHTML = '<span class="glyphicon glyphicon-list"></span> Hide Playlist';
        playlistBtn.style.marginLeft = '5px';
        
        playlistBtn.addEventListener('click', function() {
            // Target CyTube's main playlist row container
            const playlistRow = document.getElementById('playlistrow');
            if (playlistRow) {
                playlistRow.classList.toggle('playlist-collapsed');
                
                // Update button text and style based on state
                if (playlistRow.classList.contains('playlist-collapsed')) {
                    playlistBtn.innerHTML = '<span class="glyphicon glyphicon-th-list"></span> Show Playlist';
                    playlistBtn.classList.remove('btn-default');
                    playlistBtn.classList.add('btn-info');
                } else {
                    playlistBtn.innerHTML = '<span class="glyphicon glyphicon-list"></span> Hide Playlist';
                    playlistBtn.classList.remove('btn-info');
                    playlistBtn.classList.add('btn-default');
                }
            }
        });
        
        controlRow.appendChild(playlistBtn);
    }
})();

(function() {
    // Prevent duplicate buttons if the script reloads
    if (document.getElementById('toggle-ambient-btn')) return;

    const controlRow = document.getElementById('videocontrols');
    if (controlRow) {
        const ambientBtn = document.createElement('button');
        ambientBtn.id = 'toggle-ambient-btn';
        ambientBtn.className = 'btn btn-sm btn-default';
        // Uses a built-in Bootstrap lamp icon
        ambientBtn.innerHTML = '<span class="glyphicon glyphicon-lamp"></span> Glow ON';
        ambientBtn.style.marginLeft = '5px';
        
        ambientBtn.addEventListener('click', function() {
            const videoWrap = document.getElementById('videowrap');
            if (videoWrap) {
                // Toggles the custom hidden class on the player container
                videoWrap.classList.toggle('ambient-hidden');
                
                // Dynamically update the button look and text
                if (videoWrap.classList.contains('ambient-hidden')) {
                    ambientBtn.innerHTML = '<span class="glyphicon glyphicon-flash"></span> Glow OFF';
                    ambientBtn.classList.remove('btn-default');
                    ambientBtn.classList.add('btn-warning'); // Changes to an alert orange/yellow style
                } else {
                    ambientBtn.innerHTML = '<span class="glyphicon glyphicon-lamp"></span> Glow ON';
                    ambientBtn.classList.remove('btn-warning');
                    ambientBtn.classList.add('btn-default');
                }
            }
        });
        
        controlRow.appendChild(ambientBtn);
    }
})();


(function () {
    // 1. Setup Fullscreen FX Overlay Container
    const fxCanvas = document.createElement("div");
    fxCanvas.id = "custom-fx-overlay";
    Object.assign(fxCanvas.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: "99999",
        overflow: "hidden"
    });
    document.body.appendChild(fxCanvas);

    // 2. Function to generate floating screen bursts
    function triggerHypeEffect(text, color1, color2) {
        for (let i = 0; i < 12; i++) {
            const element = document.createElement("div");
            element.innerText = text;
            Object.assign(element.style, {
                position: "absolute",
                left: Math.random() * 80 + 10 + "%",
                top: Math.random() * 60 + 20 + "%",
                color: i % 2 === 0 ? color1 : color2,
                fontSize: Math.floor(Math.random() * 24) + 24 + "px",
                fontFamily: "'Impact', sans-serif",
                textShadow: `0 0 8px ${i % 2 === 0 ? color2 : color1}`,
                opacity: "1",
                transition: "all 1.5s ease-out",
                transform: "scale(0.5) translateY(0px)"
            });
            
            fxCanvas.appendChild(element);

            // Animate out
            setTimeout(() => {
                element.style.transform = `scale(1.3) translateY(-100px) rotate(${Math.random() * 30 - 15}deg)`;
                element.style.opacity = "0";
            }, 50);

            // Cleanup
            setTimeout(() => { element.remove(); }, 1600);
        }
    }

    // 3. Hook into incoming live CyTube Chat Data
    if (window.socket) {
        window.socket.on("chatMsg", function(data) {
            const msgText = data.msg.toLowerCase().trim();
            
            if (msgText.includes("!scoop")) {
                triggerHypeEffect("🥄 SCOOP 🥄", "#FFDF00", "#4B0082");
            } else if (msgText.includes("!freesal")) {
                triggerHypeEffect("🚔 FREE SAL 🚔", "#4B0082", "#FFDF00");
            }
        });
    }
})();

(function initDraggablePad() {
    if (document.getElementById('scoop-scratchpad-wrap')) return;

    // 1. Build the UI
    const padWrap = document.createElement('div');
    padWrap.id = 'scoop-scratchpad-wrap';
    padWrap.className = 'hidden';
    padWrap.innerHTML = `
        <div id="scratchpad-header">📝The Scoop Sheet</div>
        <textarea id="scratchpad-text" placeholder="Jot down notes..."></textarea>
    `;
    document.body.appendChild(padWrap);

    // 2. Drag Logic
    let isDragging = false;
    let offsetX, offsetY;
    const header = document.getElementById('scratchpad-header');
    
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - padWrap.offsetLeft;
        offsetY = e.clientY - padWrap.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            padWrap.style.left = (e.clientX - offsetX) + 'px';
            padWrap.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', () => { isDragging = false; });

    // 3. Storage
    const textArea = document.getElementById('scratchpad-text');
    textArea.value = localStorage.getItem('scoopScratchPad') || "";
    textArea.addEventListener('input', () => localStorage.setItem('scoopScratchPad', textArea.value));

    // 4. Hunter Script to place Button
    const btnHtml = `<button id="target-pad-btn" class="btn btn-sm btn-default" style="margin-left: 5px;">📝 Scratch Pad</button>`;
    
    $('body').on('click', '#target-pad-btn', function() {
        $('#scoop-scratchpad-wrap').toggleClass('hidden');
        if (!$('#scoop-scratchpad-wrap').hasClass('hidden')) {
            $(this).removeClass('btn-default').addClass('btn-info');
            textArea.focus();
        } else {
            $(this).removeClass('btn-info').addClass('btn-default');
        }
    });

    setInterval(() => {
        const emoteBtn = $("button:contains('Emote List')");
        if (emoteBtn.length > 0 && $('#target-pad-btn').length === 0) {
            emoteBtn.after(btnHtml);
        }
    }, 1000);
})();

(function() {
    // Watch for when any modal window opens
    $(document).on('shown.bs.modal', function (e) {
        // Find the modal and add a custom class to force our theme
        $(e.target).addClass('scoop-theme-modal');
    });
})();

// PM Audio Notification Script
socket.on("pm", function(data) {
    // Check if the message is being sent TO you (and not sent BY you)
    if (data.to === CLIENT.name) {
        // You can swap this URL with any direct .mp3 or .wav link you prefer
        let notifySound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
        notifySound.volume = 0.6; // Adjust volume from 0.0 to 1.0
        
        notifySound.play().catch(function(error) {
            console.log("Browser blocked the audio autoplay:", error);
        });
    }

