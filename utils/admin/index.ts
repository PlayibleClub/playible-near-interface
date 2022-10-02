const isAdminChecker = (accountId: string) => {
  return process.env.ADMIN == accountId;
};

export { isAdminChecker };
