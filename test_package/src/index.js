import {helloProvingGround} from "app_package";

function component() {
    const element = document.createElement("p");

    element.textContent = "Hello, WebPack.";

    helloProvingGround();

    return element;
}

document.body.appendChild(component());
