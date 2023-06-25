import type Button from "./Button";
import type SelectMenu from "./SelectMenu";
import type TextInput from "./TextInput";
import {
    ComponentTypes,
    Component,
    MessageActionRow,
    ModalActionRow,
    TextButton,
    URLButton,
    RawMessageActionRow,
    RawModalActionRow,
    RawTextButton
} from "oceanic.js";

export default class ActionRow {
    private components: Array<Button | SelectMenu | TextInput> = [];
    type = ComponentTypes.ACTION_ROW;

    get size(): number {
        return this.components.length;
    }

    addComponent(component: Button | SelectMenu | TextInput): this {
        this.components.push(component);
        return this;
    }

    addComponents(...components: Array<Button | SelectMenu | TextInput>): this {
        components.forEach(c => this.addComponent(c));
        return this;
    }

    getComponents(): Array<Button | SelectMenu | TextInput> {
        return Array.from(this.components);
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    toJSON(): MessageActionRow | ModalActionRow {
        return {
            type:       this.type,
            components: this.components.map(c => c.toJSON() as TextButton | URLButton) as Array<Component>
        } as MessageActionRow | ModalActionRow;
    }

    toJSONRaw(): RawMessageActionRow | RawModalActionRow {
        return {
            type:       this.type,
            components: this.components.map(c => c.toJSONRaw() as RawTextButton | URLButton) as Array<Component>
        } as RawMessageActionRow | RawModalActionRow;
    }
}
