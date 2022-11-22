import Component from "./Component";
import {
    PartialEmoji,
    SelectOption,
    SelectMenuTypes,
    SelectMenuComponent,
    ChannelTypes,
    RawSelectMenuComponent
} from "oceanic.js";

export default class SelectMenu extends Component<SelectMenuTypes> {
    channelTypes?: Array<ChannelTypes>;
    customID: string;
    disabled = false;
    maxValues?: number;
    minValues?: number;
    options: Array<SelectOption> = [];
    placeholder?: string;
    /**
     * Create a new SelectMenu.
     * @param customID The custom ID of this select menu.
     */
    constructor(type: SelectMenuTypes, customID: string) {
        super(type);
        this.customID = customID;
    }

    /** this method is meant to be for internal use only, don't use it, as it may break or change at a moments notice */
    private load(customID?: string, options?: Array<SelectOption>, placeholder?: string, minValues?: number, maxValues?: number, disabled?: boolean): this {
        if (customID) {
            this.setCustomID(customID);
        }
        if (options && Array.isArray(options) && options.length > 0) {
            this.clearOptions();
            this.addOptions(...options);
        }
        if (placeholder) {
            this.setPlaceholder(placeholder);
        }
        if (minValues) {
            this.setValues(minValues, undefined);
        }
        if (maxValues) {
            this.setValues(undefined, maxValues);
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
     * Add an option to this select menu.
     * @param label The label for this option.
     * @param value The value of this option.
     * @param description The description of this option.
     * @param emoji The emoji to displayed with this option.
     */
    addOption(label: string, value: string, description?: string, emoji?: PartialEmoji, defaultSelection?: boolean): this {
        this.options.push({
            label,
            value,
            description,
            emoji,
            default: defaultSelection
        });
        return this;
    }

    /**
     * Add options to this select menu in bulk.
     * @param options The options to add.
     */
    addOptions(...options: Array<SelectOption>): this {
        options.map(o => this.addOption(o.label, o.value, o.description, o.emoji, o.default));
        return this;
    }

    /** Clear all currently present options on this select menu. */
    clearOptions(): this {
        this.options = [];
        return this;
    }

    /** Set the valid channel types for a channel select menu. */
    setChannelTypes(...types: [types: Array<ChannelTypes>] | Array<ChannelTypes>): this {
        if (types.length === 1 && Array.isArray(types[0])) {
            types = types[0];
        }
        this.channelTypes = types as Array<ChannelTypes>;
        return this;
    }

    /**
     * Set the custom ID of this select menu.
     * @param customID A developer-defined identifier for the button, max 100 characters.
     */
    setCustomID(customID: string): this {
        this.customID = customID;
        return this;
    }

    /**
     * Set the placeholder of this select menu.
     * @param placeholder Custom placeholder text if nothing is selected, max 100 characters.
     */
    setPlaceholder(placeholder: string): this {
        this.placeholder = placeholder;
        return this;
    }

    /**
     * Set the minimum/maximum values of this select menu.
     * @param min The minimum selected values.
     * @param max The maximum selected values.
     */
    setValues(min?: number, max?: number): this {
        if (min) {
            this.minValues = min;
        }
        if (max) {
            this.maxValues = max;
        }
        return this;
    }

    /** converts this SelectMenu instance to json. */
    override toJSON(): SelectMenuComponent {
        return {
            type:         this.type,
            customID:     this.customID,
            options:      this.options,
            placeholder:  this.placeholder,
            minValues:    this.minValues,
            maxValues:    this.maxValues,
            disabled:     this.disabled,
            channelTypes: this.channelTypes
        } as SelectMenuComponent;
    }

    /** converts this SelectMenu instance to json. */
    override toJSONRaw(): RawSelectMenuComponent {
        return {
            type:          this.type,
            custom_id:     this.customID,
            options:       this.options,
            placeholder:   this.placeholder,
            min_values:    this.minValues,
            max_values:    this.maxValues,
            disabled:      this.disabled,
            channel_types: this.channelTypes
        } as RawSelectMenuComponent;
    }
}
