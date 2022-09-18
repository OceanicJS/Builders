import Component from "./Component";
import { ButtonColors } from "../Constants";
import {
    ButtonStyles,
    ComponentTypes,
    PartialEmoji,
    TextButton,
    URLButton
} from "oceanic.js";

export default class Button extends Component<ComponentTypes.BUTTON> {
    customID?: string;
    emoji?: PartialEmoji;
    label?: string;
    style: ButtonStyles | ButtonColors;
    url?: string;
    /**
     * Create a new Button.
     * @param style The style of this button.
     * @param urlOrCustomID The url of this button if style 5, else the custom ID of this button.
     */
    constructor(style: ButtonStyles | ButtonColors, urlOrCustomID: string) {
        super(ComponentTypes.BUTTON);
        this.style = style;
        if (style === ButtonStyles.LINK) {
            this.url = urlOrCustomID;
        } else {
            this.customID = urlOrCustomID;
        }
    }

    /** this method is meant to be for internal use only, don't use it, as it may break or change at a moments notice */
    private load(style?: ButtonStyles | ButtonColors, urlOrCustomID?: string, label?: string, emoji?: PartialEmoji, disabled?: boolean): this {
        if (style) {
            this.setStyle(style);
        }
        if (urlOrCustomID) {
            if (this.style === ButtonStyles.LINK) {
                this.url = urlOrCustomID;
            } else {
                this.customID = urlOrCustomID;
            }
        }
        if (label) {
            this.setLabel(label);
        }
        if (emoji) {
            this.setEmoji(emoji);
        }
        if (typeof disabled !== "undefined") {
            if (disabled) {
                this.disable();
            } else {
                this.enable();
            }
        }

        return this;
    }

    /**
     * Set the custom id of this button (styles 1-4).
     * @param customID A developer-defined identifier for the button, max 100 characters.
     */
    setCustomID(customID: string): this {
        this.customID = customID;
        return this;
    }

    /**
     * Set the emoji of this button.
     * @param emoji The emoji to display on this button.
     */
    setEmoji(emoji: PartialEmoji): this {
        this.emoji = emoji;
        return this;
    }

    /**
     * Set the label of this button
     * @param label The label to display on this button.
     */
    setLabel(label: string): this {
        this.label = label;
        return this;
    }

    /**
     * Set the style of this button.
     * * 1 - blurple
     * * 2 - grey
     * * 3 - green
     * * 4 - red
     * * 5 - link
     * @param style The [style](https://discord.com/developers/docs/interactions/message-components#button-object-button-styles) of this button.
     */
    setStyle(style: ButtonStyles | ButtonColors): this {
        this.style = style;
        return this;
    }

    /**
     * Set the custom id of this button (style 5).
     * @param url The url to open when this button is clicked.
     */
    setURL(url: string): this {
        this.url = url;
        return this;
    }

    override toJSON(): TextButton | URLButton {
        const obj = {
            type:     this.type,
            style:    this.style,
            label:    this.label,
            emoji:    this.emoji,
            disabled: this.disabled
        } as TextButton | URLButton;
        if (this.style === ButtonStyles.LINK) {
            (obj as URLButton).url = this.url!;
            return obj;
        } else {
            (obj as TextButton).customID = this.customID!;
            return obj;
        }

    }
}
