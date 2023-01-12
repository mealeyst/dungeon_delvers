import { initializeBabylonApp } from "app_package";

let assetsHostUrl;
if (DEV_BUILD) {
  assetsHostUrl = "http://127.0.0.1:8181/";
} else {
  assetsHostUrl = "https://nonlocal-assets-host-url/";
}
initializeBabylonApp({ assetsHostUrl: assetsHostUrl });
