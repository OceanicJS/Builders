import {
    ApplicationCommandOptions,
    ApplicationCommandOptionsAttachment,
    ApplicationCommandOptionsBoolean,
    ApplicationCommandOptionsChannel,
    ApplicationCommandOptionsChoice,
    ApplicationCommandOptionsInteger,
    ApplicationCommandOptionsMentionable,
    ApplicationCommandOptionsNumber,
    ApplicationCommandOptionsRole,
    ApplicationCommandOptionsString,
    ApplicationCommandOptionsSubCommand,
    ApplicationCommandOptionsSubCommandGroup,
    ApplicationCommandOptionsUser,
    ApplicationCommandOptionsWithValue,
    ApplicationCommandOptionTypes,
    ChannelTypes
} from "oceanic.js";

type TypeToOption<T extends ApplicationCommandOptionTypes> =
    T extends ApplicationCommandOptionTypes.SUB_COMMAND ?
        ApplicationCommandOptionsSubCommand :
        T extends ApplicationCommandOptionTypes.SUB_COMMAND_GROUP ?
            ApplicationCommandOptionsSubCommandGroup :
            T extends ApplicationCommandOptionTypes.STRING ?
                ApplicationCommandOptionsString :
                T extends ApplicationCommandOptionTypes.INTEGER ?
                    ApplicationCommandOptionsInteger :
                    T extends ApplicationCommandOptionTypes.BOOLEAN ?
                        ApplicationCommandOptionsBoolean :
                        T extends ApplicationCommandOptionTypes.USER ?
                            ApplicationCommandOptionsUser :
                            T extends ApplicationCommandOptionTypes.CHANNEL ?
                                ApplicationCommandOptionsChannel :
                                T extends ApplicationCommandOptionTypes.ROLE ?
                                    ApplicationCommandOptionsRole :
                                    T extends ApplicationCommandOptionTypes.MENTIONABLE ?
                                        ApplicationCommandOptionsMentionable :
                                        T extends ApplicationCommandOptionTypes.NUMBER ?
                                            ApplicationCommandOptionsNumber :
                                            T extends ApplicationCommandOptionTypes.ATTACHMENT ?
                                                ApplicationCommandOptionsAttachment : never;

export default class ApplicationCommandOptionBuilder<T extends ApplicationCommandOptionTypes = ApplicationCommandOptionTypes> {
    autocomplete?: boolean;
    channelTypes?: Array<ChannelTypes>;
    choices: Array<ApplicationCommandOptionsChoice> = [];
    description = "";
    descriptionLocalizations?: Record<string, string>;
    max?: number;
    min?: number;
    name: string;
    nameLocalizations?: Record<string, string>;
    options: Array<ApplicationCommandOptions> = [];
    parent?: ApplicationCommandOptionBuilder<T>;
    required?: boolean;
    type: T;
    constructor(type: T, name: string) {
        this.type = type;
        this.name = name;
    }

    /**
     * Add a choice.
     * @param name The name of the choice.
     * @param value The value of the choice.
     * @param nameLocalizations A map of [locales](https://discord.com/developers/docs/reference#locales) to name localizations.
     */
    addChoice(name: string, value: string | number, nameLocalizations?: Record<string, string>): this {
        this.choices.push({ name, value, nameLocalizations });
        return this;
    }

    /**
     * Add a description localization.
     * @param locale The [locale](https://discord.com/developers/docs/reference#locales) of the localization.
     * @param description The localized description.
     */
    addDescriptionLocalization(locale: string, description: string): this {
        (this.descriptionLocalizations ??= {})[locale] = description;
        return this;
    }

    /**
     * Add a name localization.
     * @param locale The [locale](https://discord.com/developers/docs/reference#locales) of the localization.
     * @param name The localized name.
     */
    addNameLocalization(locale: string, name: string): this {
        (this.nameLocalizations ??= {})[locale] = name;
        return this;
    }

    /** Add an option. */
    addOption<O extends ApplicationCommandOptionTypes = ApplicationCommandOptionTypes>(option: ApplicationCommandOptionBuilder<O> | ApplicationCommandOptions): this;
    addOption<O extends ApplicationCommandOptionTypes = ApplicationCommandOptionTypes>(name: string, type: O, extra?: ((this: ApplicationCommandOptionBuilder<T>, option: ApplicationCommandOptionBuilder<O>) => void) | ApplicationCommandOptions): this;
    addOption<O extends ApplicationCommandOptionTypes = ApplicationCommandOptionTypes>(...args: [name: string, type: O, extra?: ((this: ApplicationCommandOptionBuilder<T>, option: ApplicationCommandOptionBuilder<O>) => void) | Omit<ApplicationCommandOptions, "name" | "type">] | [option: ApplicationCommandOptionBuilder<O> | ApplicationCommandOptions]): this {
        if (args.length === 1) {
            if (args[0] instanceof ApplicationCommandOptionBuilder) {
                args[0] = args[0].toJSON();
            }
            this.options.push(args[0]);
            return this;
        } else {
            const [name, type, extra] = args;
            const option = new ApplicationCommandOptionBuilder(type, name);
            if (extra) {
                if (typeof extra === "function") {
                    extra.call(this, option);
                    this.options.push(option.toJSON());
                } else {
                    this.options.push({ ...extra, name, type } as ApplicationCommandOptions);
                }
            } else {
                this.options.push(option.toJSON());
            }
            return this;
        }
    }

