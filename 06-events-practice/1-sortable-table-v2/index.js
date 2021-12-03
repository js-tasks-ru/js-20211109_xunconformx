export default class SortableTable {
  element;
  subElements = {};

  onSortClick = (e) => {
    const column = e.target.closest('[data-sortable="true"]');
    const orders = {
      asc: "asc",
      desc: "desc"
    };

    if (column) {
      const {id, order} = column.dataset;
      const newOrder = orders[order];
      const sortedData = this.sortData(id, newOrder);
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = newOrder;
      if (!arrow) {
        column.append(arrow);
      }
      this.subElements.body.innerHTML = this.getRows(sortedData);
    }
  };

  constructor(headerConfig = [],
    {
      data = [],
      sorted = {
        id: headerConfig.find(item => item.sortable).id,
        order: 'asc'
      }
    }) {
    this.headerConfig = headerConfig;
    this.data = Array.isArray(data) ? data : data.data;
    this.sorted = sorted;

    this.render();
    this.bindEvents();
  }

  render() {
    const {id, order} = this.sorted;
    const sortedData = this.sortData(id, order);
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate(sortedData);
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  bindEvents() {
    this.subElements.header.addEventListener("pointerdown", this.onSortClick);
  }

  getTemplate(data) {
    return `
      <div class="sortable-table">
        ${this.getHeader()}
        ${this.getBody(data)}
      </div>
    `;
  }

  getHeader() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map(item => this.getHeaderRow(item)).join('')}
      </div>
    `;
  }

  getBody() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getRows(this.data)}
      </div>
    `;
  }

  getHeaderRow({id, title, sortable}) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          ${isOrderExist ? `<span data-element="arrow" class="sortable-table__sort-arrow">
                              <span class="sort-arrow"></span>
                            </span>` : ''}
        </span>
      </div>
    `;
  }

  getRows(data) {
    return data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.getRow(item)}
        </a>`;
    }).join('');
  }

  getRow(item) {
    const cells = this.headerConfig.map(({id, template}) => {
      return {
        id,
        template
      };
    });

    return cells.map(({id, template}) => {
      return template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === field);
    const {sortType, customSorting} = column;
    const direction = order === 'asc' ? 1 : -1;
    const getSortTypeValue = (a, b, type) => {
      const values = {
        'number': () => direction * (a[field] - b[field]),
        'string': () => direction * a[field].localeCompare(b[field], ['ru', 'en']),
        'custom': () => direction * customSorting(a, b),
        default: () => direction * (a[field] - b[field])
      };

      return (values[type] || values.default)();
    };

    return arr.sort((a, b) => {
      return getSortTypeValue(a, b, sortType);
    });
  }

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;
    this.subElements.body.innerHTML = this.getRows(sortedData);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

