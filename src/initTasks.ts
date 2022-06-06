export const initBeforeEnteringHome = async () => {
  console.log('initBeforeEnteringHome===');
};

export const initThirdSDKBeforeEnteringHome = async () => {
  console.log('initThirdSDKBeforeEnteringHome===');
};

export const initAfterEnteringHome = async () => {
  console.log('initAfterEnteringHome===');
};

export const initAfterEnteringHomeWithDelay = async () => {
  setTimeout(() => {
    console.log('initAfterEnteringHomeWithDelay===');
  }, 2000);
};