    /** Toggle autocomplete for this option. */
    setAutocomplete(value = !this.autocomplete): this {
        this.autocomplete = value;
        return this;
    }

    /** Set the allowed channel types for this option. */
    setChannelTypes(types: Array<ChannelTypes>): this {
        this.channelTypes = types;
        return this;
    }

    /** Set the choices for this option. */
    setChoices(choices: Array<ApplicationCommandOptionsChoice>): this {
        this.choices = choices;
        return this;
    }

    /** Set the description of this option. */
    setDescription(description: string): this {
        this.description = description;
        return this;
    }

    /**
     * Set the description localizations of this option.
     * @param localizations A map of [locales](https://discord.com/developers/docs/reference#locales) to localized description strings.
     */
    setDescriptionLocalizations(localizations: Record<string, string>): this {
        this.descriptionLocalizations = localizations;
        return this;
    }

    /** Set the min/max for this option. This applied to both `minValue`/`maxValue` and `minLength`/`maxLength`. */
    setMinMax(min?: number, max?: number): this {
        this.max = max;
        this.min = min;
        return this;
    }

    /** Set the name of this option. */
    setName(name: string): this {
        this.name = name;
        return this;
    }

    /**
     * Set the name localizations of this option.
     * @param localizations A map of [locales](https://discord.com/developers/docs/reference#locales) to localized name strings.
     */
    setNameLocalizations(localizations: Record<string, string>): this {
        this.nameLocalizations = localizations;
        return this;
    }

    /** Toggle this option being required. */
    setRequired(value = !this.required): this {
        this.required = value;
        return this;
    }

    /** Convert this command to JSON. */
    toJSON(): TypeToOption<T> {
        let res: ApplicationCommandOptions;
        switch (this.type) {
            case ApplicationCommandOptionTypes.SUB_COMMAND: {
                res = {
                    type:        this.type,
                    name:        this.name,
                    description: this.description,
                    options:     this.options as Array<ApplicationCommandOptionsWithValue>
                } as ApplicationCommandOptionsSubCommand;
                break;
            }

            case ApplicationCommandOptionTypes.SUB_COMMAND_GROUP: {
                res = {
                    type:        this.type,
                    name:        this.name,
                    description: this.description,
                    options:     this.options
                } as ApplicationCommandOptionsSubCommandGroup;
                break;
            }

            case ApplicationCommandOptionTypes.STRING: {
                res = {
                    type:         this.type,
                    name:         this.name,
                    description:  this.description,
                    autocomplete: this.autocomplete,
                    choices:      this.choices,
                    minLength:    this.min,
                    maxLength:    this.max,
                    required:     this.required
                } as ApplicationCommandOptionsString;
                break;
            }

            case ApplicationCommandOptionTypes.INTEGER:
            case ApplicationCommandOptionTypes.NUMBER: {
                res = {
                    type:        this.type,
                    name:        this.name,
                    description: this.description,
                    choices:     this.choices,
                    minValue:    this.min,
                    maxValue:    this.max,
                    required:    this.required
                } as ApplicationCommandOptionsInteger | ApplicationCommandOptionsNumber;
                break;
            }

            case ApplicationCommandOptionTypes.BOOLEAN:
            case ApplicationCommandOptionTypes.USER:
            case ApplicationCommandOptionTypes.ROLE:
            case ApplicationCommandOptionTypes.MENTIONABLE:
            case ApplicationCommandOptionTypes.ATTACHMENT: {
                res = {
                    type:        this.type,
                    name:        this.name,
                    description: this.description,
                    required:    this.required
                } as ApplicationCommandOptionsBoolean | ApplicationCommandOptionsUser | ApplicationCommandOptionsRole | ApplicationCommandOptionsMentionable | ApplicationCommandOptionsAttachment;
                break;
            }

            case ApplicationCommandOptionTypes.CHANNEL: {
                res = {
                    type:         this.type,
                    name:         this.name,
                    description:  this.description,
                    channelTypes: this.channelTypes,
                    required:     this.required
                } as ApplicationCommandOptionsChannel;
                break;
            }

            default: {
                return null as never;
            }
        }

        return res as TypeToOption<T>;
    }
}
