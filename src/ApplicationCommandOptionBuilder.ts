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

    addChoice(name: string, value: string | number, nameLocalizations?: Record<string, string>): this {
        this.choices.push({ name, value, nameLocalizations });
        return this;
    }

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

    setAutocomplete(value = true): this {
        this.autocomplete = value;
        return this;
    }

    setChannelTypes(types: Array<ChannelTypes>): this {
        this.channelTypes = types;
        return this;
    }

    setChoices(choices: Array<ApplicationCommandOptionsChoice>): this {
        this.choices = choices;
        return this;
    }

    setDescription(description: string): this {
        this.description = description;
        return this;
    }

    setDescriptionLocalizations(localizations: Record<string, string>): this {
        this.descriptionLocalizations = localizations;
        return this;
    }

    setMinMax(min?: number, max?: number): this {
        this.max = max;
        this.min = min;
        return this;
    }

    setName(name: string): this {
        this.name = name;
        return this;
    }

    setNameLocalizations(localizations: Record<string, string>): this {
        this.nameLocalizations = localizations;
        return this;
    }

    setRequired(value = true): this {
        this.required = value;
        return this;
    }

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
