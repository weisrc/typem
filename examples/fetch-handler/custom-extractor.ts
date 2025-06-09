import type { FromInput, Custom } from "typem";
import {
  handler,
  registerBaseExtractors,
  type Extractor,
} from "@typem/fetch-handler";

type AuthData = {
  user: string;
  roles: string[];
};

type FromAuth = FromInput<"auth", []>;

const authExtractor: Extractor<FromAuth> = {
  id: "auth",
  extract(request) {
    // Simulate extracting auth data from a request
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return undefined;

    const [user, ...roles] = authHeader.split(" ");
    return { user, roles };
  },
  updateSchema(operationSchema, _param, dataSchema) {
    operationSchema.parameters = [
      ...(operationSchema.parameters ?? []),
      {
        in: "header",
        name: "Authorization",
        schema: dataSchema,
        required: true,
      },
    ];
  },
};
