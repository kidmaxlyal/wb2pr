// Подробности услуг. Содержимое хранится отдельно от разметки окна.
const services = {
  wheels: { title: 'Колёса и камеры', description: 'Если колесо спускает или задевает тормоз, проверим причину и предложим ремонт.', items: ['Поиск прокола и замена камеры', 'Правка небольших «восьмёрок»', 'Проверка обода и натяжения спиц'], price: 'от 400 ₽' },
  gears: { title: 'Тормоза и передачи', description: 'Настроим узлы, от которых зависят плавный ход и контроль велосипеда.', items: ['Настройка переключателей', 'Проверка тормозов и износа колодок', 'Замена тросов и рубашек при необходимости'], price: 'от 600 ₽' },
  maintenance: { title: 'Сезонное ТО', description: 'Проверим велосипед перед сезоном или после долгого простоя.', items: ['Диагностика основных узлов и крепежа', 'Чистка и смазка трансмиссии', 'Настройка тормозов и переключения', 'Проверка давления и состояния покрышек'], price: 'от 2 000 ₽' }
};
const dialog = document.querySelector('#service-dialog');
let opener;
let selectedService;
document.querySelectorAll('[data-service]').forEach(button => {
  button.addEventListener('click', () => {
    opener = button;
    selectedService = button.dataset.service;
    const service = services[selectedService];
    document.querySelector('#dialog-title').textContent = service.title;
    document.querySelector('#dialog-description').textContent = service.description;
    document.querySelector('#dialog-price').textContent = service.price;
    const list = document.querySelector('#dialog-list');
    list.replaceChildren();
    service.items.forEach(text => {
      const item = document.createElement('li');
      item.textContent = text;
      list.append(item);
    });
    dialog.showModal();
  });
});
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
// Escape и ограничение фокуса обеспечивает стандартный элемент dialog.
document.querySelector('.choose-service').addEventListener('click', () => {
  document.querySelector('#service').value = selectedService;
  dialog.close();
  document.querySelector('#service').dispatchEvent(new Event('input'));
  document.querySelector('#contacts').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});
const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const fields = ['name', 'email', 'service', 'message'];
function errorFor(field) {
  if (!field.value.trim()) return field.id === 'service' ? 'Выберите услугу.' : 'Заполните это поле.';
  if (field.id === 'email' && field.validity.typeMismatch) return 'Введите email в формате name@example.com.';
  return '';
}
function showError(field, message) {
  document.querySelector('#' + field.id + '-error').textContent = message;
  if (message) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
}
fields.forEach(id => {
  const field = document.getElementById(id);
  field.addEventListener('input', () => {
    status.textContent = '';
    if (field.hasAttribute('aria-invalid')) showError(field, errorFor(field));
  });
});
form.addEventListener('submit', event => {
  event.preventDefault();
  let firstInvalid;
  fields.forEach(id => {
    const field = document.getElementById(id);
    // Для email пробелы по краям не должны мешать проверке.
    if (id === 'email') field.value = field.value.trim();
    const error = errorFor(field);
    showError(field, error);
    if (error && !firstInvalid) firstInvalid = field;
  });
  if (firstInvalid) {
    status.textContent = 'Проверьте отмеченные поля.';
    firstInvalid.focus();
    return;
  }
  status.textContent = 'Данные проверены. Это учебное демо: заявка не отправлена';
});
// При недоступности изображения остаётся аккуратная подпись.
document.querySelectorAll('img').forEach(img => {
  const fallback = () => {
    const replacement = document.createElement('div');
    replacement.className = 'image-fallback';
    replacement.textContent = img.alt || 'Иллюстрация мастерской';
    img.replaceWith(replacement);
  };
  img.addEventListener('error', fallback, { once: true });
  if (img.complete && img.naturalWidth === 0) fallback();
});

// Вращение можно остановить. Системная настройка уменьшения движения учитывается в CSS.
const motionToggle = document.querySelector('.motion-toggle');
motionToggle.addEventListener('click', () => {
  const paused = document.body.classList.toggle('motion-paused');
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.setAttribute('aria-label', paused ? 'Включить вращение колёс' : 'Остановить вращение колёс');
  motionToggle.querySelector('span').textContent = paused ? '▶' : 'Ⅱ';
});
