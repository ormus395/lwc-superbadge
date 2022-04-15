export const loadScript = jest.fn((element, path) => {
  return Promise.reject("mock loadScript");
});

export const loadStyle = jest.fn((element, path) => {
  return Promise.reject("mock loadStyle");
});
