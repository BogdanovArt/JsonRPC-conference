const isEqualObj = (A: object, B: object) => {
  return JSON.stringify(A) === JSON.stringify(B);
};

export default isEqualObj;