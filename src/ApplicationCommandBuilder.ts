import ApplicationCommandOptionBuilder from "./ApplicationCommandOptionBuilder";
import {
    ApplicationCommandOptions,
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
    CreateApplicationCommandOptions,
    Permission,
    PermissionName,
    Permissions
} from "oceanic.js";

const permissionNames = Object.keys(Permissions).filter(p => !/^[0-9]+$/.test(p));
export default class ApplicationCommandBuilder<T extends ApplicationCommandTypes = ApplicationCommandTypes> {
    defaultMemberPermissions?: string;
    description?: string;
    descriptionLocalizations?: Record<string, string>;
    dmPermission?: boolean;
    name: string;
    nameLocalizations?: Record<string, string>;
    options: Array<ApplicationCommandOptions> = [];
    type: T;
    constructor(type: T, name: string) {
        this.type = type;
        this.name = name;
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
    addOption<O extends ApplicationCommandOptionTypes = ApplicationCommandOptionTypes>(name: string, type: O, extra?: ((this: ApplicationCommandBuilder<T>, option: ApplicationCommandOptionBuilder<O>) => void) | ApplicationCommandOptions): this;
    addOption<O extends ApplicationCommandOptionTypes = ApplicationCommandOptionTypes>(...args: [name: string, type: O, extra?: ((this: ApplicationCommandBuilder<T>, option: ApplicationCommandOptionBuilder<O>) => void) | Omit<ApplicationCommandOptions, "name" | "type">] | [option: ApplicationCommandOptionBuilder<O> | ApplicationCommandOptions]): this {
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

    /** Allow this command to be used in direct messages. */
    allowDMUsage(): this {
        this.setDMPermission(true);
        return this;
    }

    /** Disallow this command from being used in direct messages. */
    disallowDMUsage(): this {
        this.setDMPermission(false);
        return this;
    }

    /** Set if this command can be used in direct messages. */
    setDMPermission(dmPermission: boolean): this {
        this.dmPermission = dmPermission;
        return this;
    }

    /** Set the default permissions required to use this command. */
    setDefaultMemberPermissions(...permissions: [bigint | string | Permission | Array<PermissionName>] | Array<PermissionName>): this {
        let data: bigint | string | Permission | Array<PermissionName>;
        if (permissions.length > 1 || (typeof permissions[0] === "string" && permissionNames.includes(permissions[0]))) {
            data = permissions as Array<PermissionName>;
        } else {
            data = permissions[0];
        }
        if (data instanceof Permission) {
            data = data.allow.toString();
        } else if (typeof data === "bigint") {
            data = data.toString();
        } else if (Array.isArray(data)) {
            data = data.map(perm => Permissions[perm]).reduce((a, b) => a | b, 0n).toString();
        }

        this.defaultMemberPermissions = data;
        return this;
    }

    /** Set the description of this command. */
    setDescription(description: string): this {
        this.description = description;
        return this;
    }

    /**
     * Set the description localizations for this command.
     * @param localizations A map of [locales](https://discord.com/developers/docs/reference#locales) to localized description strings.
     */
    setDescriptionLocalizations(localizations: Record<string, string>): this {
        this.descriptionLocalizations = localizations;
        return this;
    }

    /** Set the name of this command.*/
    setName(name: string): this {
        this.name = name;
        return this;
    }

    /**
     * Set the name localizations for this command.
     * @param localizations A map of [locales](https://discord.com/developers/docs/reference#locales) to localized name strings.
     */
    setNameLocalizations(localizations: Record<string, string>): this {
        this.nameLocalizations = localizations;
        return this;
    }

    /** Convert this command to JSON. */
    toJSON(): CreateApplicationCommandOptions {
        return {
            defaultMemberPermissions: this.defaultMemberPermissions,
            description:              this.description!,
            descriptionLocalizations: this.descriptionLocalizations,
            dmPermission:             this.dmPermission,
            name:                     this.name,
            nameLocalizations:        this.nameLocalizations,
            options:                  this.options,
            type:                     this.type
        };
    }
}
