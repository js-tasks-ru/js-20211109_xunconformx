import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link = '',
    url = '',
    range = {
      from: new Date(),
      to: new Date(),
    },
    formatHeading = data => data
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = formatHeading(value);
    this.formatHeading = formatHeading;
    this.link = link;
    this.url = new URL(url, BACKEND_URL);
    this.range = range;
    this.element = null;
    this.subElements = {};

    this.render();    
    this.update(this.range.from, this.range.to);
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getChildrenElements(this.element);
  }

  getTemplate() {
    return `
    <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        ${this.link ? '<a class="column-chart__link" href=' + this.link + '>View all</a>' : ''}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
        </div>
        <div data-element="body" class="column-chart__chart">
        </div>
      </div>
    </div>
  `;
  }

  getHeaderValue(data) {
    return this.formatHeading(Object.values(data).reduce((accum, item) => (accum + item), 0));
  }

  getBodyTemplate(data) {
    const maxValue = Math.max(...Object.values(data));

    return Object.entries(data).map(([key, value]) => {
      const scale = this.chartHeight / maxValue;
      const percent = (value / maxValue * 100).toFixed(0);
      const tooltip = `<span>
        <small>${key.toLocaleString('default', {dateStyle: 'medium'})}</small>
        <br>
        <strong>${percent}%</strong>
      </span>`;

      return `<div style="--value: ${Math.floor(value * scale)}" data-tooltip="${tooltip}"></div>`;
    }).join('');
  }

  getChildrenElements(element) {
    const result = {};
    const elems = element.querySelectorAll('[data-element]');

    for (const elem of elems) {
      const name = elem.dataset.element;

      result[name] = elem;
    }

    return result;
  }

  setNewRange(from, to) {
    this.range.from = from;
    this.range.to = to;
  }

  async loadData(from, to) {
    this.url.searchParams.set('from', from.toISOString()); // url = https://google.com + ?from=decodeURIComponent(...)
    this.url.searchParams.set('to', to.toISOString());

    return await fetchJson(this.url);
  }

  async update(from, to) {
    this.element.classList.add('column-chart_loading');

    const data = await this.loadData(from, to);

    this.setNewRange(from, to);

    if (data && Object.values(data).length) {
      this.subElements.header.textContent = this.getHeaderValue(data);
      this.subElements.body.innerHTML = this.getBodyTemplate(data);

      this.element.classList.remove('column-chart_loading');
    }

    this.data = data;
    return this.data;
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
