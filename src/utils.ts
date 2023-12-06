import { ParametersLengthsMismatchError, InvalidParamError } from "./errors";
import { verify } from "./schemas";
import type { WriteFunction } from "./types";

export const checkWriteFunctionArgs = ({
  func,
  args,
}: {
  func: WriteFunction;
  args: unknown[];
}) => {
  if (args.length !== func.args.length) {
    throw new ParametersLengthsMismatchError(
      "Arguments array length doesn't match the expected number of the function's arguments"
    );
  }

  for (let i = 0; i < args.length; i++) {
    const val = args[i];
    const type = func.args[i].type;
    if (!verify(val, type)) {
      throw new InvalidParamError(`Invalid argument at index ${i}`);
    }
  }
};
