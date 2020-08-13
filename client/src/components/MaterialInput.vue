<template>
  <div ref="wrapper" class="wrap" :class="[half ? 'w-50p' : 'w-full']">
    <input
      ref="input"
      :style="
        `--hoverBorderColor: ${hoverBorderColor}; --borderColor: ${borderColor}; --focusBorderColor: ${focusBorderColor}; --autofillColor: ${autofillColor};`
      "
      placeholder=" "
      :type="type"
      :name="name"
      @input="handleInput"
    />
    <label
      ref="label"
      for="input"
      :style="`--backgroundColor: ${backgroundColor};`"
      >{{ placeholder }}</label
    >
  </div>
</template>

<script>
export default {
  props: {
    half: Boolean,
    borderColor: String,
    hoverBorderColor: String,
    placeholder: String,
    backgroundColor: String,
    focusBorderColor: String,
    autofillColor: String,
    type: String,
    value: String,
    name: String,
  },
  methods: {
    handleInput(e) {
      this.$emit("input", e.target.value);
    },
  },
};
</script>

<style scoped>
input:not(:placeholder-shown) ~ label,
input:focus ~ label {
  transform: translateY(-85%) scale(0.85);
}

input {
  width: 100%;
  border-width: 1px;
  background-color: #ff000000;
  border-radius: 0.25rem;
  padding: 0.5rem;
  border-color: var(--borderColor);

  transition-property: border-color;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

input:hover {
  border-color: var(--hoverBorderColor);
}

input:focus {
  border-color: var(--focusBorderColor);
  outline: none;
}

label {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  color: #9e9e9e;
  background: var(--backgroundColor);

  transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

.wrap {
  position: relative;
  margin-top: 1rem;
}

.w-50p {
  width: 50%;
}

.w-full {
  width: 100%;
}

outline-none:focus {
  outline: 0;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-transition-delay: 9999999s !important;
  -webkit-transition: background-color 9999s ease-in-out !important;
  -webkit-text-fill-color: var(--autofillColor) !important;
}
</style>
