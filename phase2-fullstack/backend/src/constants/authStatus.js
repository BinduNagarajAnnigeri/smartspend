export const FAMILY_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  REVOKED: "REVOKED",
  COMPROMISED: "COMPROMISED",
});

export const TOKEN_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  USED: "USED",
  REVOKED: "REVOKED",
});

export const FAMILY_STATUS_VALUES = Object.freeze(Object.values(FAMILY_STATUS));

export const TOKEN_STATUS_VALUES = Object.freeze(Object.values(TOKEN_STATUS));
