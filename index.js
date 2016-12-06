// list of sutras and word forms as a component for panini-plugin

'use strict';

var classes = require('component/classes');
var salita = require('mbykov/salita');
var events = require('component/events');
var draggable = require('./draggable');
let sutra = require('./data/sutradetailsformorpheus.json');

module.exports = popup();

function popup() {
    if (!(this instanceof popup)) return new popup();
}

popup.prototype.show = function(res) {
    closeAll();
    let oPopup = createPopup();
    q('body').appendChild(oPopup);

    if (!res.target) {
        placePopup(oPopup);
    }

    // drawEditor(res.query);
    drawPaniniRules(res.data);

    let exter = q('#morph-exter');
    let drag = new draggable(oPopup);
    let exterev = events(exter, {
        onmousedown: function(ev) {
            drag._disabled = true;
        },
        onmouseup: function(ev) {
            drag._disabled = false;
        }
    });
    exterev.bind('mousedown', 'onmousedown');
    exterev.bind('mouseup', 'onmouseup');

    var x = q('#morph-x');
    var xev = events(x, {
        closePopup: function(e) {
            closeAll();
        }
    });
    xev.bind('click', 'closePopup');
}


function createPopup() {
    let pop = cre('div');
    pop.id = 'morph-popup';
    classes(pop).add('morph-popup');
    let head = createHeader();
    pop.appendChild(head);

    let oExter = cre('div');
    oExter.id = 'morph-exter';
    classes(oExter).add('morph-inner');
    pop.appendChild(oExter);
    let oInner = cre('div');
    oInner.id = 'morph-inner';
    classes(oInner).add('morph-inner');
    oExter.appendChild(oInner);
    let oPdch = cre('div');
    oPdch.id = 'morph-pdch';
    classes(oPdch).add('morph-pdch');
    oInner.appendChild(oPdch);
    let oRules = cre('ul');
    oRules.id = 'morph-rules';
    classes(oRules).add('morph-rules');
    oInner.appendChild(oRules);
    return pop;
}

function createHeader() {
    var head = cre('div');
    head.id = 'morph-header';
    classes(head).add('morph-header');

    var oVersion = cre('div');
    oVersion.id = 'version';
    classes(oVersion).add('version');
    let oX = cre('div');
    oX.id = 'morph-x';
    oX.textContent = '[x]';
    classes(oX).add('morph-x');
    oVersion.appendChild(oX);

    var oVersionText = cre('div');
    oVersionText.textContent = 'पाणिनि  -  v.0.1';
    classes(oVersionText).add('vtext');
    oVersion.appendChild(oVersionText);

    head.appendChild(oVersion);

    var oEd = cre('div');
    oEd.id = 'morph-editor';
    classes(oEd).add('morph-editor');
    oEd.setAttribute('type', 'text');
    head.appendChild(oEd);
    return head;
}

function placePopup(popup) {
    let coords = getCoords();
    coords.top = coords.top + 100;
    coords.left = coords.left + 100;
    let top = [coords.top, 'px'].join('');
    let left = [coords.left, 'px'].join('');
    popup.style.top = top;
    popup.style.left = left;
}

function getCoords() {
    let selection = window.getSelection();
    let oRange = selection.getRangeAt(0); //get the text range
    let oRect = oRange.getBoundingClientRect();
    let bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    return {top: oRect.top + bodyScrollTop, left: oRect.left};
}

function closeAll() {
    let popups = qs('.morph-popup');
    let arr = [].slice.call(popups);
    arr.forEach(function(popup) {
        popup.parentElement.removeChild(popup);
        popup = null;
    });

    let oTip = q('#morph-tip');
    if (oTip) oTip.parentElement.removeChild(oTip);

    // window.getSelection().removeAllRanges();
    // FIXME: нельзя - после закрытия мне нужен getCoords
}

function drawPaniniRules(data) {
    let oRules = q('#morph-rules');
    let rules = data.d;
    rules.forEach(function(r) {
        let oLi = cre('li');
        // let nagaris = r.i.map(function(iform) {
        //     let parts = iform.split('+');
        //     return parts.map(function(part) { return salita.slp2sa(part); }).join(' + ');
        // });
        // let iforms = nagaris.join(', ');
        let iforms = r.i.join(', ');

        let oForm = cspan(iforms, 'sutra-form');
        oLi.appendChild(oForm);

        let stexts = sutra[r.r];
        let stext = stexts;
        let stail;
        if (stexts.length > 33) {
            stext = stexts.substr(0,30);
            stail = stexts.substr(30);
            stext = [stext, '...'].join('');
        }

        let oNum = cspan(r.r, 'sutra-num');
        let oDef = cspan(' - ');
        let oSutra = cspan(stext, 'sutra-text');
        oLi.appendChild(oNum);
        oLi.appendChild(oDef);
        oLi.appendChild(oSutra);

        if (stail) {
            let oTail = cspan(stail, 'sutra-tail');
            oLi.appendChild(oTail);
        }

        oRules.appendChild(oLi);
    });
    let rulev = events(oRules, {
        showSutra: function(e) {
            let oNum = e.target.parentElement.querySelector('.sutra-num');
            let num = oNum.textContent;
            let sutrani = 'http://sanskritdocuments.org/learning_tools/sarvanisutrani/';
            let url = [sutrani, num, '.htm'].join('');
            window.open(url,'_blank');
        },
        showLongString: function(e) {
            if (!e.shiftKey || !e.target.nextSibling) return;
            showLong(e);
        },
        closeLongString: function(e) {
            closeLong();
        }
    });
    rulev.bind('click span.sutra-text', 'showSutra');
    rulev.bind('mouseover span.sutra-text', 'showLongString');
    rulev.bind('mouseout span.sutra-text', 'closeLongString');
}

function showLong(e) {
    let oTip = q('#morph-tip');
    if (!oTip) {
        oTip = cre('div');
        oTip.id = 'morph-tip';
        classes(oTip).add('morph-long');
        q('body').appendChild(oTip);
    }
    let clean = e.target.textContent.replace('...', '');
    let stext = [clean, e.target.nextSibling.textContent].join('');
    oTip.textContent = stext;
    let rect = e.target.getBoundingClientRect();
    let bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    let top = [rect.top + bodyScrollTop - 50, 'px'].join('');
    let left = [rect.left, 'px'].join('');
    oTip.style.top = top;
    oTip.style.left = left;
}

function closeLong() {
    var oTip = q('#morph-tip');
    if (oTip) oTip.parentElement.removeChild(oTip);
}

var oTip = q('#tip');

function drawEditor(query) {
    let oEd = q('#morph-editor');
    oEd.contentEditable = true;
    oEd.textContent = query;
}

function cre(tag) {
    return document.createElement(tag);
}

function cspan(str, css) {
    let oSpan = document.createElement('span');
    oSpan.textContent = str;
    if (css) classes(oSpan).add(css);
    return oSpan;
}

function cret(str) {
    return document.createTextNode(str);
}

function q(sel) {
    return document.querySelector(sel);
}

function qs(sel) {
    return document.querySelectorAll(sel);
}

function inc(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

function log() { console.log.apply(console, arguments); }
