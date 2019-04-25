/* eslint no-undef: "error" */
/* eslint-env browser */

'use strict';

// var Sortable = require('sortablejs');
var Mustache = require('mustache');

var log = console.log; // eslint-disable-line no-console

var dom = [];
window.dom = dom;

// start overlay

dom.overlay = document.getElementById('overlay');

dom.overlay.list = (function () {
  // get list of all overlays
  let arr = [];
  for (let node of document.getElementById('overlay').children) {
    for (let atr of node.attributes) {
      if (atr.value.startsWith('o-')) {
        arr.push(atr.value);
      }
    }
  }
  return arr;
})();

dom.overlay.openOverlay = function (name) {
  // open overlay using class name starting with o-
  for (let key of dom.overlay.list) {
    if (key === name) {
      let elm = dom.overlay.querySelector(`.` + name);
      if (elm) {
        dom.overlay.classList.add('show');
        elm.classList.add('show');
        return elm;
      }
    }
  }
};

dom.overlay.closeOverlay = function () {
  if (event) {
    event.stopPropagation();
  } else {
    return false;
  }
  dom.overlay.classList.remove('show');
  for (var e of dom.overlay.children) {
    e.classList.remove('show');
  }
  return true;
};

for (var e of dom.overlay.children) {
  e.addEventListener('click', event => {
    event.stopPropagation();
  });
}

dom.overlay.addEventListener('click', event => {
  dom.overlay.closeOverlay();
});

// end overlay

function Kanban (data) {
  this.init(data);
  this.title = null;
  this.board = null;
  this.cards = {};
  this.columns = {};
}

Kanban.prototype.init = function (data) {
  // .boardnode select dom container, .title set title
  log(arguments, data);
  data = typeof data === 'object' ? data : {};
  log(data);
  this.title = data.title || 'Kanban board';
  this.color = data.color || '#eee';
  this.board = data.boardnode || document.children[0].children[1]; // container
  let node = this.generateTemplate('board-template', this);
  document.children[0].children[1].appendChild(node);
  return node;
};

Kanban.prototype.newcard = function (data) {
  let id = this.newid();
  let arr = (this.cards[id] = {
    id: id,
    title: this.getdata('.o-add-card', 'title') || 'title',
    color: this.getdata('.o-add-card', 'color'),
    content: this.getdata('.o-add-card', 'content') || 'meh',
    column: (data.column || this.columns[Object.keys(this.columns)[0]]).node,
    node: null
  });
  arr.node = this.generateTemplate('card-template', arr);
  let e = arr.column.children[1].appendChild(arr.node);

  // remove card
  e.querySelector('.btn-del').addEventListener('click', event => {
    let node = event.target.closest('[card-id]');
    delete this.cards[node.attributes['card-id'].value];
    node.remove();
  });

  // edit card
  e.querySelector('.btn-edit').addEventListener('click', event => {
    let card = event.target.closest('[card-id]');
    let overlay = dom.overlay.openOverlay('o-edit-card');
    this.setdata(overlay, 'title', card.querySelector('.card-title').textContent);
    this.setdata(overlay, 'content', card.querySelector('.card-text').textContent);
    this.setdata(
      overlay,
      'color',
      this.dectohex(
        window.getComputedStyle(card.querySelector('.card-nav'))['background-color']
      )
    );
  });
};

Kanban.prototype.newcolumn = function () {
  // if(dom.overlay.closeOverlay()||1){ //if add was caused by menu
  let id = this.newid();
  let arr = (this.columns[id] = {
    id: id,
    title: this.getdata('.o-add-column', 'title') || 'null',
    color: this.getdata('.o-add-column', 'color') || '#000',
    node: null
  });
  arr.node = this.generateTemplate('column-template', arr);
  let e = this.board.querySelector(`.columns-container`).appendChild(arr.node);
  // add card
  e.querySelector('.btn-add').addEventListener('click', event => {
    let overlay = dom.overlay.openOverlay('o-add-card');
    log(overlay);
  });

  return e;
};

Kanban.prototype.newid = function () {
  var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
  var str = '';
  for (var i = 0; i < 10; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
};

Kanban.prototype.getdata = function (node, data) {
  // node target, data-name
  if (typeof node === 'string') {
    return dom.overlay.querySelector(`${node} [data=${data}]`).value || null;
  } else {
    return node.querySelector(`[data=${data}]`).value || null;
  }
};

Kanban.prototype.setdata = function (node, name, data) {
  // node target, data-name, data value
  return (node.querySelector(`[data=${name}]`).value = data);
};

Kanban.prototype.dectohex = function (rgb) {
  // rgb(0,0,0) -> #000
  if (rgb.search('rgb') === -1) return rgb;
  rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
  const hex = x => ('0' + parseInt(x).toString(16)).slice(-2);
  return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};

Kanban.prototype.generateTemplate = function (name, data) {
  // template id , data, node target
  var template = document.getElementById(name).innerHTML;
  Mustache.parse(template);
  return new DOMParser().parseFromString(Mustache.render(template, data), 'text/html')
    .body.childNodes[0];
};

window.k = Kanban;
window.kanban = new Kanban({ title: 'board name' });
e = window.kanban.newcolumn();
window.kanban.newcard({ e });

var boards = [];
window.boards = boards;
document.getElementById('app_newkanban').addEventListener('click', event => {
  let kanban = new Kanban({ title: prompt('board name') });
  boards.push(kanban);
});
boards.push(window.kanban);
/*

window.kanban.newcard({e})
window.kanban.newcard({e})

Sortable.create(c_1, {
  group: 'foo',
  animation: 100
});

Sortable.create(c_2, {
  group: {
    name: 'bar',
    pull: true
  },
  animation: 100
});

Sortable.create(c_3, {
  group: {
    name: 'qux',
    put: ['foo', 'bar']
  },
  animation: 100
});

var card = {
  id: '2kd8s958ka',
  description: 'Create Kanban app',
  color: 'green',
  //element: <Node element>
};

*/
