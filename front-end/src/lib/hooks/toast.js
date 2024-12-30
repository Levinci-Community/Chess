export function toast_success(title, description) {
  return {
    title: title,
    description: description,
    status: "success",
    duration: 5000,
    isClosable: true,
    position: "top-right",
  };
}

export function toast_warning(title, description) {
  return {
    title: title,
    description: description,
    status: "warning",
    duration: 5000,
    isClosable: true,
    position: "top-right",
  };
}

export function toast_error(title, description) {
  return {
    title: title,
    description: description,
    status: "error",
    duration: 5000,
    isClosable: true,
    position: "top-right",
  };
}

export function toast_info(title, description) {
  return {
    title: title,
    description: description,
    status: "info",
    duration: 5000,
    isClosable: true,
    position: "top-right",
  };
}
