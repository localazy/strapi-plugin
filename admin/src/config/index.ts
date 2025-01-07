import production from "./production/index";
import local from "./local/index";
import development from "./development/index";


// depending on the STRAPI_ADMIN_LOCALAZY_ENV, use the correct config
let config = production;

if (process.env.STRAPI_ADMIN_LOCALAZY_ENV === "local") {
  config = local;
}

if (process.env.STRAPI_ADMIN_LOCALAZY_ENV === "development") {
  config = development;
}

export default config;
