const debounce = (timeout = 500) => {
  return <Args extends unknown[]>(
    func: (...args: Args) => unknown,
  ): ((...args: Args) => () => void) => {
    let timer: NodeJS.Timeout;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, timeout);

      return () => clearTimeout(timer);
    };
  };
};

export default debounce;
