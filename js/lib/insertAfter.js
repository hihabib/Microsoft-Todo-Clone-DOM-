function insertAfter(oldElement, newElement) {
  const parent = oldElement.parentElement;
  parent.insertBefore(newElement, oldElement.nextElementSibling);
}


export default insertAfter;