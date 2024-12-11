export const popupDnD = ({
  header,
  popup,
  width,
  height,
}: {
  header: HTMLElement;
  popup: HTMLElement;
  width: number;
  height: number;
}) => {
  let isDragging = false;
  let currentX: number;
  let currentY: number;
  let initialX: number;
  let initialY: number;

  // Функция для ограничения значения в заданных пределах
  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  header.onmousedown = (e) => {
    isDragging = true;
    initialX = e.clientX - popup.offsetLeft;
    initialY = e.clientY - popup.offsetTop;
  };

  const resizer = document.createElement("div");
  resizer.className = "popup-resizer";
  popup.appendChild(resizer);

  let isResizing = false;
  let startWidth: number;
  let startHeight: number;
  let startX: number;
  let startY: number;

  resizer.onmousedown = (e) => {
    isResizing = true;
    startWidth = parseInt(getComputedStyle(popup).width, 10);
    startHeight = parseInt(getComputedStyle(popup).height, 10);
    startX = e.clientX;
    startY = e.clientY;

    e.stopPropagation();
  };

  document.onmousemove = (e) => {
    if (isDragging) {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      // Получаем размеры окна и попапа
      const windowWidth = window.innerWidth;
      const popupWidth = popup.offsetWidth;

      // Ограничиваем позицию попапа
      currentX = clamp(currentX, 0, windowWidth - popupWidth - 20);

      popup.style.left = `${currentX}px`;
      popup.style.top = `${currentY}px`;
    } else if (isResizing) {
      const newWidth = startWidth + (e.clientX - startX);
      const newHeight = startHeight + (e.clientY - startY);

      // Получаем позицию попапа
      const bounds = popup.getBoundingClientRect();
      const maxWidth = window.innerWidth - bounds.left;
      const maxHeight = window.innerHeight - bounds.top;

      // Ограничиваем размеры попапа
      popup.style.width = `${clamp(newWidth, 300, maxWidth)}px`;
      popup.style.height = `${clamp(newHeight, 200, maxHeight)}px`;
    }
  };

  document.onmouseup = () => {
    isDragging = false;
    isResizing = false;
  };

  const onOpen = () => {
    // Устанавливаем начальную позицию по центру экрана
    const initialLeft = clamp(
      window.innerWidth / 2 - width / 2,
      0,
      window.innerWidth - width
    );
    const initialTop = clamp(
      window.innerHeight / 2 - height / 2 + window.scrollY,
      0,
      window.innerHeight - height + window.scrollY
    );
    popup.style.left = `${initialLeft}px`;
    popup.style.top = `${initialTop}px`;
  };

  return {
    onOpen,
  };
};
