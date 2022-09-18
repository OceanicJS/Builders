import Component from "./Component";
import { ComponentTypes, TextInput as ITextInput, TextInputStyles } from "oceanic.js";

export default class TextInput extends Component<ComponentTypes.TEXT_INPUT> {
    customID: string;
    label: string;
    maxLength?: number;
    minLength?: number;
    placeholder?: string;
    required?: boolean;
    style: TextInputStyles;
    value?: string;
    constructor(style: TextInputStyles, label: string, customID: string) {
        super(ComponentTypes.TEXT_INPUT);
        this.style = style;
        this.label = label;
        this.customID = customID;
    }

    /** this method is meant to be for internal use only, don't use it, as it may break or change at a moments notice */
    private load(style?: TextInputStyles, label?: string, customID?: string, placeholder?: string, value?: string, minLength?: number, maxLength?: number, required?: boolean): this {
        if (style) {
            this.setStyle(style);
        }
        if (label) {
            this.setLabel(label);
        }
        if (customID) {
            this.setCustomID(customID);
        }
        if (placeholder) {
            this.setPlaceholder(placeholder);
        }
        if (value) {
            this.setValue(value);
        }
        if (minLength) {
            this.setLength(minLength, undefined);
        }
        if (maxLength) {
            this.setLength(undefined, maxLength);
        }
        if (typeof required !== "undefined") {
            this.setRequired(required);
        }
        return this;
    }

    /**
     * Set the custom id of this text input.
     * @param customID A developer-defined identifier for the input, max 100 characters.
     */
    setCustomID(customID: string): this {
        this.customID = customID;
        return this;
    }

    /**
     * Set the label of this text input.
     * @param label The label to display on this text input.
     */
    setLabel(label: string): this {
        this.label = label;
        return this;
    }

    /**
     * Set the minimum/maximum length of this text input.
     * @param min The minimum length.
     * @param max The maximum length.
     */
    setLength(min?: number, max?: number): this {
        if (min) {
            this.minLength = min;
        }
        if (max) {
            this.maxLength = max;
        }
        return this;
    }

    /**
     * Make this text input optional.
     */
    setOptional(): this {
        this.required = false;
        return this;
    }

    /**
     * Set the placeholder of this text input.
     * @param placeholder Custom placeholder text if nothing is selected, max 100 characters.
     */
    setPlaceholder(placeholder: string): this {
        this.placeholder = placeholder;
        return this;
    }

    /**
     * Make this text input required.
     * @param required If this text input should be required or not - default true, setOptional also exists.
     */
    setRequired(required = true): this {
        this.required = required;
        return this;
    }

    /**
     * Set the style of this text input.
     * @param style The [style](https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-styles) of this text input.
     */
    setStyle(style: TextInputStyles): this {
        this.style = style;
        return this;
    }

    /**
     * Set the initial value of this text input.
     * @param value A pre-filled value for this component, max 4000 characters.
     */
    setValue(value: string): this {
        this.value = value;
        return this;
    }

    override toJSON(): ITextInput {
        return {
            type:        this.type,
            customID:    this.customID,
            style:       this.style,
            label:       this.label,
            minLength:   this.minLength,
            maxLength:   this.maxLength,
            required:    this.required,
            value:       this.value,
            placeholder: this.placeholder
        };
    }
}
