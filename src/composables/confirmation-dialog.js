import { useQuasar } from "quasar";

export const useConfirmation = (dialog, message) => {
  return new Promise((resolve, reject) => {
    dialog({
      cancel: true,
      title: "Confirm",
      persistent: false,
      message: message ? message : "Are you sure?",
    })
      .onOk(() => {
        resolve(true);
        // console.log(">>>> OK");
      })
      // .onOk(() => {
      //   console.log(">>>> second OK catcher");
      // })
      .onCancel(() => {
        resolve(false);
        // reject();
      });
    // .onDismiss(() => {
    //   console.log("I am triggered on both OK and Cancel");
    // });
  });
};
