import ActionRow from "./Structures/ActionRow";
import Button from "./Structures/Button";
import SelectMenu from "./Structures/SelectMenu";
import TextInput from "./Structures/TextInput";
import type { ButtonColors } from "./Constants";
import {
    ButtonStyles,
    ComponentTypes,
    MessageActionRow,
    ModalActionRow,
    PartialEmoji,
    RawMessageActionRow,
    RawModalActionRow,
    SelectMenuTypes,
    SelectOption,
    TextInputStyles
} from "oceanic.js";

type RowMax = 1 | 2 | 3 | 4 | 5;
type ValidComponents = Button | SelectMenu | TextInput;

const SelectMenuTypeValues = [ComponentTypes.STRING_SELECT, ComponentTypes.USER_SELECT, ComponentTypes.ROLE_SELECT, ComponentTypes.MENTIONABLE_SELECT, ComponentTypes.CHANNEL_SELECT];
const UniqueRowNeeded = [...SelectMenuTypeValues, ComponentTypes.TEXT_INPUT];
type ToRaw<T extends MessageActionRow | ModalActionRow> = T extends MessageActionRow ? RawMessageActionRow : RawModalActionRow;
export default class ComponentBuilder<T extends MessageActionRow | ModalActionRow = MessageActionRow | ModalActionRow> {
    private currentIndex = 0;
    private rows: Array<ActionRow> = [];
    rowMax: RowMax = 5;
    constructor(rowMax?: RowMax) {
        if (rowMax) {
            this.rowMax = rowMax;
        }
    }

    /**
     * Convert an emoji to a partial.
     * @param emoji The unicode point of the emoji if default, else the fully qualified emoji.
     * @param type `default` if built in (unicode), `custom` otherwise (this can be assumed from the format by us).
     * @example emojiToPartial("🐾", "default")
     * @example emojiToPartial("<:paws8:681748079778463796>", "custom")
     */
    static emojiToPartial(emoji: string, type: "default" | "custom" = "custom"): PartialEmoji {
        if (type === "default") {
            return {
                id:       null,
                name:     emoji,
                animated: false
            };
        } else {
            const [, anim, name, id] = /^<?(a)?:(.*):([\d]{15,21})>?$/.exec(emoji) ?? [];
            if (!name || !id) {
                return this.emojiToPartial(emoji, "default");
            }
            return {
                id,
                name,
                animated: anim === "a"
            };
        }
    }

    private getCurrentRow(): ActionRow {
        return (this.rows[this.currentIndex] || (this.rows[this.currentIndex] = new ActionRow()));
    }

    /**
     * Add a component to the current row, or a new row depending on certain conditions
     * @param component The component to add.
     */
    addComponent(component: ValidComponents): this {
        const cur = this.getCurrentRow();
        if (UniqueRowNeeded.includes(component.type)) {
            if (cur.isEmpty()) {
                cur.addComponent(component);
                this.addRow();
            } else {
                this.addRow([component]).addRow();
            }
        } else {
            if (cur.size >= this.rowMax) {
                this.addRow([component]);
            } else {
                cur.addComponent(component);
            }
        }

        return this;
    }

    /**
     * Add several components.
     * @param components The components to add.
     */
    addComponents(...components: Array<ValidComponents>): this {
        components.map(c => this.addComponent(c));
        return this;
    }

    /**
     * Add an interaction button to the current row.
     * @param options The options for adding the interaction button.
     */
    addInteractionButton(options: AddInteractionButtonOptions): this {
        this.addComponent(new Button(options.style, options.customID)["load"](options.style, options.customID, options.label, options.emoji, options.disabled));
        return this;
    }

    /**
     * Start a new action row.
     * @param components The components to start this new row with.
     */
    addRow(components: Array<ValidComponents> = []): this {
        this.currentIndex++;
        this.rows.push(new ActionRow().addComponents(...components));
        return this;
    }

