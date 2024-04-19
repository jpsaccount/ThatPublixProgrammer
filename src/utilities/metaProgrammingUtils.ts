export function getCallerUniqueKey(): string {
  const err = new Error();
  let stack = err.stack;

  if (stack === undefined) {
    try {
      throw err;
    } catch (e) {
      stack = e.stack;
    }
  }

  stack = stack || "";

  const lines = stack.split("\n");
  let earliestExecutionLine = 10;

  const filteredLines = lines.filter((line, index) => {
    const isIncluded =
      (line.includes("React") || line.trim().startsWith("at commitHook") || line.trim().includes("MountEffects")) ==
      false;

    if (index < earliestExecutionLine && isIncluded == false) {
      earliestExecutionLine = index;
    }
    return isIncluded;
  });

  const result = filteredLines.filter((x, index) => index < earliestExecutionLine).join("-");
  return result;
}
