export const Colors = [
  "#88419D",
  "#1D91C0",
  "#7FCDBB",
  "#50a3a5",
  "#EB5233",
  "#D1D4D9",
  "#b9b638",
  "#a3dfa7",
  "#286b57",
  "#e8ca88",
  "#32628F",
  "#A15E20",
  "#3bc8f5",
];

export const getColor = (index: number) => {
  if (index < Colors.length) {
    return Colors[index];
  } else {
    return Colors[Math.floor(Math.random() * (Colors.length - 1))];
  }
};
