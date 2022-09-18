import ActionRow from "./Structures/ActionRow";
import Button from "./Structures/Button";
import SelectMenu from "./Structures/SelectMenu";
import TextInput from "./Structures/TextInput";
import { ButtonColors } from "./Constants";
import {
    ButtonStyles,
    ComponentTypes,
    MessageActionRow,
    ModalActionRow,
    PartialEmoji,
    SelectOption,
    TextInputStyles
} from "oceanic.js";

type RowMax = 1 | 2 | 3 | 4 | 5;
type ValidComponents = Button | SelectMenu | TextInput;
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
        if (component.type === ComponentTypes.SELECT_MENU) {
            if (cur.isEmpty()) {
                cur.addComponent(component);
                this.addRow();
                return this;
            } else {
                this.addRow([component]).addRow();
                return this;
            }
        }
        if (cur.size >= this.rowMax) {
            return this.addRow([component]);
        } else {
            cur.addComponent(component);
            return this;
        }
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
     * @param style The [style](https://discord.com/developers/docs/interactions/message-components#button-object-button-styles) of the button.
     * @param customID A developer-defined identifier for the button, max 100 characters.
     * @param label Text that appears on the button, max 80 characters.
     * @param emoji An emoji that appears on the button.
     * @param disabled If the button is disabled.
     */
    addInteractionButton(style: ButtonStyles | ButtonColors, customID: string, label?: string, emoji?: PartialEmoji, disabled?: boolean): this {
        this.addComponent(new Button(style, customID)["load"](style, customID, label, emoji, disabled));
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
     * @param customID A developer-defined identifier for the button, max 100 characters.
     * @param options The choices in the select, max 25.
     * @param placeholder Custom placeholder text if nothing is selected, max 100 characters.
     * @param minValues The minimum number of items that must be chosen; default 1, min 0, max 25.
     * @param maxValues The maximum number of items that can be chosen; default 1, max 25.
     * @param disabled Disable the select, default false.
     */
    addSelectMenu(customID: string, options: Array<SelectOption>, placeholder?: string, minValues?: number, maxValues?: number, disabled?: boolean): this {
        this.addComponent(new SelectMenu(customID)["load"](customID, options, placeholder, minValues, maxValues, disabled));
        return this;
    }

    /**
     * Add a text input to the current row.
     * @param style The [style](https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-styles) of the text input.
     * @param label The label for this text input.
     * @param customID A developer-defined identifier for the input, max 100 characters.
     * @param placeholder Custom placeholder text if the input is empty, max 100 characters.
     * @param value A pre-filled value for this component, max 4000 characters.
     * @param minLength The minimum input length for a text input, min 0, max 4000.
     * @param maxLength The maximum input length for a text input, min 1, max 4000.
     * @param required If this component is required to be filled, default true.
     * @returns
     */
    addTextInput(style: TextInputStyles, label: string, customID: string, placeholder?: string, value?: string, minLength?: number, maxLength?: number, required?: boolean): this {
        this.addComponent(new TextInput(style, label, customID)["load"](style, label, customID, placeholder, value, minLength, maxLength, required));
        return this;
    }

    /**
     * Add a url button to the current row
     * @param url The url to open when clicked.
     * @param label Text that appears on the button, max 80 characters.
     * @param emoji An emoji that appears on the button.
     * @param disabled If the button is disabled.
     */
    addURLButton(url: string, label?: string, emoji?: PartialEmoji, disabled?: boolean): this {
        this.addComponent(new Button(ButtonStyles.LINK, url)["load"](ButtonStyles.LINK, url, label, emoji, disabled));
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
}
