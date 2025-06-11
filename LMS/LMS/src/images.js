// images.js (helper file)
const importAll = (r) => {
  let images = {};
  r.keys().forEach((key) => {
    const fileName = key.replace('./', '').split('.')[0]; // "food", "news", etc.
    images[fileName] = r(key);
  });
  return images;
};

const images = importAll(require.context('./assets', false, /\.(png|jpe?g|svg)$/));

export default images;