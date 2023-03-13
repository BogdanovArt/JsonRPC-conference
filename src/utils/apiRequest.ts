import { apiRequest, getApiUrl } from "@oktell/utils";

import { domain, token } from "./env";

const requestUrl = getApiUrl(token, domain);

export { apiRequest, requestUrl };
