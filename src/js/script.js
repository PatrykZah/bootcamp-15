/* eslint-env browser */
'use strict';
// var Sortable = require('sortablejs');
var Mustache = require('mustache');

var log = console.log // eslint-disable-line

class Kanban {
  constructor (data) {
    if (typeof (data) !== 'object') {
      this.oPrompt('o-board-template', { title: 'Kanban board' }, this.newboard.bind(this));
    } else {
      this.newboard(data);
    }
  }

  newboard (data) {
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

    this.board.querySelector('.btn-create-column').addEventListener('click', () => { // add column
      this.oPrompt('o-column-template', {}, this.newcolumn.bind(this));
    });

    this.board.querySelector('.btn-edit2').addEventListener('click', () => { // edit board
      this.oPrompt('o-board-template', this.data, this.data);
    });

    this.board.querySelector('.btn-del').addEventListener('click', () => { // remove board
      this.board.remove();
      // todo remove from prototype.board
    });

    this.PropertyDescriptorsMerge(this.data,
      { this: this },
      this.reference(this.board, { id: '.id' }),
      this.reference(this.board.querySelector('.title'), { title: '.textContent' }),
      this.reference(this.board.querySelector('.board-nav'), { rgb: '.style["background-color"]' }),
      { get color () { return this.this.rgbTohex(this.rgb); },
        set color (value) { this.rgb = this.this.rgbTohex(value); } }
    );
  }

  newcolumn (data) {
    data = typeof (data) === 'object' ? data : {};
    data = {
      id: data.id || this.newid(),
      title: data.title || 'Column',
      color: data.color || '#666',
      node: null
    };

    let elm = this.generateTemplate({ name: 'column-template', tmpl_data: data });
    this.board.querySelector(`.columns-container`).appendChild(elm);

    // this.columns[data.id] = data
    this.columns[data.id] = {
      node: elm,
      data: {}
    };

    this.PropertyDescriptorsMerge(this.columns[data.id].data,
      { this: this },
      this.reference(elm, { id: '.id' }),
      this.reference(elm.querySelector('.column-title'), { title: '.textContent' }),
      this.reference(elm.querySelector('.column-nav'), { rgb: '.style["background-color"]' }),
      { get color () { return this.this.rgbTohex(this.rgb); },
        set color (value) { this.rgb = this.this.rgbTohex(value); } }
    );

    // event add card
    elm.querySelector('.btn-add').addEventListener('click', () => {
      this.oPrompt('o-card-template', { column: elm }, this.newcard.bind(this));
    });

    // event edit column
    elm.querySelector('.btn-edit2').addEventListener('click', () => {
      this.oPrompt('o-column-template', this.columns[data.id].data, this.columns[data.id].data);
    });

    // event remove column
    elm.querySelector('.btn-del').addEventListener('click', () => {
      // log(elm,this,data)
      delete this.columns[data.id];
      elm.remove();
    });

    return elm;
  }

  newcard (data) {
    let column = data.column;
    data = typeof (data) === 'object' ? data : {};
    data = {
      id: data.id || this.newid(),
      title: data.title || 'Card',
      color: data.color || '#555',
      content: data.content || 'content',
      node: null
    };

    let elm = data.node = this.generateTemplate({ name: 'card-template', tmpl_data: data });
    column.querySelector(`.cards-list`).appendChild(data.node);

    this.cards[data.id] = {
      node: elm,
      data: {}
    };
    // this.cards[data.id] = data

    this.PropertyDescriptorsMerge(this.cards[data.id].data,
      { this: this },
      this.reference(elm, { id: '.id' }),
      this.reference(elm.querySelector('.card-nav'), { rgb: '.style["background-color"]' }),
      this.reference(elm.querySelector('.card-title'), { title: '.textContent' }),
      this.reference(elm.querySelector('.card-text'), { content: '.textContent' }),
      { get color () { return this.this.rgbTohex(this.rgb); },
        set color (value) { this.rgb = this.this.rgbTohex(value); } }
    );

    // event edit card
    elm.querySelector('.btn-edit').addEventListener('click', () => {
			console.log(this,this.cards[data.id].data) // eslint-disable-line
      this.oPrompt('o-card-template', this.cards[data.id].data, this.cards[data.id].data);
    });

    // event remove card
    elm.querySelector('.btn-del').addEventListener('click', () => {
      delete this.cards[data.id];
      elm.remove();
    });
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
    let Obj = {};
    let proto = Object.getPrototypeOf(this);
    if (!proto.referenceCounter) { proto.referenceCounter = 0; }
    let NODE_ID = '_node' + proto.referenceCounter++;

    if (typeof parent === 'string') {
      parent = document.querySelector(parent);
    }

    if (!parent) {
      console.log('this:', this, 'parent', parent, 'arguments', arguments);
      throw new Error(`Kanban.reference expect (parent object ,{*id name*:*selector from parent*},...)`);
    }

    Obj[NODE_ID] = parent;
    for (let id in data) {
      Object.defineProperty(Obj, id, {
        /* eslint-disable */
        get: new Function(`return this.${NODE_ID}${data[id]}`),
        set: new Function('value', `this.${NODE_ID}${data[id]} = value`)
				/* eslint-enable */
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

  rgbTohex (rgb) { // rgb(0,0,0) -> #000
    if (rgb.search('rgb') === -1) return rgb;
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    const hex = (x) => ('0' + parseInt(x).toString(16)).slice(-2);
    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }

  generateTemplate (data) { // template id , data, node target
    if (!(typeof (data) === 'object' && data.name && data.tmpl_data)) {
			console.log(data);// eslint-disable-line
      throw new Error('Kanban.generateTemplate expect data.name:Template #id,data.tmpl_data:{...}');
    }
    let template = document.getElementById(data.name).innerHTML;
    Mustache.parse(template);
    return new DOMParser().parseFromString(Mustache.render(template, data.tmpl_data), 'text/html').body.childNodes[0];
  }

  oPrompt (tmpl, presetdata, callback) { // tmpl,presetdata{},callback
    let overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.appendChild(this.generateTemplate({ name: tmpl, tmpl_data: presetdata }));
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
      overlay.remove();
    });

    overlay.children[0].addEventListener('click', () => {
      event.stopPropagation();
    });

    overlay.querySelector('button').addEventListener('click', () => {
      let items = overlay.querySelectorAll('input,textarea');
      let obj = presetdata;
      for (let node of items) {
        obj[node.attributes.data.value] = node.value;
      }
      if (typeof callback === 'function') {
        callback(obj);// .bind(this)
      } else if (typeof callback === 'object') {
        // let color = obj.color
        // delete obj.color//
        log(obj);
        Object.assign(callback, obj);
      }
      overlay.remove();
      return obj;
    });
  }
}
window.Kanban = Kanban;

let board;
window.board = board;

document.getElementById('app_newkanban').addEventListener('click', (event) => {
  ;
  board = new Kanban();
});

// create new kanban
board = new Kanban({ title: 'preset board created from js', color: '#696' });
board.newcolumn({ title: 'js column' });
board.newcard({ title: 'js card', content: 'you can edit me or... delete me', column: board.columns[Object.keys(board.columns)[0]].node }); // a bit ugly way but whatever
