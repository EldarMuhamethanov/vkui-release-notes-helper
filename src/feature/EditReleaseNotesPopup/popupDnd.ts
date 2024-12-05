
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
    // Добавляем функционал перетаскивания
    let isDragging = false;
    let currentX: number;
    let currentY: number;
    let initialX: number;
    let initialY: number;
  
    header.onmousedown = (e) => {
      isDragging = true;
      const bounds = popup.getBoundingClientRect();
      initialX = e.clientX - bounds.left;
      initialY = e.clientY - bounds.top;
    };
  
    document.onmousemove = (e) => {
      if (isDragging) {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        popup.style.left = `${currentX}px`;
        popup.style.top = `${currentY}px`;
      }
    };
  
    document.onmouseup = () => {
      isDragging = false;
    };
  
    popup.style.left = `${window.innerWidth / 2 - width / 2}px`;
    popup.style.top = `${window.innerHeight / 2 - height / 2}px`;
  };