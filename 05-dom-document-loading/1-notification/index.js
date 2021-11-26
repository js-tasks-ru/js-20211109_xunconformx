export default class NotificationMessage {
  static activeNotificationMessage;
  element;
  timer;

  constructor(message, {
    duration = 2000,
    type = 'success',
  } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  show(container = document.querySelector('body')) {
    if (NotificationMessage.activeNotificationMessage) {
      NotificationMessage.activeNotificationMessage.remove();
    }

    container.append(this.element);
    NotificationMessage.activeNotificationMessage = this;

    this.timer = setTimeout(() => {
      this.destroy();
    }, this.duration);
  }

  get template() {
    return `
        <div class="notification ${this.type}" style="--value:${(this.duration / 1000).toFixed(3)}s">
          <div class="timer"></div>
          <div class="inner-wrapper">
            <div class="notification-header">${this.type}</div>
            <div class="notification-body">
              ${this.message}
            </div>
          </div>
        </div>;
    `;
  }

  remove() {
    clearTimeout(this.timer);

    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    NotificationMessage.activeNotificationMessage = null;
  }
}
