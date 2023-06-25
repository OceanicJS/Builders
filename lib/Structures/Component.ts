import { ComponentTypes } from "oceanic.js";

export default class Component<T extends ComponentTypes = ComponentTypes> {
    disabled = false;
    type: T;
    constructor(type: T) {
        this.type = type;
    }

    /**
     * Disable this component.
     */
    disable(): this {
        this.disabled = true;
        return this;
    }

    /**
     * Enable this component.
     */
    enable(): this {
        this.disabled = false;
        return this;
    }

    toJSON(): unknown {
        return {};
    }

    toJSONRaw(): unknown {
        return this.toJSON();
    }
}
