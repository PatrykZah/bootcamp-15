/* eslint-env browser */

'use strict';
// var Sortable = require('sortablejs');
var Mustache = require('mustache');

var log = console.log //eslint-disable-line

class Kanban {
  constructor (data) {
    // this.board;
    this.data = {};
    this.cards = {};
    this.columns = {};
    let proto = Object.getPrototypeOf(this);
    if (!proto.boards) { proto.boards = []; }
    proto.boards.push(this);// store all boards for later use, like saving

    data = typeof (data) === 'object' ? data : {};
    data = {
      id: data.id || this.newid(),
      title: data.title || 'Kanban board',
      color: data.color || '#666'
    };

    this.board = this.generateTemplate({ name: 'board-template', tmpl_data: data });
    document.children[0].children[1].appendChild(this.board);

    this.PropertyDescriptorsMerge(this.data,
      this.reference(this.board, { id: 'id' }),
      this.reference(this.board.querySelector('.title'), { title: 'textContent' }),
      this.reference(getComputedStyle(this.board.querySelector('.board-nav')), { color: 'backgroundColor' })
    );
  }

  newid () {
    let chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
    let str = '';
    for (let i = 0; i < 10; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }

  reference (parent, data) { // parent node/string,{*data id*:*where it is*} //// bypass primitive no reference :)
    // reference(Kanban.prototype.boards[0].board,{content:'.textContent',color:'.style.backgroundColor'})

    let Obj = {};
    let proto = Object.getPrototypeOf(this);
    if (!proto.referenceCounter) { proto.referenceCounter = 0; }
    let node_id = '_node' + proto.referenceCounter++;

    if (typeof parent === 'string') {
      parent = document.querySelector(parent);
    }

    if (!parent) {
      throw new Error(`Kanban.reference expect (parent object ,{*id name*:*selector from parent*},...)`);
    }

    Obj[node_id] = parent;
    for (let id in data) {
      Object.defineProperty(Obj, id, {
        get: new Function(`return this['${node_id}']['${data[id]}']`),
        set: new Function('value', `this['${node_id}']['${data[id]}'] = value`)
      });
    }
    return Obj;
  }

  PropertyDescriptorsMerge (target, ...objects) {
    for (let obj of objects) {
      var descriptors = Object.getOwnPropertyDescriptors(obj);
      Object.defineProperties(target, descriptors);
    }
  }

  generateTemplate (data) { // template id , data, node target
    if (!(typeof (data) === 'object' && data.name && data.tmpl_data)) { log(data); throw new Error('Kanban.generateTemplate expect data.name:Template #id,data.tmpl_data:{...}'); }
    let template = document.getElementById(data.name).innerHTML;
    Mustache.parse(template);
    return new DOMParser().parseFromString(Mustache.render(template, data.tmpl_data), 'text/html').body.childNodes[0];
  }

  o_prompt (tmpl, presetdata, zero) { // tmpl,presetdata{},[boolean - force zero data]
    console.log(arguments);
    let overlay = this.generateTemplate({ name: tmpl, tmpl_data: presetdata });
    document.getElementById('overlay').appendChild(overlay);
    document.getElementById('overlay').classList.add('active');
  }
} window.Kanban = Kanban;

new Kanban();// eslint-disable-line no-new
new Kanban();// eslint-disable-line no-new
window.a = new Kanban();// eslint-disable-line no-new
// a.__proto__.o_prompt("o-board-template",{title:'prompt titlee'})
window.a.__proto__.o_prompt('o-board-template', a.data);
