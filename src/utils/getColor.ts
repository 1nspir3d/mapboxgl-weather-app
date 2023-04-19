const getColor = (temp: number): string => {
  if (temp <= 0) {
    return '#1c71f2';
  }
  if (temp <= 10) {
    return '#60bdfa';
  }
  if (temp <= 20) {
    return '#e8d024';
  }
  if (temp <= 30) {
    return '#fbaa1b';
  }
  return '#f56048';
};

export default getColor
