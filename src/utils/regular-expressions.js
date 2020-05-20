export const regexDNI = [/^[VEJ]{1}\d{8,10}$/, 'dni-invalid-format'];
// /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
export const regexEmail = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'format-email-invalid'];

export const regexError = /\w+\-[\w\-]+\-\w+/g;

export const matchDNI = [/^[VEJ]{1}\d{6,10}$/, 'dni-invalid-format'];

export const matchEmail = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'invalid-email-format'];

export const matchMemo = /\w{12}/

export const matchMemoHex = /^[\dabcdef]{12}$/