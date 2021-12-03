class Tooltip {
  element;
  text = '';
  static instance;

  onPointerOver = (e) => {
    const target = e.target.closest("[data-tooltip]");

    if (target) {
      this.render(target.dataset.tooltip);
      document.addEventListener('pointermove', this.onPointerMove);
    }
  };

  onPointerOut = () => {
    this.remove();
  };

  onPointerMove = (e) => {
    this.moveElement(e);
  };

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    } else {
      return Tooltip.instance;
    }
  }

  initialize() {
    this.bindEvents();
  }

  render(text) {
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate(text);
    this.element = element.firstElementChild;

    document.body.append(this.element);
  }

  getTemplate(text) {
    return `<div class="tooltip">${text}</div>`;
  }

  bindEvents() {
    document.addEventListener("pointerover", this.onPointerOver);
    document.addEventListener("pointerout", this.onPointerOut);
  }

  moveElement(e) {
    const shift = 10;
    const top = e.clientY + shift;
    const left = e.clientX + shift;

    this.element.style.top = `${top}px`;
    this.element.style.left = `${left}px`;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    document.removeEventListener("pointerover", this.onPointerOver);
    document.removeEventListener("pointerout", this.onPointerOut);
    document.removeEventListener('pointermove', this.onPointerMove);
    this.remove();
    this.element = null;
  }
}

export default Tooltip;