    /**
     * Add a select menu (to the current row, if empty - else as a new row).
     * @param options The options for adding the select menu.
     */
    addSelectMenu(options: AddSelectMenuOptions): this {
        this.addComponent(new SelectMenu(options.type, options.customID)["load"](options.customID, options.options, options.placeholder, options.minValues, options.maxValues, options.disabled));
        return this;
    }

    /**
     * Add a text input to the current row.
     * @param options The options for adding the text input.
     * @returns
     */
    addTextInput(options: AddTextMenuOptions): this {
        this.addComponent(new TextInput(options.style, options.label, options.customID)["load"](options.style, options.label, options.customID, options.placeholder, options.value, options.minLength, options.maxLength, options.required));
        return this;
    }

    /**
     * Add a url button to the current row
     * @param options The options for adding the url button.
     */
    addURLButton(options: AddURLButtonOptions): this {
        this.addComponent(new Button(ButtonStyles.LINK, options.url)["load"](ButtonStyles.LINK, options.url, options.label, options.emoji, options.disabled));
        return this;
    }

    /**
     * Remove all of the rows that are empty.
     */
    removeEmptyRows(): this {
        this.rows.forEach((row, index) => {
            if (row.size === 0) {
                this.rows.splice(index, 1);
            }
        });
        this.currentIndex = this.rows.length - 1;

        return this;
    }

    setRowMax(rowMax: RowMax): this {
        this.rowMax = rowMax;
        return this;
    }

    /** convert the current contents to JSON */
    toJSON(): Array<T> {
        return this.removeEmptyRows().rows.map(row => row.toJSON()) as Array<T>;
    }

    /** convert the current contents to JSON */
    toJSONRaw(): Array<ToRaw<T>> {
        return this.removeEmptyRows().rows.map(row => row.toJSONRaw()) as Array<ToRaw<T>>;
    }
}

export interface AddInteractionButtonOptions {
/** A developer-defined identifier for the button, max 100 characters. */
    customID: string;
    /** If the button is disabled. */
    disabled?: boolean;
    /** An emoji that appears on the button. */
    emoji?: PartialEmoji;
    /** Text that appears on the button, max 80 characters. */
    label?: string;
    /** The [style](https://discord.com/developers/docs/interactions/message-components#button-object-button-styles) of the button. */
    style: ButtonStyles | ButtonColors;
}

export interface AddSelectMenuOptions {
/** A developer-defined identifier for the button, max 100 characters. */
    customID: string;
    /** Disable the select, default false. */
    disabled?: boolean;
    /** The maximum number of items that can be chosen; default 1, max 25. */
    maxValues?: number;
    /** The minimum number of items that must be chosen; default 1, min 0, max 25. */
    minValues?: number;
    /** The choices in the select, max 25. */
    options: Array<SelectOption>;
    /** Custom placeholder text if nothing is selected, max 100 characters. */
    placeholder?: string;
    /** The type of select menu to add. */
    type: SelectMenuTypes;
}

export interface AddTextMenuOptions {
/** A developer-defined identifier for the input, max 100 characters. */
    customID: string;
    /** The label for this text input. */
    label: string;
    /** The maximum input length for a text input, min 1, max 4000. */
    maxLength?: number;
    /** The minimum input length for a text input, min 0, max 4000. */
    minLength?: number;
    /** Custom placeholder text if the input is empty, max 100 characters. */
    placeholder?: string;
    /** If this component is required to be filled, default true. */
    required?: boolean;
    /** The [style](https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-styles) of the text input. */
    style: TextInputStyles;
    /** A pre-filled value for this component, max 4000 characters. */
    value?: string;
}

export interface AddURLButtonOptions {
/** If the button is disabled. */
    disabled?: boolean;
    /** An emoji that appears on the button. */
    emoji?: PartialEmoji;
    /** Text that appears on the button, max 80 characters. */
    label?: string;
    /** The url to open when clicked. */
    url: string;
}
