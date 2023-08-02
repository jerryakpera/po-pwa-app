import { ref } from "vue";

export const useFormValidation = () => {
  const formRef = ref(null);

  function validateForm() {
    return new Promise((resolve, reject) => {
      formRef.value.validate().then((success) => {
        if (success) {
          resolve(true);
          return;
        } else resolve(false);
      });
    });
  }

  // to reset validations:
  function resetForm() {
    formRef.value.resetValidation();
  }

  return {
    formRef,
    resetForm,
    validateForm,
  };
};
