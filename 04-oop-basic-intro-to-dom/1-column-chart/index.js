export default class ColumnChart {
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link = '',
    formatHeading = data => data
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = formatHeading(value);
    this.link = link;
    this.element = null;
    this.childrenElements = {};

    this.render();
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }

    this.childrenElements = this.getChildrenElements(this.element);
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
          ${this.value}
        </div>
        <div data-element="body" class="column-chart__chart">
          ${this.getBodyTemplate(this.data)}
        </div>
      </div>
    </div>
  `;
  }

  getBodyTemplate(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      const percent = (item / maxValue * 100).toFixed(0);

      return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
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

  update(data) {
    this.childrenElements.body.innerHTML = this.getBodyTemplate(data);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.childrenElements = {};
  }
}
