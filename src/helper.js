function getImgUrl(binaryImg) {
  const blob = new Blob([binaryImg], { type: 'image/jpeg' });
  const imageUrl = URL.createObjectURL(blob);

  return imageUrl;
}

function downloadFile(blob, fileName) {
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);

  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);
}

const areElementsFunction = arrayOfFunction => arrayOfFunction.every(value => {
  if (typeof value === 'function') {
    return true;
  } else {
    throw new TypeError(`${value} isn't a function`);
  }
});
